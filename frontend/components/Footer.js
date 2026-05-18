import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, ArrowRight, Heart, RotateCcw, Shield, Headphones } from "lucide-react";

/* ─── Column data ─── */
const girlsLinks = [
  { label: "Western Wear",  href: "/shop?category=Girls" },
  { label: "Traditional",   href: "/shop?category=Girls" },
  { label: "Jeans",         href: "/shop?category=Girls" },
  { label: "Tops",          href: "/shop?category=Girls" },
  { label: "Frocks",        href: "/shop?category=Girls" },
];
const boysLinks = [
  { label: "Jeans",     href: "/shop?category=Boys" },
  { label: "Tops",      href: "/shop?category=Boys" },
  { label: "T-Shirts",  href: "/shop?category=Boys" },
  { label: "Shirts",    href: "/shop?category=Boys" },
];
const sportsLinks = [
  { label: "Women's T-Shirt", href: "/shop?category=Sports" },
  { label: "Gym Wear",        href: "/shop?category=Sports" },
  { label: "Track Suit",      href: "/shop?category=Sports" },
];
const helpLinks = [
  { label: "Track My Order",  href: "#" },
  { label: "10-Day Returns",  href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Size Guide",      href: "#" },
  { label: "FAQs",            href: "#" },
  { label: "Help & Support",  href: "#" },
];
const companyLinks = [
  { label: "About Us",           href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy",     href: "#" },
  { label: "Refund Policy",      href: "#" },
];
const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram", color: "#ec4899" },
  { icon: Twitter,   href: "#", label: "Twitter",   color: "#67e8f9" },
  { icon: Facebook,  href: "#", label: "Facebook",  color: "#67e8f9" },
  { icon: Youtube,   href: "#", label: "YouTube",   color: "#ec4899" },
];

function ColHead({ title, pink }) {
  return (
    <h4
      className="mb-4 text-[11px] font-extrabold uppercase tracking-widest"
      style={{ color: pink ? "#ec4899" : "#67e8f9" }}
    >
      {title}
    </h4>
  );
}

function LinkList({ links }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <Link href={l.href} className="text-[11px] text-gray-400 hover:text-[#ec4899] transition-colors">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #fce7f3 0%, #ecfdf5 40%, #fbcfe8 100%)",
        borderTop: "1.5px solid #fbcfe8",
      }}
    >

      {/* ── Trust badges ── */}
      <div style={{ borderBottom: "1px solid #fbcfe8" }}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: RotateCcw,   text: "10-Day Easy Returns",       color: "#ec4899" },
              { icon: Shield,      text: "100% Secure Payments",       color: "#67e8f9" },
              { icon: Mail,        text: "marvelskidswear@gmail.com",  color: "#ec4899" },
              { icon: Headphones,  text: "Help & Support",             color: "#67e8f9" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon size={15} className="flex-shrink-0" style={{ color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div style={{ borderBottom: "1px solid #fbcfe8" }}>
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#2d2d3a]">
                Join the{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #67e8f9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  MARVELS
                </span>{" "}
                Club
              </h3>
              <p className="mt-1 text-xs text-gray-400">Get 10% off your first order + exclusive drops</p>
            </div>
            <div className="flex w-full sm:w-auto rounded-full overflow-hidden shadow-sm"
                 style={{ border: "1.5px solid #fbcfe8" }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-60 bg-white px-5 py-3 text-xs text-[#2d2d3a] placeholder-gray-400 focus:outline-none"
              />
              <button
                className="flex items-center gap-1.5 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ec4899, #67e8f9)" }}
              >
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
              <h3
                className="text-lg font-black uppercase tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MARVELS
              </h3>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 -mt-0.5">
                Kids &amp; Sports Wear
              </p>
            </Link>
            <p className="mt-3 text-[11px] leading-5 text-gray-400 max-w-[200px]">
              India&apos;s premier destination for premium Kids Wear and Junior Sports Gear.
            </p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-[#fbcfe8] text-gray-400 transition-all hover:scale-110"
                  style={{ "--hover-color": color }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Girls */}
          <div>
            <ColHead title="Girls" pink />
            <LinkList links={girlsLinks} />
          </div>

          {/* Boys */}
          <div>
            <ColHead title="Boys" />
            <LinkList links={boysLinks} />
          </div>

          {/* Sports Wear */}
          <div>
            <ColHead title="Sports Wear" pink />
            <LinkList links={sportsLinks} />
          </div>

          {/* Help */}
          <div>
            <ColHead title="Help & Support" />
            <LinkList links={helpLinks} />
          </div>

          {/* Company */}
          <div>
            <ColHead title="Company" pink />
            <LinkList links={companyLinks} />
            <div className="mt-6 space-y-2.5">
              <a href="mailto:marvelskidswear@gmail.com" className="flex items-start gap-2 group">
                <Mail size={12} className="mt-0.5 flex-shrink-0 text-[#ec4899]" />
                <span className="text-[10px] text-gray-400 group-hover:text-[#ec4899] transition-colors break-all">
                  marvelskidswear@gmail.com
                </span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-[#67e8f9]" />
                <span className="text-[10px] text-gray-400">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid #fbcfe8" }}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
            © {new Date().getFullYear()} MARVELS Kids &amp; Sports Wear. Made with{" "}
            <Heart size={10} className="text-[#ec4899] animate-heart-beat" fill="currentColor" /> in India
          </p>
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            <span>100% Secure Payments</span>
            <span className="h-3 w-px bg-[#fbcfe8]" />
            <span>Free Shipping ₹499+</span>
            <span className="h-3 w-px bg-[#fbcfe8]" />
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, #ec4899, #67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              10-Day Returns
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
