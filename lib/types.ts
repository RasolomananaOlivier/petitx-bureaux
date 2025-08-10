import { type Office as DbOffice, type Photo } from "@/lib/db/schema";

export type Office = DbOffice;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  officeId: string;
  office?: Office;
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  source: string;
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

export interface OfficeFilters {
  arr?: number;
  minPosts?: number;
  maxPosts?: number;
  minPrice?: number;
  maxPrice?: number;
  services?: number[];
  page?: number;
  limit?: number;
}

export interface OfficeWithRelations extends Office {
  photos: Photo[];
  officeServices: {
    id: number;
    officeId: number;
    serviceId: number;
    createdAt: string;
    service: {
      id: number;
      name: string;
      icon: string | null;
      createdAt: string;
    };
  }[];
}

export interface PaginatedOfficesResponse {
  offices: OfficeWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
