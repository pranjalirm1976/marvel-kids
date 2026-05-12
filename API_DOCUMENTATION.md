# 📚 MARVELS Fashion - API Documentation

Complete API documentation for the MARVELS Fashion e-commerce platform.

## 🔗 Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend-domain.com`

## 📋 Table of Contents
- [Authentication](#authentication)
- [Products API](#products-api)
- [Orders API](#orders-api)
- [Admin API](#admin-api)
- [WhatsApp API](#whatsapp-api)
- [Webhook Endpoints](#webhook-endpoints)
- [Error Handling](#error-handling)

## 🔐 Authentication

Currently, the API uses basic authentication for admin endpoints. Implement JWT or session-based auth as needed.

### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>  # For protected routes
```

## 🛍️ Products API

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (string): Filter by category
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search in product name/description

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 2999,
      "mrp": 3999,
      "category": "Boys",
      "subCategory": "T-Shirts",
      "ageRange": "4-6 years",
      "brand": "MARVELS",
      "colors": ["Black", "White"],
      "sizes": ["S", "M", "L"],
      "images": ["https://cloudinary.com/image1.jpg"],
      "stock": 50,
      "rating": 4.5,
      "reviewCount": 25,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Product
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "Product Name",
    // ... full product details
  }
}
```

### Create Product (Admin)
```http
POST /api/products
Content-Type: multipart/form-data
```

**Form Data:**
```
name: Product Name
description: Product description
price: 2999
mrp: 3999
category: Boys
subCategory: T-Shirts
ageRange: 4-6 years
colors: ["Black", "White"]
sizes: ["S", "M", "L"]
stock: 50
images: [File, File, ...]  # Image files
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "new_product_id",
    // ... product details
  }
}
```

### Update Product (Admin)
```http
PUT /api/products/:id
Content-Type: multipart/form-data
```

### Delete Product (Admin)
```http
DELETE /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## 📦 Orders API

### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "user": "Customer Name",
  "email": "customer@example.com",
  "phone": "9876543210",
  "address": "123 Street, City, State - 400001",
  "items": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 2999,
      "quantity": 2,
      "image": "https://cloudinary.com/image.jpg"
    }
  ],
  "paymentMethod": "COD" // or "RAZORPAY"
}
```

**Response (COD):**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "user": "Customer Name",
    "totalAmount": 5998,
    "paymentMethod": "COD",
    "paymentStatus": "Pending",
    "orderStatus": "Pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response (Razorpay):**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "razorpayOrderId": "order_razorpay_id",
    // ... order details
  },
  "razorpayOrder": {
    "id": "order_razorpay_id",
    "amount": 5998,
    "currency": "INR"
  }
}
```

### Verify Payment
```http
POST /api/order/verify
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id",
  "razorpay_payment_id": "pay_razorpay_id",
  "razorpay_signature": "signature_hash",
  "orderId": "mongodb_order_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "_id": "order_id",
    "paymentStatus": "Completed",
    "orderStatus": "Confirmed"
  }
}
```

### Get Orders (Admin)
```http
GET /api/orders
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `paymentMethod` (string): Filter by payment method
- `search` (string): Search orders

## 👨‍💼 Admin API

### Get Dashboard Statistics
```http
GET /api/admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": {
      "totalRevenue": 150000,
      "totalOrders": 50,
      "avgOrderValue": 3000
    },
    "today": {
      "todayRevenue": 5000,
      "todayOrders": 2
    },
    "orderStatus": [
      { "_id": "Pending", "count": 5 },
      { "_id": "Shipped", "count": 20 },
      { "_id": "Delivered", "count": 25 }
    ],
    "paymentMethods": [
      { "_id": "COD", "count": 30, "revenue": 90000 },
      { "_id": "RAZORPAY", "count": 20, "revenue": 60000 }
    ],
    "recentOrders": [
      {
        "_id": "order_id",
        "user": "Customer Name",
        "totalAmount": 2999,
        "orderStatus": "Pending",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "topProducts": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "totalSold": 15,
        "revenue": 44985
      }
    ]
  }
}
```

### Get All Orders (Admin)
```http
GET /api/admin/orders
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by order status
- `paymentMethod` (string): Filter by payment method
- `search` (string): Search by customer name, email, phone, or order ID

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "user": "Customer Name",
      "email": "customer@example.com",
      "phone": "9876543210",
      "address": "Customer Address",
      "items": [...],
      "totalAmount": 2999,
      "paymentMethod": "COD",
      "paymentStatus": "Pending",
      "orderStatus": "Pending",
      "shiprocketOrderId": "SR123456",
      "awbCode": "AWB123456",
      "whatsappStatus": "Sent",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalOrders": 50,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "totalRevenue": 150000,
    "totalOrders": 50,
    "pendingOrders": 5,
    "shippedOrders": 20,
    "deliveredOrders": 25
  }
}
```

### Update Order Status (Admin)
```http
PUT /api/admin/orders/:id/status
```

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**Valid Statuses:**
- `Pending`
- `Confirmed`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "order_id",
    "orderStatus": "Shipped",
    // ... updated order details
  }
}
```

### Get Order Tracking (Admin)
```http
GET /api/admin/orders/:id/tracking
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "orderStatus": "Shipped",
    "shiprocketOrderId": "SR123456",
    "awbCode": "AWB123456",
    "trackingId": "AWB123456"
  },
  "trackingData": {
    "tracking_data": {
      "track_status": "In Transit",
      "current_timestamp": "2025-01-01T12:00:00.000Z",
      "expected_delivery_date": "2025-01-05"
    }
  }
}
```

## 💬 WhatsApp API

### Send Promotional Messages (Admin)
```http
POST /api/admin/whatsapp/promotional
```

**Request Body:**
```json
{
  "offerDetails": "🔥 Special Offer! Get 50% off on all kids wear. Use code KIDS50. Valid till 31st Jan.",
  "targetCustomers": "all"  // or "custom"
}
```

**For Custom Customers:**
```json
{
  "offerDetails": "Your promotional message",
  "targetCustomers": [
    {
      "name": "Customer Name",
      "phone": "9876543210"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Promotional messages sent to 25 customers",
  "results": {
    "total": 25,
    "success": 23,
    "failed": 2,
    "details": [
      {
        "customer": "Customer Name",
        "phone": "9876543210",
        "success": true
      }
    ]
  }
}
```

## 🔗 Webhook Endpoints

### WhatsApp Webhook Verification
```http
GET /api/whatsapp/webhook
```

**Query Parameters:**
- `hub.mode`: "subscribe"
- `hub.challenge`: Challenge string
- `hub.verify_token`: Your verification token

### WhatsApp Webhook Events
```http
POST /api/whatsapp/webhook
```

**Request Body (from Meta):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "changes": [
        {
          "field": "messages",
          "value": {
            "messages": [
              {
                "from": "919876543210",
                "id": "message_id",
                "text": {
                  "body": "Customer message"
                },
                "timestamp": "1640995200"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Razorpay Webhook (Payment Verification)
```http
POST /api/order/verify
```

**Headers:**
```
X-Razorpay-Signature: signature_hash
```

**Request Body (from Razorpay):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_razorpay_id",
        "order_id": "order_razorpay_id",
        "status": "captured",
        "amount": 2999
      }
    }
  }
}
```

## ❌ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## 🔧 Rate Limiting

### Limits
- **General API**: 100 requests per 15 minutes per IP
- **Order Creation**: 10 requests per 5 minutes per IP
- **Admin API**: 200 requests per 15 minutes per IP

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 Request/Response Examples

### Complete Order Flow Example

1. **Create COD Order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, Mumbai, Maharashtra - 400001",
    "items": [
      {
        "_id": "product123",
        "name": "Kids T-Shirt",
        "price": 1999,
        "quantity": 1,
        "image": "https://example.com/image.jpg"
      }
    ],
    "paymentMethod": "COD"
  }'
```

2. **Update Order Status:**
```bash
curl -X PUT http://localhost:5000/api/admin/orders/order123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Shipped"}'
```

3. **Send WhatsApp Message:**
```bash
curl -X POST http://localhost:5000/api/admin/whatsapp/promotional \
  -H "Content-Type: application/json" \
  -d '{
    "offerDetails": "🎉 New Year Sale! 50% off on all items",
    "targetCustomers": "all"
  }'
```

## 🧪 Testing

### Test with Postman
Import the API collection:
```json
{
  "info": {
    "name": "MARVELS Fashion API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

### Test with cURL
See examples above for common API calls.

---

**For more information, check the [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md) files.**