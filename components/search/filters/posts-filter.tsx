"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface PostsFilterProps {
  minPosts: number | null;
  maxPosts: number | null;
  onMinPostsChange: (value: number | null) => void;
  onMaxPostsChange: (value: number | null) => void;
  onClear: () => void;
  onApply: () => void;
}

export function PostsFilter({
  minPosts,
  maxPosts,
  onMinPostsChange,
  onMaxPostsChange,
  onClear,
  onApply,
}: PostsFilterProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMinPostsChange(value ? parseInt(value, 10) : null);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMaxPostsChange(value ? parseInt(value, 10) : null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Min</Label>
          <Input
            type="number"
            placeholder="1 postes"
            value={minPosts || ""}
            onChange={handleMinChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Max</Label>
          <Input
            type="number"
            placeholder="500+ postes"
            value={maxPosts || ""}
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
