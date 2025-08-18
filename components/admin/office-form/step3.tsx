"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, X } from "lucide-react";
import { useOfficeFormStore } from "@/lib/store/office-store";

// Step 3: Amenities
interface Step3Props {
  form: any;
}

export default function Step3({ form }: Step3Props) {
  const { formData, updateFormData } = useOfficeFormStore();
  const [newAmenity, setNewAmenity] = useState<string>("");

  const addAmenity = (): void => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      const updatedAmenities = [...formData.amenities, newAmenity.trim()];
      updateFormData({ amenities: updatedAmenities });
      form.setValue("amenities", updatedAmenities);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string): void => {
    const updatedAmenities = formData.amenities.filter((a) => a !== amenity);
    updateFormData({ amenities: updatedAmenities });
    form.setValue("amenities", updatedAmenities);
  };

  const toggleAmenity = (amenity: string): void => {
    if (formData.amenities.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      const updatedAmenities = [...formData.amenities, amenity];
      updateFormData({ amenities: updatedAmenities });
      form.setValue("amenities", updatedAmenities);
    }
  };

  const commonAmenities: string[] = [
    "Salle de réunion privée",
    "Wifi",
    "Câblage RJ45",
    "Fibre",
    "Coin cafet'",
    "Espace d'attente",
    "Espace détente",
    "Ménage",
    "Tables / chaises",
    "Écran TV",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Équipements et services
        </CardTitle>
        <CardDescription>
          Ajoutez les équipements disponibles dans ce bureau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col gap-3">
          <Label className="font-semibold">Équipements courants</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonAmenities.map((amenity) => (
              <Button
                key={amenity}
                type="button"
                variant={
                  formData.amenities.includes(amenity) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleAmenity(amenity)}
                className="justify-start text-sm"
              >
                {amenity}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">
            Ajouter un équipement personnalisé
          </Label>
          <div className="flex space-x-2 mt-2">
            <Input
              placeholder="Nom de l'équipement..."
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addAmenity())
              }
            />
            <Button type="button" onClick={addAmenity}>
              Ajouter
            </Button>
          </div>
        </div>

        {formData.amenities.length > 0 && (
          <div>
            <Label className="font-semibold">
              Équipements sélectionnés ({formData.amenities.length})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="px-3 py-1">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {form.formState.errors.amenities && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.amenities.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
