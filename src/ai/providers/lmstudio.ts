import { z } from "zod";
import { aiConfig } from "../../config/ai.js";
import type { ChatMessage } from "../../types/ai.js";
import type { AIProvider } from "./provider.js";

const responseSchema = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string().nullable() }) })).min(1) });

let _modelCache: { model: string; expiresAt: number } | null = null;

type LMModel = { id?: string; name?: string; status?: string; ready?: boolean; loaded?: boolean };

function toModelsArray(body: unknown): LMModel[] {
  if (Array.isArray(body)) {
    return body.filter((b): b is LMModel => typeof b === "object" && b !== null).map((b) => b as LMModel);
  }
  if (typeof body === "object" && body !== null) {
    const maybe = (body as { models?: unknown }).models;
    if (Array.isArray(maybe)) return maybe.filter((b): b is LMModel => typeof b === "object" && b !== null).map((b) => b as LMModel);
  }
  return [];
}

async function discoverLoadedModel(): Promise<string | null> {
  const now = Date.now();
  if (_modelCache && _modelCache.expiresAt > now) return _modelCache.model;
  try {
    const res = await fetch(`${aiConfig.baseUrl}/models`);
    if (!res.ok) return null;
    const body: unknown = await res.json();
    const models = toModelsArray(body);
    if (!models.length) return null;
    const ready = models.find((m) => m.status === "ready" || m.ready === true || m.loaded === true);
    const chosen = (ready?.id ?? ready?.name) ?? (models[0].id ?? models[0].name ?? null);
    if (chosen) _modelCache = { model: chosen, expiresAt: now + 60_000 };
    return chosen ?? null;
  } catch {
    return null;
  }
}

export class LMStudioProvider implements AIProvider {
  public async chat(messages: ChatMessage[], options: { model?: string } = {}): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    try {
      const modelToUse = options.model ?? (await discoverLoadedModel()) ?? aiConfig.model;
      const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, { method: "POST", signal: controller.signal,
        headers: { "content-type": "application/json" }, body: JSON.stringify({ model: modelToUse, messages, temperature: 0.7 }) });
      if (!response.ok) throw new Error(`LM Studio returned HTTP ${response.status}`);
      const body: unknown = await response.json();
      const parsed = responseSchema.safeParse(body);
      if (!parsed.success || !parsed.data.choices[0]?.message.content?.trim()) throw new Error("LM Studio returned a malformed response");
      return parsed.data.choices[0].message.content.trim();
    } finally { clearTimeout(timer); }
  }
}
