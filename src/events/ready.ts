import { Events, type Client } from "discord.js"; import { logger } from "../utils/logger.js";
export const registerReady = (client: Client) => client.once(Events.ClientReady, (ready) => logger.info({ user: ready.user.tag }, "bot started"));
