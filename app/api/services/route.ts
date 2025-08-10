import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { services } from "@/lib/db/schema";

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
