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
        values: ["Boys", "Girls", "Unisex", "Sports"],
        message: "{VALUE} is not a valid category",
      },
    },
    sizes: {
      type: [String], // e.g. ["2-3Y", "4-5Y", "6-7Y"]
    },
    images: {
      type: [String], // Will hold Cloudinary URLs
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      default: 0,
    },
    storeId: {
      type: String,
      default: "MarvelKids", // Crucial for future SaaS expansion
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Product", productSchema);
