import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { settingsService } from "../../services/settingsService.js";
import { formatDuration } from "../../utils/time.js";
import { warningEmbed } from "../../embeds/response.js";

export const statusCommand: Command = {
  data: new SlashCommandBuilder().setName("status").setDescription("Show bot and server AI status"),
  async execute(i) {
    if (!i.guildId) return void await i.reply({ embeds: [warningEmbed("This command is only available in a server.", "Server Only")], ephemeral: true });

    const settings = await settingsService.get(i.guildId);
    const aiChannel = settings.aiChannelId ? `<#${settings.aiChannelId}>` : "Mention-only mode";
    const cooldown = formatDuration(settings.cooldownMs);
    const rateWindow = formatDuration(settings.rateLimitWindowMs);
    const embed = new EmbedBuilder()
      .setTitle("Duccky AI Status")
      .setColor(0x5865f2)
      .addFields(
        { name: "Discord latency", value: `${i.client.ws.ping}ms`, inline: true },
        { name: "Uptime", value: formatDuration(process.uptime() * 1000), inline: true },
        { name: "AI channel", value: aiChannel, inline: false },
        { name: "Model", value: settings.model, inline: false },
        { name: "Memory window", value: `${settings.maxContextMessages} messages`, inline: true },
        { name: "Rate limit", value: `${settings.rateLimitMax} prompts / ${rateWindow}`, inline: true },
        { name: "Cooldown", value: cooldown, inline: true },
      );

    await i.reply({ embeds: [embed], ephemeral: true });
  },
};
