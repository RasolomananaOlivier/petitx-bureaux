import { describe, it, expect, vi, beforeEach } from "vitest";
import { CSVExportService } from "../csv-export.service";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  })),
}));

vi.mock("@/features/offices/repositories/leads.service", () => ({
  LeadsService: vi.fn().mockImplementation(() => ({
    getLeads: vi.fn(),
  })),
}));

describe("CSVExportService", () => {
  let csvExportService: CSVExportService;

  beforeEach(() => {
    csvExportService = new CSVExportService();
  });

  describe("generateCSVContent", () => {
    it("should generate CSV content with headers", () => {
      const leads = [
        {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          phone: "123456789",
          message: "Test message",
          status: "pending",
          officeId: 1,
          emailVerifiedAt: new Date("2024-01-15"),
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          office: { id: 1, title: "Test Office", slug: "test-office" },
        },
      ];

      const csvContent = (csvExportService as any).generateCSVContent(leads);

      expect(csvContent).toContain(
        '"ID","Nom","Email","Téléphone","Message","Statut","Bureau","Email vérifié","Date de création","Date de modification"'
      );
      expect(csvContent).toContain(
        '"1","Test User","test@example.com","123456789","Test message","pending","Test Office","Oui","15/01/2024","15/01/2024"'
      );
    });

    it("should handle missing optional fields", () => {
      const leads = [
        {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          phone: null,
          message: null,
          status: "pending",
          officeId: 1,
          emailVerifiedAt: null,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          office: null,
        },
      ];

      const csvContent = (csvExportService as any).generateCSVContent(leads);

      expect(csvContent).toContain(
        '"1","Test User","test@example.com","","","pending","Bureau #1","Non","15/01/2024","15/01/2024"'
      );
    });
  });

  describe("uploadCSVToStorage", () => {
    it("should be a private method", () => {
      expect(typeof (csvExportService as any).uploadCSVToStorage).toBe(
        "function"
      );
    });
  });
});
