"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Store } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0d0d0d] text-white">
      {/* Brand */}
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <Link href="/admin" className="text-center">
          <h1 className="text-lg font-black uppercase tracking-wider">MARVELS</h1>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#ffd60a] -mt-0.5">Admin Panel</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#ffd60a] text-[#0d0d0d]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View Store Link */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#ffd60a] transition-colors"
        >
          <Store size={14} /> View Store
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-4 text-[10px] font-medium text-gray-600">
        © {new Date().getFullYear()} MARVELS Fashion
      </div>
    </aside>
  );
}
