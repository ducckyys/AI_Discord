import { SlashCommandBuilder } from "discord.js"; import type { Command } from "../../interfaces/command.js";
export const pingCommand: Command = { data: new SlashCommandBuilder().setName("ping").setDescription("Check bot latency"), async execute(i) { await i.reply({ content: `Pong! ${i.client.ws.ping}ms`, ephemeral: true }); } };
