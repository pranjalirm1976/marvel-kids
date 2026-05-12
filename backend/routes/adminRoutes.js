const express = require("express");
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderTracking,
  sendPromotionalMessages,
  getDashboardStats
} = require("../controllers/adminController");

const router = express.Router();

// Dashboard routes
router.get("/dashboard", getDashboardStats);

// Order management routes
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/orders/:id/tracking", getOrderTracking);

// WhatsApp promotional messages
router.post("/whatsapp/promotional", sendPromotionalMessages);

module.exports = router;