import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { colors } from "../../utils/colors.js";

export const helpCommand: Command = {
	data: new SlashCommandBuilder().setName("help").setDescription("Show Duccky AI help"),
	async execute(i) {
		const embed = new EmbedBuilder()
			.setTitle("Duccky AI — Command Reference")
			.setColor(colors.info)
			.setDescription("Grouped examples for the bot's slash commands. Use the examples in Discord's command UI or mention the bot for free-form chat.")
			.addFields(
				{ name: "Chat / Ask", value: "`/ask prompt:<text>` — Ask directly via slash. Example: `/ask prompt:Summarize today's server announcements.`\nOr mention: `@Duccky AI What's the status?`\nTo include an image, attach it in the same message.", inline: false },
				{ name: "AI Channel", value: "`/config channel [#channel]` — Administrator only. Select a text channel to confine bot replies to that channel. To disable dedicated channel: run `/config channel` and submit without choosing a channel (leave option empty). The bot will switch to mention-only mode.", inline: false },
				{ name: "Model", value: "`/model name:<model-id>` — Administrator only. Pins the LM Studio model for this server. Example: `/model name:google/gemma-4-e4b`. Pinned model overrides auto-discovery and `.env` fallback.", inline: false },
				{ name: "Live Search", value: "`/search query:<terms>` — Runs web search via SearXNG and includes results in the prompt. Example: `/search query:latest Node.js release`. Requires `SEARXNG_URL` in `.env`.", inline: false },
				{ name: "Memory & Context", value: "`/reset` — Clear conversation memory for the current channel.\n`/memory` — Show what the bot stores for this channel.", inline: false },
				{ name: "Status & Utilities", value: "`/status` — Show bot uptime, latency, configured AI channel, model, memory window, rate limits.\n`/ping` — Discord latency.\n`/help` — Show this help.\n`/about` — Short info about the bot.\n`/invite` — Bot invite URL.", inline: false },
				{ name: "Admin / Maintenance", value: "`/reload` — Explains that commands load on restart.\n`/shutdown` — Gracefully stop the bot (admin only).", inline: false },
			)
			.setFooter({ text: "Full docs and examples: see README.md in the repository." });

		await i.reply({ embeds: [embed], ephemeral: true });
	},
};
