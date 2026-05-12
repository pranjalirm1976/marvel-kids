/**
 * whatsapp.js — WhatsApp Business API integration
 * 
 * ENV vars required:
 *   WHATSAPP_ACCESS_TOKEN — Meta WhatsApp Business API token
 *   WHATSAPP_PHONE_NUMBER_ID — Your WhatsApp Business phone number ID
 *   WHATSAPP_VERIFY_TOKEN — Webhook verification token
 */

const axios = require("axios");
const Order = require("../models/Order");

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

/**
 * Send WhatsApp message using Meta Business API
 */
const sendWhatsAppMessage = async (to, message, messageType = "order_pending") => {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      throw new Error("WhatsApp credentials not configured");
    }

    // Clean phone number (remove +91, spaces, etc.)
    const cleanPhone = to.replace(/[^\d]/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

    const payload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "text",
      text: {
        body: message
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[WhatsApp] Message sent successfully to ${formattedPhone}`);
    return {
      success: true,
      messageId: response.data.messages[0].id,
      status: "Sent"
    };

  } catch (error) {
    console.error("[WhatsApp] Message failed:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
      status: "Failed"
    };
  }
};

/**
 * Send order pending notification
 */
const sendOrderPendingMessage = async (order) => {
  const message = `🛍️ *MARVELS Fashion*

Hi ${order.user}! 👋

Your order has been received and is currently pending confirmation.

📦 *Order Details:*
• Order ID: ${order._id}
• Total Amount: ₹${(order.totalAmount / 100).toFixed(2)}
• Payment Method: ${order.paymentMethod}

We will confirm your order shortly and send you tracking details.

Thank you for shopping with MARVELS! 💖

For any queries, reply to this message.`;

  const result = await sendWhatsAppMessage(order.phone, message, "order_pending");
  
  // Update order with WhatsApp status
  await Order.findByIdAndUpdate(order._id, {
    whatsappStatus: result.status,
    $push: {
      whatsappMessages: {
        message: message,
        status: result.status,
        sentAt: new Date(),
        messageType: "order_pending"
      }
    }
  });

  return result;
};

/**
 * Send order confirmed/shipped notification
 */
const sendOrderShippedMessage = async (order) => {
  const trackingInfo = order.awbCode ? 
    `\n🚚 *Tracking Details:*\n• AWB Code: ${order.awbCode}\n• Track: https://shiprocket.co/tracking/${order.awbCode}` : 
    "";

  const message = `🎉 *Order Confirmed & Shipped!*

Hi ${order.user}! 

Great news! Your MARVELS Fashion order has been confirmed and shipped! 📦✨

📋 *Order Details:*
• Order ID: ${order._id}
• Total Amount: ₹${(order.totalAmount / 100).toFixed(2)}
• Status: ${order.orderStatus}${trackingInfo}

Your order will be delivered within 3-7 business days.

Thank you for choosing MARVELS Fashion! 💖

Need help? Just reply to this message.`;

  const result = await sendWhatsAppMessage(order.phone, message, "order_shipped");
  
  // Update order with WhatsApp status
  await Order.findByIdAndUpdate(order._id, {
    whatsappStatus: result.status,
    $push: {
      whatsappMessages: {
        message: message,
        status: result.status,
        sentAt: new Date(),
        messageType: "order_shipped"
      }
    }
  });

  return result;
};

/**
 * Send promotional message to customer
 */
const sendPromotionalMessage = async (phoneNumber, customerName, offerDetails) => {
  const message = `🔥 *Exclusive Offer for You!*

Hi ${customerName}! 

${offerDetails}

🛍️ Shop now at MARVELS Fashion and save big!

Visit: https://marvels-fashion.com

*Limited time offer. T&C apply.*

Reply STOP to unsubscribe.`;

  return await sendWhatsAppMessage(phoneNumber, message, "promotional");
};

/**
 * Send bulk promotional messages
 */
const sendBulkPromotionalMessages = async (customers, offerDetails) => {
  const results = [];
  
  for (const customer of customers) {
    try {
      const result = await sendPromotionalMessage(
        customer.phone, 
        customer.name, 
        offerDetails
      );
      results.push({
        customer: customer.name,
        phone: customer.phone,
        ...result
      });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        customer: customer.name,
        phone: customer.phone,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Webhook handler for WhatsApp status updates
 */
const handleWhatsAppWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

/**
 * Process WhatsApp webhook events
 */
const processWhatsAppWebhook = async (req, res) => {
  try {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(entry => {
        entry.changes?.forEach(change => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            messages?.forEach(message => {
              console.log('[WhatsApp] Received message:', message);
              // Handle incoming messages here if needed
            });
          }
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('[WhatsApp] Webhook processing error:', error);
    res.status(500).send('ERROR');
  }
};

module.exports = {
  sendWhatsAppMessage,
  sendOrderPendingMessage,
  sendOrderShippedMessage,
  sendPromotionalMessage,
  sendBulkPromotionalMessages,
  handleWhatsAppWebhook,
  processWhatsAppWebhook
};