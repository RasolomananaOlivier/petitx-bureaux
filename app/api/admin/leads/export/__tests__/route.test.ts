import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

vi.mock("@/lib/email/csv-export.service", () => ({
  csvExportService: {
    exportLeadsToCSV: vi.fn(),
  },
}));

vi.mock("@/lib/email/email.service", () => ({
  emailService: {
    sendCSVExportEmail: vi.fn(),
  },
}));

vi.mock("@/features/offices/repositories/leads.service", () => ({
  LeadsService: vi.fn().mockImplementation(() => ({
    getLeads: vi.fn(),
  })),
}));

describe("POST /api/admin/leads/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 for invalid request data", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/admin/leads/export",
      {
        method: "POST",
        body: JSON.stringify({
          startDate: "invalid-date",
          endDate: "2024-01-01",
          email: "invalid-email",
        }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });

  it("should return 400 when start date is after end date", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/admin/leads/export",
      {
        method: "POST",
        body: JSON.stringify({
          startDate: "2024-01-02",
          endDate: "2024-01-01",
          email: "test@example.com",
        }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "La date de début doit être antérieure à la date de fin"
    );
  });

  it("should return 400 for missing required fields", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/admin/leads/export",
      {
        method: "POST",
        body: JSON.stringify({
          startDate: "2024-01-01",
          email: "test@example.com",
        }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });

  it("should return 400 for invalid email format", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/admin/leads/export",
      {
        method: "POST",
        body: JSON.stringify({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          email: "not-an-email",
        }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Données invalides");
  });

  it("should accept valid request data", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/admin/leads/export",
      {
        method: "POST",
        body: JSON.stringify({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          status: "pending",
          email: "test@example.com",
        }),
      }
    );

    const response = await POST(request);
    expect(response.status).not.toBe(400);
  });
});
