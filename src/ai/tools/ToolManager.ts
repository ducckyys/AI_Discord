import type { InternetService, SearchResult } from "../internet/index.js";
import { ImageService, isImageGenerationRequest } from "../image/index.js";
import type { AIProvider } from "../providers/provider.js";
import { Intent } from "../router/intent.js";
import { buildContext } from "../services/context.js";
import type { Tool, ToolInput, ToolResult } from "./Tool.js";

const searchPattern = /\b(?:search|cari|carikan|googling|terbaru|terkini|hari ini|saat ini|berita|news|latest|current|today|harga|price|cuaca|weather|jadwal|schedule|skor|score|siapa (?:presiden|ceo)|documentation|dokumentasi)\b/i;

export class ToolManager implements Tool {
  public readonly intent = Intent.INTERNET_SEARCH;

  public constructor(private readonly provider: AIProvider, private readonly internet: InternetService, private readonly images = new ImageService()) {}

  public async execute(input: ToolInput): Promise<ToolResult> {
    if (isImageGenerationRequest(input.question, Boolean(input.images?.length))) {
      const files = await this.images.generate(input.question);
      return { content: "Gambar selesai dibuat.", files };
    }

    const results = this.needsSearch(input.question)
      ? await this.internet.search(input.question, `${input.guildId}:${input.userId}`)
      : [];
    const question = results.length ? this.questionWithSources(input.question, results) : input.question;
    const content = await this.provider.chat(buildContext(input.history, question, input.images), { model: input.model });
    return { content: results.length ? `${content}\n\n${this.formatSources(results)}` : content };
  }

  private needsSearch(question: string): boolean {
    return searchPattern.test(question.trim());
  }

  private questionWithSources(question: string, results: SearchResult[]): string {
    const sources = results.map((result, index) => `${index + 1}. ${result.title}\n${result.snippet}\n${result.url}`).join("\n\n");
    return `${question}\n\nUse the following live web-search results to answer. State uncertainty when they do not support a claim and do not invent sources.\n\n${sources}`;
  }

  private formatSources(results: SearchResult[]): string {
    return `Sources:\n${results.map((result, index) => `${index + 1}. [${result.title}](${result.url})`).join("\n")}`;
  }
}
