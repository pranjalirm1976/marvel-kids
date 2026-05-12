const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // paise
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Customer name is required"],
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    totalAmount: {
      type: Number,
      required: true, // stored in paise
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: {
        values: ["COD", "RAZORPAY"],
        message: "{VALUE} is not a valid payment method",
      },
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shiprocketOrderId: {
      type: String,
      default: "",
    },
    trackingId: {
      type: String,
      default: "",
    },
    awbCode: {
      type: String,
      default: "",
    },
    whatsappStatus: {
      type: String,
      enum: ["Pending", "Sent", "Failed"],
      default: "Pending",
    },
    whatsappMessages: [{
      message: String,
      status: String,
      sentAt: Date,
      messageType: {
        type: String,
        enum: ["order_pending", "order_confirmed", "order_shipped", "promotional"],
        default: "order_pending"
      }
    }],
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    // Shiprocket logistics
    shipmentId: { type: String, default: null },
    awbCode: { type: String, default: null },
    trackingUrl: { type: String, default: null },
    storeId: {
      type: String,
      default: "MarvelKids",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
