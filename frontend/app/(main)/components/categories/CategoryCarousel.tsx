import { cacheLife } from "next/cache";
import CategoryCarouselClient from "./CategoryCarouselClient";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Codart Shop",
  description: "Browse all product categories available at Codart Shop.",
  keywords: ["categories", "products", "shop", "online store"],
  openGraph: {
    title: "Categories | Codart Shop",
    description: "Browse all product categories available at Codart Shop.",
    images: ["/images/categories-og.png"],
  },
};

export default async function CategoryCarousel() {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${process.env.BACKEND_URL}/category`, {
    cache: "no-store",
  });

  const payload = await res.json();

  const categories = payload.data;

  return (
    <div className="max-w-[76%] mb-20">
      <h1 className="text-4xl font-mono font-semibold">Categories</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryCarouselClient categories={categories} />
      </Suspense>{" "}
    </div>
  );
}
