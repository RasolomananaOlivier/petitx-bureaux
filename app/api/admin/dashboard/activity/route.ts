import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { auditLog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const recentActivity = await db
      .select({
        id: auditLog.id,
        action: auditLog.action,
        targetTable: auditLog.targetTable,
        targetId: auditLog.targetId,
        createdAt: auditLog.createdAt,
        actorId: auditLog.actorId,
      })
      .from(auditLog)
      .orderBy(desc(auditLog.createdAt))
      .limit(5);

    return NextResponse.json(
      recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        targetTable: log.targetTable,
        targetId: log.targetId,
        actorName: `User ${log.actorId}`,
        createdAt: log.createdAt,
      }))
    );
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
