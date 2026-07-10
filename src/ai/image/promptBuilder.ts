// src/ai/image/promptBuilder.ts

/**
 * Utility class responsible for enhancing raw user input into highly detailed, 
 * artistic prompt descriptions suitable for advanced image models like SDXL or ComfyUI workflows.
 * This enhances the semantic quality of the user's intent without altering the core subject matter.
 */
export class PromptBuilder {

    /**
     * Enhances a simple text prompt into an elaborate artistic description.
     * @param rawPrompt Teks awal yang diberikan oleh pengguna (misalnya: "A cat on a roof").
     * @returns Deskripsi prompt yang diperkaya dengan gaya, pencahayaan, dan detail komposisi.
     */
    public static enhance(rawPrompt: string): string {
        if (!rawPrompt) return "";

        // Basic enhancement rules to add cinematic flair and artistic direction.
        let enhanced = rawPrompt;

        // 1. Add Cinematic/Atmospheric Details
        const atmosphere = "Cinematic, hyper-detailed, volumetric lighting, deep shadows";
        enhanced += `, ${atmosphere}`;
        
        // 2. Define Style/Medium
        let style = "";
        if (rawPrompt.toLowerCase().includes("photo") || rawPrompt.toLowerCase().includes("real")) {
            style = ", photorealistic, shot on Arri Alexa, 8k resolution";
        } else if (rawPrompt.toLowerCase().includes("art") || rawPrompt.toLowerCase().includes("painting")) {
            style = ", digital painting by Greg Rutkowski and Artgerm, highly textured oil paint style";
        } else {
             // Default complex artistic style for general use
            style = ", detailed octane render, volumetric fog, cinematic composition";
        }

        // 3. Assemble the final prompt structure
        const finalPrompt = `A masterpiece of art depicting: ${enhanced}${style}`;

        return finalPrompt;
    }

    /**
     * Creates a structured negative prompt to guide image generation away from common artifacts.
     * @returns String containing detailed negative keywords.
     */
    public static buildNegativePrompt(): string {
        // These are industry standard exclusions for quality control
        return "blurry, low resolution, amateur drawing, deformed limbs, extra digits, signature, watermark, jpeg artifacts";
    }
}