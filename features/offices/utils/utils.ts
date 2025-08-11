import { offices } from "@/lib/db/schema";
import { eq, gte, lte, desc, asc, SQL } from "drizzle-orm";
import { OfficeFiltersType } from "../validator";

export function buildFilterConditions(filters: OfficeFiltersType): SQL[] {
  const conditions = [eq(offices.isFake, false)];

  if (
    filters.arr !== undefined &&
    !isNaN(filters.arr) &&
    isFinite(filters.arr)
  ) {
    conditions.push(eq(offices.arr, filters.arr));
  }

  if (
    filters.minPosts !== undefined &&
    !isNaN(filters.minPosts) &&
    isFinite(filters.minPosts)
  ) {
    conditions.push(gte(offices.nbPosts, filters.minPosts));
  }

  if (
    filters.maxPosts !== undefined &&
    !isNaN(filters.maxPosts) &&
    isFinite(filters.maxPosts)
  ) {
    conditions.push(lte(offices.nbPosts, filters.maxPosts));
  }

  if (
    filters.minPrice !== undefined &&
    !isNaN(filters.minPrice) &&
    isFinite(filters.minPrice)
  ) {
    conditions.push(gte(offices.priceCents, filters.minPrice * 100));
  }

  if (
    filters.maxPrice !== undefined &&
    !isNaN(filters.maxPrice) &&
    isFinite(filters.maxPrice)
  ) {
    conditions.push(lte(offices.priceCents, filters.maxPrice * 100));
  }

  return conditions;
}

export function getSortColumn(sortBy: string) {
  return sortBy === "price"
    ? offices.priceCents
    : sortBy === "posts"
    ? offices.nbPosts
    : offices.createdAt;
}

export function getSortOrder(sortOrder: string) {
  return sortOrder === "asc" ? asc : desc;
}
