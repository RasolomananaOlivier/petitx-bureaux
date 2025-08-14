import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { adminLeadsApi, type AdminLeadFilters } from "@/lib/api/admin-leads";

interface UseAdminLeadsParams extends AdminLeadFilters {
  enabled?: boolean;
}

export function useAdminLeads(params: UseAdminLeadsParams = {}) {
  const { enabled = true, ...filters } = params;

  return useQuery({
    queryKey: ["admin-leads", filters],
    queryFn: () => adminLeadsApi.getLeads(filters),
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: number; status: string }) =>
      adminLeadsApi.updateLeadStatus(leadId, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });
}
