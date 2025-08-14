import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([
            {
              id: 1,
              officeId: 1,
              name: "John Doe",
              email: "john@example.com",
              phone: "0600000000",
              status: "pending",
              utmJson: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ])
        ),
      })),
    })),
  },
}));

global.fetch = vi.fn();

describe("POST /api/lead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
  });

  it("should create a lead successfully with valid data and reCAPTCHA", async () => {
    const mockRecaptchaResponse = { success: true };
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockRecaptchaResponse),
    });

    const requestBody = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "0600000000",
      message: "I'm interested in this office",
      officeId: 1,
      token: "valid-recaptcha-token",
    };

    const request = new NextRequest("http://localhost:3000/api/lead", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe("Lead created successfully");
  });

  it("should return 400 for invalid email", async () => {
    const requestBody = {
      firstname: "John",
      lastname: "Doe",
      email: "invalid-email",
      phone: "0600000000",
      message: "I'm interested in this office",
      officeId: 1,
      token: "valid-recaptcha-token",
    };

    const request = new NextRequest("http://localhost:3000/api/lead", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBe("Invalid request data");
  });

  it("should return 400 for missing required fields", async () => {
    const requestBody = {
      email: "john@example.com",
      phone: "0600000000",
      officeId: 1,
      token: "valid-recaptcha-token",
    };

    const request = new NextRequest("http://localhost:3000/api/lead", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBe("Invalid request data");
  });

  it("should return 400 for invalid reCAPTCHA token", async () => {
    const mockRecaptchaResponse = { success: false };
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockRecaptchaResponse),
    });

    const requestBody = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "0600000000",
      message: "I'm interested in this office",
      officeId: 1,
      token: "invalid-recaptcha-token",
    };

    const request = new NextRequest("http://localhost:3000/api/lead", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBe("reCAPTCHA verification failed");
  });

  it("should return 400 for reCAPTCHA verification error", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const requestBody = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "0600000000",
      message: "I'm interested in this office",
      officeId: 1,
      token: "valid-recaptcha-token",
    };

    const request = new NextRequest("http://localhost:3000/api/lead", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBe("reCAPTCHA verification failed");
  });
});
