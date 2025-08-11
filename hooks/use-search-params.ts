"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  useQueryStates,
} from "nuqs";

export function useSearchParams() {
  return useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(12),
    arr: parseAsInteger,
    minPosts: parseAsInteger,
    maxPosts: parseAsInteger,
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    services: parseAsArrayOf(parseAsInteger),
    sortBy: parseAsString.withDefault("created_at"),
    sortOrder: parseAsString.withDefault("desc"),
    search: parseAsString,
    location: parseAsArrayOf(parseAsString),
    officeTypes: parseAsArrayOf(parseAsString),
    showCombinations: parseAsString,
  });
}
