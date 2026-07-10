import { describe, expect, it } from "vitest";
import { buildContext } from "../src/ai/services/context.js";

describe("AI context", () => {
  it("adds a system prompt and user question", () => expect(buildContext([], "hello")).toHaveLength(2));

  it("adds image content to the latest user message", () => {
    const context = buildContext([], "what is this?", [{ url: "data:image/png;base64,test" }]);
    expect(context[1]?.content).toEqual([
      { type: "text", text: "what is this?" },
      { type: "image_url", image_url: { url: "data:image/png;base64,test" } },
    ]);
  });
});
