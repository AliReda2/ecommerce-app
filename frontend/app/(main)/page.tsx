import { Suspense } from 'react';
import { ClientProvider } from './clientProvider';
import CategoryCarousel from './components/categories/CategoryCarousel';
import Hero from './components/hero/Hero';
import Products from './components/products/Products';
import HeroSkeleton from './components/hero/HeroSkeleton';
import TrendingProducts from './components/products/trendingProducts/TrendingProducts';
import NewProducts from './components/products/newProducts/NewProducts';
import { cacheLife } from 'next/cache';

const MainPage = async () => {
  'use cache';
  cacheLife('hours');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/products/NEW`,
    { cache: 'no-store' }
  );

  const payload = await res.json();
  const newProducts = payload?.data || [];

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/products/TRENDING`,
    { cache: 'no-store' }
  );

  const payload2 = await res2.json();
  const trendingProducts = payload2?.data || [];

  console.log({ newProducts });
  console.log({ trendingProducts });

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <ClientProvider>
          <Hero />
        </ClientProvider>
      </Suspense>

      <div className="w-full flex flex-col items-center justify-center pt-20 bg-white mx-auto">
        {newProducts.length > 0 && <NewProducts newProducts={newProducts} />}
        {trendingProducts.length > 0 && (
          <TrendingProducts trendingProducts={trendingProducts} />
        )}
        <CategoryCarousel />
        <Products />
      </div>
    </>
  );
};

export default MainPage;
