// src/ai/tools/ToolExecutor.ts

import { ToolRegistry } from './ToolRegistry';
import { Logger } from '@/utils/logger'; 
import { ImageGenerationError } from '@/ai/image/provider'; // Assuming this error type exists

/**
 * Executes the logic for a specific registered tool handler, adding crucial cross-cutting concerns.
 * This class ensures that every tool call has standardized logging, rate limiting checks (if implemented later), and robust error handling.
 */
export class ToolExecutor {
    private readonly registry: ToolRegistry;

    /**
     * Dependency Injection of the global Tool Registry.
     */
    constructor(registry: ToolRegistry) {
        this.registry = registry;
    }

    /**
     * Executes a tool by name, retrieving the handler from the registry.
     * @param toolName The intent/tool to execute (e.g., 'chat', 'internet').
     * @param payload Any necessary arguments for the tool (e.g., query string).
     * @returns A promise resolving to the formatted response message content.
     */
    public async executeTool(toolName: string, payload: any): Promise<string> {
        const handler = this.registry.getTool(toolName);

        if (!handler) {
            Logger.error(`[ToolExecutor] Failed to find registered tool: ${toolName}`);
            return `🚨 Error: Tool '${toolName}' is not available or correctly configured in the system.`;
        }

        Logger.info(`[ToolExecutor] Starting execution for tool: ${toolName}`);

        try {
            // Dynamic dispatch based on handler type and method name (SOLID principle applied here)
            if (typeof (handler as any).execute && typeof (payload as any).query) {
                 // Example handling for Search/Chat tools that take a query payload
                return await (handler as any).execute(payload.query); 
            } else if (typeof (handler as any).generateImage && (payload as any).request) {
                // Specific handling for Image Generation
                const request = (payload as any).request;
                const result = await (handler as any).generateImage(request);
                return `🖼️ Gambar berhasil dibuat! Silakan cek pesan berikutnya untuk URL gambar.`; // Placeholder response
            } 
            // Add more specific dispatch logic here as more tools are integrated

             // Fallback/Generic execution path if the tool has a general execute method
            if (typeof (handler as any).execute) {
                return await (handler as any).execute(payload);
            }
            
            throw new Error(`Tool ${toolName} does not expose a recognizable 'execute' method or required payload structure.`);

        } catch (error) {
            Logger.error(`[ToolExecutor] Failed to execute tool '${toolName}'`, error);
            if (error instanceof ImageGenerationError) {
                return `🔴 Gagal membuat gambar: ${error.message}`;
            }
            // Catch all other errors and provide a friendly message without exposing stack traces
            return `⚠️ Terjadi kesalahan sistem saat menjalankan fitur ${toolName}. Detail: ${(error as Error).message || "Unknown error."}`;
        }
    }
}