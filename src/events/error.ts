import { Events, type Client } from "discord.js"; import { logger } from "../utils/logger.js";
export const registerErrors = (client: Client) => client.on(Events.Error, (error) => logger.error({ err: error }, "discord client error"));
