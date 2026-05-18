import { Suspense } from "react";
import ShopClient from "./ShopClient";

// Server-side fetch with 60-second revalidation cache
async function getProducts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://marvel-kids-api.onrender.com";
    const res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 60 }, // cache for 60 seconds, auto-revalidate
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen"
          style={{ background: "linear-gradient(160deg, #fce7f3 0%, #ecfdf5 100%)" }}
        />
      }
    >
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}
