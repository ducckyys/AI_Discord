// src/ai/internet/brave.ts

import { InternetProvider, SearchResult, InternetSearchError } from './provider';
import { Logger } from '@/utils/logger'; // Assuming logger utility exists
import axios from 'axios'; // Using a standard HTTP client for external APIs

/**
 * Implementation of the Brave Search API provider.
 * Handles all interactions with the Brave search endpoint.
 */
export class BraveProvider implements InternetProvider {
    readonly name = 'brave';
    private static readonly BRAVE_API_KEY = process.env.BRAVE_API_KEY;

    /**
     * Checks if the necessary environment variables for this provider are set.
     */
    static isConfigured(): boolean {
        return !!BraveProvider.BRAVE_API_KEY;
    }

    /**
     * Performs a search using Brave Search API.
     * @param query The search term.
     * @param scope Optional scope filter (e.g., 'News', 'Technology').
     * @returns An array of formatted search results.
     */
    async search(query: string, scope?: string): Promise<SearchResult[]> {
        if (!BraveProvider.isConfigured()) {
            throw new InternetSearchError('Brave API Key is not configured.');
        }

        Logger.info(`Executing Brave Search for query: "${query}" (Scope: ${scope || 'General'})`);

        // Determine the search type based on scope if needed, otherwise use default general search.
        const params: Record<string, string> = {
            api_key: BraveProvider.BRAVE_API_KEY,
            q: query,
            pageno: '1', // Start page
        };

        // Example logic for scopes - adjusting the API parameters as necessary
        if (scope) {
            params['search_type'] = scope === 'News' ? 'news' : 
                                 scope === 'Technology' ? 'tech' : 
                                 scope === 'Programming' ? 'programming' : '';
        }

        try {
            // NOTE: Placeholder API structure. Actual URL and parameter mapping must be verified against Brave documentation.
            const response = await axios.get(`https://api.search.brave.com/v1/search`, params);

            // Map the complex, provider-specific response structure to our standard SearchResult array.
            const results: SearchResult[] = response.data.results.map((item: any) => ({
                title: item.title || 'No Title',
                url: item.url || '',
                snippet: item.description || 'No description available.',
                source: 'Brave Search',
                isFeatured: item.featured === true,
            }));

            return results;

        } catch (error) {
            console.error('Error executing Brave search:', error);
            throw new InternetSearchError(
                `Failed to retrieve results from Brave Search. Check API keys and network connectivity.`, 
                error
            );
        }
    }
}