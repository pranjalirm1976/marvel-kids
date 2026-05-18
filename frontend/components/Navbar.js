"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, User, Heart, Sparkles, Tag, Star, Truck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import useCartStore from "@/store/useCartStore";

const navLinks = [
  { label: "Girls",        href: "/shop?category=Girls" },
  { label: "Boys",         href: "/shop?category=Boys" },
  { label: "Sports Wear",  href: "/shop?category=Sports" },
  { label: "New Arrivals", href: "/shop", hot: true },
];

/* Ticker messages */
const tickerItems = [
  { icon: Sparkles, text: "New Drops Every Friday" },
  { icon: Tag,      text: "Flat 50% Off — Use Code MARVELS50" },
  { icon: Truck,    text: "Free Shipping Above ₹499" },
  { icon: Star,     text: "New Drops Every Friday" },
];

export default function Navbar() {
  const pathname     = usePathname();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const items      = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      {/* ===== TICKER BAR ===== */}
      <div
        style={{
          background: "linear-gradient(90deg, #ec4899, #67e8f9, #ec4899)",
          backgroundSize: "200% 100%",
          animation: "gradient-x 5s ease infinite",
        }}
        className="text-white overflow-hidden"
      >
        <div className="flex h-9 items-center overflow-hidden relative">
          {/* Desktop — scrolling ticker */}
          <div className="hidden lg:flex animate-ticker whitespace-nowrap select-none">
            {[...tickerItems, ...tickerItems].map(({ icon: Icon, text }, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-8 text-[11px] font-bold tracking-[0.1em] uppercase">
                <Icon size={11} />
                {text}
                <span className="mx-3 opacity-40">✦</span>
              </span>
            ))}
          </div>
          {/* Mobile — single centered */}
          <div className="lg:hidden mx-auto flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-4">
            <Tag size={10} />
            Flat 50% Off — Code MARVELS50
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/[0.97] backdrop-blur-2xl shadow-lg shadow-pink-200/60"
            : "bg-white"
        }`}
        style={{ borderBottom: "1.5px solid #fbcfe8" }}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[#2d2d3a] lg:hidden hover:text-[#ec4899] transition-colors active:scale-90"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* MS monogram logo — white background, pink/teal circle */}
            <div
              className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 2px 16px rgba(236,72,153,0.25)",
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(#fff,#fff), linear-gradient(135deg,#ec4899,#67e8f9)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Image
                  src="/marvels-logo.svg"
                  alt="Marvels Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="56px"
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="text-[19px] font-black uppercase tracking-[0.1em]"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MARVELS
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-0.5">
                KIDS & SPORTS
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0 lg:flex">
            {navLinks.map(({ label, href, hot }) => {
              const isActive = pathname === href || (pathname === "/" && label === "Girls");
              return (
                <div key={label} className="relative">
                  <Link
                    href={href}
                    className={`relative flex items-center gap-1.5 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-200 rounded-full mx-0.5 ${
                      isActive
                        ? "text-[#ec4899] bg-[#fce7f3]"
                        : "text-[#2d2d3a] hover:text-[#ec4899] hover:bg-[#fce7f3]"
                    }`}
                  >
                    {label}
                    {hot && (
                      <span className="absolute -top-0.5 right-2 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#67e8f9] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#67e8f9]" />
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-gray-500 hover:text-[#ec4899] transition-all rounded-full hover:bg-[#fce7f3]"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#ec4899] transition-all rounded-full hover:bg-[#fce7f3]"
              aria-label="Wishlist"
            >
              <Heart size={19} />
            </Link>

            {/* Admin */}
            <Link
              href="/admin"
              className="hidden sm:flex p-2.5 text-gray-500 hover:text-[#67e8f9] transition-all rounded-full hover:bg-[#ecfdf5]"
              aria-label="Admin"
            >
              <User size={19} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-500 hover:text-[#ec4899] transition-all rounded-full hover:bg-[#fce7f3]"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#ec4899] text-[9px] font-black text-white animate-bounce-in ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ===== SEARCH PANEL ===== */}
        {searchOpen && (
          <div
            className="border-t border-[#fbcfe8] animate-fade-in"
            style={{ background: "linear-gradient(135deg, #fce7f3, #ecfdf5)" }}
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ec4899]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for kids wear, sports gear and more..."
                  className="w-full bg-white border border-[#fbcfe8] rounded-full py-3 pl-12 pr-10 text-sm text-[#2d2d3a] placeholder-gray-400 focus:border-[#ec4899] focus:outline-none focus:ring-2 focus:ring-[#ec4899]/20 transition-all shadow-sm"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#ec4899]"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Girls Frocks", "Boys T-Shirts", "Sports Wear", "New Arrivals", "Party Wear"].map((tag) => (
                  <Link
                    key={tag}
                    href="/shop"
                    onClick={() => setSearchOpen(false)}
                    className="rounded-full border border-[#fbcfe8] bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:bg-[#ec4899] hover:text-white hover:border-[#ec4899] transition-all"
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
          <nav
            className="border-t border-[#fbcfe8] px-4 pb-6 lg:hidden animate-fade-in max-h-[70vh] overflow-y-auto"
            style={{ background: "linear-gradient(180deg, #fce7f3, #ecfdf5)" }}
          >
            {/* Mobile Search */}
            <div className="relative mt-3 mb-4">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ec4899]" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white border border-[#fbcfe8] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#2d2d3a] placeholder-gray-400 focus:border-[#ec4899] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              {navLinks.map(({ label, href, hot }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-[#2d2d3a] hover:bg-white hover:text-[#ec4899] transition-all"
                >
                  <span className="flex items-center gap-2">
                    {label}
                    {hot && <span className="h-1.5 w-1.5 rounded-full bg-[#67e8f9] animate-pulse" />}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-[#fbcfe8] pt-4 space-y-1">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-white hover:text-[#67e8f9] transition-all"
              >
                <User size={16} /> Admin Panel
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-white hover:text-[#ec4899] transition-all"
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
