import { LeadPayload } from "@/app/api/lead/route";
import { api } from "./axios";
import { NewLead } from "../db/schema";

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

export interface CSVExportRequest {
  startDate: string;
  endDate: string;
  status?: "all" | "pending" | "contacted" | "converted" | "rejected";
  email: string;
}

export interface CSVExportResponse {
  success: boolean;
  message: string;
  leadCount?: number;
  downloadUrl?: string;
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

  createLead: async (lead: LeadPayload) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      lead: NewLead;
    }>("/api/lead", lead);
    return response.data;
  },

  exportToCSV: async (
    request: CSVExportRequest
  ): Promise<CSVExportResponse> => {
    const response = await api.post("/api/admin/leads/export", request);
    return response.data;
  },
};
