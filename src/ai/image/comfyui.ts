// src/ai/image/comfyui.ts

import { ImageProvider, ImageGenerationError } from './provider'; // Assuming provider.ts defines the interface
import axios from 'axios';
import { Logger } from '@/utils/logger'; 

/**
 * Implements the ImageProvider interface specifically for communicating with a local ComfyUI instance.
 * This service is responsible for constructing the API payload and handling network requests.
 */
export class ComfyUIProvider implements ImageProvider {
    private readonly apiUrl: string; // e.g., http://localhost:8188/prompt

    /**
     * Initializes the provider with the target API URL.
     * @param baseUrl The base URL for the ComfyUI endpoint (e.g., /prompt).
     */
    constructor(baseUrl: string) {
        this.apiUrl = baseUrl;
        Logger.info(`[ComfyUIProvider] Initialized for API at ${this.apiUrl}`);
    }

    /**
     * Generates an image by sending a structured prompt and model parameters to the ComfyUI API.
     * @param enhancedPrompt Prompt yang sudah ditingkatkan secara artistik.
     * @param model Nama Model (e.g., 'sdxl-turbo').
     * @returns URL publik dari gambar yang dihasilkan.
     * @throws ImageGenerationError jika permintaan gagal atau format data salah.
     */
    public async generateImage(enhancedPrompt: string, model: string): Promise<string> {
        if (!enhancedPrompt || !model) {
            throw new ImageGenerationError("Missing enhanced prompt or model name.");
        }

        Logger.info(`[ComfyUIProvider] Attempting to generate image with Model=${model}...`);

        // --- Payload Structure (MUST match the specific ComfyUI API endpoint structure) ---
        // NOTE: This is a placeholder payload; actual structure must be validated against your setup.
        const payload = {
            prompt: enhancedPrompt, 
            negative_prompt: "blurry, low quality, bad anatomy", // Standard negative prompt
            model: model,
            steps: 30,
            seed: Math.floor(Math.random() * 100000),
        };

        try {
            // Using axios to make the POST request to the local ComfyUI API
            const response = await axios.post<any>(this.apiUrl, payload);

            // Assuming the API response structure contains a URL or file identifier
            if (response.data && response.data.image_url) {
                Logger.info("[ComfyUIProvider] Image request successful.");
                return response.data.image_url; // Return the public URL
            } else {
                throw new Error("API responded successfully but did not provide an image URL in the expected format.");
            }

        } catch (error) {
            Logger.error("[ComfyUIProvider] API Call Failed", error);
            // Re-throwing a specific application error for centralized handling by ToolExecutor
            throw new ImageGenerationError(`Failed to communicate with ComfyUI at ${this.apiUrl}. Check your server status and logs.`);
        }
    }
}