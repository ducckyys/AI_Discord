import { EmbedBuilder } from "discord.js"; import { colors } from "../utils/colors.js";
export const infoEmbed = (description: string) => new EmbedBuilder().setColor(colors.info).setDescription(description);
