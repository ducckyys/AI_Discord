import { AttachmentBuilder } from "discord.js";
import type { ToolFile } from "../ai/tools/index.js";

export const toDiscordAttachments = (files: ToolFile[] = []): AttachmentBuilder[] => files.map((file) => new AttachmentBuilder(file.data, { name: file.name }));
