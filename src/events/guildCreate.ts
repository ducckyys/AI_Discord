import { Events, type Client } from "discord.js"; import { guildService } from "../services/guildService.js"; import { logger } from "../utils/logger.js";
export const registerGuildCreate = (client: Client) => client.on(Events.GuildCreate, async (guild) => { await guildService.ensure(guild.id, guild.name); logger.info({ guildId: guild.id }, "joined guild"); });
