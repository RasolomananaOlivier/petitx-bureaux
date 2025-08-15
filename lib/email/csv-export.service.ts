import { bucketName } from "@/lib/supabase/storage/config";
import { LeadsService } from "@/features/offices/repositories/leads.service";
import { SQL, gte, lte, eq } from "drizzle-orm";
import { leads } from "@/lib/db/schema";
import { randomUUID } from "crypto";
import { createClient } from "../supabase/server";

export interface CSVExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export class CSVExportService {
  private leadsService = new LeadsService();

  private generateCSVContent(leads: any[]): string {
    const headers = [
      "ID",
      "Nom",
      "Email",
      "Téléphone",
      "Message",
      "Statut",
      "Bureau",
      "Email vérifié",
      "Date de création",
      "Date de modification",
    ];

    const rows = leads.map((lead) => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone || "",
      lead.message || "",
      lead.status,
      lead.office?.title || `Bureau #${lead.officeId}`,
      lead.emailVerifiedAt ? "Oui" : "Non",
      new Date(lead.createdAt).toLocaleDateString("fr-FR"),
      new Date(lead.updatedAt).toLocaleDateString("fr-FR"),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }

  private async uploadCSVToStorage(
    csvContent: string,
    fileName: string
  ): Promise<string> {
    const supabase = await createClient();
    const filePath = `exports/leads/${fileName}`;
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, csvContent, {
        contentType: "text/csv",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload CSV: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async exportLeadsToCSV(leadsData: any[]): Promise<CSVExportResult> {
    try {
      if (leadsData.length === 0) {
        return {
          success: false,
          error: "Aucun lead trouvé pour la période sélectionnée",
        };
      }

      const csvContent = this.generateCSVContent(leadsData);
      const fileName = `leads_${randomUUID()}.csv`;
      const downloadUrl = await this.uploadCSVToStorage(csvContent, fileName);

      return {
        success: true,
        downloadUrl,
      };
    } catch (error) {
      console.error("CSV export error:", error);
      return {
        success: false,
        error: "Erreur lors de l'export CSV",
      };
    }
  }
}

export const csvExportService = new CSVExportService();
