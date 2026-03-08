import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Men", href: "/shop?category=Men" },
  { label: "Women", href: "/shop?category=Women" },
  { label: "Kids", href: "/shop?category=Kids" },
  { label: "Accessories", href: "/shop?category=Accessories" },
  { label: "New Arrivals", href: "/shop" },
];

const helpLinks = [
  { label: "Track Order", href: "#" },
  { label: "Returns & Exchange", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Size Guide", href: "#" },
  { label: "FAQs", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] text-gray-500">
      {/* Newsletter Strip */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
                className="flex-1 sm:w-64 bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd60a] transition-colors"
              />
              <button className="flex items-center gap-1.5 bg-[#ffd60a] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#0d0d0d] hover:bg-[#ffce00] transition-colors">
                Subscribe <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                MARVELS
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ffd60a] -mt-0.5">fashion</p>
            </Link>
            <p className="mt-4 text-xs leading-5 text-gray-500 max-w-[220px]">
              India&apos;s trendiest fashion brand. Bold styles, unbeatable prices, and fashion that speaks for itself.
            </p>
            {/* Socials */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center bg-white/5 text-gray-500 transition-all hover:bg-[#ffd60a] hover:text-[#0d0d0d]"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-[#ffd60a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
              Help
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-[#ffd60a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-[#ffd60a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-white mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail size={13} className="mt-0.5 text-[#ffd60a] flex-shrink-0" />
                <span className="text-xs hover:text-[#ffd60a] transition-colors cursor-pointer">support@marvels.fashion</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={13} className="mt-0.5 text-[#ffd60a] flex-shrink-0" />
                <span className="text-xs">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 text-[#ffd60a] flex-shrink-0" />
                <span className="text-xs leading-4">Mumbai, Maharashtra, India</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-2">We Accept</p>
              <div className="flex gap-2">
                {["Visa", "MC", "UPI", "RuPay"].map((m) => (
                  <span key={m} className="bg-white/5 border border-white/10 px-2 py-1 text-[8px] font-bold text-gray-500 uppercase tracking-wider">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
            © {new Date().getFullYear()} MARVELS Fashion. Made with <Heart size={10} className="text-red-500" fill="currentColor" /> in India
          </p>
          <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-gray-600">
            <span>100% Secure Payments</span>
            <span className="h-3 w-px bg-gray-800" />
            <span>Free Shipping ₹499+</span>
            <span className="h-3 w-px bg-gray-800" />
            <span>15-Day Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
