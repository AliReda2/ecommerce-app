"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ProductCard from "./ProductCard";
import { fetchProducts } from "@/lib/features/productSlice";
import ProductCardSkeleton from "./ProductCardSkeleton";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.product);

  // Initial fetch of all products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
