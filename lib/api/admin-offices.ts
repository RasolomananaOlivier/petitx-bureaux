import type { AdminOfficeFilters } from "@/lib/types";
import type {
  PaginatedOfficesResponse,
  OfficeWithRelations,
} from "@/features/offices/types";
import { api } from "./axios";
import type { Office } from "@/lib/store/office-store";

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

export async function duplicateAdminOffice(
  id: number
): Promise<OfficeWithRelations> {
  const response = await api.post(`/api/admin/offices/${id}/duplicate`);
  return response.data.office;
}

export async function getAdminOffice(id: number): Promise<OfficeWithRelations> {
  const response = await api.get(`/api/admin/offices/${id}`);
  return response.data;
}

export async function updateAdminOffice(
  id: number,
  data: Office
): Promise<OfficeWithRelations> {
  const response = await api.put(`/api/admin/offices/${id}`, data);
  return response.data;
}

export interface BulkImportOffice {
  title: string;
  description?: string;
  slug: string;
  arr: number;
  priceCents: number;
  nbPosts?: number;
  lat: number;
  lng: number;
  isFake?: boolean;
  amenities?: string[];
}

export interface BulkImportResponse {
  success: boolean;
  message: string;
  results: {
    total: number;
    created: number;
    skipped: number;
    errors: Array<{ row: number; error: string }>;
  };
}

export async function bulkImportOffices(
  offices: BulkImportOffice[]
): Promise<BulkImportResponse> {
  const response = await api.post("/api/admin/offices/bulk-import", {
    offices,
  });
  return response.data;
}
