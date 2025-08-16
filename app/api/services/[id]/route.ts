import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de service invalide" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, icon } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Le nom du service est requis" },
        { status: 400 }
      );
    }

    const updatedService = await db
      .update(services)
      .set({
        name: name.trim(),
        icon: icon?.trim() || null,
      })
      .where(eq(services.id, id))
      .returning();

    if (updatedService.length === 0) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedService[0]);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de service invalide" },
        { status: 400 }
      );
    }

    const deletedService = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (deletedService.length === 0) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Service supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du service" },
      { status: 500 }
    );
  }
}
