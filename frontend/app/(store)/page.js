import Link from "next/link";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      {/* ========== Hero Section ========== */}
      <section className="bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500 px-4 py-20 text-center sm:py-28">
        <h1 className="text-4xl font-extrabold leading-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          Affordable Kids Fashion
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          Trendy, comfy & durable clothing for boys and girls — made for Indian families.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-rose-600 shadow-lg transition-transform hover:scale-105"
        >
          Shop Now
        </Link>
      </section>

      {/* ========== Latest Arrivals ========== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Latest Arrivals
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No products available yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
