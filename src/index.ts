import Fastify from "fastify";
import { Client, GatewayIntentBits } from "discord.js";
import { botConfig } from "./config/bot.js";
import { env } from "./utils/env.js";
import { logger } from "./utils/logger.js";
import { prisma } from "./database/prisma.js";
import { registerEvents } from "./handlers/eventHandler.js";

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const api = Fastify({ logger: false });
api.get("/health", async () => ({ status: "ok", discord: client.isReady() ? "ready" : "connecting" }));
registerEvents(client);
const shutdown = async (signal: string) => { logger.info({ signal }, "shutdown started"); await api.close(); client.destroy(); await prisma.$disconnect(); logger.info("shutdown complete"); process.exit(0); };
process.once("SIGINT", () => void shutdown("SIGINT")); process.once("SIGTERM", () => void shutdown("SIGTERM"));
await api.listen({ port: env.PORT, host: "127.0.0.1" });
await client.login(botConfig.token);
