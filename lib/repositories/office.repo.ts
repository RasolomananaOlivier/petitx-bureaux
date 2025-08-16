import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { NewOffice, offices } from "../db/schema";
import { OfficeWithRelations } from "@/features/offices/types";

export class OfficeRepo {
  // static methods
  static async findById(id: number): Promise<OfficeWithRelations | undefined> {
    return db.query.offices.findFirst({
      where: eq(offices.id, id),
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

  static async createOffice(office: NewOffice) {
    const result = await db.insert(offices).values(office).returning();
    return result[0];
  }

  static async duplicateOffice(office: OfficeWithRelations) {
    const result = await db
      .insert(offices)
      .values({
        ...office,
        title: `${office.title} (2)`,
        slug: `${office.slug}-2`,
      })
      .returning();

    return result[0];
  }
}
