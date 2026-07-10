import { EmbedBuilder } from "discord.js"; import { colors } from "../utils/colors.js";
export const warningEmbed = (description: string) => new EmbedBuilder().setColor(colors.warning).setDescription(description);
