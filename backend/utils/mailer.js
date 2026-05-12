/**
 * mailer.js — Order notification emails via Gmail SMTP
 *
 * ENV vars required:
 *   GMAIL_USER     — the Gmail address used to SEND emails (e.g. marvelskidswear@gmail.com)
 *   GMAIL_APP_PASS — 16-char Gmail App Password (NOT your Gmail login password)
 *   NOTIFY_EMAIL   — the email that receives order alerts (defaults to GMAIL_USER)
 */

const nodemailer = require("nodemailer");

/** Lazy transporter — created once when first email is sent */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASS?.trim();

  if (!user || !pass) {
    throw new Error(
      "Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASS in .env"
    );
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return _transporter;
}

/**
 * Format paise → ₹ with commas.  e.g. 149900 → "₹1,499"
 */
function formatPrice(paise) {
  return "₹" + Math.round(paise / 100).toLocaleString("en-IN");
}

/**
 * Send order notification email to the store owner.
 *
 * @param {Object} order — Mongoose Order document
 */
async function sendOrderNotification(order) {
  const transporter = getTransporter();

  const to =
    process.env.NOTIFY_EMAIL?.trim() || process.env.GMAIL_USER?.trim();

  const paymentBadge =
    order.paymentMethod === "COD"
      ? `<span style="background:#f59e0b;color:#000;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:13px;">COD</span>`
      : `<span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:13px;">PREPAID</span>`;

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
          ${item.name}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; margin:0; padding:0; }
    .wrapper { max-width:600px; margin:30px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:#0d0d0d; padding:24px 30px; display:flex; align-items:center; }
    .header h1 { color:#ffd60a; margin:0; font-size:22px; letter-spacing:2px; }
    .badge { background:#ffd60a; color:#000; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:4px; margin-left:12px; letter-spacing:1px; }
    .body { padding:28px 30px; }
    .section-title { font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#888; margin:20px 0 8px; }
    .info-box { background:#f7f7f7; border-radius:8px; padding:14px 18px; margin-bottom:16px; }
    .info-box p { margin:4px 0; font-size:14px; color:#333; }
    .info-box strong { color:#0d0d0d; }
    table { width:100%; border-collapse:collapse; }
    thead th { background:#0d0d0d; color:#ffd60a; padding:10px 12px; text-align:left; font-size:13px; }
    .total-row td { padding:12px; font-size:16px; font-weight:bold; color:#0d0d0d; background:#fff9e6; }
    .footer { text-align:center; padding:18px; background:#f7f7f7; font-size:12px; color:#aaa; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>MARVELS</h1>
    <span class="badge">NEW ORDER</span>
  </div>
  <div class="body">
    <p style="font-size:16px;color:#333;margin-top:0;">
      🛍️ You have a new order! ${paymentBadge}
    </p>

    <div class="section-title">Order Info</div>
    <div class="info-box">
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>
    </div>

    <div class="section-title">Customer Details</div>
    <div class="info-box">
      <p><strong>Name:</strong> ${order.user}</p>
      <p><strong>Email:</strong> ${order.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
    </div>

    <div class="section-title">Delivery Address</div>
    <div class="info-box">
      <p>${order.address}</p>
    </div>

    <div class="section-title">Items Ordered</div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td colspan="2">Total</td>
          <td style="text-align:right;">${formatPrice(order.totalAmount)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="footer">
    Marvels Kids &amp; Sports Wear · marvelskidswear@gmail.com<br/>
    This is an automated order notification.
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Marvels Store" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🛍️ New Order #${order._id} — ${order.paymentMethod} — ${formatPrice(order.totalAmount)}`,
    html,
  });

  console.log(`[Mailer] Order notification sent to ${to} for order ${order._id}`);
}

module.exports = { sendOrderNotification };
