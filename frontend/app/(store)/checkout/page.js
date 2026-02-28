"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import axios from "axios";
import { CreditCard, Banknote } from "lucide-react";
import useCartStore from "@/store/useCartStore";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price / 100) * item.quantity,
    0
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [processing, setProcessing] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---- Place Order ----
  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payload = {
        user: formData.name,
        email: formData.email,
        address: formData.address,
        items,
        paymentMethod,
      };

      const { data } = await axios.post(API_URL, payload);

      // --- COD ---
      if (paymentMethod === "COD") {
        clearCart();
        alert("Order placed successfully! Pay on delivery.");
        router.push("/");
        return;
      }

      // --- Razorpay ---
      const { razorpayOrder, orderId, key } = data;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Marvel Kids",
        description: "Purchase",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await axios.post(`${API_URL}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            alert("Payment successful! Your order has been placed.");
            router.push("/");
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
            console.error(err);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: { color: "#f43f5e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500";

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">Checkout</h1>

        <form
          onSubmit={handlePayment}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* ========== Left Column ========== */}
          <div className="space-y-6 lg:col-span-7">
            {/* Shipping Info */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Full address with pincode"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "RAZORPAY"
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-rose-500"
                  />
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Pay with Razorpay
                    </p>
                    <p className="text-xs text-gray-500">
                      UPI, Cards, Net Banking, Wallets
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === "COD"
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-rose-500"
                  />
                  <Banknote size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-500">
                      Pay when you receive
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========== Right Column — Order Summary ========== */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Order Summary
              </h2>

              {/* Items list */}
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="truncate font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      ₹{((item.price / 100) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                disabled={processing}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-rose-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
