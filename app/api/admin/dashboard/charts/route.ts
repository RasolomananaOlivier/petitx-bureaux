import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { offices, leads } from "@/lib/db/schema";
import { eq, gte, desc, sql, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    const dateExpr = sql`DATE(${leads.createdAt})`;
    const leadsOverTime = await db
      .select({
        date: dateExpr,
        count: count(),
      })
      .from(leads)
      .where(
        gte(leads.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
      )
      .groupBy(dateExpr)
      .orderBy(dateExpr)
      .limit(7);

    const topPerformingOffices = await db
      .select({
        officeId: leads.officeId,
        officeTitle: offices.title,
        leadCount: count(),
      })
      .from(leads)
      .innerJoin(offices, eq(leads.officeId, offices.id))
      .where(
        gte(leads.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
      )
      .groupBy(leads.officeId, offices.title)
      .orderBy(desc(count()))
      .limit(3);

    const conversionFunnel = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.status);

    return NextResponse.json({
      leadsOverTime: leadsOverTime.map((item) => ({
        date: item.date,
        count: Number(item.count),
      })),
      topPerformingOffices: topPerformingOffices.map((item) => ({
        officeId: item.officeId,
        title: item.officeTitle,
        leadCount: Number(item.leadCount),
      })),
      conversionFunnel: conversionFunnel.map((item) => ({
        status: item.status,
        count: Number(item.count),
      })),
    });
  } catch (error) {
    console.error("Charts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
