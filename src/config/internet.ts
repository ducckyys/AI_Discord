import { env } from "../utils/env.js";

export const internetConfig = {
  url: env.SEARXNG_URL.replace(/\/$/, ""),
  timeoutMs: env.SEARXNG_TIMEOUT_MS,
  maxResults: env.SEARXNG_MAX_RESULTS,
} as const;
