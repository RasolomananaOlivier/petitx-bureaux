"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface LocationFilterProps {
  value: string[] | null;
  onChange: (value: string[] | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function LocationFilter({
  value,
  onChange,
  onClear,
  onApply,
}: LocationFilterProps) {
  const locations = [
    { id: "paris", label: "Paris" },
    { id: "lyon", label: "Lyon" },
    { id: "marseille", label: "Marseille" },
  ];

  const handleLocationChange = (locationId: string, checked: boolean) => {
    const currentLocations = value || [];
    if (checked) {
      onChange([...currentLocations, locationId]);
    } else {
      onChange(currentLocations.filter((id) => id !== locationId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.id} className="flex items-center space-x-3">
            <Checkbox
              id={location.id}
              checked={value?.includes(location.id) || false}
              onCheckedChange={(checked) =>
                handleLocationChange(location.id, checked as boolean)
              }
            />
            <Label htmlFor={location.id}>{location.label}</Label>
          </div>
        ))}
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
