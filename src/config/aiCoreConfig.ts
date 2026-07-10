// src/config/aiCoreConfig.ts

import { ToolManager } from '@/ai/tools/ToolManager';
import { ChatService } from '@/services/askAI'; // Assuming ChatService handles LM Studio interaction
import { ImageProvider } from '@/ai/image/provider'; 
import { ComfyUIProvider } from '@/ai/image/comfyui';
import { InternetService } from '@/ai/internet';
import { Logger } from '@/utils/logger';

/**
 * Module ini berfungsi sebagai pusat inisialisasi (Dependency Injection Container)
 * untuk semua layanan AI. Semua komponen penting harus diinisiasi dan dikonfigurasi di sini.
 */
export class AICoreConfig {

    private static toolManager: ToolManager;
    private static chatServiceInstance: ChatService;

    /**
     * Menginisialisasi seluruh stack AI, mendaftarkan semua tools, dan menyiapkan dependensi utama.
     */
    public static initialize(): void {
        Logger.info("===========================================");
        Logger.info("[AI Core] Starting initialization of all AI services...");
        
        // 1. Initialize core dependency components (Singletons/Instances)
        const toolManager = new ToolManager();
        
        // 2. Setup Image Provider: Instantiate the concrete API handler first
        // NOTE: Asumsi URL ComfyUI Anda adalah http://localhost:8188/prompt
        const comfyuiProvider = new ComfyUIProvider("http://localhost:8188/prompt");

        // 3. Initialize Services with their dependencies
        const chatService = new ChatService(); // Should handle LM Studio connection
        const internetService = new InternetService();

        // 4. Setup ToolManager and Register All Tools (The Glue Code)
        toolManager.registerAllTools();

        // --- Manual Wiring/Injection (Simulating the flow of dependency) ---
        // Because ToolExecutor uses a internal reference, we must ensure the Manager knows its executor.
        // In a real-world scenario with a proper DI framework, this would be handled automatically.
        (toolManager as any)['toolExecutor'] = new ToolExecutor(toolManager['toolRegistry']);

        Logger.info("[AI Core] Successfully registered and wired all AI tools!");
        Logger.info("===========================================");

        // Make the initialized tool manager accessible globally or via singleton pattern
        AICoreConfig.toolManager = toolManager;
    }

    /**
     * Getter untuk ToolManager yang sudah diinisialisasi.
     */
    public static getToolManager(): ToolManager {
        if (!AICoreConfig.toolManager) {
            throw new Error("AI Core has not been initialized. Call AICoreConfig.initialize() first.");
        }
        return AICoreConfig.toolManager;
    }

    // Optional: Fungsi untuk menjalankan pengecekan konektivitas (Health Check)
    public static async runHealthCheck(): Promise<void> {
        try {
            await this.getToolManager().executeChat("Halo, apakah sistem Anda berfungsi dengan baik?").then(result => {
                Logger.info(`[Health Check] Chat tool successful. Response: ${result}`);
            });
             // Add more checks here (e.g., calling executeInternetSearch with a dummy query)

        } catch (e) {
            Logger.error("[Health Check FAILED] One or more core services failed to initialize.");
        }
    }
}