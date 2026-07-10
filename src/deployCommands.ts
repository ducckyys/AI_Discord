import "dotenv/config"; import { REST, Routes } from "discord.js"; import { botConfig } from "./config/bot.js"; import { commands } from "./handlers/commandHandler.js";
const rest = new REST({ version: "10" }).setToken(botConfig.token); const body = commands.map((command) => command.data.toJSON());
if (botConfig.guildId) await rest.put(Routes.applicationGuildCommands(botConfig.clientId, botConfig.guildId), { body }); else await rest.put(Routes.applicationCommands(botConfig.clientId), { body });
