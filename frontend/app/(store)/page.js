import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RotateCcw, Star, Zap, TrendingUp, Flame, Clock, Gift, Heart, Crown, Sparkles } from "lucide-react";

async function getProducts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com";
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    return [];
  }
}

const categories = [
  {
    name: "Boys",
    tag: "TRENDING",
    desc: "Tees, joggers, hoodies & school-ready fits",
    href: "/shop?category=Boys",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&h=800&fit=crop",
    gradient: "from-slate-900/95 via-slate-900/70 to-transparent",
  },
  {
    name: "Girls",
    tag: "NEW DROPS",
    desc: "Dresses, tops, co-ords & activewear",
    href: "/shop?category=Girls",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&h=800&fit=crop",
    gradient: "from-rose-950/95 via-rose-900/70 to-transparent",
  },
  {
    name: "Sports",
    tag: "HOT",
    desc: "Performance sets, jerseys & training gear",
    href: "/shop?category=Sports",
    image: "https://images.unsplash.com/photo-1542766788-a2f588f447ee?w=600&h=800&fit=crop",
    gradient: "from-amber-950/95 via-amber-900/70 to-transparent",
  },
];

const offers = [
  { title: "FLAT 50% OFF", subtitle: "Premium Kids Wear", code: "MARVELS50", bg: "bg-gradient-to-br from-violet-600 to-indigo-800" },
  { title: "BUY 2 GET 1", subtitle: "Junior Sports Gear", code: "B2G1", bg: "bg-gradient-to-br from-rose-500 to-pink-700" },
  { title: "UNDER ₹499", subtitle: "Everyday Kids Essentials", code: "UNDER499", bg: "bg-gradient-to-br from-amber-500 to-orange-700" },
];

const trustBadges = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: Shield, title: "100% Original", desc: "Authentic products" },
  { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
  { icon: Star, title: "4.8★ Rated", desc: "50K+ happy customers" },
];

const trendingSearches = [
  "Oversized T-Shirts", "Cargo Joggers", "Graphic Hoodies", "Acid Wash",
  "Co-ord Sets", "Polo T-Shirts", "Denim Jackets", "Printed Shirts",
];

export default async function Home() {
  const products = await getProducts();

  const boysProducts = products.filter((p) => p.category === "Boys");
  const girlsProducts = products.filter((p) => p.category === "Girls");
  const sportsProducts = products.filter((p) => p.category === "Sports");
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="bg-[#fafafa]">

      {/* ========================================= */}
      {/* ===== HERO — FULL WIDTH IMMERSIVE ===== */}
      {/* ========================================= */}
      <section className="relative overflow-hidden bg-[#0d0d0d] min-h-[85vh] flex items-center">
        {/* Animated gradient background blobs */}
        <div className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-[#ffd60a]/8 blur-[180px] animate-float" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#ff6b35]/6 blur-[150px]" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#ffd60a]/3 blur-[200px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:flex lg:items-center lg:gap-16 lg:px-8 lg:py-12 w-full">
          {/* Left Content */}
          <div className="max-w-2xl lg:max-w-[55%]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd60a]/10 border border-[#ffd60a]/20 px-5 py-2 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffd60a] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffd60a]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffd60a]">
                New Season 2026
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl animate-fade-in-up">
              KIDS
              <br />
              <span className="gradient-text">PREMIUM</span>
              <br />
              WEAR
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              Premium Kids Wear and Junior Sports Gear designed for comfort, movement, and everyday confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
              <Link href="/shop" className="btn-brand">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/shop?category=Sports" className="btn-brand-outline">
                Explore Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex items-center gap-10 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
              {[
                { num: "50K+", label: "Happy Customers" },
                { num: "1000+", label: "Designs" },
                { num: "4.8★", label: "App Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-[#ffd60a] sm:text-3xl">{stat.num}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero Image Grid */}
          <div className="mt-12 hidden lg:mt-0 lg:block lg:flex-1">
            <div className="relative">
              <div className="absolute -inset-12 rounded-3xl bg-[#ffd60a]/3 blur-[60px]" />
              <div className="relative grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="overflow-hidden aspect-[3/4] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <img src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=530&fit=crop" alt="Boys collection" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="overflow-hidden aspect-square animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    <img src="https://images.unsplash.com/photo-1542766788-a2f588f447ee?w=400&h=400&fit=crop" alt="Sports gear" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="space-y-3 pt-10">
                  <div className="overflow-hidden aspect-square animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop" alt="Girls collection" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="overflow-hidden aspect-[3/4] animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=530&fit=crop" alt="Junior sportswear" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              </div>

              {/* Floating label */}
              <div className="absolute -left-4 bottom-20 bg-[#ffd60a] px-5 py-3 shadow-2xl animate-float">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0d0d0d]">Trending Now</p>
                <p className="text-sm font-black text-[#0d0d0d]">Premium Kids Wear</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fafafa] to-transparent" />
      </section>


      {/* ========================================= */}
      {/* ===== TRUST BAR ===== */}
      {/* ========================================= */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
          {trustBadges.map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className={`flex items-center gap-3 px-4 py-5 sm:justify-center sm:px-6 sm:py-7 ${idx < 3 ? 'border-r border-gray-100' : ''}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd60a]/10 flex-shrink-0">
                <Icon size={18} className="text-[#0d0d0d]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#0d0d0d]">{title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== TRENDING SEARCHES ===== */}
      {/* ========================================= */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex-shrink-0">
              <TrendingUp size={12} /> Trending:
            </span>
            {trendingSearches.map((term) => (
              <Link
                key={term}
                href="/shop"
                className="flex-shrink-0 rounded-full border border-gray-200 px-4 py-1.5 text-[11px] font-bold text-gray-600 transition-all hover:border-[#ffd60a] hover:bg-[#ffd60a]/5 hover:text-[#0d0d0d]"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== FLASH SALE / OFFERS ===== */}
      {/* ========================================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[#0d0d0d] text-[#ffd60a] px-4 py-2">
            <Flame size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Flash Sale</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={13} />
            <span className="font-bold">Ends in: <span className="text-[#ff3d3d] font-black">23:59:59</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {offers.map((offer) => (
            <Link
              key={offer.code}
              href="/shop"
              className={`group relative overflow-hidden ${offer.bg} p-7 text-white transition-all hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="relative z-10">
                <p className="mt-2 text-3xl font-black tracking-tight sm:text-2xl lg:text-3xl">{offer.title}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{offer.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded bg-white/20 px-4 py-2 text-[10px] font-black tracking-widest backdrop-blur-sm border border-white/10">
                  CODE: {offer.code}
                </div>
              </div>
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all group-hover:scale-150" />
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
            </Link>
          ))}
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== SHOP BY CATEGORY — Premium Grid ===== */}
      {/* ========================================= */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">Browse</span>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-3xl">
              Shop by Category
            </h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:text-[#ffd60a] transition-colors group">
            View All <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden aspect-[3/4] sm:aspect-[3/5]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
              <div className="absolute top-5 left-5">
                <span className="inline-block bg-[#ffd60a] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#0d0d0d]">
                  {cat.tag}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className="text-3xl font-black uppercase text-white sm:text-4xl">{cat.name}</h3>
                <p className="mt-1 text-sm text-white/60">{cat.desc}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/70 transition-all group-hover:text-[#ffd60a] group-hover:gap-3">
                  Explore Collection <ArrowRight size={13} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== LATEST ARRIVALS — Product Grid ===== */}
      {/* ========================================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#ffd60a]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Just Dropped</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-3xl">
                Latest Arrivals
              </h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:text-[#ffd60a] transition-colors group">
              See All <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Gift size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-gray-300 uppercase">No products yet</h3>
              <p className="mt-1 text-sm text-gray-400">Add your first product from the admin panel</p>
              <Link href="/admin/products" className="mt-4 inline-block btn-brand text-xs">
                Go to Admin <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
              {products.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== LIFESTYLE BANNER — Immersive CTA ===== */}
      {/* ========================================= */}
      <section className="relative overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=700&fit=crop"
            alt="Kids and sports lifestyle"
            className="h-full w-full object-cover opacity-15"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={16} className="text-[#ffd60a]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">Premium Collection</span>
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Premium Kids<br /><span className="gradient-text">Wear</span>
            </h2>
            <p className="mt-4 max-w-md text-base text-gray-400">
              Comfortable fits, durable fabrics, and active styles built for kids and junior athletes.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <Link href="/shop" className="btn-brand text-sm">
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== BOYS COLLECTION ===== */}
      {/* ========================================= */}
      {boysProducts.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">For Boys</span>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-3xl">
                  Boys Collection
                </h2>
              </div>
              <Link href="/shop?category=Boys" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:text-[#ffd60a] transition-colors group">
                View All <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
              {boysProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ========================================= */}
      {/* ===== MID BANNER — Two Column Promo ===== */}
      {/* ========================================= */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/shop?category=Sports" className="group relative overflow-hidden aspect-[2/1] bg-gradient-to-br from-[#0d0d0d] to-[#2d2d2d]">
            <img
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop"
              alt="Junior sports"
              className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/80 to-transparent" />
            <div className="relative flex h-full items-center p-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">Sports Store</span>
                <h3 className="mt-2 text-2xl font-black uppercase text-white">Up to 60% Off</h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70 group-hover:text-[#ffd60a] transition-colors">
                  Shop Now <ArrowRight size={12} />
                </p>
              </div>
            </div>
          </Link>
          <Link href="/shop?category=Girls" className="group relative overflow-hidden aspect-[2/1] bg-gradient-to-br from-rose-900 to-rose-950">
            <img
              src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&h=400&fit=crop"
              alt="Girls collection"
              className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 to-transparent" />
            <div className="relative flex h-full items-center p-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">Girls Store</span>
                <h3 className="mt-2 text-2xl font-black uppercase text-white">New Arrivals</h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70 group-hover:text-[#ffd60a] transition-colors">
                  Shop Now <ArrowRight size={12} />
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== GIRLS COLLECTION ===== */}
      {/* ========================================= */}
      {girlsProducts.length > 0 && (
        <section className="bg-[#fafafa]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500">For Girls</span>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-3xl">
                  Girls Collection
                </h2>
              </div>
              <Link href="/shop?category=Girls" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:text-[#ffd60a] transition-colors group">
                View All <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
              {girlsProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ========================================= */}
      {/* ===== SPORTS COLLECTION ===== */}
      {/* ========================================= */}
      {sportsProducts.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Active Kids</span>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-3xl">
                  Sports Collection
                </h2>
              </div>
              <Link href="/shop?category=Sports" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0d0d0d] hover:text-[#ffd60a] transition-colors group">
                View All <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
              {sportsProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ========================================= */}
      {/* ===== WHY MARVELS — Brand Promise ===== */}
      {/* ========================================= */}
      <section className="bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ffd60a]">Why Choose Us</span>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              The MARVELS Promise
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: Sparkles, title: "1000+ Designs", desc: "Fresh kids styles added every week" },
              { icon: Shield, title: "Premium Fabric", desc: "Comfort-first quality for active children" },
              { icon: Gift, title: "Best Prices", desc: "Premium kids wear at family-friendly prices" },
              { icon: Truck, title: "Fast Delivery", desc: "2-5 day delivery pan India" },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4 group-hover:bg-[#ffd60a]/10 transition-colors">
                  <item.icon size={24} className="text-[#ffd60a]" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================= */}
      {/* ===== NEWSLETTER — Bold CTA ===== */}
      {/* ========================================= */}
      <section className="bg-[#ffd60a] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#0d0d0d]/5 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#0d0d0d]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-center text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="lg:max-w-lg">
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#0d0d0d] sm:text-4xl">
                Never Miss a Drop
              </h2>
              <p className="mt-2 text-sm font-medium text-[#0d0d0d]/60">
                Get early access to sales, new arrivals & member-only deals for Kids & Sports wear.
              </p>
            </div>
            <div className="mt-8 flex w-full max-w-md gap-2 lg:mt-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border-2 border-[#0d0d0d] bg-white px-5 py-3.5 text-sm font-medium text-[#0d0d0d] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d0d0d]/20 transition-all"
              />
              <button className="bg-[#0d0d0d] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-[#1a1a1a] hover:shadow-lg active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
