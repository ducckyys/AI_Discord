import type { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma.js";

export class ConversationRepository {
  public constructor(private readonly db: PrismaClient = prisma) {}
  public async getOrCreate(guildId: string, userId: string, channelId: string) {
    return this.db.conversation.upsert({ where: { guildId_userId_channelId: { guildId, userId, channelId } },
      create: { guildId, userId, channelId }, update: {} });
  }
  public async messages(conversationId: string, limit: number) {
    return this.db.message.findMany({ where: { conversationId }, orderBy: { createdAt: "desc" }, take: limit });
  }
  public async addMessage(conversationId: string, role: "user" | "assistant", content: string, messageId?: string) {
    return this.db.message.create({ data: { conversationId, role, content, discordMessageId: messageId, tokens: Math.ceil(content.length / 4) } });
  }
  public async clear(guildId: string, userId: string, channelId: string) {
    const conversation = await this.db.conversation.findUnique({ where: { guildId_userId_channelId: { guildId, userId, channelId } } });
    if (conversation) await this.db.message.deleteMany({ where: { conversationId: conversation.id } });
  }
}
