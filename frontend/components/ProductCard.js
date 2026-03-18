"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, Star, Heart, Eye } from "lucide-react";
import { useState } from "react";
import useCartStore from "@/store/useCartStore";

const getDeterministicReviewCount = (id) => {
  const source = String(id || "review-fallback");
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return 50 + (hash % 500);
};

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  };

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const rating = product.rating || 4.2;
  const reviewCount = product.reviewCount || getDeterministicReviewCount(product._id);

  return (
    <Link
      href={`/product/${product._id}`}
      className="group block animate-fade-in-up"
    >
      <div className="relative overflow-hidden bg-white transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        {/* ===== IMAGE ===== */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f8f8]">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover img-zoom transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-300">
              <ShoppingBag size={32} strokeWidth={1} />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute left-0 top-0 flex flex-col gap-1.5 p-2.5">
            {discount > 0 && (
              <span className="bg-[#ff3d3d] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg">
                {discount}% OFF
              </span>
            )}
            {product.tags?.includes("new-arrival") && (
              <span className="bg-[#0d0d0d] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#ffd60a]">
                NEW
              </span>
            )}
            {product.tags?.includes("trending") && (
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                TRENDING
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 ${
              wishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {/* Hover overlay with actions */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-0 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={handleAdd}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-[11px] font-black uppercase tracking-wider transition-all ${
                added
                  ? "bg-[#00c853] text-white"
                  : "bg-[#ffd60a] text-[#0d0d0d] hover:bg-[#e6c009]"
              }`}
            >
              {added ? <Check size={14} strokeWidth={3} /> : <ShoppingBag size={14} />}
              {added ? "Added!" : "Add to Bag"}
            </button>
            <Link
              href={`/product/${product._id}`}
              className="flex items-center justify-center bg-[#0d0d0d] px-4 text-white hover:bg-[#1a1a1a] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Second image on hover (if available) */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>

        {/* ===== INFO ===== */}
        <div className="p-3 sm:p-4">
          {/* Brand tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ffd60a]">
            {product.brand || "MARVELS"}
          </p>

          {/* Name */}
          <h3 className="mt-0.5 text-[13px] font-bold text-[#0d0d0d] line-clamp-1 group-hover:text-[#0d0d0d]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-sm bg-[#00c853] px-1.5 py-[2px]">
              <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
              <Star size={8} className="fill-white text-white" />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">({reviewCount})</span>
          </div>

          {/* Price row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[15px] font-black text-[#0d0d0d]">
              ₹{(product.price / 100).toFixed(0)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{(product.mrp / 100).toFixed(0)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[11px] font-bold text-[#00c853]">
                {discount}% off
              </span>
            )}
          </div>

          {/* Color dots (if available) */}
          {product.colors?.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="h-3.5 w-3.5 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[9px] font-bold text-gray-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
