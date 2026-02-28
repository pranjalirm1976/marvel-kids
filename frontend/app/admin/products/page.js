"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "Boys",
  stock: "",
  image: null,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // ---- Fetch all products ----
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---- Handle input changes ----
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---- Handle file input ----
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ---- Create product ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Math.round(Number(formData.price) * 100)); // rupees → paise
      data.append("mrp", Math.round(Number(formData.mrp) * 100));
      data.append("category", formData.category);
      data.append("stock", Number(formData.stock));

      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post(API_URL, data);
      await fetchProducts();
      setFormData(emptyForm);
    } catch (err) {
      console.error("Failed to create product:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Delete product ----
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };

  // ---- Shared input classes ----
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Manage Products
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ========== Left Column — Add Product Form ========== */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-700">
            <Plus size={20} /> Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Spider-Man Graphic Tee"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Short product description..."
                className={inputClass}
              />
            </div>

            {/* Price & MRP side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="299"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="499"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Category & Stock side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="25"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={18} />
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* ========== Right Column — Products Table ========== */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-700">
            Existing Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <p className="text-sm text-gray-400">
              No products yet. Add one using the form!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="pb-3 pr-4">Image</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Stock</th>
                    <th className="pb-3 pr-4">Price (₹)</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 pr-4">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-medium text-gray-800">
                        {product.name}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {product.stock}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        ₹{(product.price / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
