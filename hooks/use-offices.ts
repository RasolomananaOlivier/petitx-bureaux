"use client";

import { useState, useEffect, useCallback } from "react";
import { getOffices, GetOfficesParams } from "@/lib/api/offices";
import { OfficeWithRelations } from "@/features/offices/types";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UseOfficesResult {
  offices: OfficeWithRelations[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  refetch: (params: GetOfficesParams) => void;
}

export function useOffices(): UseOfficesResult {
  const [offices, setOffices] = useState<OfficeWithRelations[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffices = useCallback(async (params: GetOfficesParams) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();

      if (params.arr) searchParams.append("arr", params.arr.toString());
      if (params.minPosts)
        searchParams.append("minPosts", params.minPosts.toString());
      if (params.maxPosts)
        searchParams.append("maxPosts", params.maxPosts.toString());
      if (params.minPrice)
        searchParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice)
        searchParams.append("maxPrice", params.maxPrice.toString());
      if (params.services?.length)
        searchParams.append("services", params.services.join(","));
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const response = await getOffices(searchParams);

      setOffices(response.offices);
      setPagination({
        ...response.pagination,
        hasNext: response.pagination.page < response.pagination.totalPages,
        hasPrev: response.pagination.page > 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    offices,
    pagination,
    loading,
    error,
    refetch: fetchOffices,
  };
}
