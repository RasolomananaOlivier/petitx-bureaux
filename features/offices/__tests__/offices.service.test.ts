import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { officeServices } from "../services/offices.service";

// Mock the database module
vi.mock("@/lib/db/drizzle", () => ({
  db: {
    $count: vi.fn(),
    query: {
      offices: {
        findMany: vi.fn(),
      },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          groupBy: vi.fn(() => ({
            having: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock the repository
vi.mock("../repositories/offices.repo", () => ({
  officesRepository: {
    getOffices: vi.fn(),
    getOfficesWithServices: vi.fn(),
  },
}));

// Mock the utils
vi.mock("../utils/utils", () => ({
  buildFilterConditions: vi.fn(),
  getSortColumn: vi.fn(),
  getSortOrder: vi.fn(),
}));

vi.mock("../utils/pagination", () => ({
  createPaginationResponse: vi.fn(),
  normalizePagination: vi.fn(),
}));

// Mock the validator
vi.mock("../validator", () => ({
  officeFiltersSchema: {
    parse: vi.fn(),
  },
}));

// Import mocked modules
import { db } from "@/lib/db/drizzle";
import { officesRepository } from "../repositories/offices.repo";
import * as utils from "../utils/utils";
import * as pagination from "../utils/pagination";
import * as validator from "../validator";

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
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
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
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
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

describe("officeServices.getOffices", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (validator.officeFiltersSchema.parse as any).mockReturnValue({
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "desc",
    });

    (utils.buildFilterConditions as any).mockReturnValue([]);
    (officesRepository.getOfficesWithServices as any).mockResolvedValue([1, 2]);
    (utils.getSortColumn as any).mockReturnValue("created_at");
    (utils.getSortOrder as any).mockReturnValue("desc");
    (pagination.normalizePagination as any).mockReturnValue({
      page: 1,
      limit: 10,
    });
    (officesRepository.getOffices as any).mockResolvedValue(mockOffices);
    (pagination.createPaginationResponse as any).mockReturnValue(
      mockPaginationResponse
    );

    (db.$count as any).mockResolvedValue(2);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return offices with default parameters", async () => {
    const searchParams = new URLSearchParams();
    const response = await officeServices.getOffices(searchParams);

    expect(response).toEqual(mockPaginationResponse);
    expect(validator.officeFiltersSchema.parse).toHaveBeenCalledWith({});
    expect(pagination.createPaginationResponse).toHaveBeenCalledWith(
      mockOffices,
      1,
      10,
      2
    );
  });

  it("should handle filtering parameters", async () => {
    const mockFilters = {
      arr: 1,
      minPosts: 5,
      maxPosts: 10,
      minPrice: 500,
      maxPrice: 1000,
      services: [1, 2],
      page: 2,
      limit: 5,
      sortBy: "price" as const,
      sortOrder: "asc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 2,
      limit: 5,
    });
    (utils.getSortColumn as any).mockReturnValue("price");
    (utils.getSortOrder as any).mockReturnValue("asc");

    const searchParams = new URLSearchParams(
      "arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=2&limit=5&sortBy=price&sortOrder=asc"
    );
    const response = await officeServices.getOffices(searchParams);

    expect(response).toEqual(mockPaginationResponse);
    expect(utils.buildFilterConditions).toHaveBeenCalledWith(mockFilters);
    expect(officesRepository.getOfficesWithServices).toHaveBeenCalledWith([
      1, 2,
    ]);
    expect(officesRepository.getOffices).toHaveBeenCalled();
  });

  it("should handle services filter with no results", async () => {
    (officesRepository.getOfficesWithServices as any).mockResolvedValue([]);
    (pagination.createPaginationResponse as any).mockReturnValue({
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      offices: [],
    });

    const searchParams = new URLSearchParams("services=1,2");
    const response = await officeServices.getOffices(searchParams);

    expect(response.offices).toEqual([]);
    expect(response.pagination.total).toBe(0);
  });

  it("should handle missing parameters", async () => {
    const searchParams = new URLSearchParams();
    const response = await officeServices.getOffices(searchParams);

    expect(response.pagination.page).toBe(1);
    expect(response.pagination.limit).toBe(10);
  });

  it("should handle invalid services parameter", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: [],
      page: 1,
      limit: 10,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);

    const searchParams = new URLSearchParams("services=invalid");
    const response = await officeServices.getOffices(searchParams);

    expect(Array.isArray(response.offices)).toBe(true);
  });

  it("should handle empty services parameter", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 10,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);

    const searchParams = new URLSearchParams("services=");
    const response = await officeServices.getOffices(searchParams);

    expect(Array.isArray(response.offices)).toBe(true);
  });

  it("should handle maximum limit parameter", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 100,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 1,
      limit: 100,
    });

    const searchParams = new URLSearchParams("limit=100");
    const response = await officeServices.getOffices(searchParams);

    expect(pagination.normalizePagination).toHaveBeenCalledWith(1, 100);
  });

  it("should cap limit parameter at maximum", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 150,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 1,
      limit: 100,
    });

    const searchParams = new URLSearchParams("limit=150");
    const response = await officeServices.getOffices(searchParams);

    expect(pagination.normalizePagination).toHaveBeenCalledWith(1, 150);
  });

  it("should handle pagination parameters", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 2,
      limit: 5,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 2,
      limit: 5,
    });

    const searchParams = new URLSearchParams("page=2&limit=5");
    const response = await officeServices.getOffices(searchParams);

    expect(pagination.normalizePagination).toHaveBeenCalledWith(2, 5);
  });

  it("should handle sorting parameters", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 10,
      sortBy: "price" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (utils.getSortColumn as any).mockReturnValue("price");
    (utils.getSortOrder as any).mockReturnValue("desc");

    const searchParams = new URLSearchParams("sortBy=price&sortOrder=desc");
    const response = await officeServices.getOffices(searchParams);

    expect(utils.getSortColumn).toHaveBeenCalledWith("price");
    expect(utils.getSortOrder).toHaveBeenCalledWith("desc");
  });

  it("should handle all filter combinations", async () => {
    const mockFilters = {
      arr: 1,
      minPosts: 5,
      maxPosts: 10,
      minPrice: 500,
      maxPrice: 1000,
      services: [1, 2],
      page: 1,
      limit: 20,
      sortBy: "posts" as const,
      sortOrder: "asc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 1,
      limit: 20,
    });
    (utils.getSortColumn as any).mockReturnValue("posts");
    (utils.getSortOrder as any).mockReturnValue("asc");

    const searchParams = new URLSearchParams(
      "arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=1&limit=20&sortBy=posts&sortOrder=asc"
    );
    const response = await officeServices.getOffices(searchParams);

    expect(Array.isArray(response.offices)).toBe(true);
    expect(utils.buildFilterConditions).toHaveBeenCalledWith(mockFilters);
  });

  it("should handle database errors gracefully", async () => {
    (db.$count as any).mockRejectedValue(new Error("Database error"));

    const searchParams = new URLSearchParams();

    await expect(officeServices.getOffices(searchParams)).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle schema validation errors", async () => {
    (validator.officeFiltersSchema.parse as any).mockImplementation(() => {
      throw new Error("Validation error");
    });

    const searchParams = new URLSearchParams();

    await expect(officeServices.getOffices(searchParams)).rejects.toThrow(
      "Validation error"
    );
  });

  it("should handle getOffices errors", async () => {
    (officesRepository.getOffices as any).mockRejectedValue(
      new Error("Query error")
    );

    const searchParams = new URLSearchParams();

    await expect(officeServices.getOffices(searchParams)).rejects.toThrow(
      "Query error"
    );
  });

  it("should handle getOfficesWithServices errors", async () => {
    (officesRepository.getOfficesWithServices as any).mockRejectedValue(
      new Error("Services error")
    );

    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: [1, 2],
      page: 1,
      limit: 10,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);

    const searchParams = new URLSearchParams("services=1,2");

    await expect(officeServices.getOffices(searchParams)).rejects.toThrow(
      "Services error"
    );
  });

  it("should handle boundary values for pagination", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 1,
      limit: 1,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 1,
      limit: 1,
    });

    const searchParams = new URLSearchParams("page=1&limit=1");
    const response = await officeServices.getOffices(searchParams);

    expect(pagination.normalizePagination).toHaveBeenCalledWith(1, 1);
  });

  it("should handle extreme pagination values", async () => {
    const mockFilters = {
      arr: undefined,
      minPosts: undefined,
      maxPosts: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      services: undefined,
      page: 999999,
      limit: 999999,
      sortBy: "created_at" as const,
      sortOrder: "desc" as const,
    };

    (validator.officeFiltersSchema.parse as any).mockReturnValue(mockFilters);
    (pagination.normalizePagination as any).mockReturnValue({
      page: 999999,
      limit: 100,
    });

    const searchParams = new URLSearchParams("page=999999&limit=999999");
    const response = await officeServices.getOffices(searchParams);

    expect(pagination.normalizePagination).toHaveBeenCalledWith(999999, 999999);
  });
});
