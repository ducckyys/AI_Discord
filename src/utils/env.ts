import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DISCORD_TOKEN: z.string().min(1), CLIENT_ID: z.string().min(1), GUILD_ID: z.string().optional(),
  DATABASE_URL: z.string().min(1), LMSTUDIO_URL: z.string().url().default("http://localhost:1234/v1"),
  AI_PROVIDER: z.literal("lmstudio").default("lmstudio"), MODEL: z.string().min(1).default("qwen3"),
  IMAGE_PROVIDER: z.literal("comfyui").default("comfyui"), COMFYUI_URL: z.string().url().default("http://127.0.0.1:8188"),
  IMAGE_MODEL: z.string().min(1).default("flux.1-schnell"), COMFYUI_WORKFLOW_PATH: z.string().optional(),
  COMFYUI_TIMEOUT_MS: z.coerce.number().int().min(10_000).max(300_000).default(120_000), COMFYUI_POLL_INTERVAL_MS: z.coerce.number().int().min(250).max(10_000).default(1_000),
  SEARXNG_URL: z.string().url().default("http://127.0.0.1:8080"), SEARXNG_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(10_000), SEARXNG_MAX_RESULTS: z.coerce.number().int().min(1).max(10).default(5),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});
export const env = schema.parse(process.env);
