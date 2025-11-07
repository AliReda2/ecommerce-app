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
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!selectedCategory) return;
    setFormData({
      name: selectedCategory.name,
      description: selectedCategory.description ?? "",
    });
  }, [selectedCategory]);

  const handleUpdate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);

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
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
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
