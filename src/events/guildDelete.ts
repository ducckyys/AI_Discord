import { Events, type Client } from "discord.js"; import { guildService } from "../services/guildService.js"; import { logger } from "../utils/logger.js";
export const registerGuildDelete = (client: Client) => client.on(Events.GuildDelete, async (guild) => { await guildService.remove(guild.id); logger.info({ guildId: guild.id }, "left guild"); });
