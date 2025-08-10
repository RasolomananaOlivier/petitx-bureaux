import { describe, it, expect } from "vitest";
import { eq, gte, lte, asc, desc } from "drizzle-orm";
import { offices } from "@/lib/db/schema";
import {
  buildFilterConditions,
  getSortColumn,
  getSortOrder,
  normalizePagination,
  createPaginationResponse,
} from "../utils";

describe("Office API Utils", () => {
  describe("buildFilterConditions", () => {
    it("should build basic conditions", () => {
      const filters = {
        arr: 1,
        minPosts: 5,
        maxPosts: 10,
        minPrice: 500,
        maxPrice: 1000,
        services: [1, 2],
        page: 1,
        limit: 10,
        sortBy: "price" as const,
        sortOrder: "asc" as const,
      };

      const conditions = buildFilterConditions(filters);

      expect(conditions).toHaveLength(6);
      expect(conditions[0]).toEqual(eq(offices.isFake, false));
      expect(conditions[1]).toEqual(eq(offices.arr, 1));
      expect(conditions[2]).toEqual(gte(offices.nbPosts, 5));
      expect(conditions[3]).toEqual(lte(offices.nbPosts, 10));
      expect(conditions[4]).toEqual(gte(offices.priceCents, 50000));
      expect(conditions[5]).toEqual(lte(offices.priceCents, 100000));
    });

    it("should handle undefined values", () => {
      const filters = {
        arr: undefined,
        minPosts: undefined,
        maxPosts: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        services: [1, 2],
        page: 1,
        limit: 10,
        sortBy: "price" as const,
        sortOrder: "asc" as const,
      };

      const conditions = buildFilterConditions(filters);

      expect(conditions).toHaveLength(1);
      expect(conditions[0]).toEqual(eq(offices.isFake, false));
    });
  });

  describe("getSortColumn", () => {
    it("should return price column", () => {
      const result = getSortColumn("price");
      expect(result).toBe(offices.priceCents);
    });

    it("should return posts column", () => {
      const result = getSortColumn("posts");
      expect(result).toBe(offices.nbPosts);
    });

    it("should return created_at column", () => {
      const result = getSortColumn("created_at");
      expect(result).toBe(offices.createdAt);
    });

    it("should default to created_at", () => {
      const result = getSortColumn("invalid");
      expect(result).toBe(offices.createdAt);
    });
  });

  describe("getSortOrder", () => {
    it("should return asc order", () => {
      const result = getSortOrder("asc");
      expect(result).toBe(asc);
    });

    it("should return desc order", () => {
      const result = getSortOrder("desc");
      expect(result).toBe(desc);
    });

    it("should default to desc", () => {
      const result = getSortOrder("invalid");
      expect(result).toBe(desc);
    });
  });

  describe("normalizePagination", () => {
    it("should normalize valid values", () => {
      const result = normalizePagination(5, 20);
      expect(result).toEqual({ page: 5, limit: 20 });
    });

    it("should cap page at maximum", () => {
      const result = normalizePagination(999999999, 20);
      expect(result).toEqual({ page: 999999, limit: 20 });
    });

    it("should cap limit at maximum", () => {
      const result = normalizePagination(5, 150);
      expect(result).toEqual({ page: 5, limit: 100 });
    });

    it("should set minimum values", () => {
      const result = normalizePagination(0, 0);
      expect(result).toEqual({ page: 1, limit: 1 });
    });

    it("should handle negative values", () => {
      const result = normalizePagination(-5, -10);
      expect(result).toEqual({ page: 1, limit: 1 });
    });
  });

  describe("createPaginationResponse", () => {
    it("should create correct pagination response", () => {
      const offices = [{ id: 1, title: "Office 1" }];
      const result = createPaginationResponse(offices, 2, 10, 25);

      expect(result).toEqual({
        offices,
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNext: true,
          hasPrev: true,
        },
      });
    });

    it("should handle first page", () => {
      const offices = [{ id: 1, title: "Office 1" }];
      const result = createPaginationResponse(offices, 1, 10, 25);

      expect(result.pagination.hasPrev).toBe(false);
      expect(result.pagination.hasNext).toBe(true);
    });

    it("should handle last page", () => {
      const offices = [{ id: 1, title: "Office 1" }];
      const result = createPaginationResponse(offices, 3, 10, 25);

      expect(result.pagination.hasPrev).toBe(true);
      expect(result.pagination.hasNext).toBe(false);
    });

    it("should handle single page", () => {
      const offices = [{ id: 1, title: "Office 1" }];
      const result = createPaginationResponse(offices, 1, 10, 5);

      expect(result.pagination.hasPrev).toBe(false);
      expect(result.pagination.hasNext).toBe(false);
    });
  });
});
