import { Suspense } from "react";
import { ClientProvider } from "./clientProvider";
import CategoryCarousel from "./components/categories/CategoryCarousel";
import Hero from "./components/hero/Hero";
import Products from "./components/products/Products";
import HeroSkeleton from "./components/hero/HeroSkeleton";

const page = () => {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <ClientProvider>
          <Hero />
        </ClientProvider>
      </Suspense>
      <div className="w-full flex flex-col items-center justify-center pt-20 bg-white mx-auto">
        <CategoryCarousel />
        <Products />
      </div>
    </>
  );
};

export default page;
