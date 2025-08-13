import { describe, it, expect, beforeEach, vi } from "vitest";
import { DELETE, GET, PUT } from "../route";
import { db } from "@/lib/db/drizzle";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    transaction: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DELETE /api/admin/offices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an existing office", async () => {
    const mockOffice = { id: 1, title: "Test Office" };
    const mockTransaction = vi.fn().mockResolvedValue(undefined);

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockOffice]),
      }),
    } as any);

    vi.mocked(db.transaction).mockImplementation(mockTransaction);

    const request = new Request("http://localhost:3000/api/admin/offices/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Office deleted successfully");
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should return 404 for non-existent office", async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const request = new Request("http://localhost:3000/api/admin/offices/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Office not found");
  });

  it("should return 400 for invalid ID", async () => {
    const request = new Request(
      "http://localhost:3000/api/admin/offices/invalid",
      {
        method: "DELETE",
      }
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "invalid" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });

  it("should handle database errors", async () => {
    vi.mocked(db.select).mockImplementation(() => {
      throw new Error("Database error");
    });

    const request = new Request("http://localhost:3000/api/admin/offices/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Internal server error");
  });
});

describe("GET /api/admin/offices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch an existing office with relations", async () => {
    const mockOffice = {
      id: 1,
      title: "Test Office",
      description: "Test Description",
      slug: "test-office",
      arr: 1,
      priceCents: 10000,
      nbPosts: 5,
      lat: 48.8566,
      lng: 2.3522,
      isFake: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockOffice]),
          }),
        }),
      } as any)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

    const request = new Request("http://localhost:3000/api/admin/offices/1");

    const response = await GET(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.title).toBe("Test Office");
  });

  it("should return 404 for non-existent office", async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const request = new Request("http://localhost:3000/api/admin/offices/999");

    const response = await GET(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Office not found");
  });
});

describe("PUT /api/admin/offices/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update an existing office", async () => {
    const mockOffice = { id: 1, title: "Test Office" };
    const mockUpdatedOffice = { ...mockOffice, title: "Updated Office" };
    const mockTransaction = vi.fn().mockResolvedValue(mockUpdatedOffice);

    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockOffice]),
      }),
    } as any);

    vi.mocked(db.transaction).mockImplementation(mockTransaction);

    const request = new Request("http://localhost:3000/api/admin/offices/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Office",
        description: "Updated Description",
        slug: "updated-office",
        arr: 2,
        priceCents: 15000,
        nbPosts: 10,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        amenities: ["WiFi", "Coffee"],
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.title).toBe("Updated Office");
    expect(mockTransaction).toHaveBeenCalled();
  });

  it("should return 404 for non-existent office", async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    } as any);

    const request = new Request("http://localhost:3000/api/admin/offices/999", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Office",
        description: "Updated Description",
        slug: "updated-office",
        arr: 2,
        priceCents: 15000,
        nbPosts: 10,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        amenities: ["WiFi", "Coffee"],
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "999" }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Office not found");
  });

  it("should return 409 for duplicate slug", async () => {
    const mockOffice = { id: 1, title: "Test Office" };
    const mockExistingSlug = { id: 2, slug: "existing-slug" };

    vi.mocked(db.select)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockOffice]),
        }),
      } as any)
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockExistingSlug]),
        }),
      } as any);

    const request = new Request("http://localhost:3000/api/admin/offices/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Updated Office",
        description: "Updated Description",
        slug: "existing-slug",
        arr: 2,
        priceCents: 15000,
        nbPosts: 10,
        lat: 48.8566,
        lng: 2.3522,
        isFake: false,
        amenities: ["WiFi", "Coffee"],
      }),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toBe("Slug already exists");
  });
});
