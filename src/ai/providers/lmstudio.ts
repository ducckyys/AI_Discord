import { z } from "zod";
import { aiConfig } from "../../config/ai.js";
import type { ChatMessage } from "../../types/ai.js";
import type { AIProvider } from "./provider.js";

const responseSchema = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string().nullable() }) })).min(1) });
export class LMStudioProvider implements AIProvider {
  public async chat(messages: ChatMessage[], options: { model?: string } = {}): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    try {
      const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, { method: "POST", signal: controller.signal,
        headers: { "content-type": "application/json" }, body: JSON.stringify({ model: options.model ?? aiConfig.model, messages, temperature: 0.7 }) });
      if (!response.ok) throw new Error(`LM Studio returned HTTP ${response.status}`);
      const body: unknown = await response.json();
      const parsed = responseSchema.safeParse(body);
      if (!parsed.success || !parsed.data.choices[0]?.message.content?.trim()) throw new Error("LM Studio returned a malformed response");
      return parsed.data.choices[0].message.content.trim();
    } finally { clearTimeout(timer); }
  }
}
