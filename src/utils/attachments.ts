import type { Attachment } from "discord.js";
import type { ChatImage } from "../types/ai.js";
import { MAX_IMAGE_BYTES } from "./constants.js";

const supportedImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export const imageAttachments = (attachments: Iterable<Attachment>): Attachment[] =>
  [...attachments].filter((attachment) => attachment.contentType ? supportedImageTypes.has(attachment.contentType) : /\.(png|jpe?g|webp|gif)$/i.test(attachment.name ?? attachment.url));

export async function attachmentToChatImage(attachment: Attachment): Promise<ChatImage> {
  if (attachment.size > MAX_IMAGE_BYTES) throw new Error(`Image is too large. Maximum size is ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);

  const response = await fetch(attachment.url);
  if (!response.ok) throw new Error(`Could not download image attachment: HTTP ${response.status}`);

  const contentType = response.headers.get("content-type") ?? attachment.contentType ?? "image/png";
  if (!supportedImageTypes.has(contentType)) throw new Error("Unsupported image type. Please send PNG, JPG, WEBP, or GIF.");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`Image is too large. Maximum size is ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);

  return { url: `data:${contentType};base64,${buffer.toString("base64")}` };
}
