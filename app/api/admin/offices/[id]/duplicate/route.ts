import { OfficeRepo } from "@/lib/repositories/office.repo";
import { NextResponse } from "next/server";
import { z } from "zod";

const officeIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function POST({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = officeIdSchema.parse({ id });

    const existingOffice = await OfficeRepo.findById(parsed.id);

    if (!existingOffice) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }
    const newOffice = await OfficeRepo.duplicateOffice(existingOffice);

    return NextResponse.json({
      message: "Office duplicated successfully",
      office: newOffice,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error duplicating office:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
