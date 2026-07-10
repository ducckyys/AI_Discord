import { readFile } from "node:fs/promises";
import path from "node:path";
import defaultFluxWorkflow from "./workflow/flux-schnell.json" with { type: "json" };
import type { ComfyOutputImage, ComfyWorkflow } from "./types.js";
import { ImageGenerationError } from "./types.js";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

export async function loadWorkflow(workflowPath?: string): Promise<ComfyWorkflow> {
  if (!workflowPath) return structuredClone(defaultFluxWorkflow) as ComfyWorkflow;

  const resolved = path.resolve(process.cwd(), workflowPath);
  try {
    const parsed = JSON.parse(await readFile(resolved, "utf8")) as unknown;
    if (!isRecord(parsed)) throw new ImageGenerationError(`ComfyUI workflow at ${workflowPath} must be a JSON object.`);
    return parsed;
  } catch (error) {
    if (error instanceof ImageGenerationError) throw error;
    throw new ImageGenerationError(`ComfyUI workflow file was not found or could not be parsed: ${workflowPath}`, error);
  }
}

export function prepareWorkflow(workflow: ComfyWorkflow, prompt: string, model: string, seed: number): ComfyWorkflow {
  let injectedPrompt = false;

  const visit = (value: unknown, key?: string): unknown => {
    if (typeof value === "string") {
      const withPrompt = value.replaceAll("{{PROMPT}}", prompt).replaceAll("{{MODEL}}", model);
      if (withPrompt !== value && value.includes("{{PROMPT}}")) injectedPrompt = true;
      return withPrompt;
    }

    if (typeof value === "number" && key === "seed") return seed;
    if (Array.isArray(value)) return value.map((item) => visit(item));
    if (!isRecord(value)) return value;

    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, visit(entryValue, entryKey)]));
  };

  const prepared = visit(workflow);
  if (!isRecord(prepared)) throw new ImageGenerationError("ComfyUI workflow must be a JSON object.");
  if (!injectedPrompt) throw new ImageGenerationError("ComfyUI workflow must contain a {{PROMPT}} placeholder for the user prompt.");
  return prepared;
}

export function extractOutputImages(history: unknown, promptId: string): ComfyOutputImage[] {
  if (!isRecord(history)) return [];
  const entry = history[promptId];
  if (!isRecord(entry)) return [];
  const outputs = entry.outputs;
  if (!isRecord(outputs)) return [];

  return Object.values(outputs).flatMap((output) => {
    if (!isRecord(output) || !Array.isArray(output.images)) return [];
    return output.images.flatMap((image): ComfyOutputImage[] => {
      if (!isRecord(image) || typeof image.filename !== "string" || !image.filename.trim()) return [];
      return [{
        filename: image.filename.trim(),
        subfolder: typeof image.subfolder === "string" ? image.subfolder : "",
        type: typeof image.type === "string" && image.type.trim() ? image.type.trim() : "output",
      }];
    });
  });
}
