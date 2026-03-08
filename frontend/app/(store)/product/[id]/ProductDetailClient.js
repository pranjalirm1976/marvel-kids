"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag, Heart, Share2, ChevronRight, ChevronLeft, Star, Truck,
  RotateCcw, Shield, Check, Ruler, Zap, Package, Eye, Copy, X, Sparkles
} from "lucide-react";
import useCartStore from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailClient({ product, related }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);
  const addToCart = useCartStore((s) => s.addToCart);

  const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];
  const mainImage = images[selectedImage] || images[0];
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const rating = product.rating || 4.2;
  const reviewCount = product.reviewCount || 142;
  const brand = product.brand || "MARVELS";

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart({ ...product, selectedSize, selectedColor });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch {}
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">

          {/* ====== IMAGE GALLERY ====== */}
          <div className="space-y-3">
            {/* Main Image with Zoom */}
            <div
              ref={imgRef}
              className="group relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              {/* Skeleton */}
              {!imgLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                } ${isZooming ? "scale-150" : "scale-100"}`}
                style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onLoad={() => setImgLoaded(true)}
              />

              {/* Discount Badge */}
              {discount > 0 && (
                <span className="absolute left-0 top-4 bg-[#00c853] px-4 py-1.5 text-xs font-black text-white uppercase tracking-wider z-10">
                  {discount}% Off
                </span>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="absolute right-3 top-4 flex flex-col gap-1.5 z-10">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-[#0d0d0d] px-2.5 py-1 text-[9px] font-black text-[#ffd60a] uppercase tracking-wider">
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                  <button onClick={prevImage} className="flex h-8 w-8 items-center justify-center bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all">
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold tracking-wider shadow-lg">
                    {selectedImage + 1} / {images.length}
                  </span>
                  <button onClick={nextImage} className="flex h-8 w-8 items-center justify-center bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all">
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                <Eye size={10} /> Hover to zoom
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setImgLoaded(false); }}
                    className={`group relative h-20 w-20 flex-shrink-0 overflow-hidden transition-all ${
                      selectedImage === i
                        ? "ring-2 ring-[#0d0d0d] ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ====== PRODUCT INFO ====== */}
          <div className="mt-8 lg:mt-0">
            {/* Brand + Category + Share */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd60a] bg-[#0d0d0d] px-2.5 py-1">
                  {brand}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {product.category}
                  {product.subcategory && ` / ${product.subcategory}`}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-[#0d0d0d] hover:bg-gray-50 transition-all"
                >
                  <Share2 size={16} />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-100 shadow-xl z-20 w-48 p-2 animate-[fade-in-up_0.2s_ease]">
                    <button onClick={copyLink} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                      <Copy size={14} /> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-xl font-black text-[#0d0d0d] uppercase leading-tight sm:text-2xl lg:text-[26px]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-[#00c853] px-2.5 py-1 text-xs font-bold text-white rounded-sm">
                <Star size={10} fill="white" strokeWidth={0} /> {rating}
              </span>
              <span className="text-xs font-medium text-gray-400">
                {reviewCount.toLocaleString()} Ratings
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#0d0d0d]">
                ₹{(product.price / 100).toFixed(0)}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{(product.mrp / 100).toFixed(0)}
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

            {/* Offers */}
            <div className="mt-5 space-y-2">
              <div className="flex items-start gap-3 border border-dashed border-[#ffd60a] bg-[#ffd60a]/5 px-4 py-3">
                <Sparkles size={14} className="text-[#ffd60a] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0d0d0d]">
                    MARVELS Members get extra <span className="text-[#00c853]">₹50 off</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Auto-applied at checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border border-gray-100 px-4 py-3">
                <Zap size={14} className="text-[#0d0d0d] mt-0.5 flex-shrink-0" />
                <p className="text-xs font-bold text-[#0d0d0d]">
                  Use code <span className="text-[#ffd60a] bg-[#0d0d0d] px-1.5 py-0.5 text-[10px]">MARVELS10</span> for 10% off on first order
                </p>
              </div>
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-3">
                  Color: <span className="text-gray-400 font-bold normal-case tracking-normal">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`h-9 w-9 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-[#0d0d0d] scale-110 shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
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
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`min-w-[52px] border-2 px-4 py-2.5 text-xs font-bold uppercase transition-all ${
                        selectedSize === size
                          ? "border-[#0d0d0d] bg-[#0d0d0d] text-white"
                          : "border-gray-200 text-gray-700 hover:border-[#0d0d0d]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Stock Warning */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 text-xs font-bold text-red-600">
                <span className="inline-block h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                Only {product.stock} left in stock — Hurry!
              </div>
            )}

            {/* Add to Bag + Wishlist */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`group flex flex-1 items-center justify-center gap-2.5 py-4 text-sm font-black uppercase tracking-wider transition-all relative overflow-hidden ${
                  product.stock <= 0
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

            {/* Delivery Info */}
            <div className="mt-5 flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-4 py-3">
              <Package size={16} className="text-[#0d0d0d] flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#0d0d0d]">Expected Delivery in 3-5 Business Days</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Free shipping on orders above ₹499</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { icon: Truck, label: "Free Delivery", sub: "On orders ₹499+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "15 day policy" },
                { icon: Shield, label: "100% Secure", sub: "Payments" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center border border-gray-100 bg-[#fafafa] p-3 text-center hover:border-gray-200 transition-all">
                  <badge.icon size={18} className="text-[#0d0d0d] mb-1.5" strokeWidth={1.5} />
                  <p className="text-[10px] font-extrabold text-[#0d0d0d] uppercase tracking-wide">{badge.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{badge.sub}</p>
                </div>
              ))}
            </div>

            {/* Description / Product Details Accordion */}
            <div className="mt-8 border-t border-gray-100 pt-6 space-y-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-3">
                  Product Details
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Product Specs Table */}
              <div className="border border-gray-100 divide-y divide-gray-100">
                {[
                  { label: "Brand", value: brand },
                  { label: "Category", value: product.category },
                  product.subcategory && { label: "Type", value: product.subcategory },
                  product.colors?.length > 0 && { label: "Colors Available", value: product.colors.join(", ") },
                  product.sizes?.length > 0 && { label: "Sizes Available", value: product.sizes.join(", ") },
                  { label: "SKU", value: product._id?.slice(-8)?.toUpperCase() },
                ].filter(Boolean).map((spec, i) => (
                  <div key={i} className="flex">
                    <span className="w-36 flex-shrink-0 bg-gray-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {spec.label}
                    </span>
                    <span className="px-4 py-2.5 text-xs text-gray-700 font-medium">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ====== RELATED PRODUCTS ====== */}
        {related?.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-12 mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#0d0d0d] sm:text-xl">
                  You May Also Like
                </h2>
                <p className="text-xs text-gray-400 mt-1">Products similar to what you&apos;re viewing</p>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#0d0d0d] transition-colors"
              >
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ====== SIZE CHART MODAL ====== */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto animate-[fade-in-up_0.3s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-sm font-black uppercase tracking-wider">Size Guide</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-[#0d0d0d] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
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
                      <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold">{row.size}</td>
                        <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                        <td className="px-4 py-3 text-gray-600">{row.length}</td>
                        <td className="px-4 py-3 text-gray-600">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 bg-[#ffd60a]/10 border border-[#ffd60a]/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0d0d0d] mb-1">How to Measure</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Use a measuring tape and measure around the fullest part of your chest. Keep the tape level and snug but not tight.
                  For best fit, compare measurements with the size chart above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
