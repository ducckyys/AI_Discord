import { randomInt, randomUUID } from "node:crypto";
import { imageConfig } from "../../config/image.js";
import { logger } from "../../utils/logger.js";
import type { ComfyOutputImage, ComfyWorkflow } from "./types.js";
import { ImageGenerationError } from "./types.js";
import { extractOutputImages, loadWorkflow, prepareWorkflow } from "./workflow.js";

type PromptResponse = { prompt_id?: string };

export class ComfyUIProvider {
  public constructor(
    private readonly baseUrl = imageConfig.url,
    private readonly timeoutMs = imageConfig.timeoutMs,
    private readonly pollIntervalMs = imageConfig.pollIntervalMs,
  ) {}

  public async generate(prompt: string): Promise<{ filename: string; data: Buffer; contentType: string }> {
    const workflow = prepareWorkflow(await loadWorkflow(imageConfig.workflowPath), prompt, imageConfig.model, randomInt(1, Number.MAX_SAFE_INTEGER));
    const promptId = await this.queuePrompt(workflow);
    const image = await this.waitForImage(promptId);
    const downloaded = await this.downloadImage(image);
    logger.info({ promptId, filename: image.filename }, "ComfyUI image generated");
    return downloaded;
  }

  private async queuePrompt(workflow: ComfyWorkflow): Promise<string> {
    const response = await this.fetchJson<PromptResponse>("prompt", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ prompt: workflow, client_id: randomUUID() }),
    });

    if (!response.prompt_id) throw new ImageGenerationError("ComfyUI did not return a prompt_id.");
    return response.prompt_id;
  }

  private async waitForImage(promptId: string): Promise<ComfyOutputImage> {
    const deadline = Date.now() + this.timeoutMs;
    while (Date.now() < deadline) {
      const history = await this.fetchJson<unknown>(`history/${encodeURIComponent(promptId)}`, { headers: { accept: "application/json" } });
      const [image] = extractOutputImages(history, promptId);
      if (image) return image;
      await delay(this.pollIntervalMs);
    }

    throw new ImageGenerationError(`ComfyUI image generation timed out after ${Math.round(this.timeoutMs / 1000)}s.`);
  }

  private async downloadImage(image: ComfyOutputImage): Promise<{ filename: string; data: Buffer; contentType: string }> {
    const url = new URL("view", `${this.baseUrl}/`);
    url.searchParams.set("filename", image.filename);
    url.searchParams.set("subfolder", image.subfolder);
    url.searchParams.set("type", image.type);

    const response = await this.fetchWithTimeout(url);
    if (!response.ok) throw new ImageGenerationError(`ComfyUI /view returned HTTP ${response.status}.`);

    return {
      filename: image.filename,
      data: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get("content-type") ?? contentTypeFromName(image.filename),
    };
  }

  private async fetchJson<T>(pathName: string, init: RequestInit): Promise<T> {
    const response = await this.fetchWithTimeout(new URL(pathName, `${this.baseUrl}/`), init);
    if (!response.ok) throw new ImageGenerationError(`ComfyUI /${pathName} returned HTTP ${response.status}.`);
    return (await response.json()) as T;
  }

  private async fetchWithTimeout(url: URL, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (error) {
      const reason = error instanceof Error && error.name === "AbortError" ? "request timed out" : "request failed";
      throw new ImageGenerationError(`ComfyUI ${reason}. Check COMFYUI_URL and make sure ComfyUI is running.`, error);
    } finally {
      clearTimeout(timer);
    }
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function contentTypeFromName(name: string): string {
  if (/\.jpe?g$/i.test(name)) return "image/jpeg";
  if (/\.webp$/i.test(name)) return "image/webp";
  return "image/png";
}
