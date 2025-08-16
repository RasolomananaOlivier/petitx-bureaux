import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { leads, offices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { emailService } from "@/lib/email/email.service";
import { withRateLimit } from "@/lib/rate-limit-middleware";
import { leadSchema } from "@/lib/schemas/lead.schema";

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

async function postLeadHandler(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, phone, message, officeId, token } =
      validationResult.data;

    const isRecaptchaValid = await verifyRecaptcha(token);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const verificationToken = emailService.generateVerificationToken();

    const [newLead] = await db
      .insert(leads)
      .values({
        officeId,
        name: `${firstname} ${lastname}`,
        email,
        phone,
        message,
        status: "pending",
        emailVerificationToken: verificationToken,
        utmJson: null,
      })
      .returning();

    const office = await db.query.offices.findFirst({
      where: eq(offices.id, officeId),
    });

    const officeTitle = office?.title || "Bureau";

    try {
      await emailService.sendVerificationEmail(
        email,
        `${firstname} ${lastname}`,
        verificationToken,
        officeTitle
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Lead created but verification email failed to send",
          lead: newLead,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Lead created successfully. Please check your email to verify your address.",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(postLeadHandler);
