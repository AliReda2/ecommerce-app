"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProductsByTag } from "@/lib/features/productSlice";
import { Product } from "@/lib/types";
import ProductCardSkeleton from "../ProductCardSkeleton";
import TrendingProductCard from "./TrendingProductCard";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function TrendingProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const dispatch = useAppDispatch();
  const { productsByTag, isLoading } = useAppSelector((s) => s.product);

  // Fetch products only if not available
  useEffect(() => {
    if (!productsByTag || productsByTag.length === 0) {
      dispatch(fetchProductsByTag("TRENDING"));
    }
  }, [dispatch, productsByTag]);

  const items = useMemo(
    () => (isLoading ? initialProducts : productsByTag),
    [isLoading, initialProducts, productsByTag]
  );

  const skeletonCount = initialProducts?.length || 8;

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading
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
