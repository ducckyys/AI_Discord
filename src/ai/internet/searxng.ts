import { internetConfig } from "../../config/internet.js";
import { logger } from "../../utils/logger.js";
import type { InternetProvider, SearchResult } from "./provider.js";
import { InternetSearchError } from "./provider.js";

type SearXNGResponse = {
  results?: Array<{ title?: string; url?: string; content?: string; engine?: string }>;
};

export class SearXNGProvider implements InternetProvider {
  public async search(query: string): Promise<SearchResult[]> {
    const url = new URL("search", `${internetConfig.url}/`);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("categories", "general");
    url.searchParams.set("safesearch", "1");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), internetConfig.timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": "Duccky-AI/1.0" },
        signal: controller.signal,
      });
      if (!response.ok) {
        const hint = response.status === 403 ? " Enable the JSON output format on your SearXNG instance." : "";
        throw new InternetSearchError(`SearXNG returned HTTP ${response.status}.${hint}`);
      }

      const body = (await response.json()) as SearXNGResponse;
      const results = (body.results ?? [])
        .filter((result): result is Required<Pick<typeof result, "title" | "url">> & typeof result => Boolean(result.title?.trim() && result.url?.trim()))
        .slice(0, internetConfig.maxResults)
        .map((result) => ({
          title: result.title.trim(),
          url: result.url.trim(),
          snippet: result.content?.replace(/\s+/g, " ").trim() || "No description available.",
          source: result.engine?.trim() || "SearXNG",
        }));

      logger.info({ query, results: results.length }, "SearXNG search completed");
      return results;
    } catch (error) {
      if (error instanceof InternetSearchError) throw error;
      const reason = error instanceof Error && error.name === "AbortError" ? "request timed out" : "request failed";
      throw new InternetSearchError(`SearXNG ${reason}. Check SEARXNG_URL and that the instance is reachable.`, error);
    } finally {
      clearTimeout(timer);
    }
  }
}
