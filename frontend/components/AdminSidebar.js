"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Store, MessageCircle, Truck, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "WhatsApp", href: "/admin/whatsapp", icon: MessageCircle },
  { label: "Tracking", href: "/admin/tracking", icon: Truck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl">
      {/* Brand */}
      <div className="flex h-20 items-center justify-center gap-3 border-b border-white/10 bg-black px-4">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#fff",
            padding: 2,
            backgroundImage: "linear-gradient(#fff,#fff), linear-gradient(135deg,#C97BAA,#4ECDC4)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#fff" }}>
            <Image src="/ms-logo.svg" alt="Marvels Logo" fill className="object-contain" sizes="44px" />
          </div>
        </div>
        <Link href="/admin" className="text-left">
          <h1 className="text-base font-black uppercase tracking-wider text-white leading-none">MARVELS</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mt-0.5">Admin Panel</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-4 px-4 py-4 text-sm font-bold transition-all duration-300 rounded-xl group ${
                    isActive
                      ? "text-white shadow-lg transform scale-105"
                      : "text-gray-300 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                  }`}
                  style={isActive ? { 
                    background: "linear-gradient(135deg, #ff2d87, #3ab7e8)",
                    boxShadow: "0 8px 32px rgba(255, 45, 135, 0.3)"
                  } : {}}
                >
                  <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-[#ff2d87]" />
            <span className="text-xs font-bold uppercase tracking-wide text-gray-300">Quick Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <p className="font-black text-white">--</p>
              <p className="text-gray-400">Orders</p>
            </div>
            <div className="text-center">
              <p className="font-black text-white">--</p>
              <p className="text-gray-400">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Store Link */}
      <div className="px-4 pb-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#3ab7e8] transition-all duration-300 rounded-xl hover:bg-white/5"
        >
          <Store size={16} /> 
          <span>View Store</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-4 text-center">
        <p className="text-[10px] font-medium text-gray-500">
          © {new Date().getFullYear()} MARVELS Fashion
        </p>
        <p className="text-[8px] text-gray-600 mt-1">
          Admin Dashboard v2.0
        </p>
      </div>
    </aside>
  );
}
