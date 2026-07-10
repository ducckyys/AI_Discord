import { EmbedBuilder } from "discord.js"; import { colors } from "../utils/colors.js";
export const successEmbed = (description: string) => new EmbedBuilder().setColor(colors.success).setDescription(description);
