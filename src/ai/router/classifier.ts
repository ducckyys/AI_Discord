// src/ai/router/classifier.ts

import { Intent, ClassifiedIntent } from './intent';
import { Logger } from '@/utils/logger'; // Assuming centralized logger exists
import { AIProviderService } from '@/ai/providers/index'; // Dependency on the existing AI service layer

/**
 * A dedicated class responsible for classifying user input text into a defined intent.
 * It interfaces with the core AI model (LM Studio) to perform NLU (Natural Language Understanding).
 */
export class Classifier {
    private readonly aiService: AIProviderService;

    /**
     * Dependency Injection: Requires an initialized AI service instance.
     */
    constructor(aiService: AIProviderService) {
        this.aiService = aiService;
    }

    /**
     * Generates a highly structured prompt for the underlying LLM (LM Studio).
     * The goal is to force the model to output a machine-readable JSON object 
     * containing the determined intent and confidence score.
     * @param userPrompt The raw message from the Discord user.
     * @returns The complete, formatted system prompt payload.
     */
    private generateClassificationPrompt(userPrompt: string): { systemPrompt: string; userMessage: string } {
        const availableIntents = Object.values(Intent).filter(i => i !== Intent.UNKNOWN);
        const intentList = availableIntents.map(i => i.toString().toLowerCase()).join(', ');

        // This prompt structure is critical for reliability and adherence to the required JSON output format.
        const systemPrompt = `You are a highly accurate and strict AI Router Classifier. Your sole task is to analyze the user's message and determine which specific functional tool (intent) should be used to fulfill their request. You MUST respond ONLY with a single, valid JSON object that adheres exactly to the provided schema. DO NOT include any preamble, explanation, or surrounding text outside of the JSON block.

        Available Intents: ${availableIntents.map(i => `${i}: ${i}`).join('\n')}

        JSON Schema requirements:
        { 
          "intent": "string", // Must be one of the available intents.
          "confidence_score": "number", // A float representing your confidence (0.0 to 1.0).
          "suggested_query": "string | null" // Required if intent is 'internet' or 'file'. Otherwise, set to null.
        }

        Rules:
        1. If the user asks a general question that doesn't require external tools (e.g., "Tell me about your day"), use 'chat'.
        2. Use 'internet' if the request requires current information, news, or web lookups.
        3. Use 'generate_image' if keywords like 'draw', 'picture', 'wallpaper', etc., are present.
        4. Use 'vision' if the context implies image/visual analysis is needed (e.g., "What does this picture show?").
        5. Use 'file' if the user mentions needing to analyze an attached file or document.
        6. If none of the above apply, and it's not a chat request, use 'unknown'.

        Always prioritize finding the most specific intent possible.`;

        return { 
            systemPrompt: systemPrompt, 
            userMessage: userPrompt 
        };
    }


    /**
     * Classifies the given user prompt into a structured Intent object.
     * @param userPrompt The raw text message from the Discord user.
     * @returns A promise that resolves to the ClassifiedIntent object.
     */
    public async classify(userPrompt: string): Promise<ClassifiedIntent> {
        if (!this.aiService) {
            throw new Error('AIProviderService is not initialized in Classifier.');
        }

        Logger.info(`Starting intent classification for prompt: "${userPrompt}"`);
        
        const { systemPrompt, userMessage } = this.generateClassificationPrompt(userPrompt);

        try {
            // The AI service handles the API call, ensuring correct model usage and error handling.
            const responseJsonString = await this.aiService.chatCompletion(systemPrompt, userMessage);

            if (!responseJsonString) {
                Logger.error('AI Model returned no response for classification.');
                return { intent: Intent.UNKNOWN, confidenceScore: 0.0 };
            }

            // Attempt to parse the JSON string output from the LLM
            const classifiedData = JSON.parse(responseJsonString);
            
            const intent = Intent[classifiedData.intent?.toUpperCase() as keyof typeof Intent] || Intent.UNKNOWN;
            const confidenceScore: number = parseFloat((classifiedData.confidence_score as any)?.toFixed(2)) || 0.0;

            let suggestedQuery: string | undefined = undefined;

            if (intent === Intent.INTERNET_SEARCH && classifiedData.suggested_query) {
                suggestedQuery = classifiedData.suggested_query;
            } else if (intent === Intent.FILE_ANALYSIS && classifiedData.suggested_query) {
                suggestedQuery = classifiedData.suggested_query;
            }

            Logger.info(`Classification successful: ${Intent[intent]} with confidence ${confidenceScore}.`);
            return { 
                intent, 
                confidenceScore, 
                suggestedQuery 
            };

        } catch (error) {
            console.error('Error during intent classification:', error);
            // Fallback to UNKNOWN if JSON parsing or API call fails
            return { 
                intent: Intent.UNKNOWN, 
                confidenceScore: 0.1, // Low score indicates failure
                suggestedQuery: userPrompt
            };
        }
    }
}