import { api } from "./axios";

export interface GetOfficesParams {
  arr?: number;
  minPosts?: number;
  maxPosts?: number;
  minPrice?: number;
  maxPrice?: number;
  services?: number[];
  page?: number;
  limit?: number;
  sortBy?: "price" | "posts" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface Office {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  arr: number;
  priceCents: number;
  nbPosts: number | null;
  lat: number;
  lng: number;
  isFake: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
  officeServices: OfficeService[];
}

export interface Photo {
  id: number;
  officeId: number;
  url: string;
  alt: string | null;
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  icon: string | null;
  createdAt: string;
}

export interface OfficeService {
  id: number;
  officeId: number;
  serviceId: number;
  createdAt: string;
  service: Service;
}

export interface OfficesResponse {
  data: Office[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getOffices(
  searchParams: URLSearchParams
): Promise<OfficesResponse> {
  const response = await api.get(`/api/offices?${searchParams.toString()}`);
  return response.data;
}

export async function getOfficeBySlug(slug: string): Promise<Office> {
  const response = await api.get(`/api/offices/${slug}`);
  return response.data;
}

export async function getSuggestedOffices(slug: string): Promise<Office[]> {
  const response = await api.get(`/api/offices/${slug}/suggestions`);
  return response.data;
}
