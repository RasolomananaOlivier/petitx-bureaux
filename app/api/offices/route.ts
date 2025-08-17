import { NextRequest, NextResponse } from "next/server";
import { officeServices } from "@/features/offices/services/offices.service";
import { ZodError } from "zod";
import { withRateLimit } from "@/lib/rate-limit-middleware";

async function getOfficesHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const response = await officeServices.getOffices(searchParams);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching offices:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Erreur lors de la récupération des bureaux",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération des bureaux" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(getOfficesHandler);
