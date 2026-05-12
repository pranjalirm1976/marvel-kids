# MARVELS Fashion E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js and Node.js, featuring advanced integrations for payments, shipping, and customer communication.

## 🚀 Features

### Core E-commerce Features
- **Product Management**: Complete CRUD operations with image upload
- **Shopping Cart**: Persistent cart with Zustand state management
- **Order Processing**: COD and online payment support
- **User Management**: Customer registration and order tracking

### Advanced Integrations
- **Payment Gateway**: Razorpay integration for secure online payments
- **Shipping**: Shiprocket API integration for automated logistics
- **Email Notifications**: Professional order confirmation emails
- **WhatsApp Messaging**: Automated customer notifications and promotional campaigns
- **Admin Dashboard**: Comprehensive order and inventory management

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Premium Theme**: Pink and blue gradient design system
- **Smooth Animations**: Enhanced user experience with custom animations
- **Glass Morphism**: Modern visual effects and styling

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: Zustand for cart and global state
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary for image management
- **Email**: Nodemailer with Gmail SMTP
- **Payment**: Razorpay SDK
- **Shipping**: Shiprocket API
- **WhatsApp**: Meta Business API

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database (local or Atlas)
- Cloudinary account
- Razorpay account
- Shiprocket account
- WhatsApp Business API access
- Gmail account with App Password

### Backend Setup

1. **Clone and Install**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/marvels-ecommerce
   
   # Server
   PORT=5000
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Email (Gmail)
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASS=your-16-char-app-password
   NOTIFY_EMAIL=admin@marvels-fashion.com
   
   # Shiprocket
   SHIPROCKET_EMAIL=your-shiprocket-email@gmail.com
   SHIPROCKET_PASSWORD=your-shiprocket-password
   
   # WhatsApp Business API
   WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_VERIFY_TOKEN=your-webhook-verify-token
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration Guides

### Razorpay Setup
1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard > Settings > API Keys
3. Configure webhook URL: `https://your-domain.com/api/order/verify`

### Shiprocket Setup
1. Create account at [shiprocket.in](https://shiprocket.in)
2. Get API credentials from Settings > API
3. Configure pickup locations in dashboard
4. Set webhook URL: `https://your-domain.com/api/shiprocket/webhook`

### WhatsApp Business API Setup
1. Apply for WhatsApp Business API access
2. Get access token and phone number ID from Meta Business
3. Configure webhook URL: `https://your-domain.com/api/whatsapp/webhook`
4. Verify webhook with your verify token

### Email Configuration
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Account > Security > App passwords
3. Use the 16-character password in GMAIL_APP_PASS

### Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Configure upload presets for product images

## 📱 API Documentation

### Authentication
Most admin endpoints require authentication. Implement your preferred auth method.

### Core Endpoints

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders (admin)
- `PUT /api/orders/:id/status` - Update order status

#### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/orders` - Get orders with filters
- `POST /api/admin/whatsapp/promotional` - Send promotional messages

#### WhatsApp
- `POST /api/whatsapp/webhook` - Webhook for message status
- `GET /api/whatsapp/webhook` - Webhook verification

## 🎨 Theme Customization

The platform uses a custom design system with CSS variables:

```css
:root {
  --pink: #ff2d87;
  --blue: #3ab7e8;
  --gradient-primary: linear-gradient(135deg, #ff2d87 0%, #3ab7e8 100%);
}
```

### Customizing Colors
1. Update CSS variables in `frontend/app/globals.css`
2. Modify Tailwind config for additional utilities
3. Update component styles as needed

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy with automatic builds

### Firebase Hosting (Alternative)
```bash
cd frontend
npm run build
firebase deploy
```

## 📊 Admin Features

### Dashboard
- Real-time sales statistics
- Order status overview
- Top-selling products
- Revenue analytics

### Order Management
- View all orders with filters
- Update order status
- Track shipments
- Customer communication history

### WhatsApp Marketing
- Send promotional messages
- Bulk customer messaging
- Message status tracking
- Automated order notifications

### Inventory Management
- Product CRUD operations
- Image management
- Stock tracking
- Category management

## 🔒 Security Features

- Input validation and sanitization
- Secure payment processing
- Environment variable protection
- CORS configuration
- Rate limiting (recommended)
- SQL injection prevention

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Optimization

- Image optimization with Cloudinary
- Lazy loading for product images
- Efficient database queries
- Caching strategies
- CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@marvels-fashion.com
- Documentation: [docs.marvels-fashion.com](https://docs.marvels-fashion.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Razorpay for payment processing
- Shiprocket for logistics solutions
- Meta for WhatsApp Business API

---

**Built with ❤️ for modern e-commerce**