import { Package, ShoppingCart, IndianRupee, TrendingUp, Users, Eye } from "lucide-react";
import Link from "next/link";

const metrics = [
  {
    title: "Total Products",
    value: "12",
    change: "+3 this week",
    icon: Package,
    color: "bg-[#ffd60a]",
    textColor: "text-[#0d0d0d]",
  },
  {
    title: "Total Orders",
    value: "5",
    change: "+2 today",
    icon: ShoppingCart,
    color: "bg-[#00c853]",
    textColor: "text-white",
  },
  {
    title: "Revenue",
    value: "₹4,500",
    change: "+12% vs last week",
    icon: IndianRupee,
    color: "bg-[#0d0d0d]",
    textColor: "text-[#ffd60a]",
  },
];

const quickActions = [
  { label: "Add Product", href: "/admin/products", icon: Package },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Visit Store", href: "/", icon: Eye },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d0d0d] uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ title, value, change, icon: Icon, color, textColor }) => (
          <div
            key={title}
            className="bg-white border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-2.5`}>
                <Icon size={18} className={textColor} />
              </div>
              <span className="text-[10px] font-bold text-[#00c853] bg-[#00c853]/10 px-2 py-0.5">
                {change}
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
            <p className="text-2xl font-black text-[#0d0d0d] mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0d0d0d] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 bg-white border border-gray-100 p-4 hover:border-[#ffd60a] hover:shadow-sm transition-all group"
            >
              <div className="bg-gray-50 p-2 group-hover:bg-[#ffd60a]/10 transition-colors">
                <Icon size={18} className="text-gray-400 group-hover:text-[#0d0d0d] transition-colors" />
              </div>
              <span className="text-sm font-bold text-[#0d0d0d]">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-[#0d0d0d] p-6 flex items-center gap-4">
        <TrendingUp size={24} className="text-[#ffd60a] flex-shrink-0" />
        <div>
          <h3 className="text-sm font-black text-white uppercase">Grow Your Store</h3>
          <p className="text-xs text-gray-400 mt-1">
            Add more products to attract customers. Use high-quality images and detailed descriptions for better sales.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="ml-auto flex-shrink-0 bg-[#ffd60a] px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-[#0d0d0d] hover:bg-[#ffce00] transition-colors"
        >
          Add Products
        </Link>
      </div>
    </div>
  );
}
