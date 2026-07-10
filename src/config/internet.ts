import { env } from "../utils/env.js";

export const internetConfig = {
  provider: env.SEARCH_PROVIDER,
  braveApiKey: env.BRAVE_API_KEY,
  tavilyApiKey: env.TAVILY_API_KEY,
} as const;
