import { Events, type Client } from "discord.js";
import { z } from "zod";
import { aiService } from "../services/aiService.js";
import { guildService, settingsService, userService } from "../services/index.js";
import { isRateLimited } from "../middleware/rateLimiter.js";
import { remainingCooldown } from "../middleware/cooldown.js";
import { DEFAULT_COOLDOWN_MS, DEFAULT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_WINDOW_MS, MAX_PROMPT_LENGTH } from "../utils/constants.js";
import { logger } from "../utils/logger.js";
import { splitMessage } from "../utils/formatter.js";
import { attachmentToChatImage, imageAttachments } from "../utils/attachments.js";
import { toDiscordAttachments } from "../utils/discordFiles.js";

const promptSchema = z.string().trim().min(1).max(MAX_PROMPT_LENGTH);

export const registerMessages = (client: Client) => client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild || !client.user) return;

  await guildService.ensure(message.guild.id, message.guild.name);
  const settings = await settingsService.get(message.guild.id);
  const mentioned = message.mentions.has(client.user);
  const dedicated = settings.aiChannelId === message.channel.id;
  if (!mentioned && !dedicated) return;

  const images = imageAttachments(message.attachments.values());
  const prompt = message.content.replace(new RegExp(`^<@!?${client.user.id}>\\s*`), "").trim() || (images.length ? "Please describe this image." : "");
  const parsed = promptSchema.safeParse(prompt);
  if (!parsed.success) return void await message.reply("Please send a prompt between 1 and 4000 characters.");

  const key = `${message.guild.id}:${message.author.id}`;
  if (isRateLimited(key, settings.rateLimitMax ?? DEFAULT_RATE_LIMIT_MAX, settings.rateLimitWindowMs ?? DEFAULT_RATE_LIMIT_WINDOW_MS)) return void await message.reply("You are sending requests too quickly. Please try again shortly.");

  const remaining = remainingCooldown(key, settings.cooldownMs ?? DEFAULT_COOLDOWN_MS);
  if (remaining) return void await message.reply(`Please wait ${Math.ceil(remaining / 1000)}s before asking again.`);

  try {
    await userService.ensure(message.author.id, message.author.username, message.author.bot);
    await message.channel.sendTyping();
    logger.info({ guildId: message.guild.id, userId: message.author.id, images: images.length }, "AI mention request");

    const chatImages = await Promise.all(images.slice(0, 4).map(attachmentToChatImage));
    const answer = await aiService.askDetailed({ guildId: message.guild.id, userId: message.author.id, channelId: message.channel.id, question: parsed.data, messageId: message.id, maxContextMessages: settings.maxContextMessages, model: settings.model, images: chatImages });
    const chunks = splitMessage(answer.content);
    const files = toDiscordAttachments(answer.files);
    await message.reply({ content: chunks[0] ?? "Done.", files, allowedMentions: { repliedUser: false } });
    for (const chunk of chunks.slice(1)) await message.reply({ content: chunk, allowedMentions: { repliedUser: false } });
  } catch (error) {
    logger.error({ err: error }, "AI mention request failed");
    const messageText = error instanceof Error && /image|attachment|download|unsupported|large/i.test(error.message) ? error.message : "I could not reach LM Studio right now. Please try again later.";
    await message.reply(messageText);
  }
});
