import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLogger } from "@/lib/logger";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  contactFormSchema,
  flattenZodErrors,
  type ContactFormInput,
} from "@/lib/validation/contact";
import { sendContactNotificationEmail } from "@/lib/email";
import { sendContactNotificationSms, smsNotificationsEnabled } from "@/lib/sms";

// Prisma needs the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }; // 5 submissions / 10 min / IP

function jsonError(
  message: string,
  status: number,
  fieldErrors?: Partial<Record<keyof ContactFormInput, string>>
) {
  return NextResponse.json({ ok: false, message, fieldErrors }, { status });
}

/** Same-origin defense in depth. The form has no session cookie to steal via
 *  CSRF, but rejecting obviously cross-site POSTs costs nothing. */
function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin fetches from same-site pages, curl, etc.
  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get("host");
    return originHost === requestHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const logger = createLogger("api.contact");

  if (!isTrustedOrigin(request)) {
    return jsonError("Invalid request origin", 403);
  }

  const ip = getClientIp(request);
  const { allowed, resetAt } = rateLimit(`contact:${ip}`, RATE_LIMIT);
  if (!allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = contactFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonError("Please check the form and try again.", 400, flattenZodErrors(parsed.error));
  }

  const data = parsed.data;

  // Honeypot tripped: pretend success so bots don't learn to adapt, but do
  // nothing further.
  if (data.website) {
    logger.warn("Honeypot triggered, discarding submission", { ip });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let submissionId: string;
  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        locale: data.locale || null,
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || null,
      },
      select: { id: true },
    });
    submissionId = submission.id;
  } catch (err) {
    logger.error("Failed to save contact submission", {
      ip,
      errorName: err instanceof Error ? err.name : "unknown",
    });
    return jsonError("We couldn't save your message. Please try again shortly.", 500);
  }

  // Email is the primary notification channel; failures here shouldn't fail
  // the whole request since the submission is already safely stored — the
  // team can still see it in the admin dashboard.
  try {
    await sendContactNotificationEmail(data, submissionId);
    await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: { emailSentAt: new Date() },
    });
  } catch (err) {
    logger.error("Failed to send notification email", {
      submissionId,
      errorName: err instanceof Error ? err.name : "unknown",
    });
  }

  if (smsNotificationsEnabled()) {
    try {
      await sendContactNotificationSms(data, submissionId);
      await prisma.contactSubmission.update({
        where: { id: submissionId },
        data: { smsSentAt: new Date() },
      });
    } catch (err) {
      logger.error("Failed to send notification SMS", {
        submissionId,
        errorName: err instanceof Error ? err.name : "unknown",
      });
    }
  }

  return NextResponse.json({ ok: true, id: submissionId }, { status: 200 });
}
