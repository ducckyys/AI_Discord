import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { settingsService } from "../../services/settingsService.js";
import { formatDuration } from "../../utils/time.js";

export const statusCommand: Command = {
  data: new SlashCommandBuilder().setName("status").setDescription("Show bot and server AI status"),
  async execute(i) {
    if (!i.guildId) return void await i.reply({ content: "This command is only available in a server.", ephemeral: true });

    const settings = await settingsService.get(i.guildId);
    const aiChannel = settings.aiChannelId ? `<#${settings.aiChannelId}>` : "Mention-only mode";
    const cooldown = formatDuration(settings.cooldownMs);
    const rateWindow = formatDuration(settings.rateLimitWindowMs);

    await i.reply({
      content: [
        `Status: online (${i.client.ws.ping}ms Discord latency)`,
        `Uptime: ${formatDuration(process.uptime() * 1000)}`,
        `AI channel: ${aiChannel}`,
        `Model: ${settings.model}`,
        `Memory window: ${settings.maxContextMessages} messages`,
        `Rate limit: ${settings.rateLimitMax} prompts per ${rateWindow}`,
        `Cooldown: ${cooldown}`,
      ].join("\n"),
      ephemeral: true,
    });
  },
};
