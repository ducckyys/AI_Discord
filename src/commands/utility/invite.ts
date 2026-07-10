import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { warningEmbed } from "../../embeds/response.js";
import { colors } from "../../utils/colors.js";

export const inviteCommand: Command = {
  data: new SlashCommandBuilder().setName("invite").setDescription("Get the bot invite URL"),
  async execute(i) {
    const id = i.client.user?.id;

    if (!id) {
      await i.reply({
        embeds: [warningEmbed("The bot is still starting up. Please try again in a moment.", "Bot Not Ready")],
        ephemeral: true,
      });
      return;
    }

    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot%20applications.commands&permissions=274877975552`;
    const embed = new EmbedBuilder()
      .setTitle("Invite Duccky AI")
      .setURL(inviteUrl)
      .setColor(colors.info)
      .setDescription("Add Duccky AI to another server with the link below.")
      .addFields({ name: "Bot invite", value: `[Click here to invite Duccky AI](${inviteUrl})` })
      .setFooter({ text: "You need the Manage Server permission to add a bot." });

    await i.reply({ embeds: [embed], ephemeral: true });
  },
};
