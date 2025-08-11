import { offices } from "@/lib/db/schema";
import { officesRepository } from "../repositories/offices.repo";
import {
  createPaginationResponse,
  normalizePagination,
} from "../utils/pagination";
import {
  buildFilterConditions,
  getSortColumn,
  getSortOrder,
} from "../utils/utils";
import { officeFiltersSchema } from "../validator";
import { and, inArray } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { OfficesService } from "../repositories/offices.service";

async function getOffices(searchParams: URLSearchParams) {
  const service = new OfficesService();
  const filters = officeFiltersSchema.parse(Object.fromEntries(searchParams));

  const conditions = buildFilterConditions(filters);

  if (filters.services && filters.services.length > 0) {
    const officeIds = await service.getOfficesWithServices(filters.services);
    if (officeIds.length === 0) {
      return createPaginationResponse([], filters.page, filters.limit, 0);
    }
    conditions.push(inArray(offices.id, officeIds));
  }

  const whereClause = and(...conditions);
  const totalCount = await db.$count(offices, whereClause);

  const { page, limit } = normalizePagination(filters.page, filters.limit);
  const sortColumn = getSortColumn(filters.sortBy);
  const sortOrder = getSortOrder(filters.sortOrder);

  const officesData = await service.getOffices(
    whereClause,
    sortColumn,
    sortOrder,
    page,
    limit
  );

  const response = createPaginationResponse(
    officesData,
    page,
    limit,
    totalCount
  );

  return response;
}

export const officeServices = { getOffices };
