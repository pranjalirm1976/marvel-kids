import Link from "next/link";
import Image from "next/image";

const categoryCards = [
  {
    title: "Boys",
    subtitle: "Cool styles for every adventure",
    href: "/shop?category=Boys",
    image: "/cat-boys.png",
    accent: "#67e8f9",
    bg: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
    badge: "bg-[#67e8f9]",
  },
  {
    title: "Girls",
    subtitle: "Cute & trendy outfits for every occasion",
    href: "/shop?category=Girls",
    image: "/cat-girls.png",
    accent: "#ec4899",
    bg: "linear-gradient(135deg, #fbcfe8 0%, #f8bbd0 100%)",
    badge: "bg-[#ec4899]",
  },
  {
    title: "Sports Wear",
    subtitle: "Comfort & performance for every move",
    href: "/shop?category=Sports",
    image: "/cat-sports.png",
    accent: "#67e8f9",
    bg: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
    badge: "bg-[#67e8f9]",
  },
];


export default function Home() {
  return (
    <div className="pb-10" style={{ background: "linear-gradient(160deg, #fce7f3 0%, #ecfdf5 100%)" }}>

      {/* ─── HERO ─── */}
      <section className="overflow-hidden" style={{ background: "linear-gradient(135deg, #fce7f3 0%, #ecfdf5 60%, #fce7f3 100%)" }}>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20"
               style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
          <div className="absolute -top-16 right-0 h-80 w-80 rounded-full opacity-15"
               style={{ background: "radial-gradient(circle, #67e8f9, transparent 70%)" }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_1.6fr] min-h-[520px]">

          {/* ── LEFT: text ── */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">

            {/* Badge */}
            <div className="flex items-center gap-2 mb-5 animate-fade-in-up">
              <span className="text-[#ec4899] text-base">✿</span>
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#ec4899]">
                New Season 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black uppercase leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.06s" }}>
              <span className="block text-[52px] sm:text-[68px] lg:text-[80px] text-[#2d2d3a]">KIDS</span>
              <span
                className="block text-[52px] sm:text-[68px] lg:text-[80px]"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                PREMIUM
              </span>
              <span className="block text-[52px] sm:text-[68px] lg:text-[80px] text-[#2d2d3a]">WEAR</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-[300px] text-[13px] font-medium leading-relaxed text-gray-500 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Premium Kids Wear and Junior Sports Gear designed for comfort, movement, and everyday confidence.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.14s" }}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-white rounded-full transition-all hover:scale-105 active:scale-100"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #f472b6)",
                  boxShadow: "0 8px 28px rgba(236,72,153,0.35)",
                }}
              >
                Shop Now →
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-2 border-[#fbcfe8] bg-white px-7 py-3.5 text-[11px] font-extrabold uppercase tracking-widest text-[#2d2d3a] hover:border-[#ec4899] hover:text-[#ec4899] transition-all rounded-full"
              >
                Explore Collections
              </Link>
            </div>
          </div>

          {/* ── RIGHT: images grid ── */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-2 p-2 min-h-[420px] lg:min-h-0">
            {/* Center tall image */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-pink-200">
              <Image
                src="/hero-girls.png"
                alt="Girls premium wear"
                fill
                priority
                sizes="40vw"
                className="object-cover object-top"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24"
                   style={{ background: "linear-gradient(to top, rgba(251,207,232,0.6), transparent)" }} />
            </div>
            {/* Right — two stacked images */}
            <div className="grid grid-rows-2 gap-2">
              <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-cyan-200">
                <Image
                  src="/hero-teal.png"
                  alt="Teal dress"
                  fill
                  sizes="20vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-pink-200">
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
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categoryCards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-3xl min-h-[290px] sm:min-h-[320px] shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              style={{ background: card.bg }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Bottom gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36"
                style={{ background: `linear-gradient(to top, ${card.accent}22, transparent)` }}
              />

              {/* Text */}
              <div className="relative z-10 p-5 pt-24">
                <h2
                  className="text-2xl font-black uppercase tracking-tight drop-shadow-sm"
                  style={{ color: card.accent }}
                >
                  {card.title}
                </h2>
                <p className="mt-1 text-[11px] font-semibold leading-snug" style={{ color: card.accent + "cc" }}>
                  {card.subtitle}
                </p>
                <span
                  className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: card.accent }}
                >
                  Explore Collection
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="mt-7 flex justify-center">
          <Link
            href="/shop"
            className="px-14 py-4 text-sm font-black uppercase tracking-[0.1em] text-white transition-all hover:scale-[1.03] active:scale-100 rounded-full"
            style={{
              background: "linear-gradient(135deg, #ff2d87, #3ab7e8)",
              boxShadow: "0 8px 32px rgba(255,45,135,0.28)",
            }}
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
