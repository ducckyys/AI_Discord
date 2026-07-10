import { imageConfig } from "../../config/image.js";
import type { ToolFile } from "../tools/index.js";
import { ComfyUIProvider } from "./comfyui.js";
import { ImageGenerationError } from "./types.js";

export class ImageService {
  public constructor(private readonly provider = new ComfyUIProvider()) {}

  public async generate(prompt: string): Promise<ToolFile[]> {
    if (imageConfig.provider !== "comfyui") throw new ImageGenerationError(`Unsupported IMAGE_PROVIDER: ${imageConfig.provider}`);
    const normalized = prompt.trim();
    if (!normalized) throw new ImageGenerationError("Image prompt cannot be empty.");

    const image = await this.provider.generate(normalized);
    return [{ name: image.filename, data: image.data, contentType: image.contentType }];
  }
}
