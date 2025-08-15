import { describe, it, expect } from "vitest";
import {
  generateCSVTemplate,
  parseCSV,
  validateCSVHeaders,
  type CSVRow,
} from "../csv-utils";

describe("CSV Utils", () => {
  describe("generateCSVTemplate", () => {
    it("should generate a valid CSV template", () => {
      const template = generateCSVTemplate();

      expect(template).toContain(
        '"title","description","slug","arr","priceCents","nbPosts","lat","lng","isFake","amenities"'
      );
      expect(template).toContain("Bureau moderne - Champs-Élysées");
      expect(template).toContain("bureau-champs-elysees");
    });

    it("should include all required headers", () => {
      const template = generateCSVTemplate();
      const lines = template.split("\n");
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""));

      const requiredHeaders = [
        "title",
        "description",
        "slug",
        "arr",
        "priceCents",
        "nbPosts",
        "lat",
        "lng",
        "isFake",
        "amenities",
      ];

      requiredHeaders.forEach((header) => {
        expect(headers).toContain(header);
      });
    });
  });

  describe("parseCSV", () => {
    it("should parse valid CSV data", () => {
      const csvData = `title,description,slug,arr,priceCents,nbPosts,lat,lng,isFake,amenities
"Test Office","Test Description","test-office","1","100000","5","48.8566","2.3522","false","WiFi;Parking"`;

      const result = parseCSV(csvData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: "Test Office",
        description: "Test Description",
        slug: "test-office",
        arr: "1",
        priceCents: "100000",
        nbPosts: "5",
        lat: "48.8566",
        lng: "2.3522",
        isFake: "false",
        amenities: "WiFi;Parking",
      });
    });

    it("should handle empty CSV", () => {
      const csvData = `title,description,slug,arr,priceCents,nbPosts,lat,lng,isFake,amenities`;

      const result = parseCSV(csvData);

      expect(result).toHaveLength(0);
    });

    it("should throw error for invalid CSV", () => {
      const invalidCsv = `title,description,slug
"Test Office","Test Description"`;

      expect(() => parseCSV(invalidCsv)).toThrow("Invalid CSV format");
    });
  });

  describe("validateCSVHeaders", () => {
    it("should return empty array for valid headers", () => {
      const headers = [
        "title",
        "description",
        "slug",
        "arr",
        "priceCents",
        "nbPosts",
        "lat",
        "lng",
        "isFake",
        "amenities",
      ];

      const missingHeaders = validateCSVHeaders(headers);

      expect(missingHeaders).toHaveLength(0);
    });

    it("should return missing headers", () => {
      const headers = ["title", "description", "slug"];

      const missingHeaders = validateCSVHeaders(headers);

      expect(missingHeaders).toContain("arr");
      expect(missingHeaders).toContain("priceCents");
      expect(missingHeaders).toContain("nbPosts");
      expect(missingHeaders).toContain("lat");
      expect(missingHeaders).toContain("lng");
      expect(missingHeaders).toContain("isFake");
      expect(missingHeaders).toContain("amenities");
    });
  });
});
