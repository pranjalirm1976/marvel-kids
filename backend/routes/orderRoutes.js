const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");

router.route("/").get(getOrders).post(createOrder);
router.route("/verify").post(verifyPayment);
router.route("/:id/status").put(updateOrderStatus);
router.route("/:id").get(getOrderById);

module.exports = router;
