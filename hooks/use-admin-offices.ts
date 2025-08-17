"use client";

import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAdminOffices,
  getAdminOffice,
  updateAdminOffice,
} from "@/lib/api/admin-offices";
import type {
  PaginatedOfficesResponse,
  OfficeWithRelations,
} from "@/features/offices/types";
import type { Office } from "@/lib/store/office-store";
import { AdminOfficeFilters } from "@/types/types";

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

export function useAdminOffice(id: number) {
  return useQuery({
    queryKey: ["admin-office", id],
    queryFn: () => getAdminOffice(id),
    enabled: !!id,
  });
}

export function useUpdateAdminOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Office }) =>
      updateAdminOffice(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-offices"] });
      queryClient.invalidateQueries({ queryKey: ["admin-office", id] });
    },
  });
}
