import Link from "next/link";
import Image from "next/image";

const categoryCards = [
  {
    title: "Boys",
    subtitle: "Cool styles for every adventure",
    href: "/shop?category=Boys",
    image: "/cat-boys.png",
    bg: "bg-[#b0c4d8]",
  },
  {
    title: "Girls",
    subtitle: "Stylish & adorable outfits for every little princess.",
    href: "/shop?category=Girls",
    image: "/cat-girls.png",
    bg: "bg-[#e8b4b8]",
  },
  {
    title: "Sports Wear",
    subtitle: "Comfort & performance for every move",
    href: "/shop?category=Sports",
    image: "/cat-sports.png",
    bg: "bg-[#6b7c3f]",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "1000+", label: "Designs" },
  { value: "4.8★", label: "App Rating" },
];

export default function Home() {
  return (
    <div className="bg-[#ebebeb] pb-10">

      {/* ─── HERO ─── */}
      <section className="bg-[#08090b] overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_1.6fr] min-h-[520px]">

          {/* ── LEFT: text ── */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ffd60a] text-sm">✦</span>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#ffd60a]">
                New Season 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black uppercase leading-[0.92] tracking-tight">
              <span className="block text-[56px] sm:text-[72px] lg:text-[84px] text-white">KIDS</span>
              <span className="block text-[56px] sm:text-[72px] lg:text-[84px] text-[#ffd60a]">PREMIUM</span>
              <span className="block text-[56px] sm:text-[72px] lg:text-[84px] text-white">WEAR</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-[300px] text-[13px] font-medium leading-snug text-gray-400">
              Premium Kids Wear and Junior Sports Gear designed for comfort, movement, and everyday confidence.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#ffd60a] px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-[#0d0d0d] hover:bg-[#f0ca00] transition-colors"
              >
                Shop Now →
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest text-white hover:border-[#ffd60a] hover:text-[#ffd60a] transition-colors"
              >
                Explore Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[22px] font-black text-white leading-none">{s.value}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: images grid ── */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-1 min-h-[420px] lg:min-h-0">
            {/* Center tall image */}
            <div className="relative">
              <Image
                src="/hero-girls.png"
                alt="Girls premium wear"
                fill
                priority
                sizes="40vw"
                className="object-cover object-top"
              />
            </div>
            {/* Right — two stacked images */}
            <div className="grid grid-rows-2 gap-1">
              <div className="relative">
                <Image
                  src="/hero-teal.png"
                  alt="Teal dress"
                  fill
                  sizes="20vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="relative">
                <Image
                  src="/hero-yellow.png"
                  alt="Yellow dress"
                  fill
                  sizes="20vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY CARDS ─── */}
      <section className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative flex flex-col justify-end overflow-hidden ${card.bg} min-h-[280px] sm:min-h-[310px]`}
            >
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative z-10 p-5 pt-24">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                  {card.title}
                </h2>
                <p className="mt-1 text-[11px] font-semibold text-white/90 drop-shadow leading-snug">
                  {card.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-white">
                  Explore Collection
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/shop"
            className="bg-[#ffd60a] px-14 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#0d0d0d] transition-all hover:bg-[#f0ca00] hover:scale-[1.02] active:scale-100"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
