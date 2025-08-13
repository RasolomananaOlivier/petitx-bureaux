import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { offices, officeServices, services, photos } from "@/lib/db/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

const deleteOfficeSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const officeIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateOfficeSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000).optional(),
  slug: z.string().min(1).max(255),
  arr: z.number().min(1).max(20),
  priceCents: z.number().int().nonnegative(),
  nbPosts: z.number().int().optional(),
  lat: z.number(),
  lng: z.number(),
  isFake: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().optional(),
  amenities: z.array(z.string()).min(1),
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = deleteOfficeSchema.parse({ id });

    const existingOffice = await db
      .select()
      .from(offices)
      .where(eq(offices.id, parsed.id));

    if (existingOffice.length === 0) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      await tx.delete(photos).where(eq(photos.officeId, parsed.id));
      await tx
        .delete(officeServices)
        .where(eq(officeServices.officeId, parsed.id));
      await tx.delete(offices).where(eq(offices.id, parsed.id));
    });

    return NextResponse.json({ message: "Office deleted successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error deleting office:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = officeIdSchema.parse({ id });

    const office = await db.query.offices.findFirst({
      where: eq(offices.id, parsed.id),
      with: {
        officeServices: {
          with: {
            service: true,
          },
        },
        photos: true,
      },
    });

    if (!office) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    return NextResponse.json(office);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error fetching office:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = officeIdSchema.parse({ id });
    const body = await req.json();
    const parsed = updateOfficeSchema.parse(body);

    const existingOffice = await db.query.offices.findFirst({
      where: eq(offices.id, parsedId.id),
    });

    if (!existingOffice) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }

    const existingSlug = await db.query.offices.findFirst({
      where: and(eq(offices.slug, parsed.slug), ne(offices.id, parsedId.id)),
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const updatedOffice = await db.transaction(async (tx) => {
      const [office] = await tx
        .update(offices)
        .set({
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
          updatedAt: new Date(),
        })
        .where(eq(offices.id, parsedId.id))
        .returning();

      await tx
        .delete(officeServices)
        .where(eq(officeServices.officeId, parsedId.id));

      const serviceRows = await tx
        .select()
        .from(services)
        .where(inArray(services.name, parsed.amenities));

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

    return NextResponse.json(updatedOffice);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error updating office:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
