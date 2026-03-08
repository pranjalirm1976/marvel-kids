"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, Tag, ChevronRight, Shield, Truck, RotateCcw, ArrowRight, Sparkles, X } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import { useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price / 100) * item.quantity,
    0
  );
  const mrpTotal = items.reduce(
    (sum, item) => sum + ((item.mrp || item.price) / 100) * item.quantity,
    0
  );
  const totalDiscount = mrpTotal - subtotal;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalAmount = subtotal - couponDiscount;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "MARVELS10") {
      setCouponApplied(true);
    }
  };

  const handleRemove = (id, selectedSize) => {
    const key = `${id}-${selectedSize || "default"}`;
    setRemovingId(key);
    setTimeout(() => {
      removeFromCart(id, selectedSize);
      setRemovingId(null);
    }, 300);
  };

  // ========== Empty State ==========
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fafafa] px-4 text-center">
        <div className="bg-white p-12 max-w-md w-full shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-5 bg-gray-50 rounded-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-gray-300" strokeWidth={1.3} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-[#0d0d0d]">Your Bag is Empty</h1>
          <p className="mt-2 text-sm text-gray-400">
            Looks like you haven&apos;t added anything yet. Let&apos;s fix that!
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 btn-brand px-10 py-3.5 text-xs"
          >
            Start Shopping <ArrowRight size={14} />
          </Link>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
            {[
              { icon: Truck, text: "Free Shipping" },
              { icon: RotateCcw, text: "Easy Returns" },
              { icon: Shield, text: "Secure Pay" },
            ].map((b, i) => (
              <div key={i} className="text-center">
                <b.icon size={16} className="mx-auto text-gray-300 mb-1" />
                <p className="text-[9px] font-bold text-gray-400 uppercase">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========== Populated State ==========
  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
              My Bag <span className="text-[#ffd60a]">({totalItems})</span>
            </h1>
            <Link href="/shop" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Free shipping progress bar */}
      {subtotal < 499 && (
        <div className="bg-[#ffd60a]/10 border-b border-[#ffd60a]/20">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Truck size={16} className="text-[#0d0d0d] flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-[#0d0d0d]">
                  Add ₹{(499 - subtotal).toFixed(0)} more for <span className="text-[#00c853]">FREE delivery</span>
                </p>
                <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ffd60a] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 499) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ---- Left Column: Cart Items ---- */}
          <div className="space-y-3 lg:col-span-8">
            {/* Coupon Input */}
            <div className="bg-white border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-[#ffd60a] flex-shrink-0" />
                <div className="flex-1">
                  {couponApplied ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#00c853]">MARVELS10 Applied!</p>
                        <p className="text-[10px] text-gray-400">You&apos;re saving extra ₹{couponDiscount}</p>
                      </div>
                      <button onClick={() => { setCouponApplied(false); setCouponCode(""); }} className="text-xs font-bold text-red-400 hover:text-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-200 px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0d0d0d] transition-colors uppercase tracking-wider"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-5 py-2 text-[10px] font-black uppercase tracking-wider bg-[#0d0d0d] text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Items */}
            {items.map((item) => {
              const itemDiscount = item.mrp ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
              const itemKey = `${item._id}-${item.selectedSize || "default"}`;
              return (
                <div
                  key={itemKey}
                  className={`flex gap-4 bg-white p-4 border border-gray-100 transition-all duration-300 ${
                    removingId === itemKey ? "opacity-0 translate-x-10" : "opacity-100"
                  }`}
                >
                  {/* Image */}
                  <Link href={`/product/${item._id}`} className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-[#f5f5f5]">
                    {item.images?.[0] ? (
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-300">No Image</div>
                    )}
                    {itemDiscount > 0 && (
                      <span className="absolute left-0 top-0 bg-[#00c853] px-1.5 py-0.5 text-[8px] font-bold text-white">
                        {itemDiscount}%
                      </span>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ffd60a] bg-[#0d0d0d] inline-block px-1.5 py-0.5">
                        {item.brand || "MARVELS"}
                      </p>
                      <Link href={`/product/${item._id}`}>
                        <h3 className="text-sm font-bold text-[#0d0d0d] truncate mt-1 hover:underline">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">{item.category}</p>
                        {item.selectedSize && (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5">Size: {item.selectedSize}</span>
                        )}
                        {item.selectedColor && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <span className="h-2.5 w-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor.toLowerCase() }} />
                          </span>
                        )}
                      </div>
                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-black text-[#0d0d0d]">₹{(item.price / 100).toFixed(0)}</span>
                        {item.mrp > item.price && (
                          <>
                            <span className="text-xs text-gray-400 line-through">₹{(item.mrp / 100).toFixed(0)}</span>
                            <span className="text-[10px] font-bold text-[#00c853]">{itemDiscount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-[#0d0d0d] border-x border-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item._id, item.selectedSize)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- Right Column: Price Details ---- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white p-5 border border-gray-100">
                <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-4 pb-3 border-b border-gray-100">
                  Price Details ({totalItems} Item{totalItems > 1 ? "s" : ""})
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-xs">Total MRP</span>
                    <span className="text-xs font-medium">₹{mrpTotal.toFixed(0)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Discount on MRP</span>
                      <span className="text-xs font-bold text-[#00c853]">−₹{totalDiscount.toFixed(0)}</span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Coupon Discount</span>
                      <span className="text-xs font-bold text-[#00c853]">−₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="text-xs">Delivery Fee</span>
                    <span className="text-xs font-bold text-[#00c853]">{subtotal >= 499 ? "FREE" : "₹49"}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-black text-[#0d0d0d]">Total Amount</span>
                      <span className="text-sm font-black text-[#0d0d0d]">₹{(finalAmount + (subtotal < 499 ? 49 : 0)).toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {(totalDiscount + couponDiscount) > 0 && (
                  <div className="mt-4 bg-[#00c853]/5 border border-[#00c853]/20 px-3 py-2.5 text-center">
                    <p className="text-[11px] font-bold text-[#00c853]">
                      <Sparkles size={12} className="inline mr-1" />
                      You&apos;re saving ₹{(totalDiscount + couponDiscount).toFixed(0)} on this order
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="mt-5 flex w-full items-center justify-center gap-2 btn-brand py-4 text-xs"
                >
                  Place Order <ArrowRight size={14} />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="bg-white border border-gray-100 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Truck, label: "Free Shipping", sub: "Orders ₹499+" },
                    { icon: RotateCcw, label: "Easy Returns", sub: "15 days" },
                    { icon: Shield, label: "Secure Pay", sub: "100% safe" },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <badge.icon size={16} className="text-[#0d0d0d] mb-1" strokeWidth={1.5} />
                      <p className="text-[9px] font-extrabold text-[#0d0d0d] uppercase">{badge.label}</p>
                      <p className="text-[8px] text-gray-400">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
