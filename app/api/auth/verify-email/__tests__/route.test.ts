import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import { testDb } from "@/tests/setup";
import { leads, offices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

describe("Email Verification API", () => {
  beforeEach(async () => {
    await testDb.delete(leads);
    await testDb.delete(offices);
  });

  afterEach(async () => {
    await testDb.delete(leads);
    await testDb.delete(offices);
  });

  it("should verify email with valid token", async () => {
    const office = await testDb
      .insert(offices)
      .values({
        title: "Test Office",
        slug: "test-office",
        arr: 1,
        priceCents: 5000,
        lat: 48.8566,
        lng: 2.3522,
      })
      .returning();

    const verificationToken = "test-verification-token-123";
    const lead = await testDb
      .insert(leads)
      .values({
        officeId: office[0].id,
        name: "John Doe",
        email: "john@example.com",
        phone: "+33123456789",
        status: "pending",
        emailVerificationToken: verificationToken,
        emailVerifiedAt: null,
      })
      .returning();

    const request = new NextRequest(
      `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Email verified successfully");

    const updatedLead = await testDb
      .select()
      .from(leads)
      .where(eq(leads.id, lead[0].id));

    expect(updatedLead[0].emailVerifiedAt).not.toBeNull();
    expect(updatedLead[0].emailVerificationToken).toBeNull();
  });

  it("should return error for invalid token", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/verify-email?token=invalid-token"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid or expired verification token");
  });

  it("should return error for missing token", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/auth/verify-email"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Verification token is required");
  });

  it("should return error for already verified email", async () => {
    const office = await testDb
      .insert(offices)
      .values({
        title: "Test Office",
        slug: "test-office",
        arr: 1,
        priceCents: 5000,
        lat: 48.8566,
        lng: 2.3522,
      })
      .returning();

    const verificationToken = "test-verification-token-123";
    await testDb.insert(leads).values({
      officeId: office[0].id,
      name: "John Doe",
      email: "john@example.com",
      phone: "+33123456789",
      status: "pending",
      emailVerificationToken: verificationToken,
      emailVerifiedAt: new Date(),
    });

    const request = new NextRequest(
      `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid or expired verification token");
  });
});
