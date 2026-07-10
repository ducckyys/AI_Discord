import { AskAI, ImageService, InternetService, LMStudioProvider, ToolManager } from "../ai/index.js";

const provider = new LMStudioProvider();
const tools = new ToolManager(provider, new InternetService(), new ImageService());
export const aiService = new AskAI(provider, undefined, tools);
