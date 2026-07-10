import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../interfaces/command.js";
import { askFromInteraction } from "../../events/interactionCreate.js";
export const askCommand: Command = { data: new SlashCommandBuilder().setName("ask").setDescription("Ask Duccky AI").addStringOption((option) => option.setName("prompt").setDescription("Your question").setRequired(true)), execute: askFromInteraction };
