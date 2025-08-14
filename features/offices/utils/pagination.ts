import { PaginatedOfficesResponse } from "../types";

export function createPaginationResponse(
  offices: any[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    offices,
  } satisfies PaginatedOfficesResponse;
}

export function createLeadsPaginationResponse(
  leads: any[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    leads,
  };
}

export function normalizePagination(page: number, limit: number) {
  return {
    page: Math.max(1, Math.min(page, 999999)),
    limit: Math.max(1, Math.min(limit, 100)),
  };
}
