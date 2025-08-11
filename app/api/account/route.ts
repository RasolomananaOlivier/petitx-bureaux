// src/app/api/accounts/route.ts
import { db } from "@/lib/db/drizzle";
import { accounts } from "@/lib/db/schema";
import { NextRequest } from "next/server";
import { z } from "zod";

// 1. Define validation schema
const accountSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID" }),
  role: z.enum(["admin", "editor"]).optional().default("editor"),
});

export async function POST(request: NextRequest) {
  try {
    // 2. Parse & validate input
    const json = await request.json();
    const parsedData = accountSchema.safeParse(json);

    if (!parsedData.success) {
      return Response.json(
        {
          message: "Validation failed",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 3. Insert into database
    await db.insert(accounts).values(parsedData.data);

    // 4. Return success response
    return Response.json(
      {
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Account creation failed:", err);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
