# DigiBase Backend — Setup & Reference

This document covers the backend that was added to the DigiBase Next.js
site: what it does, how to run it locally, and how to deploy it.

## 1. What was built

The site had exactly one form — the **Contact form** (`/contact`) — which
previously only opened the visitor's email client via a `mailto:` link (no
server, no storage). It now submits to a real backend.

**Flow:**

```
USER fills contact form
  → POST /api/contact  (Next.js Route Handler, Node runtime)
  → validate + sanitize (zod) + rate limit + honeypot check
  → save to Postgres (Prisma) → contact_submissions table
  → send notification email (Resend)
  → send notification SMS (Twilio) — only if explicitly enabled
  → JSON response → success/error toast in the form
```

An internal `/admin` dashboard (token-protected) lists submissions and lets
staff update their status.

## 2. API routes created

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/contact` | `POST` | Validate, store, and notify about a new contact submission | Public (rate-limited) |
| `/api/admin/submissions` | `GET` | List submissions, optional `?status=` filter, paginated | `Authorization: Bearer <ADMIN_API_TOKEN>` |
| `/api/admin/submissions/[id]` | `PATCH` | Update a submission's status (`NEW`/`IN_PROGRESS`/`RESOLVED`/`SPAM`) | `Authorization: Bearer <ADMIN_API_TOKEN>` |

## 3. Database schema

Postgres via Prisma (`prisma/schema.prisma`), table `contact_submissions`:

`id, name, company, email, phone?, subject?, message, status
(NEW/IN_PROGRESS/RESOLVED/SPAM), locale?, ipAddress?, userAgent?,
emailSentAt?, smsSentAt?, createdAt, updatedAt`

Fields mirror exactly what the contact form collects — no extra guessed
fields. Postgres was chosen because it works on any host (including
serverless platforms like Vercel, where a local SQLite file wouldn't
persist).

## 4. Environment variables

See `.env.example` for the full list with comments. Summary:

- `DATABASE_URL` — Postgres connection string
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` — email notifications
- `ENABLE_SMS_NOTIFICATIONS`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `SMS_FROM`, `SMS_TO` — optional SMS notifications (off by default)
- `ADMIN_API_TOKEN` — shared secret for the `/admin` dashboard and admin API

## 5. Email service

**Resend** — chosen because it has the simplest DX for a Next.js app and a
generous free tier. Swappable: all email logic is isolated in `lib/email.ts`
behind a single `sendContactNotificationEmail()` function.

## 6. SMS service

**Twilio**, called directly via `fetch` (no SDK dependency added). The
contact form is a general business inquiry form, not time-critical, so SMS
is **off by default** — enable it by setting `ENABLE_SMS_NOTIFICATIONS=true`
and the Twilio variables in `.env`. Isolated in `lib/sms.ts`.

## 7. Dependencies added

```
@prisma/client, prisma (dev), resend, zod
```

No Twilio SDK, no extra HTTP client — kept the dependency footprint small.

## 8. Files created / modified

**Created**
- `prisma/schema.prisma`
- `lib/prisma.ts`, `lib/logger.ts`, `lib/rate-limit.ts`, `lib/admin-auth.ts`
- `lib/email.ts`, `lib/sms.ts`
- `lib/validation/contact.ts`
- `app/api/contact/route.ts`
- `app/api/admin/submissions/route.ts`
- `app/api/admin/submissions/[id]/route.ts`
- `app/admin/page.tsx`, `app/admin/AdminDashboard.tsx`
- `.env.example`, `.gitignore`, `docker-compose.yml`, `BACKEND_SETUP.md`

**Modified**
- `app/contact/ContactForm.tsx` — now calls `/api/contact` instead of `mailto:`; added loading/success/error states, inline field errors, disabled-while-sending button, and a hidden honeypot field. No visual/design changes.
- `app/layout.tsx` — mounted `<Toaster />` (it was already imported/used via `sonner`'s `toast()` calls in `ContactForm.tsx`, but nothing rendered it, so toasts were silently no-ops before this change).
- `data/dictionary.json` — reworded `contact.toastSuccess` (no longer references opening a mail app) and added `contact.toastError`, in all three languages (hy/en/ru).
- `package.json` — new dependencies + `postinstall`/`db:*` scripts.

## 9. Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Start a local Postgres (or point DATABASE_URL at a hosted one, e.g. Neon)
docker compose up -d

# 3. Configure environment
cp .env.example .env
# then fill in RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, ADMIN_API_TOKEN at minimum

# 4. Create the database table
npx prisma migrate dev --name init

# 5. Run the app
npm run dev
```

Visit `/contact` to submit the form, and `/admin` (with your
`ADMIN_API_TOKEN`) to view submissions.

**Fastest path with no Docker:** create a free Postgres database at
[neon.tech](https://neon.tech) (takes under a minute), paste its connection
string into `DATABASE_URL`, and skip step 2.

## 10. Testing the full flow

1. `npm run dev`, open `/contact`, submit the form with real-looking data.
2. Confirm the success toast appears and the form resets.
3. Check `npx prisma studio` (or `/admin`) — the submission should be there.
4. Check the inbox at `EMAIL_TO` for the notification email.
5. Try submitting again immediately 6 times — the 6th should be rate-limited (HTTP 429).
6. Try submitting with an invalid email — you should see an inline field error, no server round-trip wasted.

## 11. Deploying to production

Any Node.js host works (Vercel, Railway, Render, a VPS with `next start`
behind a process manager, etc.). Vercel example:

1. Push the repo, import it into Vercel.
2. In Vercel Project Settings → Environment Variables, add every variable
   from `.env.example` with real production values (use a hosted Postgres —
   Neon/Supabase/RDS — not `docker-compose.yml`, which is dev-only).
3. Set the build command to `npm run build` (default) — `postinstall` will
   run `prisma generate` automatically.
4. Before or during first deploy, run the migration against the production
   database once: `npx prisma migrate deploy` (locally with `DATABASE_URL`
   pointed at prod, or as a Vercel deploy step / one-off script).
5. Deploy. Verify `/contact` end-to-end against production, then confirm
   `/admin` is reachable only with the correct `ADMIN_API_TOKEN` (it returns
   401 without it).

**Note on the in-memory rate limiter:** `lib/rate-limit.ts` keeps counters
in a module-level `Map`, which is per-instance. On a single long-running
server this is fine. On a platform that spins up multiple serverless
instances, the limit becomes "N requests per instance" rather than a hard
global cap. If that matters for your traffic, swap `lib/rate-limit.ts` for
a shared store (e.g. Upstash Redis) — the rest of the code calls it through
one function (`rateLimit()`), so it's a one-file change.
