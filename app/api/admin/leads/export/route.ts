import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { csvExportService } from "@/lib/email/csv-export.service";
import { emailService } from "@/lib/email/email.service";
import { LeadsService } from "@/features/offices/repositories/leads.service";
import { SQL, gte, lte, eq, desc } from "drizzle-orm";
import { leads } from "@/lib/db/schema";

const exportLeadsSchema = z.object({
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().min(1, "Date de fin requise"),
  status: z
    .enum(["all", "pending", "contacted", "converted", "rejected"])
    .optional()
    .default("all"),
  email: z.string().email("Email invalide"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = exportLeadsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { startDate, endDate, status, email } = validationResult.data;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
      return NextResponse.json(
        { error: "La date de début doit être antérieure à la date de fin" },
        { status: 400 }
      );
    }

    const leadsService = new LeadsService();
    const endDateWithTime = new Date(endDateObj);
    endDateWithTime.setHours(23, 59, 59, 999);

    const whereConditions: SQL[] = [
      gte(leads.createdAt, startDateObj),
      lte(leads.createdAt, endDateWithTime),
    ];

    if (status !== "all") {
      whereConditions.push(eq(leads.status, status));
    }

    const leadsData = await leadsService.getLeads(
      whereConditions,
      "createdAt",
      desc,
      1,
      10000
    );

    if (leadsData.length === 0) {
      return NextResponse.json(
        { error: "Aucun lead trouvé pour la période sélectionnée" },
        { status: 404 }
      );
    }

    const exportResult = await csvExportService.exportLeadsToCSV(leadsData);

    if (!exportResult.success || !exportResult.downloadUrl) {
      return NextResponse.json(
        { error: exportResult.error || "Erreur lors de l'export" },
        { status: 500 }
      );
    }

    try {
      await emailService.sendCSVExportEmail(
        email,
        exportResult.downloadUrl,
        startDate,
        endDate,
        leadsData.length
      );
    } catch (emailError) {
      console.error("Failed to send CSV export email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Export créé mais l'email n'a pas pu être envoyé",
          downloadUrl: exportResult.downloadUrl,
        },
        { status: 201 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Export CSV envoyé par email avec succès",
      leadCount: leadsData.length,
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
