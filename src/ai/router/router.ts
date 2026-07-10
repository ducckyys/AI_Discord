// src/ai/router/router.ts

import { Intent, ClassifiedIntent } from './intent';
import { Classifier } from './classifier';
import { InternetService } from '../internet'; // Import the dedicated Internet Service
import { ToolManager } from '@/ai/tools/ToolManager'; // Dependency on yet-to-be-created ToolManager

/**
 * The central AI Router service. 
 * It is responsible for interpreting user intent and delegating the request to the correct specialized tool manager.
 * This acts as a clean facade layer between the event handler and all functional services.
 */
export class AiRouter {
    private readonly classifier: Classifier;
    private readonly internetService: InternetService;
    private readonly toolManager: ToolManager;

    /**
     * Dependency Injection of necessary components.
     * @param classifier The intent classification engine.
     * @param internetService The dedicated service for web search operations.
     * @param toolManager The dispatcher that executes the final action (Image, Chat, etc.).
     */
    constructor(classifier: Classifier, internetService: InternetService, toolManager: ToolManager) {
        this.classifier = classifier;
        this.internetService = internetService;
        this.toolManager = toolManager;

        // Ensure basic checks for required dependencies
        if (!classifier || !toolManager) {
            throw new Error('AiRouter failed to initialize due to missing critical dependency (Classifier or ToolManager).');
        }
    }

    /**
     * The main entry point for routing a user request.
     * It classifies the intent, determines the required action, and executes it through the tool manager.
     * @param userPrompt The raw text message from Discord.
     * @returns A promise that resolves to the final response content or an error message.
     */
    public async route(userPrompt: string): Promise<string> {
        // 1. Classification Step
        const classification = await this.classifier.classify(userPrompt);

        let resultMessage: string;
        
        if (classification.intent === Intent.UNKNOWN) {
            Logger.warn('Router detected UNKNOWN intent. Defaulting to chat.');
            return "I'm sorry, I couldn't determine the exact request. Could you rephrase it, or try mentioning a specific command?";
        }

        // 2. Tool Delegation Step (Switch statement pattern)
        try {
            switch (classification.intent) {
                case Intent.INTERNET_SEARCH:
                    Logger.info('Routing to Internet Search tool.');
                    if (!classification.suggestedQuery) {
                        return "I need a specific search query to use the internet search feature.";
                    }
                    // Pass control flow to the dedicated Internet Service first, then to Tool Manager if necessary.
                    const searchResults = await this.internetService.search(classification.suggestedQuery!, 'General Web Search');
                    return `📚 **Internet Search Results** (Sources: ${searchResults.length}):\n${this.formatSearchResults(searchResults)}`;

                case Intent.CHAT:
                    Logger.info('Routing to Chat AI.');
                    // Pass the query directly to the standard chat tool execution
                    return await this.toolManager.executeChat(userPrompt);

                case Intent.IMAGE_GENERATION:
                    Logger.info('Routing to Image Generation tool.');
                    // Tool Manager handles image generation using ComfyUI
                    await this.toolManager.executeImageGeneration(userPrompt);
                    return "✨ Image generation process started! Check the channel for the result.";

                case Intent.VISION_ANALYSIS:
                    Logger.info('Routing to Vision Analysis tool.');
                    // Requires context (attached image) which must be handled by the calling layer/event handler.
                    return this.toolManager.executeVision(userPrompt); 

                case Intent.FILE_ANALYSIS:
                    Logger.info('Routing to File Analysis tool.');
                    // Requires context (attached file)
                    return this.toolManager.executeFileAnalysis(userPrompt); 

                default:
                    // Fallback for any future or unexpected intent
                    return `Error: Intent ${Intent[Object.keys(Intent).find(key => Intent[key] === classification.intent)]} is not yet fully implemented.`;
            }
        } catch (error) {
            Logger.error(`Critical error during routing execution for intent ${Intent[Object.keys(Intent).find(key => Intent[key] === classification.intent)]}:`, error);
            return `🚨 An internal system error occurred while trying to fulfill your request. Please try again later or simplify your query.`;
        }
    }

    /**
     * Formats a list of SearchResult objects into a readable Discord Embed/message string.
     * @param results The array of search results.
     */
    private formatSearchResults(results: SearchResult[]): string {
        let output = '';
        for (const result of results) {
            output += `\n**${result.title}** (${result.source})\n`;
            output += `<${result.url}>\n`; // Use markdown link syntax for Discord
            output += `${result.snippet}\n`;
        }
        return output;
    }
}