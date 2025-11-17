"use client";

import { Button } from "@/components/ui/button";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAllCategories } from "@/lib/features/categorySlice";
import { createProduct } from "@/lib/features/productSlice";
import { AppDispatch, RootState } from "@/lib/store";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CreateProduct = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories } = useSelector((state: RootState) => state.category);
  const { isLoading } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    stock: 0,
    image: null as File | null,
  });

  const handleCreate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("categoryId", formData.categoryId);
    form.append("price", String(formData.price));
    form.append("stock", String(formData.stock));
    if (formData.image) form.append("image", formData.image);

    dispatch(createProduct(form))
      .unwrap()
      .then(() => toast.success("product created succesfuly"))
      .catch((error) => toast.error(error));
  };

  return (
    <FieldSet>
      <FieldLegend>Product</FieldLegend>
      <FieldDescription>Update Product Details</FieldDescription>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Product name</FieldLabel>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Field>

        <Field>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="price">Price</FieldLabel>
          <Input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: +e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
          <Input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: +e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="image">Image</FieldLabel>
          <Input
            type="file"
            id="image"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
          />
        </Field>
      </FieldGroup>

      <Button disabled={isLoading} onClick={handleCreate}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </FieldSet>
  );
};

export default CreateProduct;
