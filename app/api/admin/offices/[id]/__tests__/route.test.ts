import { describe, it, expect, beforeEach, vi } from "vitest";
import { DELETE } from "../route";
import { db } from "@/lib/db/drizzle";
import { offices, photos, officeServices } from "@/lib/db/schema";

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    select: vi.fn(),
    transaction: vi.fn(),
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
