import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Heart, RotateCcw, Shield, Headphones } from "lucide-react";

/* ─── Column data ─── */
const girlsLinks = [
  { label: "Western Wear",   href: "/shop?category=Girls" },
  { label: "Traditional",    href: "/shop?category=Girls" },
  { label: "Jeans",          href: "/shop?category=Girls" },
  { label: "Tops",           href: "/shop?category=Girls" },
  { label: "Frocks",         href: "/shop?category=Girls" },
];

const boysLinks = [
  { label: "Jeans",    href: "/shop?category=Boys" },
  { label: "Tops",     href: "/shop?category=Boys" },
  { label: "T-Shirts", href: "/shop?category=Boys" },
  { label: "Shirts",   href: "/shop?category=Boys" },
];

const sportsLinks = [
  { label: "Women's T-Shirt", href: "/shop?category=Sports" },
  { label: "Gym Wear",        href: "/shop?category=Sports" },
  { label: "Track Suit",      href: "/shop?category=Sports" },
];

const helpLinks = [
  { label: "Track My Order",     href: "#" },
  { label: "10-Day Returns",     href: "#" },
  { label: "Shipping Policy",    href: "#" },
  { label: "Size Guide",         href: "#" },
  { label: "FAQs",               href: "#" },
  { label: "Help & Support",     href: "#" },
];

const companyLinks = [
  { label: "About Us",          href: "#" },
  { label: "Terms & Conditions",href: "#" },
  { label: "Privacy Policy",    href: "#" },
  { label: "Refund Policy",     href: "#" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter,   href: "#", label: "Twitter" },
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Youtube,   href: "#", label: "YouTube" },
];

function ColHead({ title }) {
  return (
    <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-white">
      {title}
    </h4>
  );
}

function LinkList({ links }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <Link href={l.href} className="text-[11px] text-gray-500 hover:text-[#ffd60a] transition-colors">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-500">

      {/* ── Trust badges ── */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: RotateCcw, text: "10-Day Easy Returns" },
              { icon: Shield,    text: "100% Secure Payments" },
              { icon: Mail,      text: "marvelskidswear@gmail.com" },
              { icon: Headphones,text: "Help & Support" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon size={15} className="text-[#ffd60a] flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Join the <span className="text-[#ffd60a]">MARVELS</span> Club
              </h3>
              <p className="mt-1 text-xs text-gray-500">Get 10% off your first order + exclusive drops</p>
            </div>
            <div className="flex w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-60 bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd60a] transition-colors"
              />
              <button className="flex items-center gap-1.5 bg-[#ffd60a] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#0d0d0d] hover:bg-[#ffce00] transition-colors">
                Subscribe <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main columns ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">MARVELS</h3>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#ffd60a] -mt-0.5">
                Kids &amp; Sports Wear
              </p>
            </Link>
            <p className="mt-3 text-[11px] leading-5 text-gray-500 max-w-[200px]">
              India&apos;s premier destination for premium Kids Wear and Junior Sports Gear.
            </p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center bg-white/5 text-gray-500 transition-all hover:bg-[#ffd60a] hover:text-[#0d0d0d]"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Girls */}
          <div>
            <ColHead title="Girls" />
            <LinkList links={girlsLinks} />
          </div>

          {/* Boys */}
          <div>
            <ColHead title="Boys" />
            <LinkList links={boysLinks} />
          </div>

          {/* Sports Wear */}
          <div>
            <ColHead title="Sports Wear" />
            <LinkList links={sportsLinks} />
          </div>

          {/* Help & Support */}
          <div>
            <ColHead title="Help & Support" />
            <LinkList links={helpLinks} />
          </div>

          {/* Company / T&C + Contact */}
          <div>
            <ColHead title="Company" />
            <LinkList links={companyLinks} />

            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:marvelskidswear@gmail.com"
                className="flex items-start gap-2 group"
              >
                <Mail size={12} className="mt-0.5 text-[#ffd60a] flex-shrink-0" />
                <span className="text-[10px] text-gray-500 group-hover:text-[#ffd60a] transition-colors break-all">
                  marvelskidswear@gmail.com
                </span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 text-[#ffd60a] flex-shrink-0" />
                <span className="text-[10px] text-gray-500">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
            © {new Date().getFullYear()} MARVELS Kids &amp; Sports Wear. Made with{" "}
            <Heart size={10} className="text-red-500" fill="currentColor" /> in India
          </p>
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-gray-600">
            <span>100% Secure Payments</span>
            <span className="h-3 w-px bg-gray-800" />
            <span>Free Shipping ₹499+</span>
            <span className="h-3 w-px bg-gray-800" />
            <span className="text-[#ffd60a] font-bold">10-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
