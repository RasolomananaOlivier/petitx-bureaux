import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";
import { eq, ne, like, and } from "drizzle-orm";

const verifySlugSchema = z.object({
  slug: z.string().min(1),
  officeId: z.number().optional(),
});

function generateSlugSuggestions(baseSlug: string): string[] {
  const suggestions: string[] = [];
  const timestamp = Date.now().toString().slice(-4);

  suggestions.push(`${baseSlug}-${timestamp}`);
  suggestions.push(`${baseSlug}-${Math.floor(Math.random() * 1000)}`);
  suggestions.push(`${baseSlug}-nouveau`);
  suggestions.push(`${baseSlug}-2024`);

  return suggestions.slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = verifySlugSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { slug, officeId } = validationResult.data;

    const whereCondition = officeId
      ? and(eq(offices.slug, slug), ne(offices.id, officeId))
      : eq(offices.slug, slug);

    const existingOffice = await db.query.offices.findFirst({
      where: whereCondition,
      columns: {
        id: true,
        slug: true,
        title: true,
      },
    });

    if (existingOffice) {
      const suggestions = generateSlugSuggestions(slug);

      return NextResponse.json({
        available: false,
        existingOffice: {
          id: existingOffice.id,
          slug: existingOffice.slug,
          title: existingOffice.title,
        },
        suggestions,
      });
    }

    return NextResponse.json({
      available: true,
      suggestions: [],
    });
  } catch (error) {
    console.error("Slug verification error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du slug" },
      { status: 500 }
    );
  }
}
