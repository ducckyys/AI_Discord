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
import { attachmentToChatImage, imageAttachments } from "../utils/attachments.js";
import { toDiscordAttachments } from "../utils/discordFiles.js";

const promptSchema = z.string().trim().min(1).max(MAX_PROMPT_LENGTH);
export async function askFromInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!interaction.guildId) return void await interaction.reply({ content: "This command is only available in a server.", ephemeral: true });
  const parsed = promptSchema.safeParse(interaction.options.getString("prompt", true));
  if (!parsed.success) return void await interaction.reply({ content: "Prompt must be between 1 and 4000 characters.", ephemeral: true });
  const image = interaction.options.getAttachment("image");
  const images = image ? imageAttachments([image]) : [];
  if (image && !images.length) return void await interaction.reply({ content: "Unsupported image type. Please send PNG, JPG, WEBP, or GIF.", ephemeral: true });
  await interaction.deferReply();
  try { await guildService.ensure(interaction.guildId, interaction.guild?.name ?? "Unknown Guild"); const settings = await settingsService.get(interaction.guildId); const chatImages = await Promise.all(images.map(attachmentToChatImage)); const answer = await aiService.askDetailed({ guildId: interaction.guildId, userId: interaction.user.id, channelId: interaction.channelId, question: parsed.data, maxContextMessages: settings.maxContextMessages, model: settings.model, images: chatImages }); await interaction.editReply({ content: answer.content, files: toDiscordAttachments(answer.files) }); }
  catch (error) { logger.error({ err: error }, "AI request failed"); const message = error instanceof Error && /image|attachment|download|unsupported|large/i.test(error.message) ? error.message : "I could not reach LM Studio. Please ensure it is running and a model is loaded."; await interaction.editReply({ embeds: [errorEmbed(message)] }); }
}
export const registerInteractions = (client: Client) => client.on(Events.InteractionCreate, async (interaction) => { if (!interaction.isChatInputCommand()) return; try { logCommand(interaction.commandName, interaction.user.id, interaction.guildId); await executeCommand(interaction); } catch (error) { logger.error({ err: error, command: interaction.commandName }, "command failed"); const payload = { embeds: [errorEmbed("Something went wrong. The error has been logged.")], ephemeral: true }; if (interaction.deferred || interaction.replied) await interaction.followUp(payload); else await interaction.reply(payload); } });
