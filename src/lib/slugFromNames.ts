import { randomBytes } from "crypto";
import slugify from "slugify";

/**
 * URL-safe slug from display names. When slugify strips everything (e.g. non-Latin only),
 * returns a unique fallback so MongoDB unique index on slug is never violated.
 */
export function slugFromNames(
  firstName: string,
  lastName: string,
  emptyFallbackPrefix: string
): string {
  const base = slugify(`${firstName} ${lastName}`, {
    lower: true,
    strict: true,
  }).trim();
  if (base) return base;
  return `${emptyFallbackPrefix}-${randomBytes(4).toString("hex")}`;
}
