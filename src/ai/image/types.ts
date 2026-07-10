// src/ai/image/types.ts

/**
 * Defines the core structures used across the Image Generation module.
 */

export type ImageModelName = 'flux1-schnell' | 'automatic1111' | string;

/**
 * Represents a standardized image generation request payload.
 */
export interface ImageRequest {
    prompt: string; // The full, enhanced prompt (e.g., "A cat in golden hour...")
    negativePrompt?: string; // Things to avoid (e.g., "deformed, blurry, low quality")
    seed?: number | null;
    steps?: number;
    cfgScale?: number;
    model: ImageModelName;
}

/**
 * Represents the resulting image data or job status from a provider.
 */
export interface GenerationResult {
    imageUrl: string; // URL to the generated image (e.g., temporary cloud link)
    metadata: Record<string, any>; // Additional data like seed, prompt used, etc.
}

/**
 * Defines the specific workflow state for ComfyUI interactions.
 */
export type WorkflowId = string;