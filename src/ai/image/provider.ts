// src/ai/image/provider.ts

/**
 * Interface (Contract) that all concrete Image Providers must implement.
 * This ensures modularity and allows swapping of image APIs without affecting core service logic.
 */
export interface ImageProvider {
    /**
     * Menghasilkan gambar berdasarkan prompt yang telah disempurnakan dan parameter model.
     * @param enhancedPrompt Deskripsi artistik hasil peningkatan prompt.
     * @param model Nama model generator (e.g., 'sdxl', 'flux').
     * @returns Promise<string> URL publik dari gambar yang dihasilkan.
     * @throws ImageGenerationError jika ada kegagalan API atau validasi data.
     */
    generateImage(enhancedPrompt: string, model: string): Promise<string>;
}

/**
 * Custom error class for image generation failures. 
 * Allows the ToolExecutor to catch and report this specific failure type gracefully.
 */
export class ImageGenerationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageGenerationError";
    }
}