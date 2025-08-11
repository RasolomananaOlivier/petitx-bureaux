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
    limit: 12,
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
      const data = await getOffices(params);
      setOffices(data.offices);
      setPagination(data.pagination);
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
