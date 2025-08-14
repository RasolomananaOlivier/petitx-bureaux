import { api } from "./axios";

export interface AdminLeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "contacted" | "converted" | "rejected";
  sortBy?: "createdAt" | "updatedAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

export interface AdminLead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "contacted" | "converted" | "rejected";
  officeId: number;
  emailVerifiedAt?: string;
  emailVerificationToken?: string;
  createdAt: string;
  updatedAt: string;
  office?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface AdminLeadsResponse {
  leads: AdminLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const adminLeadsApi = {
  getLeads: async (
    filters: AdminLeadFilters = {}
  ): Promise<AdminLeadsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await api.get(`/api/admin/leads?${params.toString()}`);
    return response.data;
  },

  updateLeadStatus: async (
    leadId: number,
    status: AdminLead["status"]
  ): Promise<{ success: boolean; lead: AdminLead }> => {
    const response = await api.patch(`/api/admin/leads?id=${leadId}`, {
      status,
    });
    return response.data;
  },
};
