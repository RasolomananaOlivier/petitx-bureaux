"use client";

import React from "react";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSlugVerification } from "@/hooks/use-slug-verification";

interface SlugVerificationProps {
  slug: string;
  officeId?: number;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function SlugVerification({
  slug,
  officeId,
  onSuggestionClick,
  className,
}: SlugVerificationProps) {
  const { result, isLoading, error } = useSlugVerification({
    slug,
    officeId,
    enabled: slug.length > 0,
  });

  if (!slug) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Vérification du lien...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-red-600",
          className
        )}
      >
        <AlertCircle className="w-4 h-4" />
        <span>Erreur de vérification</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.available) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm text-green-600",
          className
        )}
      >
        <CheckCircle className="w-4 h-4" />
        <span>Lien disponible</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-red-600">
        <XCircle className="w-4 h-4" />
        <span>Lien déjà utilisé</span>
      </div>

      {result.existingOffice && (
        <div className="text-xs text-gray-600">
          Utilisé par :{" "}
          <span className="font-medium">{result.existingOffice.title}</span>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">Suggestions :</div>
          <div className="flex flex-wrap gap-1">
            {result.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick?.(suggestion)}
                className="h-6 text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
