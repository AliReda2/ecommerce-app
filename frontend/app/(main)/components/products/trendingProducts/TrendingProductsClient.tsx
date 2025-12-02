'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProductsByTag } from '@/lib/features/productSlice';
import { Product } from '@/lib/types';
import ProductCardSkeleton from '../ProductCardSkeleton';
import TrendingProductCard from './TrendingProductCard';

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function TrendingProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const dispatch = useAppDispatch();
  const { productsByTag, isLoadingByTag } = useAppSelector((s) => s.product);

  const items = productsByTag['TRENDING'] || initialProducts;
  const skeletonCount = initialProducts?.length || 8;

  useEffect(() => {
    if (!productsByTag['TRENDING'] || productsByTag['TRENDING'].length === 0) {
      dispatch(fetchProductsByTag('TRENDING'));
    }
  }, [dispatch, productsByTag]);

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoadingByTag['TRENDING']
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : items.map((product, index) => (
            <TrendingProductCard
              key={`${product.id}-${index}`}
              product={product}
            />
          ))}
    </div>
  );
}
