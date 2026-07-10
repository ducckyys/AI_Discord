import { env } from "../utils/env.js";

export const imageConfig = {
  provider: env.IMAGE_PROVIDER,
  comfyUiUrl: env.COMFYUI_URL.replace(/\/$/, ""),
  model: env.IMAGE_MODEL,
} as const;
