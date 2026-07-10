import { SlashCommandBuilder } from "discord.js"; import type { Command } from "../../interfaces/command.js";
export const aboutCommand: Command = { data: new SlashCommandBuilder().setName("about").setDescription("About Duccky AI"), async execute(i) { await i.reply({ content: "Duccky AI is a Discord assistant powered by your local LM Studio server.", ephemeral: true }); } };
