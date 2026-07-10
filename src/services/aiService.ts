import { AskAI, LMStudioProvider } from "../ai/index.js";
import { createImageService } from "../ai/image/index.js";
import { internetService } from "../ai/internet/index.js";
import { IntentClassifier } from "../ai/router/classifier.js";
import { AIRouter } from "../ai/router/router.js";
import { ToolManager } from "../ai/tools/index.js";

const provider = new LMStudioProvider();
const router = new AIRouter(new IntentClassifier(provider));
const tools = new ToolManager(router, provider, internetService, createImageService(provider));
export const aiService = new AskAI(provider, undefined, tools);
