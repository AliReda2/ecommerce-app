'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProductsByTag } from '@/lib/features/productSlice';
import { Product } from '@/lib/types';
import ProductCardSkeleton from '../ProductCardSkeleton';
import NewProductCard from './NewProductCard';

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function NewProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const dispatch = useAppDispatch();
  const { productsByTag, isLoadingByTag } = useAppSelector((s) => s.product);

  const items = productsByTag['NEW'] || initialProducts;
  const skeletonCount = initialProducts?.length || 8;

  useEffect(() => {
    if (!productsByTag['NEW'] || productsByTag['NEW'].length === 0) {
      dispatch(fetchProductsByTag('NEW'));
    }
  }, [dispatch, productsByTag]);

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoadingByTag['NEW']
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : items.map((product, index) => (
            <NewProductCard key={`${product.id}-${index}`} product={product} />
          ))}
    </div>
  );
}
