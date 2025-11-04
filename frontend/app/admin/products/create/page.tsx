"use client";

// TODO: Protect this route with admin auth guard (client + server) and sanitize description on the server.

import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import FileInput from "@/components/admin/form/input/FileInput";
import TextArea from "@/components/admin/form/input/TextArea";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/lib/features/productSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const CreateProduct = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // keep as string, parse on submit
  const [stock, setStock] = useState(""); // keep as string, parse on submit
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ids = useMemo(
    () => ({
      name: "name",
      category: "category",
      price: "price",
      stock: "stock",
      description: "description",
      image: "image",
    }),
    []
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!category.trim()) newErrors.category = "Category is required.";

    const priceNum = parseFloat(price);
    if (!price.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a number greater than 0.";
    }

    const stockNum = Number(stock);
    if (
      !stock.trim() ||
      !Number.isFinite(stockNum) ||
      stockNum < 0 ||
      !Number.isInteger(stockNum)
    ) {
      newErrors.stock = "Stock must be an integer greater than or equal to 0.";
    }

    if (imageFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        newErrors.image = "Invalid file type. Use JPG, PNG, WEBP, or GIF.";
      } else if (imageFile.size > MAX_IMAGE_BYTES) {
        newErrors.image = "File size must be 5MB or less.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, category, price, stock, imageFile]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          setErrors((prev) => ({ ...prev, image: "Invalid file type." }));
          setImageFile(null);
          return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setErrors((prev) => ({
            ...prev,
            image: "File size must be 5MB or less.",
          }));
          setImageFile(null);
          return;
        }
      }
      setErrors((prev) => {
        const { image, ...rest } = prev;
        return rest;
      });
      setImageFile(file);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category", category.trim());
    formData.append("description", description);
    formData.append("price", String(priceNum));
    formData.append("stock", String(stockNum));
    if (imageFile) formData.append("image", imageFile);

    setIsSubmitting(true);
    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created", {
        description: `${name} added successfully.`,
      });

      // Reset form
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageFile(null);

      router.push("/admin/products");
    } catch (err: any) {
      const message = err?.message || "Failed to create product.";
      toast.warning("Creation failed", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create New Product" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-wrap gap-2 max-w-md"
      >
        <ComponentCard>
          <div className="space-y-6">
            <div>
              <Label htmlFor={ids.name}>Name</Label>
              <Input
                id={ids.name}
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${ids.name}-error` : undefined}
                required
                disabled={isSubmitting}
              />
              {errors.name && (
                <p
                  id={`${ids.name}-error`}
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={ids.category}>Category</Label>
              <Input
                id={ids.category}
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2"
                aria-invalid={!!errors.category}
                aria-describedby={
                  errors.category ? `${ids.category}-error` : undefined
                }
                required
                disabled={isSubmitting}
              />
              {errors.category && (
                <p
                  id={`${ids.category}-error`}
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={ids.price}>Price</Label>
              <Input
                id={ids.price}
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2"
                min={0.01}
                step={0.01}
                inputMode="decimal"
                aria-invalid={!!errors.price}
                aria-describedby={
                  errors.price ? `${ids.price}-error` : undefined
                }
                required
                disabled={isSubmitting}
              />
              {errors.price && (
                <p
                  id={`${ids.price}-error`}
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={ids.stock}>Stock</Label>
              <Input
                id={ids.stock}
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border p-2"
                min={0}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-invalid={!!errors.stock}
                aria-describedby={
                  errors.stock ? `${ids.stock}-error` : undefined
                }
                required
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p
                  id={`${ids.stock}-error`}
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.stock}
                </p>
              )}
            </div>
          </div>
        </ComponentCard>

        <ComponentCard>
          <div className="space-y-2">
            <Label htmlFor={ids.description}>Description</Label>
            <TextArea
              id={ids.description as any}
              value={description}
              onChange={(value) => setDescription(value)}
              rows={6}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? `${ids.description}-error` : undefined
              }
              disabled={isSubmitting}
            />
            {errors.description && (
              <p
                id={`${ids.description}-error`}
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.description}
              </p>
            )}
          </div>
        </ComponentCard>

        <ComponentCard>
          <div>
            <Label htmlFor={ids.image}>Upload file</Label>
            <FileInput
              id={ids.image as any}
              onChange={handleFileChange}
              className="custom-class"
              accept={ALLOWED_IMAGE_TYPES.join(",") as any}
              disabled={isSubmitting}
            />
            {errors.image && (
              <p
                id={`${ids.image}-error`}
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.image}
              </p>
            )}
          </div>
        </ComponentCard>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </>
  );
};

export default CreateProduct;
