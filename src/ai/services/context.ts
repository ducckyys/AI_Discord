import type { ChatImage, ChatMessage } from "../../types/ai.js";
import { systemPrompt } from "../prompts/system.js";
export const buildContext = (history: { role: string; content: string }[], question: string, images: ChatImage[] = []): ChatMessage[] => [
  { role: "system", content: systemPrompt },
  ...history.slice().reverse().filter((item): item is { role: "user" | "assistant"; content: string } => item.role === "user" || item.role === "assistant"),
  { role: "user", content: images.length ? [{ type: "text", text: question }, ...images.map((image) => ({ type: "image_url" as const, image_url: image }))] : question },
];
