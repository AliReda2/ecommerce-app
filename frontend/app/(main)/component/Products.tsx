"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";
import { fetchProducts } from "@/lib/features/productSlice";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { setHighlightedProduct } from "@/lib/features/uiSlice";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.product);
  const highlightedProductId = useAppSelector((s) => s.ui.highlightedProductId);

  const productRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [localHighlight, setLocalHighlight] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // when ui.highlightedProductId changes -> scroll + highlight locally
  useEffect(() => {
    if (!highlightedProductId) return;

    const el = productRefs.current[highlightedProductId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // small visible offset: ensure nav doesn't overlap (if needed)
      // window.scrollBy(0, -80);
    }

    setLocalHighlight(highlightedProductId);

    const t = window.setTimeout(() => {
      setLocalHighlight(null);
      dispatch(setHighlightedProduct(null)); // clear central state
    }, 3000);

    return () => window.clearTimeout(t);
  }, [highlightedProductId, dispatch]);

  return (
    <div className="px-3 py-0 w-full sm:max-w-[76%] mx-auto mb-20">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {isLoading ? (
        <div
          className="
    grid gap-4 
    grid-cols-2 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
  "
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div
          className="
    grid gap-4 
    grid-cols-2 
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-4 
  "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              highlight={localHighlight === product.id}
              innerRef={(el) => { productRefs.current[product.id] = el; }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
