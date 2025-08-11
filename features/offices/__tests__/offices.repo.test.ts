import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { officesRepository } from "../repositories/offices.repo";

// Mock the database module
vi.mock("@/lib/db/drizzle", () => ({
  db: {
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

// Import mocked modules
import { db } from "@/lib/db/drizzle";

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

const mockOfficeIds = [1, 2, 3];

describe("officesRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db.query.offices.findMany as any).mockResolvedValue(mockOffices);
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          groupBy: vi.fn().mockReturnValue({
            having: vi
              .fn()
              .mockResolvedValue([
                { officeId: 1 },
                { officeId: 2 },
                { officeId: 3 },
              ]),
          }),
        }),
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getOffices", () => {
    it("should fetch offices with correct parameters", async () => {
      const whereClause = { isFake: false };
      const sortColumn = "created_at";
      const sortOrder = vi.fn();
      const page = 1;
      const limit = 10;

      const result = await officesRepository.getOffices(
        whereClause,
        sortColumn,
        sortOrder,
        page,
        limit
      );

      expect(result).toEqual(mockOffices);
      expect(db.query.offices.findMany).toHaveBeenCalledWith({
        where: whereClause,
        orderBy: sortOrder(sortColumn),
        limit: limit,
        offset: 0,
        with: {
          photos: true,
          officeServices: {
            with: {
              service: true,
            },
          },
        },
      });
    });

    it("should handle pagination correctly", async () => {
      const page = 3;
      const limit = 5;
      const offset = (page - 1) * limit;
      const sortOrder = vi.fn();

      await officesRepository.getOffices(
        {},
        "created_at",
        sortOrder,
        page,
        limit
      );

      expect(db.query.offices.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: sortOrder("created_at"),
        limit: limit,
        offset: offset,
        with: {
          photos: true,
          officeServices: {
            with: {
              service: true,
            },
          },
        },
      });
    });

    it("should handle database errors", async () => {
      (db.query.offices.findMany as any).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        officesRepository.getOffices({}, "created_at", vi.fn(), 1, 10)
      ).rejects.toThrow("Database error");
    });
  });

  describe("getOfficesWithServices", () => {
    it("should fetch office IDs with services", async () => {
      const serviceIds = [1, 2, 3];

      const result = await officesRepository.getOfficesWithServices(serviceIds);

      expect(result).toEqual(mockOfficeIds);
      expect(db.select).toHaveBeenCalled();
    });

    it("should handle empty service IDs", async () => {
      const serviceIds: number[] = [];

      const result = await officesRepository.getOfficesWithServices(serviceIds);

      expect(result).toEqual(mockOfficeIds);
    });

    it("should handle single service ID", async () => {
      const serviceIds = [1];

      const result = await officesRepository.getOfficesWithServices(serviceIds);

      expect(result).toEqual(mockOfficeIds);
    });

    it("should handle database errors", async () => {
      (db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            groupBy: vi.fn().mockReturnValue({
              having: vi.fn().mockRejectedValue(new Error("Database error")),
            }),
          }),
        }),
      });

      await expect(
        officesRepository.getOfficesWithServices([1, 2, 3])
      ).rejects.toThrow("Database error");
    });
  });
});
