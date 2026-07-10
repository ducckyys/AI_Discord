import { prisma } from "../database/prisma.js";
export const userService = { ensure: (id: string, username: string, isBot = false) => prisma.user.upsert({ where: { id }, create: { id, username, isBot }, update: { username, isBot } }) };
