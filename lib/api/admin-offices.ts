import type { AdminOfficeFilters } from "@/lib/types";
import type { PaginatedOfficesResponse } from "@/features/offices/types";

export async function getAdminOffices(
  filters: AdminOfficeFilters = {}
): Promise<PaginatedOfficesResponse> {
  const searchParams = new URLSearchParams();

  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());
  if (filters.search) searchParams.set("search", filters.search);
  if (filters.sortBy) searchParams.set("sortBy", filters.sortBy);
  if (filters.sortOrder) searchParams.set("sortOrder", filters.sortOrder);

  const response = await fetch(`/api/admin/offices?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch offices: ${response.statusText}`);
  }

  return response.json();
}
