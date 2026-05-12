const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const { createShipment } = require("../utils/shipping");
const { sendOrderNotification } = require("../utils/mailer");
const { sendOrderPendingMessage, sendOrderShippedMessage } = require("../utils/whatsapp");

// Lazy Razorpay instance — only created when needed (avoids crash if keys missing)
let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

// @desc    Create a new order (COD or Razorpay)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { user, email, address, phone, items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    // Calculate total server-side to prevent frontend tampering
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // --- COD Flow ---
    if (paymentMethod === "COD") {
      const order = await Order.create({
        user,
        email,
        address,
        phone,
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.images?.[0] || i.image || "",
        })),
        totalAmount,
        paymentMethod: "COD",
        paymentStatus: "Pending",
      });

      // Respond to client immediately
      res.status(201).json({ success: true, order });

      // Trigger Shiprocket + email + WhatsApp asynchronously (non-blocking)
      Promise.all([
        createShipment(order).catch((err) =>
          console.error("[Shiprocket] COD shipment failed for order", order._id, ":", err.message)
        ),
        sendOrderNotification(order).catch((err) =>
          console.error("[Mailer] COD email failed for order", order._id, ":", err.message)
        ),
        sendOrderPendingMessage(order).catch((err) =>
          console.error("[WhatsApp] COD message failed for order", order._id, ":", err.message)
        )
      ]).then(() => {
        console.log(`[Order] All notifications sent for order ${order._id}`);
      });

      return; // response already sent
    }

    // --- Razorpay Flow ---
    if (paymentMethod === "RAZORPAY") {
      // Create Razorpay order
      const razorpayOrder = await getRazorpay().orders.create({
        amount: totalAmount, // already in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      // Save order in DB with Pending status
      const order = await Order.create({
        user,
        email,
        address,
        phone,
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.images?.[0] || i.image || "",
        })),
        totalAmount,
        paymentMethod: "RAZORPAY",
        paymentStatus: "Pending",
        razorpayOrderId: razorpayOrder.id,
      });

      return res.status(201).json({
        success: true,
        razorpayOrder,
        orderId: order._id,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid payment method" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/orders/verify
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Mark order as paid
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "Completed",
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: "Processing",
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Respond to client immediately — don't block on shipping
    res.status(200).json({
      success: true,
      message: "Payment verified",
      orderId: order._id,
      order,
    });

    // Trigger Shiprocket + email + WhatsApp asynchronously (non-blocking)
    Promise.all([
      createShipment(order).catch((err) =>
        console.error("[Shiprocket] Failed to create shipment for order", order._id, ":", err.message)
      ),
      sendOrderNotification(order).catch((err) =>
        console.error("[Mailer] Email failed for order", order._id, ":", err.message)
      ),
      sendOrderPendingMessage(order).catch((err) =>
        console.error("[WhatsApp] Payment message failed for order", order._id, ":", err.message)
      )
    ]).then(() => {
      console.log(`[Order] All post-payment notifications sent for order ${order._id}`);
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public (order owner uses this from success page)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, verifyPayment, getOrders, getOrderById, updateOrderStatus };
