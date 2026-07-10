// src/ai/internet/provider.ts

import { SearchResult } from '@/types'; // Assuming a global or module-level type definition for search results
import { Logger } from '@/utils/logger'; // Assuming a centralized logger utility

/**
 * Defines the standard structure for all internet search providers.
 * Ensures adherence to the Provider pattern, making it easy to add new sources (Google, etc.).
 */
export interface InternetProvider {
    /**
     * Unique identifier for this provider (e.g., 'brave', 'tavily').
     */
    readonly name: string;

    /**
     * Checks if the API key or necessary environment variables are configured.
     */
    static isConfigured(): boolean;

    /**
     * Performs a comprehensive internet search based on the query and desired scope.
     * @param query The search term provided by the user.
     * @param scope Optional scope filter (e.g., 'News', 'Technology', 'GitHub').
     * @returns A promise that resolves to an array of structured SearchResult objects.
     */
    search(query: string, scope?: string): Promise<SearchResult[]>;
}

/**
 * Represents a single search result item returned by any provider.
 */
export type SearchResult = {
    title: string;
    url: string;
    snippet: string; // The short description/excerpt of the content
    source: string; // Original source name (e.g., 'Brave Search', 'Tavily')
    isFeatured?: boolean; // Indicates if it's a featured result or snippet
};

/**
 * Handles errors specific to internet search operations.
 */
export class InternetSearchError extends Error {
    constructor(message: string, public originalError?: any) {
        super(`Internet Search Failed: ${message}`);
        this.name = 'InternetSearchError';
    }
}

/**
 * A utility function to simulate logging provider usage.
 */
export const logProviderUsage = (providerName: string, query: string): void => {
    Logger.info(`[AI Tooling] Starting internet search via ${providerName} for query: "${query}"`);
};