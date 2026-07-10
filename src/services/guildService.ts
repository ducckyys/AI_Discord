import { prisma } from "../database/prisma.js";
export const guildService = { ensure: (id: string, name: string) => prisma.guild.upsert({ where: { id }, create: { id, name, settings: { create: {} } }, update: { name } }), remove: (id: string) => prisma.guild.delete({ where: { id } }).catch(() => undefined) };
