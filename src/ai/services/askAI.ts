import type { AIProvider } from "../providers/provider.js";
import { buildContext } from "./context.js";
import { ConversationRepository } from "../../database/repositories/conversationRepository.js";

export class AskAI {
  public constructor(private readonly provider: AIProvider, private readonly conversations = new ConversationRepository()) {}
  public async ask(input: { guildId: string; userId: string; channelId: string; question: string; messageId?: string; maxContextMessages: number; model?: string }): Promise<string> {
    const conversation = await this.conversations.getOrCreate(input.guildId, input.userId, input.channelId);
    const history = await this.conversations.messages(conversation.id, input.maxContextMessages);
    await this.conversations.addMessage(conversation.id, "user", input.question, input.messageId);
    const answer = await this.provider.chat(buildContext(history, input.question), { model: input.model });
    await this.conversations.addMessage(conversation.id, "assistant", answer);
    return answer;
  }
  public clear(guildId: string, userId: string, channelId: string) { return this.conversations.clear(guildId, userId, channelId); }
}
