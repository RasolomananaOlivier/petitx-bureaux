import { NextRequest, NextResponse } from "next/server";
import { officeServices } from "@/features/offices/services/offices.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const response = await officeServices.getOffices(searchParams);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching offices:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des bureaux" },
      { status: 500 }
    );
  }
}
