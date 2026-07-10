import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { colors } from "../../utils/colors.js";

export const helpCommand: Command = {
	data: new SlashCommandBuilder().setName("help").setDescription("Show Duccky AI help"),
	async execute(i) {
		const embed = new EmbedBuilder()
			.setTitle("Duccky AI — Command Reference")
			.setColor(colors.info)
			.setDescription("Use the slash commands below, or mention the bot for free-form chat. Every registered command is shown here.")
			.addFields(
				{
					name: "Chat",
					value:
						"**`/ask prompt:<text>`** — Ask the bot directly via slash.\n" +
						"Example: `/ask prompt:Summarize today's server announcements.`\n" +
						"Or mention the bot: `@Duccky AI What's the status?`\n" +
						"Attach an image to include it in the request.",
					inline: false,
				},
				{
					name: "Setup",
					value:
						"**`/config channel [#channel]`** — Admin only. Set a dedicated AI channel.\n" +
						"If you want to disable it, run `/config channel` without selecting a channel. The bot returns to mention-only mode.\n\n" +
						"**`/model name:<model-id>`** — Admin only. Set the LM Studio model for this server.\n" +
						"Example: `/model name:google/gemma-4-e4b`\n" +
						"Pinned model overrides auto-discovery and `.env` fallback.",
					inline: false,
				},
				{
					name: "Search",
					value:
						"**`/search query:<terms>`** — Run live web search through SearXNG.\n" +
						"Example: `/search query:latest Node.js release`\n" +
						"Requires `SEARXNG_URL` configured in `.env`.",
					inline: false,
				},
				{
					name: "Memory",
					value:
						"**`/reset`** — Clear conversation memory in the current channel.\n" +
						"**`/memory`** — Show what the bot remembers for this channel.",
					inline: false,
				},
				{
					name: "Status & Info",
					value:
						"**`/status`** — Show uptime, latency, AI channel, model, memory window, and rate limits.\n" +
						"**`/ping`** — Ping the bot.\n" +
						"**`/help`** — Show this help page.\n" +
						"**`/about`** — About the bot and creator.\n" +
						"**`/invite`** — Get the bot invite URL.",
					inline: false,
				},
				{
					name: "Admin / Maintenance",
					value:
						"**`/reload`** — Explain that commands load on restart.\n" +
						"**`/shutdown`** — Gracefully stop the bot (admin only).",
					inline: false,
				},
			)
			.setFooter({ text: "Need more? Read the repo README for full setup and command examples." });

		await i.reply({ embeds: [embed], ephemeral: true });
	},
};
