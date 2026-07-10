-- CreateTable
CREATE TABLE "Guild" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "username" TEXT NOT NULL,
  "isBot" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "guildId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "summary" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Conversation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "discordMessageId" TEXT,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "tokens" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Settings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "guildId" TEXT NOT NULL,
  "aiChannelId" TEXT,
  "model" TEXT NOT NULL DEFAULT 'qwen3',
  "maxContextMessages" INTEGER NOT NULL DEFAULT 12,
  "cooldownMs" INTEGER NOT NULL DEFAULT 5000,
  "rateLimitMax" INTEGER NOT NULL DEFAULT 8,
  "rateLimitWindowMs" INTEGER NOT NULL DEFAULT 60000,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Settings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Conversation_guildId_userId_channelId_key" ON "Conversation"("guildId", "userId", "channelId");
CREATE INDEX "Conversation_guildId_channelId_idx" ON "Conversation"("guildId", "channelId");
CREATE UNIQUE INDEX "Message_discordMessageId_key" ON "Message"("discordMessageId");
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
CREATE UNIQUE INDEX "Settings_guildId_key" ON "Settings"("guildId");
