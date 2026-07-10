// src/ai/router/intent.ts

/**
 * Defines all possible user intents that Duccky AI can handle.
 * This enumeration ensures type safety across the entire routing system.
 */
export enum Intent {
    CHAT = 'chat',
    INTERNET_SEARCH = 'internet',
    IMAGE_GENERATION = 'generate_image',
    VISION_ANALYSIS = 'vision',
    FILE_ANALYSIS = 'file',
    UNKNOWN = 'unknown' // Fallback for unclassifiable requests
}

/**
 * Defines the structure for a classified intent result.
 */
export interface ClassifiedIntent {
    intent: Intent;
    confidenceScore: number; // LM Studio model confidence score (optional)
    suggestedQuery?: string;  // For Internet Search or File Analysis, pass relevant parameters
}

/**
 * Maps the internal Intent enum to a standardized, machine-readable string 
 * required by downstream services.
 */
export const intentToString = (intent: Intent): string => {
    return intent[keyof typeof Intent];
};