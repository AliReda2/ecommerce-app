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
import { createHero } from "@/lib/features/heroSlice";
import { AppDispatch, RootState } from "@/lib/store";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CreateHero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating } = useSelector((state: RootState) => state.hero);

  const [formData, setFormData] = useState({
    title: "",
    titleColor: "",
    subtitle: "",
    subtitleColor: "",
    description: "",
    descriptionColor: "",
    buttonText: "",
    buttonColor: "",
    imageAlt: "",
    backgroundColor: "",
    order: 0,
    image: null as File | null,
  });

  const handleCreate = () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("titleColor", formData.titleColor);
    form.append("subtitle", formData.subtitle);
    form.append("subtitleColor", formData.subtitleColor);
    form.append("description", formData.description);
    form.append("descriptionColor", formData.descriptionColor);
    form.append("buttonText", formData.buttonText);
    form.append("buttonColor", formData.buttonColor);
    form.append("imageAlt", formData.imageAlt);
    form.append("backgroundColor", formData.backgroundColor);
    form.append("order", String(formData.order));
    if (formData.image) form.append("image", formData.image);

    dispatch(createHero(form))
      .unwrap()
      .then(() => toast.success("Hero created successfully"))
      .catch((error) => toast.error(error));
  };

  return (
    <FieldSet>
      <FieldLegend>Create Hero</FieldLegend>
      <FieldDescription>Fill hero section details</FieldDescription>

      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Title Color</FieldLabel>
          <Input
            value={formData.titleColor}
            onChange={(e) =>
              setFormData({ ...formData, titleColor: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Subtitle</FieldLabel>
          <Input
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Subtitle Color</FieldLabel>
          <Input
            value={formData.subtitleColor}
            onChange={(e) =>
              setFormData({ ...formData, subtitleColor: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Description Color</FieldLabel>
          <Input
            value={formData.descriptionColor}
            onChange={(e) =>
              setFormData({ ...formData, descriptionColor: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Button Text</FieldLabel>
          <Input
            value={formData.buttonText}
            onChange={(e) =>
              setFormData({ ...formData, buttonText: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Button Color</FieldLabel>
          <Input
            value={formData.buttonColor}
            onChange={(e) =>
              setFormData({ ...formData, buttonColor: e.target.value })
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
          <FieldLabel>Background Color</FieldLabel>
          <Input
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData({ ...formData, backgroundColor: e.target.value })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Order</FieldLabel>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: Number(e.target.value) })
            }
          />
        </Field>

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
        </Field>
      </FieldGroup>

      <Button disabled={isCreating} onClick={handleCreate}>
        {isCreating ? "Creating..." : "Create"}
      </Button>
    </FieldSet>
  );
};

export default CreateHero;
