"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Search, User, Heart, ChevronDown, Flame, Sparkles, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useCartStore from "@/store/useCartStore";

const navLinks = [
  {
    label: "Men",
    href: "/shop?category=Men",
    submenu: [
      { label: "T-Shirts", href: "/shop?category=Men&sub=T-Shirts" },
      { label: "Shirts", href: "/shop?category=Men&sub=Shirts" },
      { label: "Hoodies", href: "/shop?category=Men&sub=Hoodies" },
      { label: "Joggers", href: "/shop?category=Men&sub=Joggers" },
      { label: "Jeans", href: "/shop?category=Men&sub=Jeans" },
    ],
  },
  {
    label: "Women",
    href: "/shop?category=Women",
    submenu: [
      { label: "Tops", href: "/shop?category=Women&sub=Tops" },
      { label: "Dresses", href: "/shop?category=Women&sub=Dresses" },
      { label: "Hoodies", href: "/shop?category=Women&sub=Hoodies" },
      { label: "Joggers", href: "/shop?category=Women&sub=Joggers" },
    ],
  },
  { label: "Kids", href: "/shop?category=Kids" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "New Arrivals", href: "/shop", hot: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const searchRef = useRef(null);
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      {/* ===== TOP OFFER BAR ===== */}
      <div className="bg-[#ffd60a] text-[#0d0d0d] overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee py-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase">
                <Flame size={12} /> FLAT 50% OFF — USE CODE MARVELS50
              </span>
              <span className="h-3 w-px bg-[#0d0d0d]/20" />
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase">
                <Tag size={11} /> FREE SHIPPING ABOVE ₹499
              </span>
              <span className="h-3 w-px bg-[#0d0d0d]/20" />
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase">
                <Sparkles size={11} /> NEW DROPS EVERY FRIDAY
              </span>
              <span className="h-3 w-px bg-[#0d0d0d]/20" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0d0d0d]/[0.98] backdrop-blur-2xl shadow-2xl shadow-black/30"
            : "bg-[#0d0d0d]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[68px] lg:px-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white lg:hidden hover:text-[#ffd60a] transition-colors active:scale-90"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex flex-col items-center leading-none">
              <span className="text-2xl font-black tracking-tighter text-white sm:text-[1.75rem] lg:text-[2rem] group-hover:text-[#ffd60a] transition-colors duration-300">
                MARVELS
              </span>
              <div className="flex items-center gap-1">
                <span className="h-[1.5px] w-4 bg-[#ffd60a]" />
                <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-[#ffd60a]/80 sm:text-[8px]">
                  fashion
                </span>
                <span className="h-[1.5px] w-4 bg-[#ffd60a]" />
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0 lg:flex" onMouseLeave={() => setHoveredMenu(null)}>
            {navLinks.map(({ label, href, submenu, hot }) => (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => setHoveredMenu(submenu ? label : null)}
              >
                <Link
                  href={href}
                  className="relative flex items-center gap-1 px-4 py-6 text-[12px] font-bold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:text-white group"
                >
                  {label}
                  {hot && (
                    <span className="absolute -top-0.5 right-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff3d3d] opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff3d3d]" />
                    </span>
                  )}
                  {submenu && <ChevronDown size={11} className="text-gray-500 transition-transform group-hover:rotate-180" />}
                  <span className="absolute bottom-4 left-1/2 h-[2px] w-0 bg-[#ffd60a] transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]" />
                </Link>

                {/* Mega menu dropdown */}
                {submenu && hoveredMenu === label && (
                  <div className="absolute left-0 top-full w-48 bg-[#1a1a1a] border border-white/5 shadow-2xl shadow-black/40 animate-fade-in py-2">
                    {submenu.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-white/5 hover:text-[#ffd60a]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="hidden sm:flex p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="Wishlist"
            >
              <Heart size={19} />
            </Link>

            {/* Admin */}
            <Link
              href="/admin"
              className="hidden sm:flex p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="Admin"
            >
              <User size={19} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#ffd60a] text-[9px] font-black text-[#0d0d0d] animate-bounce-in ring-2 ring-[#0d0d0d]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        {searchOpen && (
          <div className="border-t border-white/5 bg-[#0d0d0d] animate-fade-in">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full bg-white/5 border border-white/10 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#ffd60a]/50 focus:outline-none focus:ring-1 focus:ring-[#ffd60a]/30 transition-all"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              {/* Quick suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["T-Shirts", "Hoodies", "Joggers", "Oversized", "New Arrivals"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/shop`}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:bg-[#ffd60a]/10 hover:text-[#ffd60a] hover:border-[#ffd60a]/30 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== MOBILE MENU ===== */}
        {menuOpen && (
          <nav className="border-t border-white/5 bg-[#0d0d0d] px-4 pb-6 lg:hidden animate-fade-in max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative mt-3 mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#ffd60a]/50 focus:outline-none"
              />
            </div>

            <div className="space-y-0.5">
              {navLinks.map(({ label, href, submenu, hot }) => (
                <div key={label}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-[#ffd60a] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {label}
                      {hot && <span className="h-1.5 w-1.5 rounded-full bg-[#ff3d3d] animate-pulse" />}
                    </span>
                  </Link>
                  {submenu && (
                    <div className="ml-4 space-y-0.5 mb-1">
                      {submenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-white/5 hover:text-[#ffd60a] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-white/5 pt-4 space-y-1">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <User size={16} /> Admin Panel
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <ShoppingBag size={16} /> My Bag {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
