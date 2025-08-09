"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Office } from "@/lib/types";

interface OfficeFormProps {
  office?: Office;
  mode: "create" | "edit";
}

export function OfficeForm({ office, mode }: OfficeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: office?.name || "",
    description: office?.description || "",
    address: office?.address || "",
    arrondissement: office?.arrondissement || 1,
    pricePerDay: office?.pricePerDay || 0,
    pricePerHour: office?.pricePerHour || 0,
    capacity: office?.capacity || 1,
    isActive: office?.isActive ?? true,
    isFake: office?.isFake ?? false,
    amenities: office?.amenities || [],
    photos: office?.photos || [],
  });

  const [newAmenity, setNewAmenity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call would go here
      console.log("Saving office:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/offices");
    } catch (error) {
      console.error("Error saving office:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Détails de base du bureau</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du bureau</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="arrondissement">Arrondissement</Label>
              <Input
                id="arrondissement"
                type="number"
                min="1"
                max="20"
                value={formData.arrondissement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    arrondissement: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prix et capacité</CardTitle>
            <CardDescription>
              Tarification et informations pratiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pricePerDay">Prix par jour (€)</Label>
              <Input
                id="pricePerDay"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerDay: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="pricePerHour">Prix par heure (€)</Label>
              <Input
                id="pricePerHour"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerHour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerHour: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacité (personnes)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Bureau actif</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFake"
                  checked={formData.isFake}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFake: checked })
                  }
                />
                <Label htmlFor="isFake">Bureau factice (test)</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Équipements</CardTitle>
          <CardDescription>Services et équipements disponibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter un équipement..."
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

          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Enregistrement..."
            : mode === "create"
            ? "Créer le bureau"
            : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}
