import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MARVELS Fashion — India's Trendiest Clothing Brand",
  description:
    "Shop the latest trends in men's, women's & kids fashion at MARVELS. Premium quality, bold designs & unbeatable prices. Free shipping on orders above ₹499.",
  keywords: "fashion, clothing, men fashion, women fashion, kids fashion, trending clothes, MARVELS, online shopping India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#f5f5f5] text-[#0d0d0d]`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
