"use client";

import Navbar from "@/components/Navbar";

export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
