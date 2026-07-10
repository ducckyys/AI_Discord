import { logger } from "../utils/logger.js";
export const logCommand = (name: string, userId: string, guildId: string | null) => logger.info({ name, userId, guildId }, "command executed");
