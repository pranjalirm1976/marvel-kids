"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  SlidersHorizontal, X, ChevronDown,
  LayoutGrid, Grid3X3, Search, Sparkles,
} from "lucide-react";

const categories = ["All", "Girls", "Boys", "Sports", "New Arrivals"];
const sortOptions = [
  { label: "Newest First",      value: "newest"     },
  { label: "Price: Low → High", value: "price-asc"  },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name: A → Z",       value: "name-asc"   },
  { label: "Popularity",        value: "popular"    },
];

// Skeleton card shown while images load
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-2 w-16 rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function ShopContent({ initialProducts }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy]                 = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols]             = useState(4);

  // Sync URL param → active category
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  // Filter
  let filtered = activeCategory === "All"
    ? initialProducts
    : initialProducts.filter((p) => p.category === activeCategory);

  // Sort
  if      (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "name-asc")   filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "popular")    filtered = [...filtered].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  else                              filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const gridClass = gridCols === 5
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div style={{ background: "linear-gradient(160deg, #fff8fb 0%, #f0fbff 100%)" }} className="min-h-screen">

      {/* ===== PAGE HEADER ===== */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fff8fb 0%, #f0fbff 60%, #fff8fb 100%)",
          borderBottom: "1.5px solid #fce8f3",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #ff2d87, transparent 70%)" }} />
          <div className="absolute -top-8 right-0 h-40 w-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #3ab7e8, transparent 70%)" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: "#ff2d87" }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: "#ff2d87" }}>
              {activeCategory === "All" ? "All Collections" : `${activeCategory}'s Collection`}
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl" style={{ color: "#2d2d3a" }}>
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <p className="mt-2 text-sm font-medium" style={{ color: "#8892a4" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ===== TOOLBAR ===== */}
        <div className="flex items-center justify-between mb-6 gap-4">
          {/* Desktop category tabs */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[11px] font-extrabold uppercase tracking-wider transition-all whitespace-nowrap rounded-full ${
                  activeCategory === cat
                    ? "text-white shadow-md"
                    : "bg-white text-gray-500 hover:bg-[#fff0f7] hover:text-[#ff2d87] border border-[#fce8f3]"
                }`}
                style={activeCategory === cat ? { background: "linear-gradient(135deg, #ff2d87, #3ab7e8)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex sm:hidden items-center gap-2 bg-white border border-[#fce8f3] px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full"
            style={{ color: "#2d2d3a" }}
          >
            <SlidersHorizontal size={14} /> Filter &amp; Sort
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Grid toggle */}
            <div className="hidden lg:flex items-center gap-0 bg-white border border-[#fce8f3] rounded-full overflow-hidden shadow-sm">
              {[4, 5].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className="p-2.5 transition-colors"
                  style={gridCols === cols
                    ? { background: "linear-gradient(135deg, #ff2d87, #3ab7e8)", color: "#fff" }
                    : { color: "#8892a4" }}
                >
                  {cols === 4 ? <LayoutGrid size={14} /> : <Grid3X3 size={14} />}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-[#fce8f3] rounded-full py-2.5 pl-4 pr-10 text-[11px] font-bold uppercase tracking-wider focus:border-[#ff2d87] focus:outline-none cursor-pointer shadow-sm"
                style={{ color: "#2d2d3a" }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8892a4" }} />
            </div>
          </div>
        </div>

        {/* Active filter chip */}
        {activeCategory !== "All" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active:</span>
            <button
              onClick={() => setActiveCategory("All")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-full"
              style={{ background: "linear-gradient(135deg, #ff2d87, #3ab7e8)" }}
            >
              {activeCategory} <X size={10} />
            </button>
          </div>
        )}

        {/* ===== MOBILE FILTERS PANEL ===== */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 sm:hidden animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <div
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: "#2d2d3a" }}>
                  Filter &amp; Sort
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-[#fff0f7]">
                  <X size={20} style={{ color: "#ff2d87" }} />
                </button>
              </div>
              <div className="mb-6">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-4 py-3.5 text-sm font-bold uppercase tracking-wider transition-all rounded-xl ${
                        activeCategory === cat ? "text-white" : "text-gray-700 hover:bg-[#fff0f7]"
                      }`}
                      style={activeCategory === cat
                        ? { background: "linear-gradient(135deg, #ff2d87, #3ab7e8)" }
                        : { background: "#fff8fb" }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Sort By</h4>
                <div className="space-y-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all rounded-xl ${
                        sortBy === opt.value ? "text-white font-bold" : "text-gray-600"
                      }`}
                      style={sortBy === opt.value
                        ? { background: "linear-gradient(135deg, #ff2d87, #3ab7e8)" }
                        : { background: "#fff8fb" }}
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
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-xl font-black uppercase" style={{ color: "#8892a4" }}>
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-400">Try a different category or check back later</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 px-8 py-3 text-white text-sm font-bold rounded-full"
              style={{ background: "linear-gradient(135deg, #ff2d87, #3ab7e8)" }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-3 sm:gap-5`}>
            {filtered.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopClient({ initialProducts }) {
  return (
    <Suspense
      fallback={
        <div style={{ background: "linear-gradient(160deg, #fff8fb 0%, #f0fbff 100%)" }} className="min-h-screen">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
                  <div className="mt-3 space-y-2 px-1">
                    <div className="h-2 w-16 rounded bg-gray-200" />
                    <div className="h-3 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopContent initialProducts={initialProducts} />
    </Suspense>
  );
}
