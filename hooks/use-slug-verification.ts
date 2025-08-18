import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";

interface SlugVerificationResult {
  available: boolean;
  existingOffice?: {
    id: number;
    slug: string;
    title: string;
  };
  suggestions: string[];
}

interface UseSlugVerificationProps {
  slug: string;
  officeId?: number;
  enabled?: boolean;
}

export function useSlugVerification({
  slug,
  officeId,
  enabled = true,
}: UseSlugVerificationProps) {
  const [result, setResult] = useState<SlugVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSlug] = useDebounce(slug, 500);

  const verifySlug = useCallback(
    async (slugToVerify: string) => {
      if (!slugToVerify.trim() || !enabled) {
        setResult(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin/offices/verify-slug", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: slugToVerify,
            officeId,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la vérification");
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [officeId, enabled]
  );

  useEffect(() => {
    verifySlug(debouncedSlug);
  }, [debouncedSlug, verifySlug]);

  return {
    result,
    isLoading,
    error,
    verifySlug,
  };
}
