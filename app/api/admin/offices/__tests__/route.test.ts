import { describe, it, expect, beforeEach } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "../route";
import { testDb } from "@/tests/setup";
import { offices, services, officeServices, photos } from "@/lib/db/schema";

describe("/api/admin/offices", () => {
  const setupTestData = async () => {
    const service1 = await testDb
      .insert(services)
      .values({ name: "WiFi", icon: "wifi" })
      .returning();

    const service2 = await testDb
      .insert(services)
      .values({ name: "Café", icon: "coffee" })
      .returning();

    const offices_data = [
      {
        title: "Bureau Test 1",
        description: "Description test 1",
        slug: "bureau-test-1",
        arr: 1,
        priceCents: 5000,
        nbPosts: 4,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        publishedAt: new Date("2024-01-01"),
      },
      {
        title: "Bureau Test 2",
        description: "Description test 2",
        slug: "bureau-test-2",
        arr: 2,
        priceCents: 7500,
        nbPosts: 6,
        lat: 48.8606,
        lng: 2.3376,
        isFake: true,
        publishedAt: null,
      },
      {
        title: "Bureau Search",
        description: "Description search test",
        slug: "bureau-search",
        arr: 3,
        priceCents: 3000,
        nbPosts: 2,
        lat: 48.855,
        lng: 2.348,
        isFake: false,
        publishedAt: new Date("2024-02-01"),
      },
    ];

    const insertedOffices = await testDb
      .insert(offices)
      .values(offices_data)
      .returning();

    await testDb.insert(photos).values([
      {
        officeId: insertedOffices[0].id,
        url: "https://example.com/photo1.jpg",
        alt: "Photo 1",
      },
      {
        officeId: insertedOffices[1].id,
        url: "https://example.com/photo2.jpg",
        alt: "Photo 2",
      },
    ]);

    await testDb.insert(officeServices).values([
      {
        officeId: insertedOffices[0].id,
        serviceId: service1[0].id,
      },
      {
        officeId: insertedOffices[1].id,
        serviceId: service2[0].id,
      },
    ]);

    return { service1, service2, insertedOffices };
  };

  describe("GET /api/admin/offices", () => {
    it("should return paginated offices with default parameters", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data).toHaveProperty("offices");
          expect(data).toHaveProperty("pagination");
          expect(data.offices).toHaveLength(3);
          expect(data.pagination).toEqual({
            page: 1,
            limit: 10,
            total: 3,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          });
        },
      });
    });

    it("should handle pagination correctly", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?page=1&limit=2", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.offices).toHaveLength(2);
          expect(data.pagination).toEqual({
            page: 1,
            limit: 2,
            total: 3,
            totalPages: 2,
            hasNext: true,
            hasPrev: false,
          });
        },
      });
    });

    it("should handle search functionality", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?search=search", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.offices).toHaveLength(1);
          expect(data.offices[0].title).toBe("Bureau Search");
        },
      });
    });

    it("should handle sorting by title ascending", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?sortBy=title&sortOrder=asc", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.offices[0].title).toBe("Bureau Search");
          expect(data.offices[1].title).toBe("Bureau Test 1");
          expect(data.offices[2].title).toBe("Bureau Test 2");
        },
      });
    });

    it("should handle sorting by price descending", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?sortBy=priceCents&sortOrder=desc", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.offices[0].priceCents).toBe(7500);
          expect(data.offices[1].priceCents).toBe(5000);
          expect(data.offices[2].priceCents).toBe(3000);
        },
      });
    });

    it("should include photos and services for each office", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);

          const officeWithPhoto = data.offices.find(
            (office: any) => office.photos.length > 0
          );
          const officeWithService = data.offices.find(
            (office: any) => office.officeServices.length > 0
          );

          expect(officeWithPhoto).toBeDefined();
          expect(officeWithPhoto.photos[0]).toHaveProperty("url");
          expect(officeWithPhoto.photos[0]).toHaveProperty("alt");

          expect(officeWithService).toBeDefined();
          expect(officeWithService.officeServices[0]).toHaveProperty("service");
          expect(officeWithService.officeServices[0].service).toHaveProperty(
            "name"
          );
        },
      });
    });

    it("should return empty results for non-matching search", async () => {
      await setupTestData();

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?search=nonexistent", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(200);
          expect(data.offices).toHaveLength(0);
          expect(data.pagination.total).toBe(0);
        },
      });
    });

    it("should handle invalid pagination parameters", async () => {
      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?page=0&limit=150", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(400);
          expect(data).toHaveProperty("error", "Validation failed");
        },
      });
    });

    it("should handle invalid sort parameters", async () => {
      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url + "?sortBy=invalid&sortOrder=invalid", {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const data = await res.json();

          expect(res.status).toBe(400);
          expect(data).toHaveProperty("error", "Validation failed");
        },
      });
    });
  });

  describe("POST /api/admin/offices (existing functionality)", () => {
    beforeEach(async () => {
      await testDb.insert(services).values([
        { name: "WiFi", icon: "wifi" },
        { name: "Café", icon: "coffee" },
      ]);
    });

    it("should create office successfully", async () => {
      const officeData = {
        title: "Test Office",
        description: "Test description",
        slug: "test-office",
        arr: 1,
        priceCents: 5000,
        nbPosts: 4,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        publishedAt: "2024-01-01T00:00:00.000Z",
        amenities: ["WiFi", "Café"],
      };

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(officeData),
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "POST" });
          const data = await res.json();

          expect(res.status).toBe(201);
          expect(data).toHaveProperty("id");
          expect(data.title).toBe(officeData.title);
          expect(data.slug).toBe(officeData.slug);
        },
      });
    });

    it("should return error for duplicate slug", async () => {
      await testDb.insert(offices).values({
        title: "Existing Office",
        slug: "duplicate-slug",
        arr: 1,
        priceCents: 3000,
        lat: 48.8566,
        lng: 2.3522,
      });

      const officeData = {
        title: "Test Office",
        description: "Test description",
        slug: "duplicate-slug",
        arr: 1,
        priceCents: 5000,
        lat: 48.8566,
        lng: 2.3522,
        amenities: ["WiFi"],
      };

      await testApiHandler({
        appHandler,
        requestPatcher(req) {
          return new Request(req.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(officeData),
          });
        },
        test: async ({ fetch }) => {
          const res = await fetch({ method: "POST" });
          const data = await res.json();

          expect(res.status).toBe(409);
          expect(data).toHaveProperty("error", "Slug already exists");
        },
      });
    });
  });
});
