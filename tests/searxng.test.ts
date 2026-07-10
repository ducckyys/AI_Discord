import { afterEach, describe, expect, it, vi } from "vitest";
import { SearXNGProvider } from "../src/ai/internet/searxng.js";

describe("SearXNGProvider", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("maps SearXNG JSON results into the application result format", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      results: [{ title: "SearXNG docs", url: "https://docs.searxng.org", content: "Official docs", engine: "google" }],
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(new SearXNGProvider().search("SearXNG")).resolves.toEqual([{
      title: "SearXNG docs", url: "https://docs.searxng.org", snippet: "Official docs", source: "google",
    }]);
  });
});
