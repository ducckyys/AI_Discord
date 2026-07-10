import { describe, expect, it } from "vitest";

describe("commands", () => it("includes ask", async () => {
  process.env.DISCORD_TOKEN = "test-token";
  process.env.CLIENT_ID = "test-client";
  process.env.DATABASE_URL = "file:./test.db";
  const { commands } = await import("../src/handlers/commandHandler.js");
  expect(commands.some((command) => command.data.name === "ask")).toBe(true);
}));
