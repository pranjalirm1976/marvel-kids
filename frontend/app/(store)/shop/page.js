"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, Grid3X3, Search, Sparkles } from "lucide-react";

const categories = ["All", "Men", "Women", "Kids", "Accessories"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name: A → Z", value: "name-asc" },
  { label: "Popularity", value: "popular" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com";
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "name-asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "popular") filtered = [...filtered].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  else filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const gridClass = gridCols === 5
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#ffd60a]/5 blur-[80px]" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-[#ffd60a]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">
              {activeCategory === "All" ? "All Collections" : `${activeCategory}'s Collection`}
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ===== TOOLBAR ===== */}
        <div className="flex items-center justify-between mb-6 gap-4">
          {/* Desktop Category Tabs */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0d0d0d] text-white shadow-lg"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-[#0d0d0d] border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex sm:hidden items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:border-[#0d0d0d] transition-colors"
          >
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Grid toggle - desktop only */}
            <div className="hidden lg:flex items-center gap-1 bg-white border border-gray-200">
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 ${gridCols === 4 ? 'bg-[#0d0d0d] text-white' : 'text-gray-400 hover:text-[#0d0d0d]'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setGridCols(5)}
                className={`p-2 ${gridCols === 5 ? 'bg-[#0d0d0d] text-white' : 'text-gray-400 hover:text-[#0d0d0d]'}`}
              >
                <Grid3X3 size={14} />
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-wider text-[#0d0d0d] focus:border-[#0d0d0d] focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ===== ACTIVE FILTERS ===== */}
        {activeCategory !== "All" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active:</span>
            <button
              onClick={() => setActiveCategory("All")}
              className="inline-flex items-center gap-1.5 bg-[#0d0d0d] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
            >
              {activeCategory} <X size={10} />
            </button>
          </div>
        )}

        {/* ===== MOBILE FILTERS PANEL ===== */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 sm:hidden animate-fade-in" onClick={() => setMobileFiltersOpen(false)}>
            <div
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight">Filter & Sort</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-4 py-3.5 text-sm font-bold uppercase tracking-wider transition-all ${
                        activeCategory === cat
                          ? "bg-[#0d0d0d] text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Sort By</h4>
                <div className="space-y-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all ${
                        sortBy === opt.value
                          ? "bg-[#ffd60a] text-[#0d0d0d] font-bold"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRODUCT GRID ===== */}
        {loading ? (
          <div className={`grid ${gridClass} gap-3 sm:gap-5`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="mt-3 space-y-2 px-1">
                  <div className="h-2 w-16 bg-gray-200" />
                  <div className="h-3 w-3/4 bg-gray-200" />
                  <div className="h-3 w-1/2 bg-gray-200" />
                  <div className="h-4 w-1/3 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-xl font-black text-gray-300 uppercase">No products found</h3>
            <p className="mt-2 text-sm text-gray-400">Try a different category or check back later</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 btn-brand text-xs"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-3 sm:gap-5 stagger-children`}>
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <ShopContent />
    </Suspense>
  );
}
