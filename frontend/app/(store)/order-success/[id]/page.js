"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  CheckCircle,
  Package,
  MapPin,
  Truck,
  ArrowRight,
  Home,
  ExternalLink,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://marvel-kids-api.onrender.com";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/orders/${id}`);
        setOrder(data.order);
      } catch {
        setError("Could not load order details. Please check your email for confirmation.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const copyAwb = () => {
    if (!order?.awbCode) return;
    navigator.clipboard.writeText(order.awbCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#ffd60a]" />
      </div>
    );
  }

  const isCOD = order?.paymentMethod === "COD";
  const hasTracking = !!order?.awbCode;
  const totalAmountRupees = order
    ? (order.totalAmount / 100).toFixed(0)
    : "—";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Header ── */}
      <div className="bg-[#0d0d0d]">
        <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-black uppercase tracking-tighter text-white">
            MARVELS
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Order Confirmation
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-5">

        {/* ── Success Banner ── */}
        <div className="bg-[#0d0d0d] p-8 text-center space-y-3">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00c853]">
              <CheckCircle size={32} className="text-white" strokeWidth={2.5} />
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            {isCOD ? "Order Placed!" : "Payment Successful!"}
          </h1>
          <p className="text-sm text-gray-400">
            {isCOD
              ? "Your order has been placed. Pay on delivery."
              : "Your order is confirmed and will be shipped soon."}
          </p>
          {error && (
            <p className="text-xs text-[#ff3d3d]">{error}</p>
          )}
        </div>

        {/* ── Order Meta ── */}
        {order && (
          <div className="bg-white border border-gray-100 p-5 space-y-4">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Order Details
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                <p className="text-[11px] font-bold text-[#0d0d0d] break-all">#{String(order._id).slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Amount</p>
                <p className="text-[11px] font-bold text-[#0d0d0d]">₹{totalAmountRupees}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment</p>
                <p className={`text-[11px] font-bold ${order.paymentStatus === "Completed" ? "text-[#00c853]" : "text-[#ffd60a]"}`}>
                  {order.paymentStatus === "Completed" ? "Paid" : isCOD ? "Pay on Delivery" : order.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
                <p className="text-[11px] font-bold text-[#0d0d0d]">{order.orderStatus}</p>
              </div>
            </div>

            {/* Delivery address */}
            <div className="border-t border-gray-100 pt-4 flex gap-2">
              <MapPin size={14} className="text-[#ffd60a] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Delivery To</p>
                <p className="text-xs font-semibold text-[#0d0d0d]">{order.user}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{order.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Items ── */}
        {order?.items?.length > 0 && (
          <div className="bg-white border border-gray-100 p-5">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">
              Items Ordered
            </h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="h-12 w-10 flex-shrink-0 bg-[#f5f5f5] flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package size={16} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0d0d0d] truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-black text-[#0d0d0d]">
                    ₹{((item.price / 100) * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tracking ── */}
        <div className="bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={16} className="text-[#ffd60a]" />
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d0d0d]">
              Shipment Tracking
            </h2>
          </div>

          {hasTracking ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-[#fafafa] border border-gray-100 px-4 py-3">
                <p className="text-xs font-bold text-[#0d0d0d] flex-1">
                  AWB: <span className="font-black tracking-widest">{order.awbCode}</span>
                </p>
                <button
                  onClick={copyAwb}
                  className="text-gray-400 hover:text-[#0d0d0d] transition-colors"
                  title="Copy AWB"
                >
                  {copied ? <Check size={14} className="text-[#00c853]" /> : <Copy size={14} />}
                </button>
              </div>
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 bg-[#0d0d0d] text-white py-3.5 text-[11px] font-extrabold uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors"
              >
                <Truck size={14} />
                Track My Order
                <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <div className="text-center py-4">
              <Loader2 size={20} className="animate-spin text-[#ffd60a] mx-auto mb-2" />
              <p className="text-[11px] text-gray-500 font-medium">
                Shipment is being created. Tracking details will be available shortly.
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                You will receive a tracking update via email at <span className="font-bold">{order?.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border-2 border-[#0d0d0d] py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white transition-all"
          >
            <Home size={14} />
            Continue Shopping
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 bg-[#ffd60a] py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] hover:bg-[#e6c009] transition-colors"
          >
            Explore More
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
