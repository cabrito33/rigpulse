/**
 * Global site configuration and environment-derived constants.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const DATA_LAST_REVIEWED = "2026-10-30";
