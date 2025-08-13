import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "../route";
import { db } from "@/lib/db/drizzle";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    query: {
      offices: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  },
}));

describe("GET /api/offices/[slug]/suggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return suggested offices when current office exists", async () => {
    const mockCurrentOffice = {
      id: 1,
      title: "Current Office",
      slug: "current-office",
      arr: 1,
      priceCents: 50000,
      nbPosts: 10,
      lat: 48.8566,
      lng: 2.3522,
    };

    const mockSuggestedOffices = [
      {
        id: 2,
        title: "Suggested Office 1",
        slug: "suggested-office-1",
        arr: 1,
        priceCents: 48000,
        nbPosts: 8,
        photos: [{ url: "/test-image.jpg" }],
      },
      {
        id: 3,
        title: "Suggested Office 2",
        slug: "suggested-office-2",
        arr: 1,
        priceCents: 52000,
        nbPosts: 12,
        photos: [{ url: "/test-image-2.jpg" }],
      },
    ];

    vi.mocked(db.query.offices.findFirst).mockResolvedValue(mockCurrentOffice);
    vi.mocked(db.query.offices.findMany).mockResolvedValue(
      mockSuggestedOffices
    );

    const request = new Request(
      "http://localhost:3000/api/offices/current-office/suggestions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "current-office" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockSuggestedOffices);
  });

  it("should return 404 when current office does not exist", async () => {
    vi.mocked(db.query.offices.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/offices/non-existent/suggestions"
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
      "http://localhost:3000/api/offices/test-office/suggestions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "test-office" }),
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Erreur lors de la récupération des suggestions");
  });
});
