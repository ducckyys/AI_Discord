import type { ChatInputCommandInteraction } from "discord.js";
export const isAdministrator = (interaction: ChatInputCommandInteraction): boolean => interaction.inGuild() && interaction.memberPermissions?.has("Administrator") === true;
