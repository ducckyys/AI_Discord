import { env } from "../utils/env.js";
export const aiConfig = { provider: env.AI_PROVIDER, baseUrl: env.LMSTUDIO_URL.replace(/\/$/, ""), model: env.MODEL } as const;
