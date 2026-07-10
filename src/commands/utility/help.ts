import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";

export const helpCommand: Command = {
	data: new SlashCommandBuilder().setName("help").setDescription("Show Duccky AI help"),
	async execute(i) {
		await i.reply({
			content:
				"Use /ask to chat or mention me in any channel.\n" +
				"To configure a dedicated AI channel run `/config channel` and pick a text channel. To disable the dedicated channel run `/config channel` without selecting a channel.\n" +
				"Use `/search query:<terms>` to run a live web search (requires a configured SearXNG instance).\n" +
				"Use `/reset` to clear context.",
			ephemeral: true,
		});
	},
};
