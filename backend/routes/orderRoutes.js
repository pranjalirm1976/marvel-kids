const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getOrders, updateOrderStatus } = require("../controllers/orderController");

router.route("/").get(getOrders).post(createOrder);
router.route("/verify").post(verifyPayment);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;
