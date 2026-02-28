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
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
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
