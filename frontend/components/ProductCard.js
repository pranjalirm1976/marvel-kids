"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import useCartStore from "@/store/useCartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}

        {/* Add to Cart overlay button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold shadow-md transition-all ${
            added
              ? "bg-green-500 text-white"
              : "bg-white text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white"
          }`}
        >
          {added ? <Check size={14} /> : <ShoppingBag size={14} />}
          {added ? "Added!" : "Add"}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-rose-500">
          {product.category}
        </p>
        <h3 className="mt-1 truncate text-sm font-semibold text-gray-800">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹{(product.price / 100).toFixed(0)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{(product.mrp / 100).toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
