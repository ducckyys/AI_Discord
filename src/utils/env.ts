import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DISCORD_TOKEN: z.string().min(1), CLIENT_ID: z.string().min(1), GUILD_ID: z.string().optional(),
  DATABASE_URL: z.string().min(1), LMSTUDIO_URL: z.string().url().default("http://localhost:1234/v1"),
  AI_PROVIDER: z.literal("lmstudio").default("lmstudio"), MODEL: z.string().min(1).default("qwen3"),
  SEARCH_PROVIDER: z.enum(["brave", "tavily"]).default("brave"), BRAVE_API_KEY: z.string().optional(), TAVILY_API_KEY: z.string().optional(),
  IMAGE_PROVIDER: z.literal("comfyui").default("comfyui"), COMFYUI_URL: z.string().url().default("http://127.0.0.1:8188"), IMAGE_MODEL: z.string().min(1).default("flux1-schnell"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});
export const env = schema.parse(process.env);
