import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import { leads } from "@/lib/db/schema";
import { desc, asc, eq, like, SQL } from "drizzle-orm";
import {
  createLeadsPaginationResponse,
  normalizePagination,
} from "@/features/offices/utils/pagination";
import { leadsService } from "@/features/offices/repositories/leads.service";

const getLeadsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["pending", "contacted", "converted", "rejected"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "name", "email"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const updateLeadSchema = z.object({
  status: z.enum(["pending", "contacted", "converted", "rejected"]),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = getLeadsSchema.parse(Object.fromEntries(searchParams));

    const whereCondition: SQL[] = [];
    if (params.search) {
      whereCondition.push(like(leads.name, `%${params.search}%`));
    }
    if (params.status) {
      whereCondition.push(eq(leads.status, params.status));
    }

    const totalCount = await leadsService.getLeadsCount(whereCondition);
    const { page, limit } = normalizePagination(params.page, params.limit);

    const leadsData = await leadsService.getLeads(
      whereCondition,
      leads[params.sortBy],
      params.sortOrder === "desc" ? desc : asc,
      page,
      limit
    );

    const response = createLeadsPaginationResponse(
      leadsData,
      page,
      limit,
      totalCount
    );

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error fetching leads:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = updateLeadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("id");

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const updatedLead = await db
      .update(leads)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, parseInt(leadId)))
      .returning();

    if (updatedLead.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead[0],
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
