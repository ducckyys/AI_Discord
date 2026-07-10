import { EmbedBuilder } from "discord.js"; import { colors } from "../utils/colors.js";
export const errorEmbed = (description: string) => new EmbedBuilder().setColor(colors.error).setDescription(description);
