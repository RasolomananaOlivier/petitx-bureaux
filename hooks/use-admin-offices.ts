"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminOffices } from "@/lib/api/admin-offices";
import type { AdminOfficeFilters } from "@/lib/types";
import type { PaginatedOfficesResponse } from "@/features/offices/types";

interface UseAdminOfficesParams extends AdminOfficeFilters {
  enabled?: boolean;
}

export function useAdminOffices(params: UseAdminOfficesParams = {}) {
  const { enabled = true, ...filters } = params;

  const query = useQuery<PaginatedOfficesResponse>({
    queryKey: ["admin-offices", filters],
    queryFn: () => getAdminOffices(filters),
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return query;
}
