import { Office, Photo } from "@/lib/db/schema";

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
