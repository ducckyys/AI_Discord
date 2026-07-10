import type { InternetProvider, InternetSearchOptions, SearchResult } from "./provider.js";

export class InternetError extends Error {
  public constructor(message: string, public readonly cause?: unknown) { super(message); }
}

export async function fetchJson<T>(url: string, init: RequestInit, timeoutMs = 10_000, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok) throw new InternetError(`Search provider returned HTTP ${response.status}`);
      return await response.json() as T;
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw new InternetError("Search provider request failed", lastError);
}

export class InternetService {
  private readonly requests = new Map<string, number[]>();

  public constructor(private readonly provider: InternetProvider, private readonly limit = { max: 6, windowMs: 60_000 }) {}

  public async search(query: string, options: InternetSearchOptions = {}, key = "global"): Promise<SearchResult[]> {
    this.checkRateLimit(key);
    const normalized = query.trim();
    if (!normalized) throw new InternetError("Search query cannot be empty.");
    return this.provider.search(normalized, options);
  }

  private checkRateLimit(key: string) {
    const now = Date.now();
    const active = (this.requests.get(key) ?? []).filter((time) => now - time < this.limit.windowMs);
    if (active.length >= this.limit.max) throw new InternetError("Internet search rate limit reached. Please try again shortly.");
    active.push(now);
    this.requests.set(key, active);
  }
}
