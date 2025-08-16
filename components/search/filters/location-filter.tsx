"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

interface LocationFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function LocationFilter({
  value,
  onChange,
  onClear,
  onApply,
}: LocationFilterProps) {
  const arrondissements = [
    { id: 1, label: "1er arrondissement" },
    { id: 2, label: "2e arrondissement" },
    { id: 3, label: "3e arrondissement" },
    { id: 4, label: "4e arrondissement" },
    { id: 5, label: "5e arrondissement" },
    { id: 6, label: "6e arrondissement" },
    { id: 7, label: "7e arrondissement" },
    { id: 8, label: "8e arrondissement" },
    { id: 9, label: "9e arrondissement" },
    { id: 10, label: "10e arrondissement" },
    { id: 11, label: "11e arrondissement" },
    { id: 12, label: "12e arrondissement" },
    { id: 13, label: "13e arrondissement" },
    { id: 14, label: "14e arrondissement" },
    { id: 15, label: "15e arrondissement" },
    { id: 16, label: "16e arrondissement" },
    { id: 17, label: "17e arrondissement" },
    { id: 18, label: "18e arrondissement" },
    { id: 19, label: "19e arrondissement" },
    { id: 20, label: "20e arrondissement" },
  ];

  const handleArrondissementChange = (arrondissementId: string) => {
    onChange(arrondissementId ? parseInt(arrondissementId) : null);
  };

  return (
    <div className="space-y-4">
      <Select
        value={value?.toString() || ""}
        onValueChange={handleArrondissementChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un arrondissement" />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {arrondissements.map((arrondissement) => (
            <SelectItem
              key={arrondissement.id}
              value={arrondissement.id.toString()}
            >
              {arrondissement.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button onClick={onApply} className="bg-blue-600 hover:bg-blue-700">
          Appliquer
        </Button>
      </div>
    </div>
  );
}
