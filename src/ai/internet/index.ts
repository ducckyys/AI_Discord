import { SearXNGProvider } from "./searxng.js";
import type { SearchResult } from "./provider.js";
import { InternetSearchError } from "./provider.js";

export class InternetService {
  private readonly requests = new Map<string, number[]>();
  private readonly provider = new SearXNGProvider();

  public async search(query: string, key = "global"): Promise<SearchResult[]> {
    const normalized = query.trim();
    if (!normalized) throw new InternetSearchError("Search query cannot be empty.");
    this.checkRateLimit(key);
    return this.provider.search(normalized);
  }

  private checkRateLimit(key: string): void {
    const now = Date.now();
    const active = (this.requests.get(key) ?? []).filter((time) => now - time < 60_000);
    if (active.length >= 6) throw new InternetSearchError("Internet search rate limit reached. Please try again shortly.");
    active.push(now);
    this.requests.set(key, active);
  }
}

export { InternetSearchError } from "./provider.js";
export type { SearchResult } from "./provider.js";
