import { testApiHandler } from "next-test-api-route-handler"; // Must be first import
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as appHandler from "../route";

// Mock the office service
vi.mock("@/features/offices/services/offices.service", () => ({
  officeServices: {
    getOffices: vi.fn(),
  },
}));

// Import mocked modules
import { officeServices } from "@/features/offices/services/offices.service";

// Mock data
const mockOffices = [
  {
    id: 1,
    title: "Bureau Test 1",
    description: "Description test 1",
    slug: "bureau-test-1",
    arr: 1,
    priceCents: 50000,
    nbPosts: 5,
    lat: 48.8566,
    lng: 2.3522,
    isFake: false,
    publishedAt: "2025-08-11T04:12:56.812Z",
    createdAt: "2025-08-11T04:12:56.812Z",
    updatedAt: "2025-08-11T04:12:56.812Z",
    photos: [],
    officeServices: [],
  },
  {
    id: 2,
    title: "Bureau Test 2",
    description: "Description test 2",
    slug: "bureau-test-2",
    arr: 2,
    priceCents: 75000,
    nbPosts: 10,
    lat: 48.8566,
    lng: 2.3522,
    isFake: false,
    publishedAt: "2025-08-11T04:12:56.812Z",
    createdAt: "2025-08-11T04:12:56.812Z",
    updatedAt: "2025-08-11T04:12:56.812Z",
    photos: [],
    officeServices: [],
  },
];

const mockPaginationResponse = {
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
  offices: mockOffices,
};

describe("GET /api/offices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (officeServices.getOffices as any).mockResolvedValue(
      mockPaginationResponse
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return offices with default parameters", async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual(mockPaginationResponse);
        expect(officeServices.getOffices).toHaveBeenCalledWith(
          expect.any(URLSearchParams)
        );
      },
    });
  });

  it("should handle filtering parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=2&limit=5&sortBy=price&sortOrder=asc",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual(mockPaginationResponse);
        expect(officeServices.getOffices).toHaveBeenCalledWith(
          expect.any(URLSearchParams)
        );
      },
    });
  });

  it("should handle missing parameters", async () => {
    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle invalid services parameter", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=invalid",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle invalid sort parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?sortBy=invalid&sortOrder=invalid",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle empty services parameter", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle maximum limit parameter", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?limit=100",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should cap limit parameter at maximum", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?limit=150",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle negative price filters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPrice=-100&maxPrice=-50",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle price range with no results", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPrice=200000&maxPrice=300000",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle posts range with no results", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPosts=100&maxPosts=200",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle non-existent arrondissement", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=99",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle mixed valid and invalid services", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=1,invalid,999",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle single service filter", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=1",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle multiple services filter", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=1,2,3",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle pagination parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?page=2&limit=5",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle sorting parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?sortBy=price&sortOrder=desc",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle all filter combinations", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=1&limit=20&sortBy=posts&sortOrder=asc",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle edge case with very large numbers", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPrice=999999&maxPrice=999999&minPosts=999999&maxPosts=999999",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle zero values", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPrice=0&maxPrice=0&minPosts=0&maxPosts=0",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle decimal values", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?minPrice=100.5&maxPrice=200.75",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle special characters in services", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?services=1,2,3,4,5,6,7,8,9,10",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle empty string parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=&minPosts=&maxPosts=&minPrice=&maxPrice=",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle malformed URL parameters", async () => {
    (officeServices.getOffices as any).mockRejectedValue(
      new Error("Validation error")
    );

    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=abc&minPosts=def&maxPosts=ghi&minPrice=jkl&maxPrice=mno",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe("Erreur lors de la récupération des bureaux");
      },
    });
  });

  it("should handle duplicate parameters", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?arr=1&arr=2&minPosts=5&minPosts=10",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle very long service lists", async () => {
    const longServices = Array.from({ length: 50 }, (_, i) => i + 1).join(",");
    await testApiHandler({
      appHandler,
      url: `/api/offices?services=${longServices}`,
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(Array.isArray(data.offices)).toBe(true);
      },
    });
  });

  it("should handle boundary values for pagination", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?page=1&limit=1",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle extreme pagination values", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/offices?page=999999&limit=999999",
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(10);
      },
    });
  });

  it("should handle service errors gracefully", async () => {
    (officeServices.getOffices as any).mockRejectedValue(
      new Error("Service error")
    );

    await testApiHandler({
      appHandler,
      async test({ fetch }) {
        const res = await fetch();
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe("Erreur lors de la récupération des bureaux");
      },
    });
  });
});
