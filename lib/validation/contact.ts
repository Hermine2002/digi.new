import { z } from "zod";

// Loose but useful phone check: digits, spaces, parens, dashes, optional
// leading +. We intentionally don't over-validate international formats.
const PHONE_PATTERN = /^[+]?[0-9\s()-]{6,20}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(200, "Name is too long"),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(200, "Company name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(320),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(PHONE_PATTERN, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(300).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message is too short")
    .max(5000, "Message is too long"),
  locale: z.enum(["hy", "en", "ru"]).optional(),
  // Honeypot field: real users never fill this in (it's visually hidden).
  // Deliberately unconstrained here — the route handler checks for a
  // non-empty value and silently drops the submission. Rejecting it at the
  // schema level would return a validation error a bot could learn from.
  website: z.string().optional().or(z.literal("")),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export type ContactFormFieldErrors = Partial<
  Record<keyof ContactFormInput, string>
>;

export function flattenZodErrors(error: z.ZodError): ContactFormFieldErrors {
  const fieldErrors: ContactFormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactFormInput | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
