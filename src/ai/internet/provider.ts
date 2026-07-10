export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface InternetProvider {
  search(query: string): Promise<SearchResult[]>;
}

export class InternetSearchError extends Error {
  public constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "InternetSearchError";
  }
}
