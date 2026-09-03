import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const logger = createLogger("api.admin.submissions");

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const status = searchParams.get("status");

  try {
    const where =
      status && ["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"].includes(status)
        ? { status: status as "NEW" | "IN_PROGRESS" | "RESOLVED" | "SPAM" }
        : {};

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      submissions,
      pagination: { page, pageSize: PAGE_SIZE, total },
    });
  } catch (err) {
    logger.error("Failed to list submissions", {
      errorName: err instanceof Error ? err.name : "unknown",
    });
    return NextResponse.json(
      { ok: false, message: "Failed to load submissions" },
      { status: 500 }
    );
  }
}
