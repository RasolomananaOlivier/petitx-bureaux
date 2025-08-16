import { describe, it, expect, vi } from "vitest";
import { POST } from "../route";
import { db } from "@/lib/db/drizzle";
import { offices, photos } from "@/lib/db/schema";
import { OfficeRepo } from "@/lib/repositories/office.repo";
import {
  createOfficeFactory,
  getOfficeFactory,
} from "@/lib/db/factories/office.factory";

vi.mock("@/lib/repositories/office.repo", () => ({
  OfficeRepo: {
    findById: vi.fn(),
    duplicateOffice: vi.fn(),
  },
}));

describe("POST /api/admin/offices/[id]/duplicate", () => {
  it("should duplicate an existing office", async () => {
    const existingOffice = getOfficeFactory();
    vi.mocked(OfficeRepo.findById).mockResolvedValue(existingOffice);

    vi.mocked(OfficeRepo.duplicateOffice).mockResolvedValue({
      ...existingOffice,
      id: existingOffice.id + 1,
      title: `${existingOffice.title} (2)`,
      slug: `${existingOffice.slug}-2`,
    });

    const params = Promise.resolve({ id: existingOffice.id.toString() });
    const request = new Request(
      "http://localhost:3000/api/admin/offices/1/duplicate"
    );
    const response = await POST(request, { params });

    const data = await response.json();
    expect(data.message).toBe("Office duplicated successfully");
    expect(response.status).toBe(200);
  });

  it("should return 404 for non-existent office", async () => {
    vi.mocked(OfficeRepo.findById).mockResolvedValue(undefined);

    const params = Promise.resolve({ id: "999" });
    const request = new Request(
      "http://localhost:3000/api/admin/offices/999/duplicate"
    );
    const response = await POST(request, { params });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Office not found");
  });

  it("should return 400 for invalid office id", async () => {
    const params = Promise.resolve({ id: "invalid" });
    const request = new Request(
      "http://localhost:3000/api/admin/offices/invalid/duplicate"
    );
    const response = await POST(request, { params });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });
});
