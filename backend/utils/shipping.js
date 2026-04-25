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

  const email = process.env.SHIPROCKET_EMAIL?.trim();
  const password = process.env.SHIPROCKET_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error(
      "Shiprocket credentials not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env"
    );
  }

  const { data } = await axios.post(
    `${SHIPROCKET_BASE}/auth/login`,
    {
      email,
      password,
    },
    { timeout: 15000 }
  );

  if (!data?.token) {
    throw new Error("Shiprocket login succeeded but token was not returned.");
  }

  _token = data.token;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
  return _token;
}

/**
 * Parse a flat address string into components.
 * Expected format: "Street, City, State - Pincode"  (as built in orderController)
 */
function parseAddress(addressStr = "") {
  const raw = String(addressStr || "").trim();
  const pincode = (raw.match(/(\d{6})/) || [])[1] || "";

  // Remove trailing "- 400001" or "400001" before splitting.
  const withoutPincode = raw
    .replace(/\s*-\s*\d{6}\s*$/, "")
    .replace(/\s+\d{6}\s*$/, "")
    .trim();

  const parts = withoutPincode
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let street = "";
  let city = "";
  let state = "";

  if (parts.length >= 3) {
    state = parts[parts.length - 1];
    city = parts[parts.length - 2];
    street = parts.slice(0, -2).join(", ");
  } else if (parts.length === 2) {
    city = parts[1];
    street = parts[0];
  } else if (parts.length === 1) {
    street = parts[0];
  }

  return { street, city, state, pincode };
}

function getTotalOrderWeightKg(items = []) {
  const total = items.reduce((sum, item) => {
    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

    // Prefer explicit per-item weight if present; otherwise fallback to 0.3kg per unit.
    const inferredWeightKg =
      Number(item.weightKg) > 0
        ? Number(item.weightKg)
        : Number(item.weightGrams) > 0
        ? Number(item.weightGrams) / 1000
        : Number(item.weight) > 0 && Number(item.weight) <= 10
        ? Number(item.weight)
        : 0.3;

    return sum + qty * inferredWeightKg;
  }, 0);

  return Number(total.toFixed(2));
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

  if (!street || !city || !pincode) {
    throw new Error(
      `Invalid shipping address for order ${order._id}. Parsed values: street='${street}', city='${city}', pincode='${pincode}'`
    );
  }

  // Build line items for Shiprocket
  const srItems = order.items.map((item) => ({
    name: item.name,
    sku: String(item.product),
    units: item.quantity,
    selling_price: Math.round(item.price / 100), // convert paise → ₹
  }));

  // Total shipment weight in kg.
  const totalWeightKg = getTotalOrderWeightKg(order.items);

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
    billing_state: state || "NA",
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
    weight: totalWeightKg,
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
