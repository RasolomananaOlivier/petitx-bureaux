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
    const response = await POST({ params });

    const data = await response.json();
    expect(data.message).toBe("Office duplicated successfully");
    expect(response.status).toBe(200);
  });

  it("should return 404 for non-existent office", async () => {
    vi.mocked(OfficeRepo.findById).mockResolvedValue(undefined);

    const params = Promise.resolve({ id: "999" });
    const response = await POST({ params });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Office not found");
  });

  it("should return 400 for invalid office id", async () => {
    const params = Promise.resolve({ id: "invalid" });
    const response = await POST({ params });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });
});
