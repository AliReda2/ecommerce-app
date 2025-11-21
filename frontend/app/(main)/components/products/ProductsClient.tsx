"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { fetchProducts } from "@/lib/features/productSlice";
import { setHighlightedProduct } from "@/lib/features/uiSlice";
import { Product } from "@/lib/types";

// Add the custom hook here, before the ProductsClient component
const useSmoothScroll = () => {
  const smoothScrollTo = (targetPosition: number, duration: number = 800) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smoothness
      const easeInOut =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOut);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return smoothScrollTo;
};

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
  const [isScrolling, setIsScrolling] = useState(false);

  // Initialize the custom hook
  const smoothScrollTo = useSmoothScroll();

  // Fetch products only if not available
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    const scrollToHighlightedProduct = () => {
      if (!highlightedProductId) return;

      const productElement = productRefs.current[highlightedProductId];

      if (productElement) {
        setIsScrolling(true);

        const navbarHeight = 104;
        const elementRect = productElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const scrollPosition = absoluteElementTop - navbarHeight;

        console.log("Scrolling to:", scrollPosition);

        // Use the custom smooth scroll instead of window.scrollTo
        smoothScrollTo(scrollPosition, 1000);

        // Clear highlight after scroll completes
        setTimeout(() => {
          setIsScrolling(false);
          setTimeout(() => {
            dispatch(setHighlightedProduct(null));
          }, 2000);
        }, 1200);
      }
    };

    scrollToHighlightedProduct();
  }, [highlightedProductId, dispatch, smoothScrollTo]);

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
              highlight={highlightedProductId === product.id && !isScrolling}
              innerRef={(el) => {
                productRefs.current[String(product.id)] = el;
              }}
            />
          ))}
    </div>
  );
}
