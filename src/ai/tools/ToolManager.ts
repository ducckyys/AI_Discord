// src/ai/tools/ToolManager.ts

import { Logger } from '@/utils/logger'; 
import { ToolRegistry } from './ToolRegistry';
import { ChatService } from '@/services/askAI'; // Assume this is the primary chat handler
import { ImageService } from '@/ai/image/imageService'; 
import { InternetService } from '@/ai/internet';
// Import other tool handlers (Vision, File) here as they become available

/**
 * ToolManager adalah orkestrator utama. Tugasnya adalah menerima permintaan dari AI Router 
 * dan secara berurutan memanggil layanan yang tepat (Chat, Image, Search), sambil menangani logika 
 * pra-pemrosesan, pasca-pemrosesan, dan penanganan error terpusat.
 */
export class ToolManager {
    private readonly toolRegistry: ToolRegistry;

    /**
     * Dependency Injection of the global Tool Registry.
     */
    constructor() {
        this.toolRegistry = ToolRegistry.getInstance();
    }

    // --- Implementasi Metode Utama untuk Router ---

    /**
     * Meng-setup dan mendaftarkan semua tool yang tersedia ke dalam registry. 
     * Ini harus dipanggil sekali saat bot dimulai (di src/config/ai.ts).
     */
    public registerAllTools(): void {
        Logger.info('[ToolManager] Registering all available tools.');

        // 1. Tool Chat AI
        const chatService = new ChatService(); // Instantiate the service
        this.toolRegistry.registerTool('chat', chatService);

        // 2. Tool Internet Search
        const internetService = new InternetService();
        this.toolRegistry.registerTool('internet', internetService);

        // 3. Tool Image Generation
        const imageService = new ImageService(); // Instantiate the service
        this.toolRegistry.registerTool('image', imageService);

        // TODO: Register Vision, File Analysis tools here later
    }


    /**
     * Menjalankan fungsi Chat AI.
     * @param query Teks prompt yang akan dikirim ke AI.
     */
    public async executeChat(query: string): Promise<string> {
        // The chat service handles the complex logic of memory, prompting, and calling providers.
        const chatHandler = this.toolRegistry.getTool('chat');
        if (!chatHandler) throw new Error("Chat tool handler not found.");

        // Passing query directly to ToolExecutor for centralized logging/error handling
        return await (this['toolExecutor'] as any).executeTool('chat', { query });
    }

    /**
     * Menjalankan fungsi Pencarian Internet.
     * @param query Query spesifik untuk dicari di web.
     */
    public async executeInternetSearch(query: string): Promise<string> {
        const internetHandler = this.toolRegistry.getTool('internet');
        if (!internetHandler) throw new Error("Internet Search tool handler not found.");

        // Passing query and scope (e.g., 'General Web Search') to ToolExecutor
        return await (this['toolExecutor'] as any).executeTool('internet', { query, scope: 'General Web Search' });
    }


    /**
     * Menjalankan fungsi Generasi Gambar.
     * @param userPrompt Prompt awal dari pengguna.
     */
    public async executeImageGeneration(userPrompt: string): Promise<string> {
        // Di sini harusnya ada logika yang memanggil Prompt Builder dulu, 
        // sebelum mengirim request ke ImageService.

        const imageHandler = this.toolRegistry.getTool('image');
        if (!imageHandler) throw new Error("Image Generation tool handler not found.");

        // Placeholder: For now, we assume the prompt builder has run and created a 'request' object.
        const placeholderRequest = { 
            prompt: "Placeholder for enhanced prompt.", 
            model: 'flux1-schnell' 
        };

        return await (this['toolExecutor'] as any).executeTool('image', { request: placeholderRequest });
    }


    /**
     * Menjalankan fungsi Analisis Visual/File.
     */
    public async executeVision(prompt: string): Promise<string> {
         // TODO: Implement logic for Vision Tool execution
        return "Visual analysis tool is pending implementation.";
    }

    /**
     * Constructor dan inisialisasi yang menyuntikkan semua dependensi.
     */
    constructor() {
        this['toolExecutor'] = new ToolExecutor(ToolRegistry.getInstance()); // Injecting the Executor dependency
        // Pastikan pendaftaran tool dilakukan setelah instansiasi
    }
}