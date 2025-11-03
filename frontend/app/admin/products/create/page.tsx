"use client";

import { createProduct } from "@/lib/features/productSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";

const CreateProduct = () => {
  const dispatch = useAppDispatch();

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
  return (
    <>
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
};

export default CreateProduct;
