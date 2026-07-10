import { describe, expect, it } from "vitest"; import { splitMessage } from "../src/utils/formatter.js";
describe("splitMessage", () => it("keeps Discord chunks within the limit", () => expect(splitMessage("a".repeat(2001)).every((part) => part.length <= 2000)).toBe(true)));
