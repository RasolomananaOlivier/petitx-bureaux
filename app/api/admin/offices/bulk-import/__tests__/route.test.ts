import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { POST } from "../route";
import { db } from "@/lib/db/drizzle";
import { offices, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

describe("POST /api/admin/offices/bulk-import", () => {
  beforeEach(async () => {
    await db.delete(offices);
    await db.delete(services);
  });

  afterEach(async () => {
    await db.delete(offices);
    await db.delete(services);
  });

  it("should import valid offices successfully", async () => {
    const validOffices = [
      {
        title: "Test Office 1",
        description: "Test description 1",
        slug: "test-office-1",
        arr: 1,
        priceCents: 100000,
        nbPosts: 5,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        amenities: ["WiFi", "Parking"],
      },
      {
        title: "Test Office 2",
        description: "Test description 2",
        slug: "test-office-2",
        arr: 2,
        priceCents: 150000,
        nbPosts: 3,
        lat: 48.8606,
        lng: 2.3376,
        isFake: true,
        amenities: ["Café"],
      },
    ];

    const request = new Request(
      "http://localhost:3000/api/admin/offices/bulk-import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offices: validOffices }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.results.created).toBe(2);
    expect(data.results.skipped).toBe(0);
    expect(data.results.errors).toHaveLength(0);
  });

  it("should skip offices with duplicate slugs", async () => {
    const existingOffice = {
      title: "Existing Office",
      description: "Existing description",
      slug: "existing-office",
      arr: 1,
      priceCents: 100000,
      nbPosts: 5,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      amenities: [],
    };

    await db.insert(offices).values(existingOffice);

    const officesToImport = [
      {
        title: "New Office 1",
        description: "New description 1",
        slug: "existing-office",
        arr: 2,
        priceCents: 120000,
        nbPosts: 3,
        lat: 48.8606,
        lng: 2.3376,
        isFake: false,
        amenities: [],
      },
      {
        title: "New Office 2",
        description: "New description 2",
        slug: "new-office-2",
        arr: 3,
        priceCents: 130000,
        nbPosts: 4,
        lat: 48.8534,
        lng: 2.3488,
        isFake: false,
        amenities: [],
      },
    ];

    const request = new Request(
      "http://localhost:3000/api/admin/offices/bulk-import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offices: officesToImport }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.results.created).toBe(1);
    expect(data.results.skipped).toBe(1);
    expect(data.results.errors).toHaveLength(1);
    expect(data.results.errors[0].error).toContain("Slug already exists");
  });

  it("should reject imports with more than 500 offices", async () => {
    const largeOfficesArray = Array.from({ length: 501 }, (_, i) => ({
      title: `Office ${i + 1}`,
      description: `Description ${i + 1}`,
      slug: `office-${i + 1}`,
      arr: 1,
      priceCents: 100000,
      nbPosts: 5,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      amenities: [],
    }));

    const request = new Request(
      "http://localhost:3000/api/admin/offices/bulk-import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offices: largeOfficesArray }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });

  it("should handle validation errors", async () => {
    const invalidOffices = [
      {
        title: "",
        description: "Test description",
        slug: "test-office",
        arr: 25,
        priceCents: -100,
        nbPosts: 0,
        lat: 100,
        lng: 200,
        isFake: false,
        amenities: [],
      },
    ];

    const request = new Request(
      "http://localhost:3000/api/admin/offices/bulk-import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offices: invalidOffices }),
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });
});
