import { cacheLife } from "next/cache";
import ProductsClient from "./ProductsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Codart Shop",
  description:
    "Browse all products available at Codart Shop with fast delivery.",
  openGraph: {
    title: "Products | Codart Shop",
    description:
      "Browse all products available at Codart Shop with fast delivery.",
    images: ["/images/products-og.png"],
  },
};

export default async function Products() {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
    cache: "no-store",
  });

  const payload = await res.json();
  const products = payload.data;

  return (
    <div className="px-3 py-0 w-full sm:max-w-[76%] mx-auto mb-20">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <ProductsClient initialProducts={products} />
    </div>
  );
}
