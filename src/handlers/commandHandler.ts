import type { ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../interfaces/command.js";
import { askCommand } from "../commands/ai/ask.js"; import { resetCommand } from "../commands/ai/reset.js"; import { modelCommand } from "../commands/ai/model.js"; import { memoryCommand } from "../commands/ai/memory.js";
import { pingCommand } from "../commands/utility/ping.js"; import { helpCommand } from "../commands/utility/help.js"; import { inviteCommand } from "../commands/utility/invite.js"; import { aboutCommand } from "../commands/utility/about.js"; import { statusCommand } from "../commands/utility/status.js";
import { searchCommand } from "../commands/utility/search.js";
import { configCommand } from "../commands/admin/config.js"; import { reloadCommand } from "../commands/admin/reload.js"; import { shutdownCommand } from "../commands/admin/shutdown.js";
export const commands: Command[] = [askCommand, resetCommand, modelCommand, memoryCommand, statusCommand, pingCommand, helpCommand, inviteCommand, aboutCommand, searchCommand, configCommand, reloadCommand, shutdownCommand];
export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
export const executeCommand = async (interaction: ChatInputCommandInteraction) => { const command = commandMap.get(interaction.commandName); if (command) await command.execute(interaction); };
