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
import { fetchHeroes, updateHero } from "@/lib/features/heroSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UpdateHero = () => {
  const goBack = useGoBack();

  const params = useParams();
  const heroId = params.id as string;

  const dispatch = useAppDispatch();
  const { heroes, isUpdating } = useAppSelector((state) => state.hero);

  // Fetch heroes and resolve the one being edited
  useEffect(() => {
    dispatch(fetchHeroes());
  }, [dispatch]);

  const hero = heroes.find((h) => h.id === heroId);

  const [formData, setFormData] = useState({
    title: hero?.title ?? "",
    titleColor: hero?.titleColor ?? "",
    subtitle: hero?.subtitle ?? "",
    subtitleColor: hero?.subtitleColor ?? "",
    description: hero?.description ?? "",
    descriptionColor: hero?.descriptionColor ?? "",
    buttonText: hero?.buttonText ?? "",
    buttonColor: hero?.buttonColor ?? "",
    backgroundColor: hero?.backgroundColor ?? "",
    imageAlt: hero?.imageAlt ?? "",
    order: hero?.order ?? 0,
    image: null as File | null,
  });

  const handleUpdate = () => {
    const form = new FormData();

    form.append("title", formData.title);
    form.append("titleColor", formData.titleColor);
    form.append("subtitle", formData.subtitle);
    form.append("subtitleColor", formData.subtitleColor);
    form.append("description", formData.description);
    form.append("descriptionColor", formData.descriptionColor);
    form.append("buttonText", formData.buttonText);
    form.append("buttonColor", formData.buttonColor);
    form.append("backgroundColor", formData.backgroundColor);
    form.append("imageAlt", formData.imageAlt);
    form.append("order", String(formData.order));

    if (formData.image) form.append("image", formData.image);

    dispatch(updateHero({ heroId, formData: form }))
      .unwrap()
      .then(() => {
        toast.success("hero updated");
      })
      .catch((error) => toast.error(error));
  };

  if (!hero) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
      <Button variant="outline" onClick={goBack}>
        Back
      </Button>

      <FieldSet>
        <FieldLegend className="text-center">Hero Section</FieldLegend>
        <FieldDescription className="text-center">
          Update Hero Details
        </FieldDescription>

        <FieldGroup>
          {/* Title */}
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Field>

          {/* Title Color */}
          <Field>
            <FieldLabel>Title Color</FieldLabel>
            <Input
              value={formData.titleColor}
              onChange={(e) =>
                setFormData({ ...formData, titleColor: e.target.value })
              }
            />
          </Field>

          {/* Subtitle */}
          <Field>
            <FieldLabel>Subtitle</FieldLabel>
            <Input
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
            />
          </Field>

          {/* Subtitle Color */}
          <Field>
            <FieldLabel>Subtitle Color</FieldLabel>
            <Input
              value={formData.subtitleColor}
              onChange={(e) =>
                setFormData({ ...formData, subtitleColor: e.target.value })
              }
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Field>

          {/* Description Color */}
          <Field>
            <FieldLabel>Description Color</FieldLabel>
            <Input
              value={formData.descriptionColor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descriptionColor: e.target.value,
                })
              }
            />
          </Field>

          {/* Button Text */}
          <Field>
            <FieldLabel>Button Text</FieldLabel>
            <Input
              value={formData.buttonText}
              onChange={(e) =>
                setFormData({ ...formData, buttonText: e.target.value })
              }
            />
          </Field>

          {/* Button Color */}
          <Field>
            <FieldLabel>Button Color</FieldLabel>
            <Input
              value={formData.buttonColor}
              onChange={(e) =>
                setFormData({ ...formData, buttonColor: e.target.value })
              }
            />
          </Field>

          {/* Background Color */}
          <Field>
            <FieldLabel>Background Color</FieldLabel>
            <Input
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData({ ...formData, backgroundColor: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel>Image Alt</FieldLabel>
            <Input
              value={formData.imageAlt}
              onChange={(e) =>
                setFormData({ ...formData, imageAlt: e.target.value })
              }
            />
          </Field>

          <Field>
            <FieldLabel>Order</FieldLabel>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: +e.target.value })
              }
            />
          </Field>

          {/* Image Upload */}
          <Field>
            <FieldLabel>Image</FieldLabel>
            <Input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] || null,
                })
              }
            />

            {hero.imageUrl && (
              <Image
                src={hero.imageUrl}
                alt={hero.imageAlt}
                width={800}
                height={800}
                className="rounded-md mt-2"
              />
            )}
          </Field>
        </FieldGroup>

        <Button disabled={isUpdating} onClick={handleUpdate}>
          {isUpdating ? "Updating..." : "Update Hero"}
        </Button>
      </FieldSet>
    </>
  );
};

export default UpdateHero;
