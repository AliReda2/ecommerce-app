"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { fetchProducts } from "@/lib/features/productSlice";
import { setHighlightedProduct } from "@/lib/features/uiSlice";
import { Product } from "@/lib/types";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((s) => s.product);
  const highlightedProductId = useAppSelector((s) => s.ui.highlightedProductId);

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch products only if not available
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  // Scroll to highlighted product
  useEffect(() => {
    if (!highlightedProductId) return;

    const el = productRefs.current[highlightedProductId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = setTimeout(() => {
      dispatch(setHighlightedProduct(null));
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedProductId, dispatch]);

  const items = useMemo(
    () => (isLoading ? initialProducts : products),
    [isLoading, initialProducts, products]
  );

  const skeletonCount = initialProducts?.length || 8;

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              highlight={highlightedProductId === product.id}
              innerRef={(el) => {
                productRefs.current[product.id] = el;
              }}
            />
          ))}
    </div>
  );
}
