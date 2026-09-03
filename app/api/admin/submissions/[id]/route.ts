import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { createLogger } from "@/lib/logger";

export const runtime = "nodejs";

const logger = createLogger("api.admin.submission");

const patchSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid status value" }, { status: 400 });
  }

  try {
    const updated = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true, submission: updated });
  } catch (err) {
    logger.error("Failed to update submission", {
      id: params.id,
      errorName: err instanceof Error ? err.name : "unknown",
    });
    return NextResponse.json(
      { ok: false, message: "Submission not found or update failed" },
      { status: 404 }
    );
  }
}
