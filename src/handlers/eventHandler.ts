import type { Client } from "discord.js"; import { registerBotEvents } from "../events/index.js";
export const registerEvents = (client: Client) => registerBotEvents(client);
