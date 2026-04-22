"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      {!isHomePage && <Footer />}
    </>
  );
}
