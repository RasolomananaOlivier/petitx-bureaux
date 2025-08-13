import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { offices, officeServices, photos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const deleteOfficeSchema = z.object({
  id: z.coerce.number().int().positive(),
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
