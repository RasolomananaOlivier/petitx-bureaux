import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/drizzle";
import { photos } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { photos: photoData, officeId } = body;

    if (!photoData || !Array.isArray(photoData) || !officeId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const photosToInsert = photoData.map((photo: any) => ({
      officeId,
      url: photo.url,
      alt: photo.alt || "",
    }));

    const insertedPhotos = await db
      .insert(photos)
      .values(photosToInsert)
      .returning();

    return NextResponse.json(insertedPhotos);
  } catch (error) {
    console.error("Error creating photos:", error);
    return NextResponse.json(
      { error: "Failed to create photos" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { error: "Photo IDs are required" },
        { status: 400 }
      );
    }

    const photoIds = ids.split(",").map(Number);

    await db.delete(photos).where(inArray(photos.id, photoIds));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photos:", error);
    return NextResponse.json(
      { error: "Failed to delete photos" },
      { status: 500 }
    );
  }
}
