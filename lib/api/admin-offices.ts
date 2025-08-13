import type { AdminOfficeFilters } from "@/lib/types";
import type { PaginatedOfficesResponse } from "@/features/offices/types";
import { api } from "./axios";

export async function getAdminOffices(
  filters: AdminOfficeFilters = {}
): Promise<PaginatedOfficesResponse> {
  const searchParams = new URLSearchParams();

  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());
  if (filters.search) searchParams.set("search", filters.search);
  if (filters.sortBy) searchParams.set("sortBy", filters.sortBy);
  if (filters.sortOrder) searchParams.set("sortOrder", filters.sortOrder);

  const response = await api.get(`/api/admin/offices?${searchParams}`);

  return response.data;
}

export async function deleteAdminOffice(id: number): Promise<void> {
  const response = await api.delete(`/api/admin/offices/${id}`);

  return response.data;
}
