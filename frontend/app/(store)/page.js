import Link from "next/link";
import Image from "next/image";
import CategoryCollectionCard from "@/components/CategoryCollectionCard";

const heroImage =
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1600&h=900&fit=crop&q=80&auto=format";

const categoryCards = [
  {
    title: "Boys",
    description: "Cool styles for every adventure",
    href: "/shop?category=Boys",
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1200&h=800&fit=crop&q=80&auto=format",
    gradient: "from-blue-900/70 via-blue-700/40 to-transparent",
  },
  {
    title: "Girls",
    description: "Cute & trendy outfits for every occasion",
    href: "/shop?category=Girls",
    image:
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1200&h=800&fit=crop&q=80&auto=format",
    gradient: "from-pink-900/65 via-rose-700/45 to-transparent",
  },
  {
    title: "Sports Wear",
    description: "Comfort & performance for every move",
    href: "/shop?category=Sports",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=800&fit=crop&q=80&auto=format",
    gradient: "from-emerald-900/70 via-green-700/40 to-transparent",
  },
];

export default function Home() {
  return (
    <div className="bg-[#e9e9e9] pb-12">
      <section className="bg-[#08090b]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd60a]">
                ✣
                <span className="ml-2">Girl&apos;s Collection</span>
              </p>
              <h1 className="mt-4 text-6xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Girls
              </h1>
              <p className="mt-5 max-w-sm text-lg font-semibold leading-snug text-gray-200 sm:text-[35px] lg:text-[36px]">
                Stylish &amp; adorable outfits for every little princess.
              </p>
              <p className="mt-5 text-base font-semibold text-slate-400">0 products available</p>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <Image
              src={heroImage}
              alt="Girls hero"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08090b] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {categoryCards.map((card, index) => (
            <CategoryCollectionCard
              key={card.title}
              title={card.title}
              description={card.description}
              href={card.href}
              image={card.image}
              gradient={card.gradient}
              priority={index === 0}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/shop"
            className="bg-[#ffd60a] px-14 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#0d0d0d] transition-colors hover:bg-[#f0ca00] sm:text-lg"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
