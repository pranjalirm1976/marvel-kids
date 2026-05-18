"use client";

import { Package, ShoppingCart, IndianRupee, TrendingUp, Users, Eye, MessageCircle, Truck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    today: { todayRevenue: 0, todayOrders: 0 },
    orderStatus: [],
    paymentMethods: [],
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      title: "Total Revenue",
      value: loading ? "Loading..." : `₹${(stats.total.totalRevenue / 100).toLocaleString('en-IN')}`,
      change: `${stats.today.todayRevenue > 0 ? `+₹${(stats.today.todayRevenue / 100).toFixed(0)} today` : 'No sales today'}`,
      icon: IndianRupee,
      color: "bg-gradient-to-r from-[#ec4899] to-[#f472b6]",
      textColor: "text-white",
    },
    {
      title: "Total Orders",
      value: loading ? "Loading..." : stats.total.totalOrders.toString(),
      change: `${stats.today.todayOrders > 0 ? `+${stats.today.todayOrders} today` : 'No orders today'}`,
      icon: ShoppingCart,
      color: "bg-gradient-to-r from-[#67e8f9] to-[#a5f3fc]",
      textColor: "text-white",
    },
    {
      title: "Avg Order Value",
      value: loading ? "Loading..." : `₹${(stats.total.avgOrderValue / 100).toFixed(0)}`,
      change: `${stats.total.totalOrders > 0 ? 'Per order' : 'No data'}`,
      icon: TrendingUp,
      color: "bg-gradient-to-r from-[#00c853] to-[#4caf50]",
      textColor: "text-white",
    },
    {
      title: "Pending Orders",
      value: loading ? "Loading..." : stats.orderStatus.find(s => s._id === 'Pending')?.count || 0,
      change: "Need attention",
      icon: AlertCircle,
      color: "bg-gradient-to-r from-[#ff9800] to-[#ffb74d]",
      textColor: "text-white",
    },
  ];

  const quickActions = [
    { label: "Manage Orders", href: "/admin/orders", icon: ShoppingCart, color: "bg-[#ec4899]" },
    { label: "Add Product", href: "/admin/products", icon: Package, color: "bg-[#67e8f9]" },
    { label: "Send WhatsApp", href: "/admin/whatsapp", icon: MessageCircle, color: "bg-[#25d366]" },
    { label: "Track Shipments", href: "/admin/tracking", icon: Truck, color: "bg-[#ff9800]" },
    { label: "Visit Store", href: "/", icon: Eye, color: "bg-[#9c27b0]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ec4899] to-[#67e8f9] p-8 rounded-2xl text-white">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-white/80 mt-2">Welcome back! Here's your store overview for today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ title, value, change, icon: Icon, color, textColor }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-3 rounded-xl shadow-lg`}>
                <Icon size={24} className={textColor} />
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-400">{change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className={`${color} p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900 group-hover:text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase tracking-wide text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-[#ec4899] hover:text-[#f472b6] text-sm font-bold">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading orders...</div>
            ) : stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{order.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{(order.totalAmount / 100).toFixed(0)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No orders yet</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase tracking-wide text-gray-900">Top Products</h3>
            <Link href="/admin/products" className="text-[#67e8f9] hover:text-[#a5f3fc] text-sm font-bold">
              Manage →
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading products...</div>
            ) : stats.topProducts.length > 0 ? (
              stats.topProducts.slice(0, 5).map((product, index) => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#ec4899] to-[#67e8f9] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{(product.revenue / 100).toFixed(0)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No products yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
            const statusData = stats.orderStatus.find(s => s._id === status);
            const count = statusData?.count || 0;
            const colors = {
              'Pending': 'bg-yellow-100 text-yellow-800',
              'Confirmed': 'bg-blue-100 text-blue-800',
              'Processing': 'bg-purple-100 text-purple-800',
              'Shipped': 'bg-indigo-100 text-indigo-800',
              'Delivered': 'bg-green-100 text-green-800',
              'Cancelled': 'bg-red-100 text-red-800'
            };
            
            return (
              <div key={status} className={`p-4 rounded-xl ${colors[status]}`}>
                <p className="text-2xl font-black">{count}</p>
                <p className="text-sm font-bold">{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
