const Product = require("../models/Product");
const { uploadImage } = require("../utils/cloudinary");

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (will be Admin-only later)
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Parse array fields if sent as JSON strings (multipart form)
    const arrayFields = ["images", "sizes", "colors", "tags", "sizeVariants"];
    for (const field of arrayFields) {
      if (typeof productData[field] === "string") {
        try {
          productData[field] = JSON.parse(productData[field]);
        } catch {
          productData[field] = productData[field] ? [productData[field]] : [];
        }
      }
    }

    // Parse boolean fields from string
    if (typeof productData.featured === "string") {
      productData.featured = productData.featured === "true";
    }

    // If a file was uploaded, send it to Cloudinary
    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer);
      productData.images = productData.images || [];
      productData.images.push(imageUrl);
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (_req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Public (will be Admin-only later)
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Parse array fields if sent as JSON strings (multipart form)
    const arrayFields = ["images", "sizes", "colors", "tags", "sizeVariants"];
    for (const field of arrayFields) {
      if (typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch {
          updateData[field] = updateData[field] ? [updateData[field]] : [];
        }
      }
    }

    // Parse boolean fields from string
    if (typeof updateData.featured === "string") {
      updateData.featured = updateData.featured === "true";
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (will be Admin-only later)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
