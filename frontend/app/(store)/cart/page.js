"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/useCartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price / 100) * item.quantity,
    0
  );

  // ========== Empty State ==========
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-800">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ========== Populated State ==========
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ---- Left Column: Cart Items ---- */}
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:gap-6"
            >
              {/* Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
                {item.images && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.category}
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    ₹{(item.price / 100).toFixed(2)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {/* Quantity controller */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Right Column: Order Summary ---- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
