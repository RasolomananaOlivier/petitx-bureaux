import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";
import { and, inArray } from "drizzle-orm";
import {
  officeFiltersSchema,
  buildFilterConditions,
  getOfficesWithServices,
  getSortColumn,
  getSortOrder,
  normalizePagination,
  getOfficesData,
  createPaginationResponse,
} from "./utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = officeFiltersSchema.parse(Object.fromEntries(searchParams));

    const conditions = buildFilterConditions(filters);

    if (filters.services && filters.services.length > 0) {
      const officeIds = await getOfficesWithServices(filters.services);
      if (officeIds.length === 0) {
        return NextResponse.json(
          createPaginationResponse([], filters.page, filters.limit, 0)
        );
      }
      conditions.push(inArray(offices.id, officeIds));
    }

    const whereClause = and(...conditions);
    const totalCount = await db.$count(offices, whereClause);

    const { page, limit } = normalizePagination(filters.page, filters.limit);
    const sortColumn = getSortColumn(filters.sortBy);
    const sortOrder = getSortOrder(filters.sortOrder);

    const officesData = await getOfficesData(
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

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching offices:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bureaux" },
      { status: 500 }
    );
  }
}
