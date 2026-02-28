import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white">Marvel Kids</h3>
            <p className="mt-2 text-sm leading-6">
              Affordable, stylish kids fashion for every occasion. Made in India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white">Shop All</Link>
              </li>
              <li>
                <Link href="/shop?category=Boys" className="hover:text-white">Boys</Link>
              </li>
              <li>
                <Link href="/shop?category=Girls" className="hover:text-white">Girls</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>support@marvelkids.in</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Marvel Kids & Sports Wear. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
