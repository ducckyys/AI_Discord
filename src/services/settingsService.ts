import { prisma } from "../database/prisma.js";
export const settingsService = {
  get: async (guildId: string) => (await prisma.settings.findUnique({ where: { guildId } })) ?? prisma.settings.create({ data: { guildId } }),
  setChannel: (guildId: string, aiChannelId: string | null) => prisma.settings.upsert({ where: { guildId }, create: { guildId, aiChannelId }, update: { aiChannelId } }),
  setModel: (guildId: string, model: string) => prisma.settings.upsert({ where: { guildId }, create: { guildId, model }, update: { model } }),
};
