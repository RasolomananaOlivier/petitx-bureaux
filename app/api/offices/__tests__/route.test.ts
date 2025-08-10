import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

describe("GET /api/offices", () => {
  it("should validate filtering parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=2&limit=5&sortBy=price&sortOrder=asc"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it("should handle missing parameters", async () => {
    const request = new NextRequest("http://localhost:3000/api/offices");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(10);
  });

  it("should handle invalid services parameter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services=invalid"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle invalid sort parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?sortBy=invalid&sortOrder=invalid"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle empty services parameter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services="
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle maximum limit parameter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?limit=100"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.limit).toBe(100);
  });

  it("should cap limit parameter at maximum", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?limit=150"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.limit).toBe(100);
  });

  it("should handle negative price filters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPrice=-100&maxPrice=-50"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle price range with no results", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPrice=200000&maxPrice=300000"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle posts range with no results", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPosts=100&maxPosts=200"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle non-existent arrondissement", async () => {
    const request = new NextRequest("http://localhost:3000/api/offices?arr=99");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle mixed valid and invalid services", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services=1,invalid,999"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle single service filter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services=1"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle multiple services filter", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services=1,2,3"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle pagination parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?page=2&limit=5"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(5);
  });

  it("should handle sorting parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?sortBy=price&sortOrder=desc"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle all filter combinations", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?arr=1&minPosts=5&maxPosts=10&minPrice=500&maxPrice=1000&services=1,2&page=1&limit=20&sortBy=posts&sortOrder=asc"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(20);
  });

  it("should handle edge case with very large numbers", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPrice=999999&maxPrice=999999&minPosts=999999&maxPosts=999999"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle zero values", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPrice=0&maxPrice=0&minPosts=0&maxPosts=0"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle decimal values", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?minPrice=100.5&maxPrice=200.75"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle special characters in services", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?services=1,2,3,4,5,6,7,8,9,10"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle empty string parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?arr=&minPosts=&maxPosts=&minPrice=&maxPrice="
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle malformed URL parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?arr=abc&minPosts=def&maxPosts=ghi&minPrice=jkl&maxPrice=mno"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
  });

  it("should handle duplicate parameters", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?arr=1&arr=2&minPosts=5&minPosts=10"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle very long service lists", async () => {
    const longServices = Array.from({ length: 50 }, (_, i) => i + 1).join(",");
    const request = new NextRequest(
      `http://localhost:3000/api/offices?services=${longServices}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.offices)).toBe(true);
  });

  it("should handle boundary values for pagination", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?page=1&limit=1"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(1);
  });

  it("should handle extreme pagination values", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/offices?page=999999&limit=999999"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(999999);
    expect(data.pagination.limit).toBe(100);
  });
});
