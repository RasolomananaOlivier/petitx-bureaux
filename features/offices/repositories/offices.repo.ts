import { db } from "@/lib/db/drizzle";
import { officeServices } from "@/lib/db/schema";
import { DrizzleDB } from "@/lib/db/types";
import { inArray, sql } from "drizzle-orm";

async function getOffices(
  db: DrizzleDB, // Inject db dependency
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

async function getOfficesWithServices(db: DrizzleDB, serviceIds: number[]) {
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

export const officesRepository = {
  getOffices,
  getOfficesWithServices,
};
