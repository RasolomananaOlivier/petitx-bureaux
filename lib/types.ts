import { type Office as DbOffice } from "@/lib/db/schema";

export type Office = DbOffice;

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  officeId: number;
  office?: Office;
  status: "pending" | "contacted" | "converted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalVisits: number;
  totalLeads: number;
  conversionRate: number;
  topOffices: Array<{
    office: Office;
    views: number;
    leads: number;
  }>;
  recentActivity: Array<{
    type: "visit" | "lead" | "conversion";
    office?: Office;
    timestamp: Date;
  }>;
}

export interface AdminOfficeFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "title" | "createdAt" | "updatedAt" | "priceCents";
  sortOrder?: "asc" | "desc";
}

export type Coordinates = { lat: number; lng: number };
