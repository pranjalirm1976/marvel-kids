const express = require("express");
const { handleWhatsAppWebhook, processWhatsAppWebhook } = require("../utils/whatsapp");

const router = express.Router();

// WhatsApp webhook verification
router.get("/webhook", handleWhatsAppWebhook);

// WhatsApp webhook events
router.post("/webhook", processWhatsAppWebhook);

module.exports = router;