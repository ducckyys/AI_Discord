import type { AIProvider } from "../providers/provider.js";
import { buildContext } from "./context.js";
import { ConversationRepository } from "../../database/repositories/conversationRepository.js";
import type { ChatImage } from "../../types/ai.js";
import type { ToolFile, ToolManager } from "../tools/index.js";

export interface AIResponse { content: string; files?: ToolFile[]; }

export class AskAI {
  public constructor(private readonly provider: AIProvider, private readonly conversations = new ConversationRepository(), private readonly toolManager?: ToolManager) {}
  public async ask(input: { guildId: string; userId: string; channelId: string; question: string; messageId?: string; maxContextMessages: number; model?: string; images?: ChatImage[] }): Promise<string> {
    return (await this.askDetailed(input)).content;
  }

  public async askDetailed(input: { guildId: string; userId: string; channelId: string; question: string; messageId?: string; maxContextMessages: number; model?: string; images?: ChatImage[] }): Promise<AIResponse> {
    const conversation = await this.conversations.getOrCreate(input.guildId, input.userId, input.channelId);
    const history = await this.conversations.messages(conversation.id, input.maxContextMessages);
    await this.conversations.addMessage(conversation.id, "user", input.question, input.messageId);
    const result = this.toolManager ? await this.toolManager.execute({ ...input, history }) : { content: await this.provider.chat(buildContext(history, input.question, input.images), { model: input.model }) };
    await this.conversations.addMessage(conversation.id, "assistant", result.content);
    return result;
  }
  public clear(guildId: string, userId: string, channelId: string) { return this.conversations.clear(guildId, userId, channelId); }
}
