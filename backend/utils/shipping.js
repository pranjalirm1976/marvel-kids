/**
 * shipping.js — Shiprocket logistics integration
 *
 * ENV vars required:
 *   SHIPROCKET_EMAIL    — your Shiprocket account email
 *   SHIPROCKET_PASSWORD — your Shiprocket account password
 */

const axios = require("axios");
const Order = require("../models/Order");

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

/* ─── Token cache (valid 24 h per Shiprocket docs) ─── */
let _token = null;
let _tokenExpiry = 0;

/**
 * Authenticate with Shiprocket and return a Bearer token.
 * Token is cached in memory for 23 hours.
 */
async function getShiprocketToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Shiprocket credentials not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env"
    );
  }

  const { data } = await axios.post(`${SHIPROCKET_BASE}/auth/login`, {
    email,
    password,
  });

  _token = data.token;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
  return _token;
}

/**
 * Parse a flat address string into components.
 * Expected format: "Street, City, State - Pincode"  (as built in orderController)
 */
function parseAddress(addressStr = "") {
  // Try to pull pincode from the end (6-digit Indian PIN)
  const pincodeMatch = addressStr.match(/(\d{6})/);
  const pincode = pincodeMatch ? pincodeMatch[1] : "000000";

  // Try to extract state — assumes "State - Pincode" at tail
  const stateMatch = addressStr.match(/,\s*([^,\-]+)\s*-\s*\d{6}/);
  const state = stateMatch ? stateMatch[1].trim() : "Maharashtra";

  // City is second-to-last comma-separated chunk before state
  const parts = addressStr.split(",").map((s) => s.trim());
  const city = parts.length >= 2 ? parts[parts.length - 2].replace(/\s*-\s*\d{6}/, "").trim() : "Mumbai";

  // Everything before city is the street
  const street = parts.slice(0, -2).join(", ") || addressStr;

  return { street, city, state, pincode };
}

/**
 * createShipment — called automatically after successful Razorpay payment.
 * Creates a Shiprocket order + shipment and saves shipment_id + awb_code to the Order doc.
 *
 * @param {Object} order — Mongoose Order document
 * @returns {Object} { shipmentId, awbCode, trackingUrl }
 */
async function createShipment(order) {
  const token = await getShiprocketToken();

  const { street, city, state, pincode } = parseAddress(order.address);

  // Build line items for Shiprocket
  const srItems = order.items.map((item) => ({
    name: item.name,
    sku: String(item.product),
    units: item.quantity,
    selling_price: Math.round(item.price / 100), // convert paise → ₹
  }));

  // Total weight in kg — default 0.3 kg per item if unknown
  const totalWeight = (order.items.reduce((s, i) => s + i.quantity, 0) * 0.3).toFixed(2);

  const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

  const payload = {
    order_id: String(order._id),
    order_date: orderDate,
    pickup_location: "Primary", // must match a pickup location in your Shiprocket dashboard
    channel_id: "",
    comment: "MARVELS Fashion Order",
    billing_customer_name: order.user,
    billing_last_name: "",
    billing_address: street,
    billing_address_2: "",
    billing_city: city,
    billing_pincode: pincode,
    billing_state: state,
    billing_country: "India",
    billing_email: order.email,
    billing_phone: order.phone || "9999999999",
    shipping_is_billing: true,
    order_items: srItems,
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: Math.round(order.totalAmount / 100), // paise → ₹
    length: 25,
    breadth: 20,
    height: 5,
    weight: totalWeight,
  };

  const { data } = await axios.post(
    `${SHIPROCKET_BASE}/orders/create/adhoc`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const shipmentId = data.shipment_id ? String(data.shipment_id) : null;
  const awbCode = data.awb_code ? String(data.awb_code) : null;
  const trackingUrl = awbCode
    ? `https://shiprocket.co/tracking/${awbCode}`
    : null;

  // Persist to DB
  await Order.findByIdAndUpdate(order._id, { shipmentId, awbCode, trackingUrl });

  return { shipmentId, awbCode, trackingUrl };
}

module.exports = { createShipment, getShiprocketToken };
