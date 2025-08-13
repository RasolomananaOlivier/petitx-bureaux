import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle"; // your drizzle db instance
import { offices, officeServices, services } from "@/lib/db/schema"; // your schema
import { eq, inArray } from "drizzle-orm";

// Zod schema for request body validation
const officeSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000).optional(),
  slug: z.string().min(1).max(255),
  arr: z.number().min(1).max(10),
  priceCents: z.number().int().nonnegative(),
  nbPosts: z.number().int().optional(),
  lat: z.number(),
  lng: z.number(),
  isFake: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().optional(),
  amenities: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate incoming data
    const parsed = officeSchema.parse(body);

    // Check if slug already exists (optional, since DB has unique constraint)
    const existing = await db
      .select()
      .from(offices)
      .where(eq(offices.slug, parsed.slug));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    // 🛠️ Run everything in a transaction
    const insertedOffice = await db.transaction(async (tx) => {
      // 1️⃣ Insert office
      const [office] = await tx
        .insert(offices)
        .values({
          title: parsed.title,
          description: parsed.description,
          slug: parsed.slug,
          arr: parsed.arr,
          priceCents: parsed.priceCents,
          nbPosts: parsed.nbPosts,
          lat: parsed.lat,
          lng: parsed.lng,
          isFake: parsed.isFake,
          publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
        })
        .returning();

      // 2️⃣ Find matching services by name
      const serviceRows = await tx
        .select()
        .from(services)
        .where(inArray(services.name, parsed.amenities));

      // 3️⃣ Link office to services
      if (serviceRows.length > 0) {
        await tx.insert(officeServices).values(
          serviceRows.map((s) => ({
            officeId: office.id,
            serviceId: s.id,
          }))
        );
      }

      return office;
    });

    return NextResponse.json(insertedOffice, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error creating office:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
