import { env } from "../utils/env.js";
export const botConfig = { token: env.DISCORD_TOKEN, clientId: env.CLIENT_ID, guildId: env.GUILD_ID } as const;
