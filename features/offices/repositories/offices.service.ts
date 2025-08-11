import { db } from "@/lib/db/drizzle";
import { officesRepository } from "./offices.repo";

export class OfficesService {
  constructor(private database = db) {}

  async getOffices(
    whereClause: any,
    sortColumn: any,
    sortOrder: any,
    page: number,
    limit: number
  ) {
    return officesRepository.getOffices(
      this.database,
      whereClause,
      sortColumn,
      sortOrder,
      page,
      limit
    );
  }

  async getOfficesWithServices(serviceIds: number[]) {
    return officesRepository.getOfficesWithServices(this.database, serviceIds);
  }
}

export const officesService = new OfficesService();
