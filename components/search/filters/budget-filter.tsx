"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

interface BudgetFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (value: number | null) => void;
  onMaxPriceChange: (value: number | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function BudgetFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
  onApply,
}: BudgetFilterProps) {
  const handleSliderChange = (value: number[]) => {
    onMinPriceChange(value[0] || null);
    onMaxPriceChange(value[1] || null);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMinPriceChange(value ? parseInt(value, 10) : null);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMaxPriceChange(value ? parseInt(value, 10) : null);
  };

  const sliderValue = [minPrice || 0, maxPrice || 100000];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={100000}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>100,000+</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Min</Label>
          <Input
            type="number"
            placeholder="0 € HT/mois"
            value={minPrice || ""}
            onChange={handleMinChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Max</Label>
          <Input
            type="number"
            placeholder="100 000+ € HT/mois"
            value={maxPrice || ""}
            onChange={handleMaxChange}
          />
        </div>
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
