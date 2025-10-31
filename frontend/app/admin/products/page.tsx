"use client";

import { createProduct, fetchAllProducts } from "@/lib/features/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // <-- adjust path if needed
import Link from "next/link";

export default function Product() {
  const dispatch = useAppDispatch();
  const { isLoading, error, products } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData if you want to send image
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    if (imageFile) formData.append("image", imageFile);

    // Dispatch createProduct thunk
    await dispatch(createProduct(formData));

    // Reset form
    setName("");
    setCategory("");
    setDescription("");
    setPrice(0);
    setStock(0);
    setImageFile(null);
  };

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
    return (
      <>
        <h1>NO Products To Display</h1>
        <Link href={"/admin"}>Go Back</Link>
      </>
    );
  }

  return (
    <>
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

      <h2 className="mt-8 text-xl font-bold">Create New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="border p-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Create Product
        </button>
      </form>
    </>
  );
}
