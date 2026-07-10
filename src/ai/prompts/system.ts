import { personalityPrompt } from "./personality.js";
import { safetyPrompt } from "./safety.js";
import { toolsPrompt } from "./tools.js";
export const systemPrompt = `You are Duccky AI, a Discord assistant. ${personalityPrompt} ${safetyPrompt} ${toolsPrompt}`;
