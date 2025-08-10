import { db } from "@/lib/db/drizzle";
import { offices, officeServices, services, photos } from "@/lib/db/schema";
import { eq, and, gte, lte, inArray, desc, asc, sql, SQL } from "drizzle-orm";
import { z } from "zod";
import { PaginatedOfficesResponse } from "@/lib/types";

const officeFiltersSchema = z.object({
  arr: z.coerce.number().optional(),
  minPosts: z.coerce.number().optional(),
  maxPosts: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  services: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.split(",").map(Number).filter(Boolean);
    }),
  page: z.coerce.number().default(1).catch(1),
  limit: z.coerce.number().default(10).catch(10),
  sortBy: z
    .enum(["price", "posts", "created_at"])
    .default("created_at")
    .catch("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc").catch("desc"),
});

export type OfficeFiltersType = z.infer<typeof officeFiltersSchema>;

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

export async function getOfficesWithServices(serviceIds: number[]) {
  const officesWithServices = await db
    .select({ officeId: officeServices.officeId })
    .from(officeServices)
    .where(inArray(officeServices.serviceId, serviceIds))
    .groupBy(officeServices.officeId)
    .having(
      sql`COUNT(DISTINCT ${officeServices.serviceId}) = ${serviceIds.length}`
    );

  return officesWithServices.map((row) => row.officeId);
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

export function normalizePagination(page: number, limit: number) {
  return {
    page: Math.max(1, Math.min(page, 999999)),
    limit: Math.max(1, Math.min(limit, 100)),
  };
}

export async function getOfficesData(
  whereClause: any,
  sortColumn: any,
  sortOrder: any,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit;

  return await db.query.offices.findMany({
    where: whereClause,
    orderBy: sortOrder(sortColumn),
    limit: limit,
    offset: offset,
    with: {
      photos: true,
      officeServices: {
        with: {
          service: true,
        },
      },
    },
  });
}

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

export { officeFiltersSchema };
