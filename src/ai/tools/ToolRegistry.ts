// src/ai/tools/ToolRegistry.ts

import { ChatService } from '@/services/askAI'; // Assuming chat functionality comes from this service layer
import { InternetService } from '@/ai/internet';
import { ImageService } from '@/ai/image/imageService'; 
// Add imports for other services (Vision, File) as they are developed

/**
 * ToolRegistry acts as a centralized map of all callable tools in the system.
 * This prevents code from hardcoding which services exist and promotes easy extension.
 */
export class ToolRegistry {
    private static instance: ToolRegistry;
    private readonly registry = new Map<string, any>(); // Maps tool name (Intent) to a handler/service object

    /**
     * Private constructor enforces Singleton pattern.
     */
    private constructor() {}

    /**
     * Retrieves the singleton instance of the ToolRegistry.
     */
    public static getInstance(): ToolRegistry {
        if (!ToolRegistry.instance) {
            ToolRegistry.instance = new ToolRegistry();
        }
        return ToolRegistry.instance;
    }

    /**
     * Registers a tool by associating its name (key) with an executable service object.
     * @param toolName The canonical name of the tool (e.g., 'internet', 'chat').
     * @param handler The service instance responsible for executing the tool's logic.
     */
    public registerTool(toolName: string, handler: any): void {
        if (!this.registry.has(toolName)) {
            this.registry.set(toolName, handler);
        } else {
            console.warn(`[ToolRegistry] Warning: Tool ${toolName} is already registered and will be overwritten.`);
            this.registry.set(toolName, handler);
        }
    }

    /**
     * Retrieves a registered tool handler by its name.
     */
    public getTool(toolName: string): any | undefined {
        return this.registry.get(toolName);
    }
}