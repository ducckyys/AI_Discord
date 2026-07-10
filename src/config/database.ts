import { env } from "../utils/env.js";
export const databaseConfig = { url: env.DATABASE_URL } as const;
