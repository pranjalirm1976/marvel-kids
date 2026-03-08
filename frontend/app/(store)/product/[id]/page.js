"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag, Heart, ChevronRight, Star, Truck,
  RotateCcw, Shield, Check, Ruler, Package, X, Loader2
} from "lucide-react";
import useCartStore from "@/store/useCartStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  // ── Fetch product on mount ──
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/products/${params.id}`);
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  // ── Derived values (dynamic based on selected size) ──
  const getSizePrice = () => {
    if (selectedSize && product?.sizeVariants?.length > 0) {
      const variant = product.sizeVariants.find((v) => v.size === selectedSize);
      if (variant) return variant.price;
    }
    return product?.price;
  };

  const activePrice = product ? getSizePrice() : 0;
  const activeMrp = product?.mrp || activePrice;
  const discount = activeMrp > activePrice
    ? Math.round(((activeMrp - activePrice) / activeMrp) * 100)
    : 0;
  const brand = product?.brand || "MARVELS";

  // ── Handlers ──
  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart({ ...product, selectedSize, price: activePrice });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-[#0d0d0d]" />
      </div>
    );
  }

  // ── 404 ──
  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fafafa]">
        <h1 className="text-6xl font-black text-gray-200">404</h1>
        <h2 className="mt-2 text-xl font-black uppercase text-[#0d0d0d]">Product Not Found</h2>
        <p className="mt-2 text-sm text-gray-400">This product doesn&apos;t exist or has been removed.</p>
        <Link href="/shop" className="mt-6 inline-block btn-brand text-xs">Back to Shop</Link>
      </div>
    );
  }

  const mainImage =
    product.images?.length > 0 ? product.images[0] : "/placeholder.png";

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#fafafa] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            <Link href="/" className="hover:text-[#0d0d0d] transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link href="/shop" className="hover:text-[#0d0d0d] transition-colors">Shop</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-[#0d0d0d] transition-colors">
              {product.category}
            </Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-[#0d0d0d] truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">

          {/* ====== LEFT — Product Image ====== */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount > 0 && (
              <span className="absolute left-0 top-4 bg-[#00c853] px-4 py-1.5 text-xs font-black text-white uppercase tracking-wider z-10">
                {discount}% Off
              </span>
            )}
            {product.tags?.length > 0 && (
              <div className="absolute right-3 top-4 flex flex-col gap-1.5 z-10">
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-[#0d0d0d] px-2.5 py-1 text-[9px] font-black text-[#ffd60a] uppercase tracking-wider">
                    {tag.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ====== RIGHT — Product Info ====== */}
          <div className="mt-8 lg:mt-0">

            {/* Brand + Category */}
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd60a] bg-[#0d0d0d] px-2.5 py-1">
                {brand}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {product.category}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-xl font-black text-[#0d0d0d] uppercase leading-tight sm:text-2xl lg:text-[26px]">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 bg-[#00c853] px-2.5 py-1 text-xs font-bold text-white rounded-sm">
                  <Star size={10} fill="white" strokeWidth={0} /> {product.rating}
                </span>
                {product.reviewCount > 0 && (
                  <span className="text-xs font-medium text-gray-400">
                    {product.reviewCount.toLocaleString()} Ratings
                  </span>
                )}
              </div>
            )}

            {/* Price — updates dynamically when a size is selected */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#0d0d0d]">
                ₹{(activePrice / 100).toFixed(0)}
              </span>
              {activeMrp > activePrice && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{(activeMrp / 100).toFixed(0)}
                  </span>
                  <span className="text-sm font-extrabold text-[#00c853]">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              inclusive of all taxes
            </p>

            {/* ── Select Size ── */}
            {product.sizes?.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0d0d0d]">
                    Select Size
                  </h3>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#0d0d0d] transition-colors"
                  >
                    <Ruler size={12} /> Size Guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const variant = product.sizeVariants?.find((v) => v.size === size);
                    return (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setSizeError(false); }}
                        className={`min-w-[52px] border-2 px-4 py-2.5 text-xs font-bold uppercase transition-all ${
                          selectedSize === size
                            ? "border-[#0d0d0d] bg-[#0d0d0d] text-white"
                            : "border-gray-200 text-gray-700 hover:border-[#0d0d0d]"
                        }`}
                      >
                        <span>{size}</span>
                        {variant && (
                          <span className={`block text-[10px] mt-0.5 font-semibold ${
                            selectedSize === size ? "text-gray-300" : "text-gray-400"
                          }`}>
                            ₹{(variant.price / 100).toFixed(0)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-7 border-t border-gray-100 pt-5">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-3">
                  Product Details
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart + Wishlist */}
            <div className="mt-7 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || (product.sizes?.length > 0 && !selectedSize)}
                className={`group flex flex-1 items-center justify-center gap-2.5 py-4 text-sm font-black uppercase tracking-wider transition-all ${
                  product.stock <= 0
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : product.sizes?.length > 0 && !selectedSize
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : addedToCart
                    ? "bg-[#00c853] text-white"
                    : "btn-brand"
                }`}
              >
                {product.stock <= 0 ? (
                  "Out of Stock"
                ) : addedToCart ? (
                  <><Check size={16} strokeWidth={3} /> Added to Bag!</>
                ) : (
                  <><ShoppingBag size={16} strokeWidth={2.5} /> Add to Bag</>
                )}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center justify-center border-2 px-5 transition-all ${
                  isWishlisted
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-400"
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Low stock warning */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 text-xs font-bold text-red-600">
                <span className="inline-block h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                Only {product.stock} left — Hurry!
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {[
                { icon: Truck, label: "Free Delivery", sub: "On orders ₹499+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "15 day policy" },
                { icon: Shield, label: "100% Secure", sub: "Payments" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center border border-gray-100 bg-[#fafafa] p-3 text-center">
                  <badge.icon size={18} className="text-[#0d0d0d] mb-1.5" strokeWidth={1.5} />
                  <p className="text-[10px] font-extrabold text-[#0d0d0d] uppercase tracking-wide">{badge.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{badge.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Size Chart Modal ── */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-sm font-black uppercase tracking-wider">Size Guide</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-[#0d0d0d]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#0d0d0d] text-white">
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Chest (in)</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Length (in)</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { size: "XS", chest: "34-36", length: "26", shoulder: "15" },
                    { size: "S", chest: "36-38", length: "27", shoulder: "16" },
                    { size: "M", chest: "38-40", length: "28", shoulder: "17" },
                    { size: "L", chest: "40-42", length: "29", shoulder: "18" },
                    { size: "XL", chest: "42-44", length: "30", shoulder: "19" },
                    { size: "XXL", chest: "44-46", length: "31", shoulder: "20" },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold">{row.size}</td>
                      <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                      <td className="px-4 py-3 text-gray-600">{row.length}</td>
                      <td className="px-4 py-3 text-gray-600">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
