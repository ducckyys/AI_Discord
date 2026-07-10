import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { InternetService, InternetSearchError } from "../../ai/internet/index.js";
import { warningEmbed } from "../../embeds/response.js";
import { colors } from "../../utils/colors.js";

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

      if (!results.length) {
        await i.editReply({ embeds: [warningEmbed(`No results found for \`${query}\`.`, "No Results")] });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Search Results")
        .setColor(colors.info)
        .setDescription(`Results for \`${query}\``)
        .addFields(
          results.slice(0, 5).map((result, index) => ({
            name: `${index + 1}. ${result.title.slice(0, 240)}`,
            value: `[Open result](${result.url})\n${result.snippet.slice(0, 700) || "No description available."}`,
          })),
        );

      await i.editReply({ embeds: [embed] });
    } catch (err) {
      const message = err instanceof InternetSearchError ? err.message : "Search failed. Check SEARXNG_URL and that the instance is reachable.";
      await i.editReply({ embeds: [warningEmbed(message, "Search Failed")] });
    }
  },
};
