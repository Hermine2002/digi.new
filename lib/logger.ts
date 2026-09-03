/**
 * Small structured logger for API routes.
 *
 * Deliberately does not accept raw Error/env objects for `meta` without
 * scrubbing, so a stray `logger.error("x", { env: process.env })` can't leak
 * secrets into logs. Keep meta objects small and explicit.
 */

const SECRET_KEY_PATTERN = /key|secret|token|password|authorization/i;

function scrub(meta: Record<string, unknown> | undefined) {
  if (!meta) return undefined;
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    safe[key] = SECRET_KEY_PATTERN.test(key) ? "[redacted]" : value;
  }
  return safe;
}

function format(level: string, scope: string, message: string, meta?: Record<string, unknown>) {
  return JSON.stringify({
    level,
    scope,
    message,
    ...scrub(meta),
    timestamp: new Date().toISOString(),
  });
}

export function createLogger(scope: string) {
  return {
    info(message: string, meta?: Record<string, unknown>) {
      console.log(format("info", scope, message, meta));
    },
    warn(message: string, meta?: Record<string, unknown>) {
      console.warn(format("warn", scope, message, meta));
    },
    error(message: string, meta?: Record<string, unknown>) {
      console.error(format("error", scope, message, meta));
    },
  };
}
