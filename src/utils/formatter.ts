import { DISCORD_MESSAGE_LIMIT } from "./constants.js";
export const splitMessage = (text: string): string[] => {
  const result: string[] = [];
  let remaining = text.trim();
  while (remaining.length > DISCORD_MESSAGE_LIMIT) {
    const cut = remaining.lastIndexOf("\n", DISCORD_MESSAGE_LIMIT) || DISCORD_MESSAGE_LIMIT;
    result.push(remaining.slice(0, cut)); remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) result.push(remaining);
  return result;
};
