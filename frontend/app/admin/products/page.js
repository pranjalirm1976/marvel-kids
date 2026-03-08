"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit3, X, Star, Tag, Eye, Package, Search, Filter } from "lucide-react";
import Link from "next/link";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com"}/api/products`;

const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Boys", "Girls", "Unisex", "Sports"];
const SUBCATEGORIES = {
  Men: ["T-Shirts", "Shirts", "Hoodies", "Joggers", "Jeans", "Shorts", "Jackets"],
  Women: ["Tops", "Dresses", "Hoodies", "Joggers", "Jeans", "Skirts", "Jackets"],
  Kids: ["T-Shirts", "Shorts", "Dresses", "Pants", "Hoodies"],
  Accessories: ["Caps", "Bags", "Belts", "Socks", "Sunglasses"],
  Boys: ["T-Shirts", "Shorts", "Pants", "Hoodies"],
  Girls: ["Tops", "Dresses", "Pants", "Hoodies"],
  Unisex: ["T-Shirts", "Hoodies", "Joggers", "Caps"],
  Sports: ["Jerseys", "Shorts", "Track Pants", "Jackets"],
};
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y", "18", "20", "22", "24", "26", "28", "30", "32"];
const COLOR_OPTIONS = ["Black", "White", "Navy", "Red", "Blue", "Green", "Yellow", "Pink", "Grey", "Brown", "Orange", "Purple", "Maroon", "Olive"];
const TAG_OPTIONS = ["trending", "new-arrival", "best-seller", "flash-sale"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "Men",
  subcategory: "",
  brand: "MARVELS",
  stock: "",
  sizes: [],
  sizeVariants: [], // [{ size: "18", price: "1380" }]
  colors: [],
  tags: [],
  featured: false,
  image: null,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "featured") {
      setFormData({ ...formData, featured: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ---- Toggle array items (sizes, colors, tags) ----
  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const isRemoving = prev[field].includes(item);
      const updated = {
        ...prev,
        [field]: isRemoving
          ? prev[field].filter((i) => i !== item)
          : [...prev[field], item],
      };
      // If toggling sizes, also update sizeVariants
      if (field === "sizes") {
        updated.sizeVariants = isRemoving
          ? prev.sizeVariants.filter((v) => v.size !== item)
          : [...prev.sizeVariants, { size: item, price: "" }];
      }
      return updated;
    });
  };

  // ---- Update sizeVariant price ----
  const updateSizeVariantPrice = (size, price) => {
    setFormData((prev) => ({
      ...prev,
      sizeVariants: prev.sizeVariants.map((v) =>
        v.size === size ? { ...v, price } : v
      ),
    }));
  };

  // ---- Handle file input ----
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ---- Create or Update product ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Math.round(Number(formData.price) * 100));
      data.append("mrp", Math.round(Number(formData.mrp) * 100));
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("brand", formData.brand);
      data.append("stock", Number(formData.stock));
      data.append("featured", formData.featured);

      // Send arrays as JSON strings
      data.append("sizes", JSON.stringify(formData.sizes));
      data.append("colors", JSON.stringify(formData.colors));
      data.append("tags", JSON.stringify(formData.tags));

      // Send sizeVariants — convert price strings to paisa
      const sizeVariantsForApi = formData.sizeVariants
        .filter((v) => v.price !== "")
        .map((v) => ({ size: v.size, price: Math.round(Number(v.price) * 100) }));
      data.append("sizeVariants", JSON.stringify(sizeVariantsForApi));

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      await fetchProducts();
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save product:", err.message);
      alert("Failed to save product. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Edit product ----
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      mrp: ((product.mrp || product.price) / 100).toString(),
      category: product.category,
      subcategory: product.subcategory || "",
      brand: product.brand || "MARVELS",
      stock: product.stock.toString(),
      sizes: product.sizes || [],
      sizeVariants: (product.sizeVariants || []).map((v) => ({
        size: v.size,
        price: (v.price / 100).toString(),
      })),
      colors: product.colors || [],
      tags: product.tags || [],
      featured: product.featured || false,
      image: null,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // ---- Delete product ----
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchProducts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete product:", err.message);
    }
  };

  // ---- Filter products ----
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // ---- Shared input classes ----
  const inputClass =
    "w-full border-2 border-gray-200 px-4 py-3 text-sm text-[#0d0d0d] placeholder-gray-300 focus:border-[#0d0d0d] focus:outline-none transition-colors font-medium";
  const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d0d0d] uppercase tracking-tight">
            Products
          </h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(emptyForm); }}
          className="flex items-center gap-2 bg-[#ffd60a] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#0d0d0d] hover:bg-[#ffce00] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* ========== Add/Edit Product Form (Collapsible) ========== */}
      {showForm && (
        <div className="bg-white border border-gray-100 p-6 mb-6 animate-[fade-in-up_0.3s_ease]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#0d0d0d]">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }} className="text-gray-400 hover:text-[#0d0d0d]">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Name + Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Oversized Graphic Tee"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="MARVELS"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Detailed product description..."
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Row 3: Price, MRP, Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Selling Price (₹) *</label>
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
                <label className={labelClass}>MRP (₹) *</label>
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
              <div>
                <label className={labelClass}>Stock *</label>
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

            {/* Row 4: Category + Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, category: e.target.value, subcategory: "" }));
                  }}
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select subcategory</option>
                  {(SUBCATEGORIES[formData.category] || []).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className={labelClass}>Sizes (click to select)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleArrayItem("sizes", size)}
                    className={`px-3 py-2 text-xs font-bold border-2 transition-all ${
                      formData.sizes.includes(size)
                        ? "border-[#0d0d0d] bg-[#0d0d0d] text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Per-size pricing inputs */}
              {formData.sizeVariants.length > 0 && (
                <div className="mt-3 space-y-2 border border-dashed border-gray-200 p-3 bg-gray-50/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Price per size (₹) — leave blank to use base price
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formData.sizeVariants.map((v) => (
                      <div key={v.size} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0d0d0d] w-10">{v.size}</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={v.price}
                          onChange={(e) => updateSizeVariantPrice(v.size, e.target.value)}
                          placeholder={formData.price || "Base"}
                          className="flex-1 border border-gray-200 px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#0d0d0d] transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colors */}
            <div>
              <label className={labelClass}>Colors (click to select)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleArrayItem("colors", color)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-2 transition-all ${
                      formData.colors.includes(color)
                        ? "border-[#0d0d0d] bg-[#0d0d0d] text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}>Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleArrayItem("tags", tag)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                      formData.tags.includes(tag)
                        ? "border-[#ffd60a] bg-[#ffd60a] text-[#0d0d0d]"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <Tag size={12} /> {tag.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured + Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-4 file:border-0 file:bg-[#0d0d0d] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white file:uppercase file:tracking-wider hover:file:bg-[#1a1a1a] file:cursor-pointer file:transition-colors"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#ffd60a]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0d0d0d]">Featured Product</span>
                    <p className="text-[10px] text-gray-400">Show on homepage</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#ffd60a] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#0d0d0d] hover:bg-[#ffce00] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-[#0d0d0d]/30 border-t-[#0d0d0d] rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <><Plus size={14} /> {editingId ? "Update Product" : "Add Product"}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-400 border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== Search & Filter Bar ========== */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full border-2 border-gray-200 pl-10 pr-4 py-2.5 text-sm font-medium text-[#0d0d0d] placeholder-gray-300 focus:border-[#0d0d0d] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border-2 border-gray-200 px-4 py-2.5 text-sm font-medium text-[#0d0d0d] focus:border-[#0d0d0d] focus:outline-none transition-colors"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ========== Products Grid/Table ========== */}
      <div className="bg-white border border-gray-100">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-sm font-bold text-gray-400">No products found</p>
            <p className="text-xs text-gray-300 mt-1">
              {products.length === 0 ? "Add your first product to get started!" : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Image</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tags</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
                  return (
                    <tr
                      key={product._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center bg-gray-100 text-[8px] font-bold text-gray-400 uppercase">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="font-bold text-[#0d0d0d] truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{product.brand || "MARVELS"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-600">{product.category}</span>
                        {product.subcategory && (
                          <span className="text-[10px] text-gray-400 block">{product.subcategory}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-[#0d0d0d]">₹{(product.price / 100).toFixed(0)}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-[#00c853] font-bold block">{discount}% off</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${
                          product.stock <= 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-gray-600"
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags?.map((tag) => (
                            <span key={tag} className="bg-[#ffd60a]/20 text-[8px] font-bold text-[#0d0d0d] px-1.5 py-0.5 uppercase tracking-wider">
                              {tag.replace("-", " ")}
                            </span>
                          ))}
                          {product.featured && (
                            <span className="bg-[#0d0d0d] text-[8px] font-bold text-[#ffd60a] px-1.5 py-0.5 uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/product/${product._id}`}
                            className="p-2 text-gray-400 hover:text-[#0d0d0d] hover:bg-gray-100 transition-all"
                            title="View"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 hover:text-[#0d0d0d] hover:bg-gray-100 transition-all"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          {deleteConfirm === product._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="px-2 py-1 text-[10px] font-bold bg-red-500 text-white hover:bg-red-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
