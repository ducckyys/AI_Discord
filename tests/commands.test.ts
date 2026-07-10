import { describe, expect, it } from "vitest";

describe("commands", () => it("includes core user and setup commands", async () => {
  process.env.DISCORD_TOKEN = "test-token";
  process.env.CLIENT_ID = "test-client";
  process.env.DATABASE_URL = "file:./test.db";
  const { commands } = await import("../src/handlers/commandHandler.js");
  const names = commands.map((command) => command.data.name);
  expect(names).toEqual(expect.arrayContaining(["ask", "reset", "memory", "status", "config", "model"]));
}));
