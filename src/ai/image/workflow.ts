import workflow from "./workflow/flux-schnell.json" with { type: "json" };

type WorkflowNode = { class_type?: string; inputs?: Record<string, unknown> };
export type ComfyWorkflow = Record<string, WorkflowNode>;

export const defaultFluxWorkflow = workflow as ComfyWorkflow;

export function injectPrompt(workflowTemplate: ComfyWorkflow, prompt: string, model: string): ComfyWorkflow {
  const cloned = structuredClone(workflowTemplate);
  for (const node of Object.values(cloned)) {
    if (!node.inputs) continue;
    if (node.class_type === "CLIPTextEncode" && typeof node.inputs.text === "string" && node.inputs.text.includes("{{PROMPT}}")) node.inputs.text = prompt;
    if (node.class_type === "CheckpointLoaderSimple" && typeof node.inputs.ckpt_name === "string" && node.inputs.ckpt_name.includes("{{MODEL}}")) node.inputs.ckpt_name = model;
    if (node.class_type === "UNETLoader" && typeof node.inputs.unet_name === "string" && node.inputs.unet_name.includes("{{MODEL}}")) node.inputs.unet_name = model;
  }
  return cloned;
}
