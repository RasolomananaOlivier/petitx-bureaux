import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "../route";
import { db } from "@/lib/db/drizzle";
import { offices } from "@/lib/db/schema";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    query: {
      offices: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("GET /api/offices/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return office data when office exists", async () => {
    const mockOffice = {
      id: 1,
      title: "Test Office",
      description: "Test description",
      slug: "test-office",
      arr: 1,
      priceCents: 50000,
      nbPosts: 10,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      publishedAt: null,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      photos: [],
      officeServices: [],
    };

    vi.mocked(db.query.offices.findFirst).mockResolvedValue(mockOffice);

    const request = new Request(
      "http://localhost:3000/api/offices/test-office"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-office" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockOffice);
  });

  it("should return 404 when office does not exist", async () => {
    vi.mocked(db.query.offices.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/offices/non-existent"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "non-existent" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Bureau non trouvé");
  });

  it("should return 500 when database error occurs", async () => {
    vi.mocked(db.query.offices.findFirst).mockRejectedValue(
      new Error("Database error")
    );

    const request = new Request(
      "http://localhost:3000/api/offices/test-office"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-office" }),
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Erreur lors de la récupération du bureau");
  });
});
