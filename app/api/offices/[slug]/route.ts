import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { withRateLimit } from "@/lib/rate-limit-middleware";

async function getOfficeHandler(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const office = await db.query.offices.findFirst({
      where: eq(offices.slug, slug),
      with: {
        photos: true,
        officeServices: {
          with: {
            service: true,
          },
        },
      },
    });

    if (!office) {
      return NextResponse.json({ error: "Bureau non trouvé" }, { status: 404 });
    }

    return NextResponse.json(office);
  } catch (error) {
    console.error("Error fetching office:", error);

    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération du bureau" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(getOfficeHandler);
