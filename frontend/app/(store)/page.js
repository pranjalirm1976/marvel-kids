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
    subtitle: "Cute & trendy outfits for every occasion",
    href: "/shop?category=Girls",
    image: "/cat-girls.png",
    bg: "bg-[#e8b4b8]",
  },
  {
    title: "Sports Wear",
    subtitle: "Comfort & performance for every move",
    href: "/shop?category=Sports",
    image: "/cat-sports.png",
    bg: "bg-[#7a8c5c]",
  },
];

export default function Home() {
  return (
    <div className="bg-[#ebebeb] pb-10">

      {/* ─── HERO ─── */}
      <section className="bg-[#08090b] overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_1.15fr]">

          {/* Left — text */}
          <div className="flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16 z-10">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffd60a]">
                <span className="text-base">✣</span>
                Girl&apos;s Collection
              </p>
              <h1 className="mt-3 text-[80px] font-black uppercase leading-none tracking-tight text-white sm:text-[100px] lg:text-[110px]">
                GIRLS
              </h1>
              <p className="mt-4 max-w-xs text-[15px] font-medium leading-snug text-gray-300">
                Stylish &amp; adorable outfits for every little princess.
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-500">
                0 products available
              </p>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative min-h-[380px] lg:min-h-[520px]">
            <Image
              src="/hero-girls.png"
              alt="Girls collection"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-top"
            />
            {/* Fade left edge into dark bg */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── CATEGORY CARDS ─── */}
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categoryCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative flex flex-col justify-between overflow-hidden ${card.bg} min-h-[280px] sm:min-h-[320px]`}
            >
              {/* Background product image */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text overlay at bottom */}
              <div className="relative z-10 mt-auto p-5 pt-32">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                  {card.title}
                </h2>
                <p className="mt-1 text-[12px] font-semibold text-white/90 drop-shadow">
                  {card.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white">
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
