"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ShoppingCart, Package } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/orders`);
        if (isMounted) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/orders`);
      setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const statusColors = {
    Completed: "bg-[#00c853]/10 text-[#00c853]",
    Failed: "bg-red-50 text-red-600",
    Pending: "bg-[#ffd60a]/20 text-[#0d0d0d]",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0d0d0d] uppercase tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-bold text-[#0d0d0d]">
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4 text-xs font-medium text-[#0d0d0d]">{order.user}</td>
                <td className="px-5 py-4 text-xs font-black text-[#0d0d0d]">
                  ₹{(order.totalAmount / 100).toFixed(0)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider ${
                      statusColors[order.paymentStatus] || statusColors.Pending
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border-2 border-gray-200 px-3 py-1.5 text-xs font-bold text-[#0d0d0d] focus:outline-none focus:border-[#0d0d0d] transition-colors"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center"
                >
                  <ShoppingCart size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-sm font-bold text-gray-400">No orders yet</p>
                  <p className="text-xs text-gray-300 mt-1">Orders will appear here when customers place them</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
