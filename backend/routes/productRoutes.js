const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").post(upload.single("image"), createProduct).get(getProducts);
router.route("/:id").get(getProductById).put(upload.single("image"), updateProduct).delete(deleteProduct);

module.exports = router;
