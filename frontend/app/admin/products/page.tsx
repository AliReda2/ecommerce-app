"use client";

import { fetchAllProducts } from "@/lib/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // <-- adjust path if needed

export default function Product() {
  const dispatch = useAppDispatch();
  const { isLoading, error, products } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <table className="w-full border-collapse">
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td>
                <Skeleton className="h-6 w-32" />
              </td>
              <td>
                <Skeleton className="h-6 w-24" />
              </td>
              <td>
                <Skeleton className="h-6 w-48" />
              </td>
              <td>
                <Skeleton className="h-6 w-24" />
              </td>
              <td>
                <Skeleton className="h-6 w-16" />
              </td>
              <td>
                <Skeleton className="h-6 w-16" />
              </td>
              <td>
                <Skeleton className="h-6 w-32" />
              </td>
              <td>
                <Skeleton className="h-6 w-32" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Display message only if loading = false and products list is empty
  if (!isLoading && products.length === 0) {
    return "NO Products To Display";
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <th>name</th>
        <th>category</th>
        <th>description</th>
        <th>imageUrl</th>
        <th>price</th>
        <th>stock</th>
        <th>createdAt</th>
        <th>updatedAt</th>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>{product.description}</td>
            <td>{product.imageUrl}</td>
            <td>{product.price}</td>
            <td>{product.stock}</td>
            <td>{new Date(product.updatedAt).toLocaleString()}</td>
            <td>{new Date(product.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
