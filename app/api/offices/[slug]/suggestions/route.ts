import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";
import { eq, ne, and, between, gte, lte } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const currentOffice = await db.query.offices.findFirst({
      where: eq(offices.slug, slug),
    });

    if (!currentOffice) {
      return NextResponse.json({ error: "Bureau non trouvé" }, { status: 404 });
    }

    const priceRange = currentOffice.priceCents * 0.2;
    const minPrice = currentOffice.priceCents - priceRange;
    const maxPrice = currentOffice.priceCents + priceRange;

    const currentNbPosts = currentOffice.nbPosts || 1;
    const suggestedOffices = await db.query.offices.findMany({
      where: and(
        ne(offices.id, currentOffice.id),
        eq(offices.arr, currentOffice.arr),
        between(offices.priceCents, minPrice, maxPrice),
        gte(offices.nbPosts, Math.max(1, currentNbPosts - 5)),
        lte(offices.nbPosts, currentNbPosts + 5)
      ),
      with: {
        officeServices: {
          with: {
            service: true,
          },
        },
        photos: {
          limit: 1,
        },
      },
      limit: 6,
    });

    return NextResponse.json(suggestedOffices);
  } catch (error) {
    console.error("Error fetching suggested offices:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des suggestions" },
      { status: 500 }
    );
  }
}
