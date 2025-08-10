import { PaginatedOfficesResponse } from "@/lib/types";

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

export async function getOffices(params: GetOfficesParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.arr) searchParams.append("arr", params.arr.toString());
  if (params.minPosts)
    searchParams.append("minPosts", params.minPosts.toString());
  if (params.maxPosts)
    searchParams.append("maxPosts", params.maxPosts.toString());
  if (params.minPrice)
    searchParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    searchParams.append("maxPrice", params.maxPrice.toString());
  if (params.services?.length)
    searchParams.append("services", params.services.join(","));
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

  const response = await fetch(`/api/offices?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des bureaux");
  }

  return response.json() as Promise<PaginatedOfficesResponse>;
}
