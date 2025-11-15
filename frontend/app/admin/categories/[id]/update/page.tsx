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
import useGoBack from "@/hooks/useGoBack";
import { getCategoryById, updateCategory } from "@/lib/features/categorySlice";
import { AppDispatch, RootState } from "@/lib/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UpdateCategory = () => {
  const goBack = useGoBack();

  const params = useParams();
  const categoryId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { selectedCategory, isLoading } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(getCategoryById(categoryId));
  }, [dispatch, categoryId]);

  const [formData, setFormData] = useState({
    name: selectedCategory?.name ?? "",
    image: null as File | null,
  });

  const handleUpdate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    if (formData.image) form.append("image", formData.image);

    dispatch(updateCategory({ categoryId, categoryData: form }));
  };

  return (
    <>
      <Button variant={"outline"} onClick={goBack}>
        Back
      </Button>

      <FieldSet>
        <FieldLegend>Category</FieldLegend>
        <FieldDescription>Update Category Details</FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Category name</FieldLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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

            {selectedCategory?.imageUrl && (
              <Image
                src={selectedCategory.imageUrl}
                alt="Category Image"
                width={1080}
                height={1080}
                className="rounded-md"
              />
            )}
          </Field>
        </FieldGroup>

        <Button disabled={isLoading} onClick={handleUpdate}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </FieldSet>
    </>
  );
};

export default UpdateCategory;
