"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn, useWatch } from "react-hook-form";
import LocationPicker from "@/components/admin/location-picker";
import { Office } from "@/lib/store/office-store";

interface Step1Props {
  form: UseFormReturn<Office>;
}

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD") // Remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export default function Step1({ form }: Step1Props) {
  const titleValue = useWatch({ control: form.control, name: "title" });
  const slugValue = useWatch({ control: form.control, name: "slug" });

  useEffect(() => {
    if (titleValue) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Informations générales
        </CardTitle>
        <CardDescription>
          Renseignez les détails de base du bureau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Localisation</Label>
          <LocationPicker<Office>
            form={form}
            latName="lat"
            lngName="lng"
            titleName="title"
            arrName="arr"
          />
        </div>

        <div>
          <Label htmlFor="title">Nom du bureau *</Label>
          <Input
            id="title"
            placeholder="Open space partagé • coworking"
            {...form.register("title")}
            className={form.formState.errors.title ? "border-red-500" : ""}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Lien personnalisé *</Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="ex : bureau-champs-elysees"
            className={form.formState.errors.slug ? "border-red-500" : ""}
          />
          {form.formState.errors.slug && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.slug.message}
            </p>
          )}

          {slugValue && (
            <p className="text-gray-700 text-sm mt-1">
              Lien du site : {`${process.env.NEXT_PUBLIC_API_URL}/${slugValue}`}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            rows={4}
            className={
              form.formState.errors.description ? "border-red-500" : ""
            }
            placeholder="Décrivez le bureau, son environnement, ses points forts..."
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="arr">Arrondissement *</Label>
          <Input
            id="arr"
            type="number"
            min="1"
            max="20"
            {...form.register("arr", { valueAsNumber: true })}
            className={form.formState.errors.arr ? "border-red-500" : ""}
          />
          {form.formState.errors.arr && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.arr.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
