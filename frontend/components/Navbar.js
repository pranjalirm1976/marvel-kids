"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import useCartStore from "@/store/useCartStore";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Boys", href: "/shop?category=Boys" },
  { label: "Girls", href: "/shop?category=Girls" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900">
          Marvel Kids
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side — Cart + Mobile toggle */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
            <ShoppingCart size={22} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {totalItems}
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-700 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
