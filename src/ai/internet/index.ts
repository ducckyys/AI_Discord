// src/ai/internet/index.ts

import { InternetProvider, SearchResult, InternetSearchError } from './provider';
import { BraveProvider } from './brave';
import { TavilyProvider } from './tavily';
import { Logger } from '@/utils/logger'; // Assuming logger utility exists

/**
 * Manages all available internet search providers and orchestrates the search process.
 * This acts as the facade for the entire Internet Search feature.
 */
export class InternetService {
    private readonly providers: Map<string, InternetProvider> = new Map();

    constructor() {
        this.initializeProviders();
    }

    /**
     * Populates the service with all configured and available providers.
     * This adheres to Dependency Injection principles by aggregating implementations.
     */
    private initializeProviders(): void {
        // Register all known provider classes
        const availableProviders: [new () => InternetProvider, string][] = [
            [BraveProvider, 'brave'],
            [TavilyProvider, 'tavily'],
            // Future providers (Google, SerpAPI) will be added here.
        ];

        for (const [ProviderClass, name] of availableProviders) {
            if (ProviderClass.isConfigured()) {
                this.providers.set(name, new ProviderClass());
            } else {
                Logger.warn(`Internet Search: Skipping provider '${name}' because it is not configured.`);
            }
        }
    }

    /**
     * Executes the search query by attempting multiple available providers 
     * and returning aggregated results or failing gracefully.
     * @param query The user's raw search query.
     * @param scope Optional functional area (News, Tech, etc.) to restrict search scope.
     * @returns A promise resolving to an array of SearchResult, sorted and deduplicated.
     */
    public async search(query: string, scope?: string): Promise<SearchResult[]> {
        if (this.providers.size === 0) {
            throw new InternetSearchError('No internet search providers are currently configured or available.');
        }

        Logger.info(`Attempting to perform multi-provider search for query: "${query}"`);

        // Get all active provider instances
        const activeProviders = Array.from(this.providers.values());
        if (activeProviders.length === 0) {
            throw new InternetSearchError('No active providers found.');
        }


        /**
         * Core search logic with retry mechanism and parallel execution.
         */
        try {
            // Run searches in parallel to minimize latency, but handle failures individually.
            const promises = activeProviders.map(provider => 
                this.executeSearchWithRetry(provider, query, scope)
            );

            // Wait for all promises (including those that fail gracefully)
            const resultsPromises = await Promise.allSettled(promises);

            let combinedResults: SearchResult[] = [];
            let successfulCount = 0;

            for (const result of resultsPromises) {
                if (result.status === 'fulfilled' && result.value) {
                    combinedResults = combinedResults.concat(result.value);
                    successfulCount++;
                } else {
                    // Log the failure but do not re-throw, allowing other providers to succeed.
                    Logger.error(`A search provider failed: ${result.reason}`);
                }
            }

            if (combinedResults.length === 0) {
                throw new InternetSearchError('All configured search providers failed or returned no results.');
            }

            // Deduplicate and format the final list of results for the consumer
            return this.deduplicateAndFormat(combinedResults);

        } catch (error) {
            if (error instanceof InternetSearchError) {
                throw error;
            }
            Logger.error(`Critical failure during search coordination:`, error);
            throw new InternetSearchError('An unexpected critical error occurred during the search process.');
        }
    }

    /**
     * Attempts to call a single provider's search method with basic retry logic.
     */
    private async executeSearchWithRetry(provider: InternetProvider, query: string, scope?: string): Promise<SearchResult[] | null> {
        const maxRetries = 2;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Attempt the search. The provider class handles specific API calls.
                const results = await provider.search(query, scope);
                Logger.info(`[Success] Provider ${provider.name} successfully returned ${results.length} results.`);
                return results;

            } catch (error) {
                console.warn(`Attempt ${attempt} failed for ${provider.name}. Error:`, (error as any).message);
                if (attempt < maxRetries && !(error instanceof InternetSearchError)) {
                    // Wait before retrying due to temporary network issues or rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff simulation
                    continue;
                } else if (error instanceof InternetSearchError) {
                     // Do not retry on known configuration/API key errors.
                     return null;
                }
            }
        }
        Logger.error(`[Failure] Failed to search using ${provider.name} after ${maxRetries} attempts.`);
        return null; // Return null if all retries fail for this provider
    }

    /**
     * Simple deduplication logic based on URL and title matching.
     */
    private deduplicateAndFormat(results: SearchResult[]): SearchResult[] {
        const uniqueMap = new Map<string, SearchResult>();
        for (const result of results) {
            // Use a combination key to ensure uniqueness
            const key = `${result.url}:${result.title}`; 
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, result);
            }
        }
        return Array.from(uniqueMap.values());
    }
}