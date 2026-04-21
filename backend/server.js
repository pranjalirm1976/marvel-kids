const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------

app.get('/api/health', (req, res) => res.status(200).json({ status: 'success', message: 'Server is live' }));

app.get('/', (req, res) => res.status(200).send('Marvel Kids API is running.'));

// Product routes
app.use("/api/products", productRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// --------------- Error Handler ---------------
app.use((err, _req, res, _next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Image is too large. Maximum allowed size is 15MB.",
    });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload request.",
    });
  }

  if (err?.message) {
    return res.status(400).json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --------------- Database Connection & Server Start ---------------
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Try to connect to MongoDB in the background (non-blocking)
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB on startup:", err.message);
  console.warn("Continuing anyway - database operations may fail until connection is restored.");
});
