"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building, Map as MapIcon, RotateCcw } from "lucide-react";

interface TypeFilterProps {
  officeTypes: string[] | null;
  showCombinations: string | null;
  onOfficeTypesChange: (value: string[] | null) => void;
  onShowCombinationsChange: (value: string | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function TypeFilter({
  officeTypes,
  showCombinations,
  onOfficeTypesChange,
  onShowCombinationsChange,
  onClear,
  onApply,
}: TypeFilterProps) {
  const types = [
    {
      id: "independent",
      label: "Espace indépendant",
      icon: Building,
    },
    {
      id: "private",
      label: "Bureau privé pour votre équipe",
      icon: Building,
    },
    {
      id: "shared",
      label: "Open space partagé",
      icon: MapIcon,
    },
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    const currentTypes = officeTypes || [];
    if (checked) {
      onOfficeTypesChange([...currentTypes, typeId]);
    } else {
      onOfficeTypesChange(currentTypes.filter((id) => id !== typeId));
    }
  };

  const handleCombinationsChange = (checked: boolean) => {
    onShowCombinationsChange(checked ? "true" : null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {types.map((type) => (
          <div key={type.id} className="flex items-center space-x-3">
            <Checkbox
              id={type.id}
              checked={officeTypes?.includes(type.id) || false}
              onCheckedChange={(checked) =>
                handleTypeChange(type.id, checked as boolean)
              }
            />
            <Label htmlFor={type.id} className="flex items-center gap-2">
              <type.icon className="h-4 w-4 text-gray-600" />
              {type.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="combinations"
            checked={showCombinations === "true"}
            onCheckedChange={handleCombinationsChange}
          />
          <Label htmlFor="combinations" className="text-sm">
            Voir les combinaisons de bureaux
          </Label>
        </div>
        <p className="text-xs text-gray-500">
          Annonces groupées en 1 résultat unique : votre équipe est répartie
          dans plusieurs bureaux d'un même lieu.
        </p>
      </div>

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
