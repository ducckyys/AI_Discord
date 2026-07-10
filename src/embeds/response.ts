import { EmbedBuilder } from "discord.js";
import { colors } from "../utils/colors.js";

export const infoEmbed = (description: string, title = "Info") =>
  new EmbedBuilder().setTitle(title).setDescription(description).setColor(colors.info);

export const successEmbed = (description: string, title = "Success") =>
  new EmbedBuilder().setTitle(title).setDescription(description).setColor(colors.success);

export const warningEmbed = (description: string, title = "Warning") =>
  new EmbedBuilder().setTitle(title).setDescription(description).setColor(colors.warning);
