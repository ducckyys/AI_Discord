import { imageConfig } from "../../config/image.js";
import type { AIProvider } from "../providers/provider.js";
import { ComfyUIProvider } from "./comfyui.js";
import { ImagePromptBuilder } from "./promptBuilder.js";
import { ImageService } from "./imageService.js";
import type { ImageProvider } from "./types.js";

export const createImageProvider = (): ImageProvider => {
  switch (imageConfig.provider) {
    case "comfyui": return new ComfyUIProvider();
  }
};

export const createImageService = (aiProvider: AIProvider): ImageService => new ImageService(createImageProvider(), new ImagePromptBuilder(aiProvider));
export { ComfyUIError, ComfyUIProvider } from "./comfyui.js";
export { ImagePromptBuilder } from "./promptBuilder.js";
export { ImageService } from "./imageService.js";
export type { GeneratedImage, ImageGenerationRequest, ImageProvider } from "./types.js";
