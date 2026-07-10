export const summarize = (texts: string[]): string => texts.join(" ").slice(0, 2_000);
