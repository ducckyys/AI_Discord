import type { ChatMessage } from "../../types/ai.js";
import { systemPrompt } from "../prompts/system.js";
export const buildContext = (history: { role: string; content: string }[], question: string): ChatMessage[] => [
  { role: "system", content: systemPrompt },
  ...history.reverse().filter((item): item is { role: "user" | "assistant"; content: string } => item.role === "user" || item.role === "assistant"),
  { role: "user", content: question },
];
