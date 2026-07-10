import { describe, expect, it } from "vitest";
import { isImageGenerationRequest } from "../src/ai/image/intent.js";
import { extractOutputImages, prepareWorkflow } from "../src/ai/image/workflow.js";

describe("image generation intent", () => {
  it("detects image generation prompts", () => {
    expect(isImageGenerationRequest("buat gambar kota cyberpunk")).toBe(true);
    expect(isImageGenerationRequest("gambar kota cyberpunk")).toBe(true);
    expect(isImageGenerationRequest("generate image of a small robot")).toBe(true);
    expect(isImageGenerationRequest("tolong jelaskan gambar ini", true)).toBe(false);
  });
});

describe("ComfyUI workflow helpers", () => {
  it("injects prompt, model, and seed placeholders", () => {
    expect(prepareWorkflow({
      "1": { inputs: { text: "{{PROMPT}}", ckpt_name: "{{MODEL}}", seed: 1 } },
    }, "a duck astronaut", "flux-test", 123)).toEqual({
      "1": { inputs: { text: "a duck astronaut", ckpt_name: "flux-test", seed: 123 } },
    });
  });

  it("extracts output images from ComfyUI history", () => {
    const history = {
      abc: {
        outputs: {
          "7": { images: [{ filename: "duccky-ai_00001_.png", subfolder: "", type: "output" }] },
        },
      },
    };

    expect(extractOutputImages(history, "abc")).toEqual([{ filename: "duccky-ai_00001_.png", subfolder: "", type: "output" }]);
  });
});
