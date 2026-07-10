import type { ToolFile } from "../tools/index.js";

export type ComfyWorkflow = Record<string, unknown>;

export interface ComfyOutputImage {
  filename: string;
  subfolder: string;
  type: string;
}

export interface ImageGenerationResult {
  prompt: string;
  file: ToolFile;
}

export class ImageGenerationError extends Error {
  public constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ImageGenerationError";
  }
}
