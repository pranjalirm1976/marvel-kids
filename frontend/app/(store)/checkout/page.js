"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  CreditCard,
  Banknote,
  Shield,
  Truck,
  Lock,
  ChevronLeft,
  MapPin,
  User,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Navigation,
  Loader2,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import useCartStore from "@/store/useCartStore";

const MapLocationPicker = dynamic(
  () => import("@/components/MapLocationPicker"),
  { ssr: false }
);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com"}/api/order`;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price / 100) * item.quantity,
    0
  );
  const mrpTotal = items.reduce(
    (sum, item) => sum + ((item.mrp || item.price) / 100) * item.quantity,
    0
  );
  const totalDiscount = mrpTotal - subtotal;
  const deliveryFee = 0;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [processing, setProcessing] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapCoords, setMapCoords] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error for this field as user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const reverseGeocodeAddress = async (latitude, longitude) => {
    const bigDataCloudRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (bigDataCloudRes.ok) {
      const data = await bigDataCloudRes.json();
      const street =
        data.localityInfo?.informative?.[0]?.name ||
        data.locality ||
        data.localityInfo?.administrative?.[4]?.name ||
        "";
      const city = data.city || data.locality || data.principalSubdivision || "";
      const pincode = data.postcode || "";
      const state = data.principalSubdivision || "";

      if (street || city || pincode || state) {
        return { street, city, pincode, state };
      }
    }

    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!nominatimRes.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const nominatimData = await nominatimRes.json();
    const address = nominatimData.address || {};

    const streetParts = [address.house_number, address.road, address.suburb]
      .filter(Boolean)
      .join(", ");

    return {
      street: streetParts,
      city: address.city || address.town || address.village || address.county || "",
      pincode: address.postcode || "",
      state: address.state || "",
    };
  };

  const validateAddress = () => {
    const errors = {};
    if (!formData.name.trim())    errors.name    = "Full name is required";
    if (!formData.email.trim())   errors.email   = "Email is required";
    if (!formData.address.trim()) errors.address = "Delivery address is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ─────────────────────────────────────────────────────────────
     Anti-Gravity Auto-Location Detection — opens map modal
  ───────────────────────────────────────────────────────────── */
  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setLocationError("");
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCoords({ lat: latitude, lng: longitude });
        setDetectingLocation(false);
        setShowMapPicker(true);
      },
      (err) => {
        setDetectingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location access denied. Please allow location permissions in your browser.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location signal unavailable. Please fill in manually.");
            break;
          case err.TIMEOUT:
            setLocationError("Location timed out. Please allow permission quickly when prompted, or fill in manually.");
            break;
          default:
            setLocationError("Could not detect location. Please fill in manually.");
        }
      },
      { timeout: 20000, maximumAge: 300000, enableHighAccuracy: true }
    );
  };

  /* Called when user confirms a pin on the map */
  const handleMapConfirm = ({ address, fullAddress, city, district, state, pincode, landmark, area }) => {
    const deliveryAddress =
      fullAddress ||
      [address, landmark, area, city, district, state, pincode]
        .filter(Boolean)
        .join(", ");

    setFormData((prev) => ({
      ...prev,
      address: deliveryAddress || prev.address,
      city: city || prev.city,
      state: state || prev.state,
      pincode: pincode || prev.pincode,
    }));
    setShowMapPicker(false);
    setLocationSuccess(true);
    setTimeout(() => setLocationSuccess(false), 4000);
  };


  /* ─────────────────────────────────────────────────────────────
     Payment Handler
  ───────────────────────────────────────────────────────────── */
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateAddress()) {
      alert("Please complete your delivery details before payment.");
      setStep(1);
      return;
    }

    setProcessing(true);

    try {
      const payload = {
        user: formData.name,
        email: formData.email,
        address: `${formData.address}, ${formData.city}${formData.state ? ", " + formData.state : ""} - ${formData.pincode}`,
        phone: formData.phone,
        items,
        paymentMethod,
      };

      const { data } = await axios.post(API_URL, payload);

      if (paymentMethod === "COD") {
        clearCart();
        router.push(`/order-success/${data.order._id}`);
        return;
      }

      const { razorpayOrder, key } = data;

      if (!window.Razorpay) {
        setProcessing(false);
        alert("Payment gateway is still loading. Please try again in a moment.");
        return;
      }

      // Keep overlay for API work, release before opening Razorpay modal.
      setProcessing(false);

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "MARVELS",
        description: "Purchase from MARVELS Fashion",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          setProcessing(true);
          try {
            const { data: verifyData } = await axios.post(`${API_URL}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            router.push(`/order-success/${verifyData.orderId}`);
          } catch (err) {
            const verifyMessage =
              err.response?.data?.message ||
              "Payment verification failed. Please contact support.";
            alert(verifyMessage);
            console.error(err);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#0d0d0d" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        const failureMessage =
          response?.error?.description ||
          "Payment failed. Please try another method.";
        alert(failureMessage);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      const orderMessage =
        err.response?.data?.message || "Failed to place order. Please try again.";
      alert(`Failed to place order: ${orderMessage}`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) return null;

  const isLoading = processing || detectingLocation;

  const inputClass =
    "w-full border-2 border-gray-200 px-4 py-3.5 text-sm text-[#0d0d0d] placeholder-gray-300 focus:border-[#0d0d0d] focus:outline-none transition-colors font-medium";

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* ── Map Location Picker Modal ── */}
      {showMapPicker && mapCoords && (
        <MapLocationPicker
          initialLat={mapCoords.lat}
          initialLng={mapCoords.lng}
          onConfirm={handleMapConfirm}
          onClose={() => setShowMapPicker(false)}
        />
      )}

      {/* ── Full-Screen Loading Overlay ── */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#ffd60a] border-t-transparent" />
            <p className="text-sm font-bold uppercase tracking-widest text-white">
              {detectingLocation ? "Detecting your location..." : "Processing payment..."}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {detectingLocation
                ? "Please allow location access if prompted"
                : "Do not close this window"}
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#fafafa] min-h-screen">
        {/* Header */}
        <div className="bg-[#0d0d0d]">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-gray-500 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <h1 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                Checkout
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <Lock size={12} /> Secure Checkout
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  step >= 1 ? "text-[#0d0d0d]" : "text-gray-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center text-[10px] font-black ${
                    step > 1
                      ? "bg-[#00c853] text-white"
                      : step === 1
                      ? "bg-[#0d0d0d] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > 1 ? <CheckCircle size={12} /> : "1"}
                </span>
                Address
              </button>
              <div className={`h-px w-12 ${step >= 2 ? "bg-[#0d0d0d]" : "bg-gray-200"}`} />
              <button
                onClick={() => validateAddress() && setStep(2)}
                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  step >= 2 ? "text-[#0d0d0d]" : "text-gray-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center text-[10px] font-black ${
                    step === 2
                      ? "bg-[#0d0d0d] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  2
                </span>
                Payment
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <form
            onSubmit={handlePayment}
            className="grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            {/* ========== Left Column ========== */}
            <div className="space-y-4 lg:col-span-7">

              {/* Step 1: Shipping Info */}
              <div className={step === 1 ? "block" : "hidden lg:block"}>
                <div className="bg-white p-6 border border-gray-100">
                  <div className="flex items-center gap-2.5 mb-4">
                    <MapPin size={16} className="text-[#ffd60a]" />
                    <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d]">
                      Delivery Details
                    </h2>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="ml-auto text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#0d0d0d]"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {/* ── Anti-Gravity: Detect My Location button ── */}
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={handleLocationDetection}
                      disabled={detectingLocation}
                      className="group w-full flex items-center justify-center gap-2.5 border-2 border-dashed border-[#ffd60a] bg-[#ffd60a]/5 px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] transition-all hover:bg-[#ffd60a]/15 hover:border-[#ffd60a] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {detectingLocation ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Detecting location…
                        </>
                      ) : (
                        <>
                          <Zap size={14} className="text-[#ffd60a] group-hover:scale-110 transition-transform" />
                          <Navigation size={13} className="text-[#0d0d0d]" />
                          Detect My Location — Auto-fill Address
                        </>
                      )}
                    </button>

                    {/* Status messages */}
                    {locationSuccess && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#00c853]">
                        <CheckCircle size={11} />
                        Address auto-filled! Please verify and edit if needed.
                      </div>
                    )}
                    {locationError && (
                      <div className="mt-2 text-[10px] font-semibold text-[#ff3d3d]">
                        ⚠ {locationError}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
                      or fill manually
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          <User size={10} /> Full Name <span className="text-[#ff3d3d]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={fieldErrors.name ? inputClass.replace("border-gray-200", "border-[#ff3d3d]") : inputClass}
                        />
                        {fieldErrors.name && <p className="mt-1 text-[10px] font-bold text-[#ff3d3d]">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          <Mail size={10} /> Email <span className="text-[#ff3d3d]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={fieldErrors.email ? inputClass.replace("border-gray-200", "border-[#ff3d3d]") : inputClass}
                        />
                        {fieldErrors.email && <p className="mt-1 text-[10px] font-bold text-[#ff3d3d]">{fieldErrors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={fieldErrors.phone ? inputClass.replace("border-gray-200", "border-[#ff3d3d]") : inputClass}
                      />
                      {fieldErrors.phone && <p className="mt-1 text-[10px] font-bold text-[#ff3d3d]">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Delivery Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="House/Flat No., Building, Street, Area"
                        className={`${fieldErrors.address ? inputClass.replace("border-gray-200", "border-[#ff3d3d]") : inputClass} resize-none`}
                      />
                      {fieldErrors.address && <p className="mt-1 text-[10px] font-bold text-[#ff3d3d]">{fieldErrors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="400001"
                          className={fieldErrors.pincode ? inputClass.replace("border-gray-200", "border-[#ff3d3d]") : inputClass}
                        />
                        {fieldErrors.pincode && <p className="mt-1 text-[10px] font-bold text-[#ff3d3d]">{fieldErrors.pincode}</p>}
                      </div>
                    </div>
                  </div>

                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => validateAddress() && setStep(2)}
                      className="mt-6 flex w-full items-center justify-center gap-2 btn-brand py-4 text-xs"
                    >
                      Continue to Payment <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className={step === 2 ? "block" : "hidden lg:block"}>
                <div className="bg-white p-6 border border-gray-100">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-5">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {/* ── Razorpay Option (default) ── */}
                    <label
                      className={`flex cursor-pointer items-center gap-4 border-2 p-4 transition-all relative ${
                        paymentMethod === "RAZORPAY"
                          ? "border-[#0d0d0d] bg-[#0d0d0d]/[0.02]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#0d0d0d]"
                      />
                      <CreditCard
                        size={20}
                        className={paymentMethod === "RAZORPAY" ? "text-[#0d0d0d]" : "text-gray-400"}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-[#0d0d0d]">Pay Securely via UPI / Card</p>
                          {paymentMethod === "RAZORPAY" && (
                            <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-[#ffd60a] bg-[#0d0d0d] px-2 py-0.5">
                              <Zap size={8} /> Premium Secure
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          UPI · Cards · Net Banking · Wallets
                        </p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#00c853] bg-[#00c853]/10 px-2 py-0.5">
                        Recommended
                      </span>
                    </label>

                    {/* ── COD Option ── */}
                    <label
                      className={`flex cursor-pointer items-center gap-4 border-2 p-4 transition-all ${
                        paymentMethod === "COD"
                          ? "border-[#0d0d0d] bg-[#0d0d0d]/[0.02]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#0d0d0d]"
                      />
                      <Banknote
                        size={20}
                        className={paymentMethod === "COD" ? "text-[#0d0d0d]" : "text-gray-400"}
                      />
                      <div>
                        <p className="text-xs font-bold text-[#0d0d0d]">Cash on Delivery</p>
                        <p className="text-[10px] text-gray-400">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>

                  {/* ── Payment Breakdown ── */}
                  <div className="mt-5 border border-dashed border-gray-200 p-4 bg-[#fafafa] space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">
                      Payment Breakdown
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-[#0d0d0d]">₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Shipping Fee</span>
                      <span className="font-bold text-[#00c853]">₹0</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-sm font-black text-[#0d0d0d]">Total</span>
                      <span className="text-sm font-black text-[#0d0d0d]">₹{grandTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "100% Secure", sub: "Payments" },
                  { icon: Truck, label: "Free Delivery", sub: "Orders ₹499+" },
                  { icon: Lock, label: "Encrypted", sub: "SSL/TLS" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 bg-white p-3 border border-gray-100 text-center"
                  >
                    <Icon size={16} className="text-[#0d0d0d]" strokeWidth={1.5} />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#0d0d0d]">
                      {label}
                    </span>
                    <span className="text-[8px] text-gray-400">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ========== Right Column — Order Summary ========== */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white p-5 border border-gray-100">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-4 pb-3 border-b border-gray-100">
                    Order Summary ({totalItems} Item{totalItems > 1 ? "s" : ""})
                  </h2>

                  {/* Items list */}
                  <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 py-1.5">
                        <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-[#f5f5f5]">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] text-gray-300">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-bold text-[#0d0d0d]">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                            {item.selectedSize && (
                              <p className="text-[10px] text-gray-400">Size: {item.selectedSize}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs font-black text-[#0d0d0d]">
                          ₹{((item.price / 100) * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Total MRP</span>
                      <span className="text-xs font-medium text-gray-600">₹{mrpTotal.toFixed(0)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Discount on MRP</span>
                        <span className="text-xs font-bold text-[#00c853]">−₹{totalDiscount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Delivery Fee</span>
                      <span className="text-xs font-bold text-[#00c853]">
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-black text-[#0d0d0d]">Total Amount</span>
                        <span className="text-sm font-black text-[#0d0d0d]">₹{grandTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="mt-4 bg-[#00c853]/5 border border-[#00c853]/20 px-3 py-2.5 text-center">
                      <p className="text-[11px] font-bold text-[#00c853]">
                        <Sparkles size={12} className="inline mr-1" />
                        You save ₹{totalDiscount.toFixed(0)} on this order
                      </p>
                    </div>
                  )}

                  {/* Place Order */}
                  {step === 2 && (
                    <button
                      type="submit"
                      disabled={processing}
                      className="mt-5 flex w-full items-center justify-center gap-2 btn-brand py-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Processing…
                        </span>
                      ) : paymentMethod === "COD" ? (
                        <>Place Order — COD <ArrowRight size={14} /></>
                      ) : (
                        <>
                          <Lock size={13} />
                          Pay ₹{grandTotal.toFixed(0)} Securely <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
