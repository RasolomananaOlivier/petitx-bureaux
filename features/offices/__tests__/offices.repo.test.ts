import { describe, it, expect, beforeEach, vi } from "vitest";

import { offices, photos } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { officesRepository } from "../repositories/offices.repo";
import { testDb } from "@/tests/setup";
import {
  seedMultipleOffices,
  seedOffice,
  seedOfficeService,
  seedService,
} from "@/tests/helpers/db.helper";
import { OfficesService } from "../repositories/offices.service";

describe("officesRepository", () => {
  let officesService: OfficesService;

  beforeEach(() => {
    // Create service instance with test database
    officesService = new OfficesService(testDb);
  });

  describe("getOffices", () => {
    beforeEach(async () => {
      // Seed test data
      await seedMultipleOffices(5);
    });

    it("should return paginated offices", async () => {
      const result = await officesService.getOffices(
        undefined, // no where clause
        offices.id, // sort by id
        asc, // ascending
        1, // page 1
        3 // limit 3
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("photos");
      expect(result[0]).toHaveProperty("officeServices");
    });

    it("should apply where clause correctly", async () => {
      await seedOffice({ title: "Unique Office" });

      const result = await officesService.getOffices(
        eq(offices.title, "Unique Office"),
        offices.id,
        asc,
        1,
        10
      );

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Unique Office");
    });

    it("should handle pagination correctly", async () => {
      // Should return offices 4 and 5 (skip first 3)
      const result = await officesService.getOffices(
        undefined,
        offices.id,
        asc,
        2, // page 2
        3 // limit 3
      );

      expect(result).toHaveLength(2); // Only 2 remaining offices
    });

    it("should sort correctly", async () => {
      const result = await officesService.getOffices(
        undefined,
        offices.title,
        desc,
        1,
        10
      );

      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].title >= result[i].title).toBe(true);
      }
    });

    it("should include related photos and services", async () => {
      const office = await seedOffice();
      const service = await seedService();
      await seedOfficeService(office.id, service.id);

      // Add a photo (you'd need to add this to your helper)
      await testDb.insert(photos).values({
        officeId: office.id,
        url: "https://example.com/photo.jpg",
        alt: "Test photo",
      });

      const result = await officesService.getOffices(
        eq(offices.id, office.id),
        offices.id,
        asc,
        1,
        1
      );

      expect(result[0].photos).toHaveLength(1);
      expect(result[0].officeServices).toHaveLength(1);
      expect(result[0].officeServices[0].service).toEqual(
        expect.objectContaining({ name: service.name })
      );
    });
  });

  describe("getOfficesWithServices", () => {
    it("should return offices that have all specified services", async () => {
      const office1 = await seedOffice({ title: "Office 1" });
      const office2 = await seedOffice({ title: "Office 2" });
      const office3 = await seedOffice({ title: "Office 3" });

      const service1 = await seedService({ name: "Service 1" });
      const service2 = await seedService({ name: "Service 2" });
      const service3 = await seedService({ name: "Service 3" });

      // Office 1 has services 1 and 2
      await seedOfficeService(office1.id, service1.id);
      await seedOfficeService(office1.id, service2.id);

      // Office 2 has services 1, 2, and 3
      await seedOfficeService(office2.id, service1.id);
      await seedOfficeService(office2.id, service2.id);
      await seedOfficeService(office2.id, service3.id);

      // Office 3 has only service 1
      await seedOfficeService(office3.id, service1.id);

      // Search for offices with both service 1 and 2
      const result = await officesService.getOfficesWithServices([
        service1.id,
        service2.id,
      ]);

      expect(result).toHaveLength(2);
      expect(result).toContain(office1.id);
      expect(result).toContain(office2.id);
      expect(result).not.toContain(office3.id);
    });

    it("should return empty array when no offices match all services", async () => {
      const office = await seedOffice();
      const service1 = await seedService({ name: "Service 1" });
      const service2 = await seedService({ name: "Service 2" });

      // Office only has service 1
      await seedOfficeService(office.id, service1.id);

      // Search for offices with both services
      const result = await officesService.getOfficesWithServices([
        service1.id,
        service2.id,
      ]);

      expect(result).toHaveLength(0);
    });

    it("should handle single service filter", async () => {
      const office1 = await seedOffice();
      const office2 = await seedOffice();
      const service1 = await seedService({ name: "Service 1" });
      const service2 = await seedService({ name: "Service 2" });

      await seedOfficeService(office1.id, service1.id);
      await seedOfficeService(office2.id, service2.id);

      const result = await officesService.getOfficesWithServices([service1.id]);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(office1.id);
    });

    it("should handle empty service array", async () => {
      await seedOffice();

      const result = await officesService.getOfficesWithServices([]);

      expect(result).toHaveLength(0);
    });
  });
});
