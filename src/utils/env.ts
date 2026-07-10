import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DISCORD_TOKEN: z.string().min(1), CLIENT_ID: z.string().min(1), GUILD_ID: z.string().optional(),
  DATABASE_URL: z.string().min(1), LMSTUDIO_URL: z.string().url().default("http://localhost:1234/v1"),
  AI_PROVIDER: z.literal("lmstudio").default("lmstudio"), MODEL: z.string().min(1).default("qwen3"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});
export const env = schema.parse(process.env);
