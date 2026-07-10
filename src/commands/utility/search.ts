import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { InternetService, InternetSearchError } from "../../ai/internet/index.js";

export const searchCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Perform a web search using the configured SearXNG instance")
    .addStringOption((o) => o.setName("query").setDescription("Search query").setRequired(true)),

  async execute(i) {
    const query = i.options.getString("query", true).trim();
    await i.deferReply({ ephemeral: true });
    try {
      const internet = new InternetService();
      const key = i.guildId ? `${i.guildId}:${i.user.id}` : `${i.user.id}`;
      const results = await internet.search(query, key);

      if (!results.length) return void (await i.editReply({ content: "No results found." }));

      const lines = results.map((r, idx) => `${idx + 1}. ${r.title}\n${r.url}\n${r.snippet}`);
      // If message too long, send first few only
      const payload = lines.join("\n\n");
      await i.editReply({ content: payload });
    } catch (err) {
      const message = err instanceof InternetSearchError ? err.message : "Search failed. Check SEARXNG_URL and that the instance is reachable.";
      await i.editReply({ content: message });
    }
  },
};
