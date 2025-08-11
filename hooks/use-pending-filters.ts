"use client";

import { useState, useCallback } from "react";

export interface PendingFilters {
  page: number;
  limit: number;
  arr: number | null;
  minPosts: number | null;
  maxPosts: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  services: number[] | null;
  sortBy: string;
  sortOrder: string;
  search: string | null;
  location: string[] | null;
  officeTypes: string[] | null;
  showCombinations: string | null;
}

export function usePendingFilters(initialFilters: PendingFilters) {
  const [pendingFilters, setPendingFilters] =
    useState<PendingFilters>(initialFilters);

  const updatePendingFilters = useCallback(
    (updates: Partial<PendingFilters>) => {
      setPendingFilters((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetPendingFilters = useCallback(() => {
    setPendingFilters({
      page: 1,
      limit: 12,
      arr: null,
      minPosts: null,
      maxPosts: null,
      minPrice: null,
      maxPrice: null,
      services: null,
      sortBy: "created_at",
      sortOrder: "desc",
      search: null,
      location: null,
      officeTypes: null,
      showCombinations: null,
    });
  }, []);

  return {
    pendingFilters,
    updatePendingFilters,
    resetPendingFilters,
  };
}
