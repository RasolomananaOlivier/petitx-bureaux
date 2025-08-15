import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { offices, leads, accounts } from "@/lib/db/schema";
import { eq, gte, isNotNull, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalOffices = await db.$count(offices);
    const publishedOffices = await db.$count(
      offices,
      isNotNull(offices.publishedAt)
    );
    const draftOffices = await db.$count(offices, isNull(offices.publishedAt));

    const leadsThisMonth = await db.$count(
      leads,
      gte(leads.createdAt, startOfMonth)
    );

    const totalLeads = await db.$count(leads);
    const convertedLeads = await db.$count(
      leads,
      eq(leads.status, "converted")
    );

    const activeAccounts = await db.$count(accounts);
    const adminAccounts = await db.$count(accounts, eq(accounts.role, "admin"));
    const editorAccounts = await db.$count(
      accounts,
      eq(accounts.role, "editor")
    );

    const leadsThisMonthCount = leadsThisMonth;
    const totalLeadsCount = totalLeads;
    const convertedLeadsCount = convertedLeads;

    const conversionRate =
      totalLeadsCount > 0 ? (convertedLeadsCount / totalLeadsCount) * 100 : 0;

    return NextResponse.json({
      totalOffices: totalOffices,
      publishedOffices: publishedOffices,
      draftOffices: draftOffices,
      leadsThisMonth: leadsThisMonthCount,
      leadsChangePercent: 0,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeAccounts: activeAccounts,
      adminAccounts: adminAccounts,
      editorAccounts: editorAccounts,
    });
  } catch (error) {
    console.error("KPIs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
