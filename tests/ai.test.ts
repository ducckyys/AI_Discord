import { describe, expect, it } from "vitest"; import { buildContext } from "../src/ai/services/context.js";
describe("AI context", () => it("adds a system prompt and user question", () => expect(buildContext([], "hello")).toHaveLength(2)));
