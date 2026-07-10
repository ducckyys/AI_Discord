// src/ai/internet/tavily.ts

import { InternetProvider, SearchResult, InternetSearchError } from './provider';
import { Logger } from '@/utils/logger'; // Assuming logger utility exists
import axios from 'axios'; 

/**
 * Implementation of the Tavily Search API provider.
 * Handles all interactions with the Tavily search endpoint.
 */
export class TavilyProvider implements InternetProvider {
    readonly name = 'tavily';
    private static readonly TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    /**
     * Checks if the necessary environment variables for this provider are set.
     */
    static isConfigured(): boolean {
        return !!TavilyProvider.TAVILY_API_KEY;
    }

    /**
     * Performs a search using Tavily Search API.
     * @param query The search term.
     * @param scope Optional scope filter (e.g., 'News', 'Technology').
     * @returns An array of formatted search results.
     */
    async search(query: string, scope?: string): Promise<SearchResult[]> {
        if (!TavilyProvider.isConfigured()) {
            throw new InternetSearchError('Tavily API Key is not configured.');
        }

        Logger.info(`Executing Tavily Search for query: "${query}" (Scope: ${scope || 'General'})`);

        // Tavily typically uses a single endpoint and accepts various parameters for filtering.
        const params = {
            api_key: TavilyProvider.TAVILY_API_KEY,
            query: query,
            #ifdef SCOPE_PARAM // Placeholder: Check if scope is supported by the API
            max_results: 5, // Limit results to 5 for performance
        };

        try {
            // NOTE: Using a generic placeholder endpoint. Must be adjusted for actual Tavily SDK/API usage.
            const response = await axios.get('https://api.tavily.com/search', params);

            // Map the provider-specific response structure to our standard SearchResult array.
            const results: SearchResult[] = (response.data?.results || []).map((item: any) => ({
                title: item.title || 'No Title',
                url: item.url || '',
                snippet: item.content || 'No content available.',
                source: 'Tavily Search',
                isFeatured: false, // Assume featured status requires explicit checks
            }));

            return results;

        } catch (error) {
            console.error('Error executing Tavily search:', error);
            throw new InternetSearchError(
                `Failed to retrieve results from Tavily Search. Check API keys and network connectivity.`, 
                error
            );
        }
    }
}