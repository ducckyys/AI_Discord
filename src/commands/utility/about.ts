import { SlashCommandBuilder, EmbedBuilder } from "discord.js"; import type { Command } from "../../interfaces/command.js"; import { colors } from "../../utils/colors.js"; import { env } from "../../utils/env.js";

export const aboutCommand: Command = {
  data: new SlashCommandBuilder().setName("about").setDescription("About Duccky AI"),
  async execute(i) {
    const creatorLink = env.CREATOR_ID ? `[Duck](https://discord.com/users/${env.CREATOR_ID})` : "Duck";
    const embed = new EmbedBuilder()
      .setTitle("About Duccky AI")
      .setColor(colors.info)
      .setDescription("Duccky AI is a self-hosted Discord assistant built to let communities run a local AI bot without cloud API keys.")
      .addFields(
        { name: "Bot", value: "Duccky AI — a local Discord AI assistant using LM Studio behind the scenes.", inline: false },
        { name: "Creator", value: creatorLink, inline: false },
        { name: "Support", value: "Need help or want to contribute? Open an issue in the repo or message the creator on Discord.", inline: false },
      )
      .setFooter({ text: "Built for self-hosted Discord communities." });

    await i.reply({ embeds: [embed], ephemeral: true });
  },
};
