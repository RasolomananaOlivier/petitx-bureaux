import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allServices = await db.select().from(services).orderBy(services.name);

    return NextResponse.json(allServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Le nom du service est requis" },
        { status: 400 }
      );
    }

    const newService = await db
      .insert(services)
      .values({
        name: name.trim(),
        icon: icon?.trim() || null,
      })
      .returning();

    return NextResponse.json(newService[0]);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du service" },
      { status: 500 }
    );
  }
}
