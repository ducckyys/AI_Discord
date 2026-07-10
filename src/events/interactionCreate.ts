import { Events, type ChatInputCommandInteraction, type Client } from "discord.js";
import { z } from "zod";
import { aiService } from "../services/aiService.js";
import { executeCommand } from "../handlers/commandHandler.js";
import { logCommand } from "../middleware/logger.js";
import { settingsService } from "../services/settingsService.js";
import { guildService } from "../services/guildService.js";
import { errorEmbed } from "../embeds/error.js";
import { MAX_PROMPT_LENGTH } from "../utils/constants.js";
import { logger } from "../utils/logger.js";

const promptSchema = z.string().trim().min(1).max(MAX_PROMPT_LENGTH);
export async function askFromInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guildId) return void await interaction.reply({ content: "This command is only available in a server.", ephemeral: true });
  const parsed = promptSchema.safeParse(interaction.options.getString("prompt", true));
  if (!parsed.success) return void await interaction.reply({ content: "Prompt must be between 1 and 4000 characters.", ephemeral: true });
  await interaction.deferReply();
  try { await guildService.ensure(interaction.guildId, interaction.guild?.name ?? "Unknown Guild"); const settings = await settingsService.get(interaction.guildId); const answer = await aiService.ask({ guildId: interaction.guildId, userId: interaction.user.id, channelId: interaction.channelId, question: parsed.data, maxContextMessages: settings.maxContextMessages, model: settings.model }); await interaction.editReply(answer); }
  catch (error) { logger.error({ err: error }, "AI request failed"); await interaction.editReply({ embeds: [errorEmbed("I could not reach LM Studio. Please ensure it is running and a model is loaded.")] }); }
}
export const registerInteractions = (client: Client) => client.on(Events.InteractionCreate, async (interaction) => { if (!interaction.isChatInputCommand()) return; try { logCommand(interaction.commandName, interaction.user.id, interaction.guildId); await executeCommand(interaction); } catch (error) { logger.error({ err: error, command: interaction.commandName }, "command failed"); const payload = { embeds: [errorEmbed("Something went wrong. The error has been logged.")], ephemeral: true }; if (interaction.deferred || interaction.replied) await interaction.followUp(payload); else await interaction.reply(payload); } });
