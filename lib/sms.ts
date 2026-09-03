import { createLogger } from "@/lib/logger";
import type { ContactFormInput } from "@/lib/validation/contact";

const logger = createLogger("sms");

/**
 * SMS notifications are optional for the contact form (it's a general
 * business inquiry form, not an urgent/emergency one) so this is disabled
 * unless explicitly turned on via ENABLE_SMS_NOTIFICATIONS=true and fully
 * configured. Kept isolated here so it can be wired into other forms later
 * without touching the contact route.
 */
export function smsNotificationsEnabled(): boolean {
  return (
    process.env.ENABLE_SMS_NOTIFICATIONS === "true" &&
    Boolean(process.env.TWILIO_ACCOUNT_SID) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN) &&
    Boolean(process.env.SMS_FROM) &&
    Boolean(process.env.SMS_TO)
  );
}

export async function sendContactNotificationSms(
  data: ContactFormInput,
  submissionId: string
): Promise<void> {
  if (!smsNotificationsEnabled()) return;

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.SMS_FROM!;
  const to = process.env.SMS_TO!;

  const body = `DigiBase: new inquiry from ${data.name} (${data.company}). ${
    data.subject ? `Subject: ${data.subject}. ` : ""
  }Check your email or the admin dashboard for details. #${submissionId.slice(-6)}`;

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
  });

  if (!response.ok) {
    logger.error("Twilio API returned a non-OK status", {
      submissionId,
      status: response.status,
    });
    throw new Error("Failed to send notification SMS");
  }
}
