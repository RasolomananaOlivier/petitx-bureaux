import { db } from "@/lib/db/drizzle";
import { leads, offices } from "@/lib/db/schema";
import { desc, asc, eq, like, and, SQL } from "drizzle-orm";

export class LeadsService {
  constructor(private database = db) {}

  async getLeads(
    whereClause: SQL[],
    sortColumn: any,
    sortOrder: any,
    page: number,
    limit: number
  ) {
    const offset = (page - 1) * limit;

    return this.database
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        status: leads.status,
        officeId: leads.officeId,
        emailVerifiedAt: leads.emailVerifiedAt,
        emailVerificationToken: leads.emailVerificationToken,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
        office: {
          id: offices.id,
          title: offices.title,
          slug: offices.slug,
        },
      })
      .from(leads)
      .leftJoin(offices, eq(leads.officeId, offices.id))
      .where(whereClause.length > 0 ? and(...whereClause) : undefined)
      .orderBy(sortOrder(sortColumn))
      .limit(limit)
      .offset(offset);
  }

  async getLeadsCount(whereClause: SQL[]) {
    return this.database.$count(leads, and(...whereClause));
  }
}

export const leadsService = new LeadsService();
