import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { offices, services, officeServices } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { stringify } from "csv-stringify/sync";

const bulkImportSchema = z.object({
  offices: z
    .array(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        slug: z.string().min(1).max(255),
        arr: z.number().min(1).max(20),
        priceCents: z.number().int().nonnegative(),
        nbPosts: z.number().int().min(1).optional(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        isFake: z.boolean().optional().default(false),
        amenities: z.array(z.string()).optional().default([]),
      })
    )
    .max(500, "Maximum 500 offices allowed per import"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = bulkImportSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { offices: officesData } = validationResult.data;

    const results = {
      total: officesData.length,
      created: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; error: string }>,
    };

    for (let i = 0; i < officesData.length; i++) {
      const officeData = officesData[i];

      try {
        const existingSlug = await db
          .select()
          .from(offices)
          .where(eq(offices.slug, officeData.slug));

        if (existingSlug.length > 0) {
          results.skipped++;
          results.errors.push({
            row: i + 1,
            error: `Slug already exists: ${officeData.slug}`,
          });
          continue;
        }

        await db.transaction(async (tx) => {
          const [office] = await tx
            .insert(offices)
            .values({
              title: officeData.title,
              description: officeData.description || "",
              slug: officeData.slug,
              arr: officeData.arr,
              priceCents: officeData.priceCents,
              nbPosts: officeData.nbPosts || 1,
              lat: officeData.lat,
              lng: officeData.lng,
              isFake: officeData.isFake,
            })
            .returning();

          if (officeData.amenities && officeData.amenities.length > 0) {
            const serviceRows = await tx
              .select()
              .from(services)
              .where(inArray(services.name, officeData.amenities));

            if (serviceRows.length > 0) {
              await tx.insert(officeServices).values(
                serviceRows.map((s) => ({
                  officeId: office.id,
                  serviceId: s.id,
                }))
              );
            }
          }

          return office;
        });

        results.created++;
      } catch (error) {
        results.skipped++;
        results.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${results.created} created, ${results.skipped} skipped`,
      results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
