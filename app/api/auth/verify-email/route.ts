import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { leads } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { emailService } from "@/lib/email/email.service";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const validationResult = verifyEmailSchema.safeParse({ token });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid verification token",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const lead = await db
      .select()
      .from(leads)
      .where(
        and(
          eq(leads.emailVerificationToken, token),
          isNull(leads.emailVerifiedAt)
        )
      )
      .limit(1);

    if (lead.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    const [verifiedLead] = await db
      .update(leads)
      .set({
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      })
      .where(eq(leads.id, lead[0].id))
      .returning();

    try {
      await emailService.sendLeadConfirmationEmail(
        verifiedLead.email,
        verifiedLead.name,
        "Bureau" // We could fetch the office title here if needed
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      lead: verifiedLead,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
