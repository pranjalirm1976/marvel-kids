# ⚙️ MARVELS Fashion - Configuration Guide

Complete configuration guide for all integrations and services.

## 📋 Table of Contents
- [Environment Variables](#environment-variables)
- [Razorpay Setup](#razorpay-setup)
- [Shiprocket Configuration](#shiprocket-configuration)
- [WhatsApp Business API](#whatsapp-business-api)
- [Email Configuration](#email-configuration)
- [Cloudinary Setup](#cloudinary-setup)
- [Database Configuration](#database-configuration)
- [Security Configuration](#security-configuration)

## 🔐 Environment Variables

### Backend Environment Variables (.env)

```env
# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=development

# ===== DATABASE CONFIGURATION =====
MONGO_URI=mongodb://localhost:27017/marvels-ecommerce
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/marvels-ecommerce

# ===== RAZORPAY CONFIGURATION =====
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# ===== EMAIL CONFIGURATION =====
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASS=your-16-character-app-password
NOTIFY_EMAIL=admin@marvels-fashion.com
ADMIN_EMAIL=admin@marvels-fashion.com
ADMIN_EMAIL_CC=manager@marvels-fashion.com

# ===== SHIPROCKET CONFIGURATION =====
SHIPROCKET_EMAIL=your-shiprocket-account@gmail.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_PICKUP_LOCATION=Primary

# ===== WHATSAPP BUSINESS API =====
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-webhook-verify-token

# ===== CLOUDINARY CONFIGURATION =====
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===== FRONTEND URL =====
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env.local)

```env
# ===== API CONFIGURATION =====
NEXT_PUBLIC_API_URL=http://localhost:5000

# ===== RAZORPAY CONFIGURATION =====
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890

# ===== FIREBASE CONFIGURATION (Optional) =====
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# ===== ANALYTICS (Optional) =====
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ===== ENVIRONMENT =====
NODE_ENV=development
```

## 💳 Razorpay Setup

### 1. Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up for a merchant account
3. Complete KYC verification
4. Activate your account

### 2. Get API Keys
1. Login to Razorpay Dashboard
2. Go to **Settings** > **API Keys**
3. Generate keys for Test/Live mode
4. Copy Key ID and Key Secret

### 3. Configure Webhooks
1. Go to **Settings** > **Webhooks**
2. Create new webhook with URL: `https://your-backend.com/api/order/verify`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Set webhook secret (optional but recommended)

### 4. Test Configuration
```javascript
// Test Razorpay connection
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create test order
const order = await razorpay.orders.create({
  amount: 100, // ₹1.00 in paise
  currency: 'INR',
  receipt: 'test_receipt_1'
});

console.log('Test order created:', order.id);
```

### 5. Production Checklist
- [ ] Switch to live API keys
- [ ] Update webhook URL to production
- [ ] Test payment flow end-to-end
- [ ] Verify webhook signature validation
- [ ] Set up payment reconciliation

## 🚚 Shiprocket Configuration

### 1. Create Shiprocket Account
1. Go to [shiprocket.in](https://shiprocket.in)
2. Sign up for business account
3. Complete business verification
4. Add pickup locations

### 2. API Configuration
1. Login to Shiprocket Panel
2. Go to **Settings** > **API**
3. Note down your login credentials
4. Generate API token (if available)

### 3. Pickup Location Setup
1. Go to **Settings** > **Pickup Locations**
2. Add your warehouse/store address
3. Set as "Primary" pickup location
4. Verify address with Shiprocket

### 4. Webhook Configuration
1. Go to **Settings** > **Webhooks**
2. Add webhook URL: `https://your-backend.com/api/shiprocket/webhook`
3. Select all shipment events
4. Test webhook delivery

### 5. Test Integration
```javascript
// Test Shiprocket API
const axios = require('axios');

// Get auth token
const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
  email: process.env.SHIPROCKET_EMAIL,
  password: process.env.SHIPROCKET_PASSWORD
});

const token = authResponse.data.token;
console.log('Shiprocket token obtained:', token ? 'Success' : 'Failed');

// Test order creation
const orderData = {
  order_id: 'TEST_ORDER_1',
  order_date: new Date().toISOString().split('T')[0],
  pickup_location: 'Primary',
  billing_customer_name: 'Test Customer',
  billing_address: 'Test Address',
  billing_city: 'Mumbai',
  billing_pincode: '400001',
  billing_state: 'Maharashtra',
  billing_country: 'India',
  billing_email: 'test@example.com',
  billing_phone: '9876543210',
  shipping_is_billing: true,
  order_items: [{
    name: 'Test Product',
    sku: 'TEST_SKU',
    units: 1,
    selling_price: 100
  }],
  payment_method: 'Prepaid',
  sub_total: 100,
  length: 10,
  breadth: 10,
  height: 10,
  weight: 0.5
};

const orderResponse = await axios.post(
  'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
  orderData,
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log('Test order created:', orderResponse.data);
```

## 📱 WhatsApp Business API

### 1. Apply for WhatsApp Business API
1. Go to [business.whatsapp.com](https://business.whatsapp.com)
2. Apply for WhatsApp Business API access
3. Complete business verification process
4. Wait for approval (can take several days)

### 2. Meta Business Manager Setup
1. Create Meta Business Manager account
2. Add WhatsApp Business Account
3. Verify your business phone number
4. Get phone number ID and access token

### 3. Webhook Configuration
1. In Meta Business Manager, go to WhatsApp > Configuration
2. Set webhook URL: `https://your-backend.com/api/whatsapp/webhook`
3. Set verify token (use same as WHATSAPP_VERIFY_TOKEN)
4. Subscribe to message events

### 4. Test Webhook
```bash
# Test webhook verification
curl -X GET "https://your-backend.com/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your_verify_token"

# Should return: test123
```

### 5. Test Message Sending
```javascript
// Test WhatsApp message
const axios = require('axios');

const sendMessage = async () => {
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: '919876543210', // Test number
      type: 'text',
      text: {
        body: 'Test message from MARVELS Fashion!'
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log('Message sent:', response.data);
};

sendMessage();
```

### 6. Message Templates (Optional)
Create message templates in Meta Business Manager for:
- Order confirmation
- Shipping updates
- Promotional messages
- Customer support

## 📧 Email Configuration

### 1. Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to **Google Account** > **Security** > **App passwords**
3. Generate password for "Mail" application
4. Use the 16-character password as GMAIL_APP_PASS

### 2. Alternative Email Providers

#### Outlook/Hotmail
```env
EMAIL_SERVICE=hotmail
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Custom SMTP
```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

### 3. Test Email Configuration
```javascript
// Test email sending
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

const testEmail = async () => {
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: 'test@example.com',
    subject: 'Test Email from MARVELS Fashion',
    html: '<h1>Test Email</h1><p>Email configuration is working!</p>'
  });
  
  console.log('Test email sent:', info.messageId);
};

testEmail();
```

## ☁️ Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Note down your cloud name, API key, and API secret

### 2. Configure Upload Settings
1. Go to **Settings** > **Upload**
2. Create upload preset named "marvels-products"
3. Set folder to "products"
4. Enable auto-optimization
5. Set max file size to 10MB

### 3. Test Configuration
```javascript
// Test Cloudinary upload
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const testUpload = async () => {
  const result = await cloudinary.uploader.upload(
    'https://via.placeholder.com/300x300.png',
    {
      folder: 'products',
      public_id: 'test-image'
    }
  );
  
  console.log('Test upload successful:', result.secure_url);
};

testUpload();
```

## 🗄️ Database Configuration

### 1. MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string

### 2. Local MongoDB
```bash
# Install MongoDB
# macOS
brew install mongodb/brew/mongodb-community

# Ubuntu
sudo apt install mongodb

# Start MongoDB
# macOS
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo systemctl start mongod

# Connection string
mongodb://localhost:27017/marvels-ecommerce
```

### 3. Database Indexes (Recommended)
```javascript
// Create indexes for better performance
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ orderStatus: 1 });
```

## 🔒 Security Configuration

### 1. Environment Variables Security
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Use different keys for development and production
# Rotate keys regularly
# Use strong, unique passwords
```

### 2. CORS Configuration
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Rate Limiting
```javascript
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// General API rate limit
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests, please try again later'
);

// Order creation rate limit
const orderLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // 10 orders per window
  'Too many orders, please wait before placing another order'
);

module.exports = { generalLimiter, orderLimiter };
```

### 4. Input Validation
```javascript
// backend/middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateOrder = [
  body('user').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number is required'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('paymentMethod').isIn(['COD', 'RAZORPAY']).withMessage('Invalid payment method')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = { validateOrder, handleValidationErrors };
```

## 🧪 Testing Configuration

### 1. Test All Integrations
```bash
# Create test script
node test-integrations.js
```

```javascript
// test-integrations.js
const testRazorpay = async () => {
  // Test Razorpay connection
};

const testShiprocket = async () => {
  // Test Shiprocket API
};

const testWhatsApp = async () => {
  // Test WhatsApp API
};

const testEmail = async () => {
  // Test email sending
};

const testCloudinary = async () => {
  // Test image upload
};

const runAllTests = async () => {
  console.log('Testing all integrations...');
  
  try {
    await testRazorpay();
    console.log('✅ Razorpay: OK');
  } catch (error) {
    console.log('❌ Razorpay: Failed', error.message);
  }
  
  // ... test other services
};

runAllTests();
```

### 2. Environment Validation
```javascript
// backend/config/validateEnv.js
const requiredEnvVars = [
  'MONGO_URI',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASS',
  'SHIPROCKET_EMAIL',
  'SHIPROCKET_PASSWORD',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => console.error(`   - ${envVar}`));
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
};

module.exports = { validateEnvironment };
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```
   Error: MongoNetworkError: failed to connect to server
   
   Solutions:
   - Check MONGO_URI format
   - Verify network connectivity
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has correct permissions
   ```

2. **Razorpay Key Invalid**
   ```
   Error: The api key provided is invalid
   
   Solutions:
   - Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
   - Check if using test/live keys correctly
   - Ensure keys are not expired
   ```

3. **Email Sending Failed**
   ```
   Error: Invalid login: 535-5.7.8 Username and Password not accepted
   
   Solutions:
   - Enable 2FA on Gmail
   - Generate new App Password
   - Check GMAIL_USER and GMAIL_APP_PASS
   - Verify "Less secure app access" is disabled
   ```

4. **WhatsApp API Unauthorized**
   ```
   Error: 401 Unauthorized
   
   Solutions:
   - Verify WHATSAPP_ACCESS_TOKEN
   - Check token expiration
   - Ensure phone number is verified
   - Verify webhook URL is accessible
   ```

5. **Shiprocket Authentication Failed**
   ```
   Error: Invalid credentials
   
   Solutions:
   - Check SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD
   - Verify account is active
   - Ensure API access is enabled
   - Check for special characters in password
   ```

### Debug Mode
```javascript
// Enable debug logging
process.env.DEBUG = 'marvels:*';

// Add to your modules
const debug = require('debug')('marvels:orders');
debug('Order created:', order._id);
```

---

**For additional help, check [README.md](README.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md)**