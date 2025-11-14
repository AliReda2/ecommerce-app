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
import { createCategory } from "@/lib/features/categorySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
  });

  const handleCreate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    if (formData.image) form.append("image", formData.image);

    dispatch(createCategory(form));
    toast.success("Category created succesfuly");
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

export default CreateCategory;
