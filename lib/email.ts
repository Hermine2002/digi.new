import { Resend } from "resend";
import { createLogger } from "@/lib/logger";
import type { ContactFormInput } from "@/lib/validation/contact";

const logger = createLogger("email");

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactEmailHtml(data: ContactFormInput, submissionId: string): string {
  const row = (label: string, value?: string) =>
    value
      ? `<tr>
           <td style="padding:8px 12px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;vertical-align:top;">${label}</td>
           <td style="padding:8px 12px;color:#18181b;font-size:14px;">${escapeHtml(value)}</td>
         </tr>`
      : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;">
    <div style="background:#00c050;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#ffffff;font-size:18px;margin:0;">New contact form submission</h1>
    </div>
    <div style="border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;padding:8px 0;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", data.name)}
        ${row("Company", data.company)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}
        ${row("Subject", data.subject)}
      </table>
      <div style="padding:12px 12px 16px;">
        <div style="color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;">Message</div>
        <div style="color:#18181b;font-size:14px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(data.message)}</div>
      </div>
    </div>
    <p style="color:#a1a1aa;font-size:11px;margin-top:16px;">Submission ID: ${escapeHtml(submissionId)} · DigiBase website contact form</p>
  </div>`;
}

function buildContactEmailText(data: ContactFormInput, submissionId: string): string {
  return [
    "New contact form submission",
    "",
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.subject ? `Subject: ${data.subject}` : null,
    "",
    "Message:",
    data.message,
    "",
    `Submission ID: ${submissionId}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Sends the internal notification email to the DigiBase team about a new
 * contact form submission. Throws on failure — callers decide how to
 * handle that (the submission itself is already saved by that point).
 */
export async function sendContactNotificationEmail(
  data: ContactFormInput,
  submissionId: string
): Promise<void> {
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!from || !to) {
    throw new Error("EMAIL_FROM or EMAIL_TO is not configured");
  }

  const client = getResendClient();

  const { error } = await client.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `DigiBase inquiry: ${data.subject?.trim() || data.company}`,
    html: buildContactEmailHtml(data, submissionId),
    text: buildContactEmailText(data, submissionId),
  });

  if (error) {
    logger.error("Resend API returned an error", { submissionId, name: error.name });
    throw new Error("Failed to send notification email");
  }
}
