import { Metadata } from 'next';
import { ClientProvider } from '../../../clientProvider';
import { Suspense } from 'react';
import NewProductsClient from './NewProductsClient';
import { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Products | Codart Shop',
  description:
    'Browse all products available at Codart Shop with fast delivery.',
  openGraph: {
    title: 'Products | Codart Shop',
    description:
      'Browse all products available at Codart Shop with fast delivery.',
    images: ['/images/products-og.webp'],
  },
};

export default async function NewProducts({
  newProducts,
}: {
  newProducts: Product[];
}) {
  const products = newProducts;
  return (
    <div className="px-3 py-0 w-full sm:max-w-[76%] mx-auto mb-20">
      <h1 className="text-4xl font-mono font-semibold">New Products</h1>
      <br />
      <br />
      <Suspense fallback={<div>Loading...</div>}>
        <ClientProvider>
          <NewProductsClient initialProducts={products} />
        </ClientProvider>
      </Suspense>
    </div>
  );
}
