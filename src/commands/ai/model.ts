import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { successEmbed, warningEmbed } from "../../embeds/response.js";
import { isAdministrator } from "../../middleware/permission.js";
import { settingsService } from "../../services/settingsService.js";

export const modelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("model")
    .setDescription("Set the LM Studio model for this server")
    .addStringOption((o) => o.setName("name").setDescription("Model identifier").setRequired(true)),
  async execute(i) {
    if (!i.guildId || !isAdministrator(i)) {
      await i.reply({
        embeds: [warningEmbed("Administrator permission is required.", "Permission Denied")],
        ephemeral: true,
      });
      return;
    }

    const model = i.options.getString("name", true).trim();
    if (model.length > 100) {
      await i.reply({
        embeds: [warningEmbed("Model names must be 100 characters or fewer.", "Invalid Model Name")],
        ephemeral: true,
      });
      return;
    }

    await settingsService.setModel(i.guildId, model);
    await i.reply({
      embeds: [successEmbed(`LM Studio model set to \`${model}\`.`, "Model Updated")],
      ephemeral: true,
    });
  },
};
