import type { ChatImage } from "../../types/ai.js";
import type { Intent } from "../router/intent.js";

export interface ToolInput {
  guildId: string;
  userId: string;
  channelId: string;
  question: string;
  history: { role: string; content: string }[];
  messageId?: string;
  maxContextMessages: number;
  model?: string;
  images?: ChatImage[];
}

export interface ToolFile {
  name: string;
  data: Buffer;
  contentType: string;
}

export interface ToolResult {
  content: string;
  files?: ToolFile[];
}

export interface Tool {
  intent: Intent;
  execute(input: ToolInput): Promise<ToolResult>;
}
