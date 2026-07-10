import { env } from "../utils/env.js";

export const imageConfig = {
  provider: env.IMAGE_PROVIDER,
  url: env.COMFYUI_URL.replace(/\/$/, ""),
  model: env.IMAGE_MODEL,
  workflowPath: env.COMFYUI_WORKFLOW_PATH,
  timeoutMs: env.COMFYUI_TIMEOUT_MS,
  pollIntervalMs: env.COMFYUI_POLL_INTERVAL_MS,
} as const;
