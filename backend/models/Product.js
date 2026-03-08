const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"], // Stored as integer (paise/cents)
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"], // Original price for strikethrough UI
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Men", "Women", "Kids", "Accessories", "Boys", "Girls", "Unisex", "Sports"],
        message: "{VALUE} is not a valid category",
      },
    },
    subcategory: {
      type: String,
      trim: true, // e.g. "T-Shirts", "Jeans", "Hoodies", "Joggers"
    },
    brand: {
      type: String,
      default: "MARVELS",
      trim: true,
    },
    colors: {
      type: [String], // e.g. ["Black", "White", "Navy"]
    },
    tags: {
      type: [String], // e.g. ["trending", "new-arrival", "best-seller", "flash-sale"]
    },
    sizes: {
      type: [String], // e.g. ["S", "M", "L", "XL", "XXL"]
    },
    sizeVariants: {
      type: [
        {
          size: { type: String, required: true },
          price: { type: Number, required: true }, // stored in paisa
        },
      ],
      default: [], // when empty, all sizes use the base product.price
    },
    images: {
      type: [String], // Will hold Cloudinary URLs
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.2,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    storeId: {
      type: String,
      default: "Marvels",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
