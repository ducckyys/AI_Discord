export type ChatRole = "system" | "user" | "assistant";
export interface ChatImage { url: string; detail?: "auto" | "low" | "high"; }
export type ChatContentPart = { type: "text"; text: string } | { type: "image_url"; image_url: ChatImage };
export type ChatContent = string | ChatContentPart[];
export interface ChatMessage { role: ChatRole; content: ChatContent; }
