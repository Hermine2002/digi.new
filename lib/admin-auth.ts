/**
 * Very small bearer-token gate for the internal admin endpoints.
 *
 * This intentionally isn't a full auth system (no users table, no
 * sessions) — it's a single shared secret for internal staff, similar to a
 * "backstage door" key. If the admin dashboard grows beyond a couple of
 * trusted staff members, replace this with real authentication
 * (NextAuth.js, Clerk, etc.) rather than adding more shared tokens.
 */
export function isAuthorizedAdmin(request: Request): boolean {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) return false; // fail closed if not configured

  const header = request.headers.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return false;

  return timingSafeEqual(token, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
