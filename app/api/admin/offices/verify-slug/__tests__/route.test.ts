import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../route";
import { db } from "@/lib/db/drizzle";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    query: {
      offices: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("POST /api/admin/offices/verify-slug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return available true when slug does not exist", async () => {
    vi.mocked(db.query.offices.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug" }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      available: true,
      suggestions: [],
    });
  });

  it("should return available false with suggestions when slug exists", async () => {
    const mockExistingOffice = {
      id: 1,
      slug: "test-slug",
      title: "Existing Office",
    };

    vi.mocked(db.query.offices.findFirst).mockResolvedValue(mockExistingOffice);

    const request = new Request(
      "http://localhost:3000/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug" }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(false);
    expect(data.existingOffice).toEqual(mockExistingOffice);
    expect(data.suggestions).toHaveLength(3);
    expect(data.suggestions[0]).toMatch(/test-slug-\d{4}$/);
  });

  it("should exclude current office when officeId is provided", async () => {
    vi.mocked(db.query.offices.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug", officeId: 1 }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.available).toBe(true);
    expect(vi.mocked(db.query.offices.findFirst)).toHaveBeenCalledWith({
      where: expect.any(Object),
      columns: {
        id: true,
        slug: true,
        title: true,
      },
    });
  });

  it("should return 400 for invalid request data", async () => {
    const request = new Request(
      "http://localhost:3000/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(data).toHaveProperty("details");
  });

  it("should return 500 when database error occurs", async () => {
    vi.mocked(db.query.offices.findFirst).mockRejectedValue(
      new Error("Database error")
    );

    const request = new Request(
      "http://localhost:3000/api/admin/offices/verify-slug",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test-slug" }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erreur lors de la vérification du slug");
  });
});
