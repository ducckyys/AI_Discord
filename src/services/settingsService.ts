import { prisma } from "../database/prisma.js";
import { env } from "../utils/env.js";

export const settingsService = {
  get: async (guildId: string) => (await prisma.settings.findUnique({ where: { guildId } })) ?? prisma.settings.create({ data: { guildId, model: env.MODEL } }),
  setChannel: (guildId: string, aiChannelId: string | null) => prisma.settings.upsert({ where: { guildId }, create: { guildId, aiChannelId }, update: { aiChannelId } }),
  setModel: (guildId: string, model: string) => prisma.settings.upsert({ where: { guildId }, create: { guildId, model }, update: { model } }),
};
