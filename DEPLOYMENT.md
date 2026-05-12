# 🚀 MARVELS Fashion - Deployment Guide

This guide covers the complete deployment process for the MARVELS Fashion e-commerce platform.

## 📋 Pre-Deployment Checklist

### Required Accounts & Services
- [ ] MongoDB Atlas account (or local MongoDB)
- [ ] Cloudinary account for image storage
- [ ] Razorpay merchant account
- [ ] Shiprocket account for logistics
- [ ] WhatsApp Business API access
- [ ] Gmail account with App Password
- [ ] Hosting provider accounts (Vercel, Railway, etc.)

### Environment Variables Setup
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] All API keys and secrets obtained
- [ ] Webhook URLs configured

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. **Create Cluster**
   ```
   1. Go to mongodb.com/atlas
   2. Create free cluster
   3. Choose region closest to your users
   4. Create database user
   5. Whitelist IP addresses (0.0.0.0/0 for development)
   ```

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/marvels-ecommerce
   ```

3. **Database Collections**
   The following collections will be created automatically:
   - `products` - Product catalog
   - `orders` - Customer orders
   - `users` - Customer data (if implementing auth)

### Local MongoDB (Development)
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community  # macOS
sudo apt install mongodb  # Ubuntu

# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
sudo systemctl start mongod  # Ubuntu

# Connection string
mongodb://localhost:27017/marvels-ecommerce
```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)
1. **Setup**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd backend
   railway init
   ```

2. **Environment Variables**
   ```bash
   # Set variables via CLI
   railway variables set MONGO_URI="your_mongodb_connection_string"
   railway variables set RAZORPAY_KEY_ID="your_key"
   railway variables set RAZORPAY_KEY_SECRET="your_secret"
   # ... add all other variables
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Render
1. **Connect Repository**
   - Go to render.com
   - Connect GitHub repository
   - Select backend folder

2. **Configuration**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: marvels-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: MONGO_URI
           value: your_mongodb_connection_string
         - key: PORT
           value: 10000
   ```

3. **Environment Variables**
   Set all required environment variables in Render dashboard

### Option 3: Heroku
1. **Setup**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login and create app
   heroku login
   cd backend
   heroku create marvels-backend
   ```

2. **Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_connection_string"
   heroku config:set RAZORPAY_KEY_ID="your_key"
   # ... set all variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)
1. **Setup**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd frontend
   vercel
   ```

2. **Environment Variables**
   ```bash
   # Set via CLI
   vercel env add NEXT_PUBLIC_API_URL
   vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
   ```

3. **Custom Domain**
   ```bash
   vercel domains add yourdomain.com
   ```

### Option 2: Netlify
1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Set in Netlify dashboard under Site settings > Environment variables

### Option 3: Firebase Hosting
1. **Setup**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Configuration**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run build
   npm run export
   firebase deploy
   ```

## 🔗 API Integration Setup

### Razorpay Configuration
1. **Dashboard Setup**
   ```
   1. Login to razorpay.com
   2. Go to Settings > API Keys
   3. Generate keys for production
   4. Configure webhook: https://your-backend.com/api/order/verify
   ```

2. **Webhook Configuration**
   ```json
   {
     "url": "https://your-backend.com/api/order/verify",
     "events": ["payment.captured", "payment.failed"]
   }
   ```

### Shiprocket Integration
1. **API Setup**
   ```
   1. Login to shiprocket.in
   2. Go to Settings > API
   3. Get API credentials
   4. Configure pickup locations
   ```

2. **Webhook Setup**
   ```
   Webhook URL: https://your-backend.com/api/shiprocket/webhook
   Events: All shipment events
   ```

### WhatsApp Business API
1. **Meta Business Setup**
   ```
   1. Apply for WhatsApp Business API
   2. Get phone number ID and access token
   3. Configure webhook: https://your-backend.com/api/whatsapp/webhook
   ```

2. **Webhook Verification**
   ```bash
   # Test webhook
   curl -X GET "https://your-backend.com/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test&hub.verify_token=your_verify_token"
   ```

### Email Configuration
1. **Gmail App Password**
   ```
   1. Enable 2FA on Gmail
   2. Go to Account > Security > App passwords
   3. Generate password for "Mail"
   4. Use 16-character password in GMAIL_APP_PASS
   ```

## 🔒 Security Configuration

### Environment Variables
```bash
# Backend Production Variables
NODE_ENV=production
MONGO_URI=mongodb+srv://...
RAZORPAY_KEY_SECRET=your_secret_key
GMAIL_APP_PASS=your_app_password
WHATSAPP_ACCESS_TOKEN=your_token

# Frontend Production Variables
NEXT_PUBLIC_API_URL=https://your-backend.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_key
```

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://your-frontend.com',
    'https://www.your-frontend.com'
  ],
  credentials: true
}));
```

### Rate Limiting
```javascript
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Analytics

### Error Tracking
```bash
# Install Sentry
npm install @sentry/node @sentry/nextjs

# Configure in backend
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your_sentry_dsn' });

# Configure in frontend
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### Performance Monitoring
```javascript
// Add to backend
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
```

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend.com/api/health
# Expected: {"status": "success", "message": "Server is live"}
```

### Frontend Accessibility
```bash
curl https://your-frontend.com
# Should return HTML content
```

### Payment Flow Test
1. Create test order with Razorpay test keys
2. Verify webhook receives payment confirmation
3. Check order status updates correctly

### Email Test
```bash
# Test order creation to trigger email
curl -X POST https://your-backend.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{"user":"Test User","email":"test@example.com",...}'
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Add to backend
   app.use(cors({
     origin: true,
     credentials: true
   }));
   ```

2. **Environment Variables Not Loading**
   ```bash
   # Check if .env file exists and variables are set
   echo $MONGO_URI
   ```

3. **Database Connection Issues**
   ```javascript
   // Add connection logging
   mongoose.connection.on('connected', () => {
     console.log('MongoDB connected successfully');
   });
   ```

4. **Payment Webhook Issues**
   ```javascript
   // Add webhook logging
   app.post('/api/order/verify', (req, res) => {
     console.log('Webhook received:', req.body);
     // ... rest of handler
   });
   ```

### Performance Issues
1. **Slow API Responses**
   - Add database indexing
   - Implement caching
   - Optimize queries

2. **Large Bundle Size**
   - Implement code splitting
   - Optimize images
   - Remove unused dependencies

## 📞 Support

If you encounter issues during deployment:
1. Check logs in your hosting platform
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check webhook configurations

For additional support:
- Email: support@marvels-fashion.com
- Documentation: Check README.md
- Issues: Create GitHub issue

---

**Happy Deploying! 🚀**