// src/ai/image/imageService.ts

import { ImageProvider } from './provider'; 
import { PromptBuilder } from './promptBuilder';
import { ComfyUIProvider } from './comfyui'; // Import the concrete provider implementation
import { Logger } from '@/utils/logger';

/**
 * ImageService adalah lapisan layanan (service layer) yang bertanggung jawab mengorkestrasi
 * proses pembuatan gambar: Prompt Enhancement -> Provider Selection -> API Call.
 * Ini memastikan bahwa ToolManager hanya berinteraksi dengan antarmuka yang bersih dan terdefinisi.
 */
export class ImageService {
    private readonly activeProvider: ImageProvider;

    /**
     * Dependency Injection: Menginisialisasi service dengan provider gambar aktif (saat ini ComfyUI).
     * Di masa depan, logika di sini dapat memilih antara ComfyUIProvider atau sejenisnya.
     * @param provider Instance dari provider yang akan digunakan.
     */
    constructor(provider: ImageProvider) {
        this.activeProvider = provider;
        Logger.info('[ImageService] Initialized using active provider.');
    }

    /**
     * Menjalankan seluruh alur pembuatan gambar dari awal hingga akhir.
     * @param rawUserPrompt Prompt mentah dari pengguna (e.g., "A robot in a forest").
     * @returns Promise<string> URL gambar yang berhasil dibuat.
     */
    public async generate(rawUserPrompt: string): Promise<string> {
        if (!rawUserPrompt) {
            throw new Error("Cannot generate image from an empty prompt.");
        }

        // 1. Enhancement Phase (Using PromptBuilder)
        const enhancedPrompt = PromptBuilder.enhance(rawUserPrompt);
        Logger.info("[ImageService] Enhanced Prompt: " + enhancedPrompt);

        // 2. Model Selection and Negative Prompting
        const modelName = 'sdxl-turbo'; // Hardcoded for now, should come from config/user input
        const negativePrompt = PromptBuilder.buildNegativePrompt();


        try {
            // 3. Execution Phase (Delegating to the concrete Provider)
            // The actual API call happens here, using the selected provider's implementation.
            const imageUrl = await this.activeProvider.generateImage(enhancedPrompt, modelName);

            return imageUrl;

        } catch (error) {
            console.error("[ImageService] Fatal image generation pipeline failure:", error);
            // Re-throw to allow the ToolManager/ToolExecutor to handle it gracefully.
            throw new Error("Gagal menjalankan alur pembuatan gambar secara keseluruhan."); 
        }
    }
}