import type { ChatMessage } from "../../types/ai.js";
export interface AIProvider { chat(messages: ChatMessage[], options?: { model?: string }): Promise<string>; }
