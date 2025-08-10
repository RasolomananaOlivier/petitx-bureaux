import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { photos } from "@/lib/db/schema"; // your photos table from pgTable
import { db } from "@/lib/db/drizzle";

const photoSchema = z.object({
  url: z.string().url().max(500),
  alt: z.string().max(255).optional(),
});

const requestSchema = z.object({
  officeId: z.number().int().positive(),
  photos: z.array(photoSchema).min(1),
}); // import the schema above or define here

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // Validate body
    const { officeId, photos: photosToAdd } = requestSchema.parse(json);

    const insertedPhotos = await db
      .insert(photos)
      .values(
        photosToAdd.map((photo) => ({
          officeId,
          url: photo.url,
          alt: photo.alt || null,
        }))
      )
      .returning();

    return NextResponse.json(
      { success: true, insertedPhotos },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
