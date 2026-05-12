const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderShippedMessage, sendBulkPromotionalMessages } = require("../utils/whatsapp");
const { trackShipment } = require("../utils/shipping");

// @desc    Get all orders with pagination and filters
// @route   GET /api/admin/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const paymentMethod = req.query.paymentMethod;
    const search = req.query.search;

    // Build filter object
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (search) {
      filter.$or = [
        { user: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Calculate statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Shipped"] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: stats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0
      }
    });
  } catch (error) {
    console.error("[Admin] Get orders failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// @desc    Get single order details
// @route   GET /api/admin/orders/:id
// @access  Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("[Admin] Get order failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Send WhatsApp notification for shipped orders
    if (status === "Shipped" && order.phone) {
      sendOrderShippedMessage(order).catch((err) =>
        console.error("[WhatsApp] Shipped notification failed:", err.message)
      );
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("[Admin] Update order status failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// @desc    Get order tracking information
// @route   GET /api/admin/orders/:id/tracking
// @access  Admin
const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    let trackingData = null;
    if (order.awbCode) {
      try {
        trackingData = await trackShipment(order.awbCode);
      } catch (error) {
        console.error("[Tracking] Failed to fetch tracking data:", error.message);
      }
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderStatus: order.orderStatus,
        shiprocketOrderId: order.shiprocketOrderId,
        awbCode: order.awbCode,
        trackingId: order.trackingId
      },
      trackingData
    });
  } catch (error) {
    console.error("[Admin] Get tracking failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tracking information",
      error: error.message
    });
  }
};

// @desc    Send promotional WhatsApp messages
// @route   POST /api/admin/whatsapp/promotional
// @access  Admin
const sendPromotionalMessages = async (req, res) => {
  try {
    const { offerDetails, targetCustomers } = req.body;

    if (!offerDetails) {
      return res.status(400).json({
        success: false,
        message: "Offer details are required"
      });
    }

    let customers = [];

    if (targetCustomers === "all") {
      // Get all customers from orders
      const orders = await Order.find({ phone: { $exists: true, $ne: "" } })
        .distinct("phone");
      
      const uniqueCustomers = await Order.aggregate([
        { $match: { phone: { $exists: true, $ne: "" } } },
        {
          $group: {
            _id: "$phone",
            name: { $first: "$user" },
            phone: { $first: "$phone" }
          }
        }
      ]);

      customers = uniqueCustomers.map(c => ({
        name: c.name,
        phone: c.phone
      }));
    } else if (Array.isArray(targetCustomers)) {
      customers = targetCustomers;
    }

    if (customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No customers found to send messages"
      });
    }

    // Send messages in batches to avoid rate limiting
    const results = await sendBulkPromotionalMessages(customers, offerDetails);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Promotional messages sent to ${successCount} customers`,
      results: {
        total: results.length,
        success: successCount,
        failed: failureCount,
        details: results
      }
    });
  } catch (error) {
    console.error("[Admin] Send promotional messages failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send promotional messages",
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Overall statistics
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    // Today's statistics
    const todayStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmount" },
          todayOrders: { $sum: 1 }
        }
      }
    ]);

    // Order status breakdown
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment method breakdown
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id user totalAmount orderStatus paymentMethod createdAt');

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        today: todayStats[0] || { todayRevenue: 0, todayOrders: 0 },
        orderStatus: statusStats,
        paymentMethods: paymentStats,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error("[Admin] Get dashboard stats failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderTracking,
  sendPromotionalMessages,
  getDashboardStats
};