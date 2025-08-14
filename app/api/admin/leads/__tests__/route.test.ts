import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH } from "../route";
import { testDb } from "@/tests/setup";
import { leads, offices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

describe("Admin Leads API", () => {
  describe("GET /api/admin/leads", () => {
    it("should return leads with pagination", async () => {
      const office = await testDb
        .insert(offices)
        .values({
          title: "Test Office",
          slug: "test-office",
          arr: 1,
          priceCents: 5000,
          lat: 48.8566,
          lng: 2.3522,
        })
        .returning();

      await testDb.insert(leads).values([
        {
          officeId: office[0].id,
          name: "John Doe",
          email: "john@example.com",
          phone: "+33123456789",
          status: "pending",
        },
        {
          officeId: office[0].id,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+33987654321",
          status: "contacted",
        },
      ]);

      const request = new NextRequest("http://localhost:3000/api/admin/leads");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leads).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    it("should filter leads by search query", async () => {
      const office = await testDb
        .insert(offices)
        .values({
          title: "Test Office",
          slug: "test-office",
          arr: 1,
          priceCents: 5000,
          lat: 48.8566,
          lng: 2.3522,
        })
        .returning();

      await testDb.insert(leads).values([
        {
          officeId: office[0].id,
          name: "John Doe",
          email: "john@example.com",
          status: "pending",
        },
        {
          officeId: office[0].id,
          name: "Jane Smith",
          email: "jane@example.com",
          status: "contacted",
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?search=John"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leads).toHaveLength(1);
      expect(data.leads[0].name).toBe("John Doe");
    });

    it("should filter leads by status", async () => {
      const office = await testDb
        .insert(offices)
        .values({
          title: "Test Office",
          slug: "test-office",
          arr: 1,
          priceCents: 5000,
          lat: 48.8566,
          lng: 2.3522,
        })
        .returning();

      await testDb.insert(leads).values([
        {
          officeId: office[0].id,
          name: "John Doe",
          email: "john@example.com",
          status: "pending",
        },
        {
          officeId: office[0].id,
          name: "Jane Smith",
          email: "jane@example.com",
          status: "contacted",
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?status=contacted"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leads).toHaveLength(1);
      expect(data.leads[0].status).toBe("contacted");
    });

    it("should sort leads by creation date", async () => {
      const office = await testDb
        .insert(offices)
        .values({
          title: "Test Office",
          slug: "test-office",
          arr: 1,
          priceCents: 5000,
          lat: 48.8566,
          lng: 2.3522,
        })
        .returning();

      await testDb.insert(leads).values([
        {
          officeId: office[0].id,
          name: "John Doe",
          email: "john@example.com",
          status: "pending",
          createdAt: new Date("2024-01-01"),
        },
        {
          officeId: office[0].id,
          name: "Jane Smith",
          email: "jane@example.com",
          status: "contacted",
          createdAt: new Date("2024-01-02"),
        },
      ]);

      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?sortBy=createdAt&sortOrder=desc"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.leads[0].name).toBe("Jane Smith");
      expect(data.leads[1].name).toBe("John Doe");
    });

    it("should handle invalid query parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?page=invalid"
      );
      const response = await GET(request);

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/admin/leads", () => {
    it("should update lead status", async () => {
      const office = await testDb
        .insert(offices)
        .values({
          title: "Test Office",
          slug: "test-office",
          arr: 1,
          priceCents: 5000,
          lat: 48.8566,
          lng: 2.3522,
        })
        .returning();

      const lead = await testDb
        .insert(leads)
        .values({
          officeId: office[0].id,
          name: "John Doe",
          email: "john@example.com",
          status: "pending",
        })
        .returning();

      const request = new NextRequest(
        `http://localhost:3000/api/admin/leads?id=${lead[0].id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "contacted" }),
        }
      );

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.lead.status).toBe("contacted");

      const updatedLead = await testDb
        .select()
        .from(leads)
        .where(eq(leads.id, lead[0].id));
      expect(updatedLead[0].status).toBe("contacted");
    });

    it("should return 404 for non-existent lead", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?id=999",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "contacted" }),
        }
      );

      const response = await PATCH(request);

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid status", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/admin/leads?id=1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "invalid" }),
        }
      );

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });

    it("should return 400 for missing lead ID", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "contacted" }),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });
  });
});
