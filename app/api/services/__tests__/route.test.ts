import { describe, it, expect } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

describe("GET /api/services", () => {
  it("should return all services", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    data.forEach((service: any) => {
      expect(service).toHaveProperty("id");
      expect(service).toHaveProperty("name");
      expect(typeof service.id).toBe("number");
      expect(typeof service.name).toBe("string");
    });
  });
});
