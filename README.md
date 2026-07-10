# Duccky AI

Duccky AI is a TypeScript Discord bot that answers mentions and messages in a configured AI channel using **LM Studio only**.

## Features

- Mention the bot or use a dedicated AI channel
- `/ask`, `/reset`, `/model`, `/memory`, utility, and admin slash commands
- Per-user, per-channel conversation memory backed by Prisma/SQLite
- LM Studio provider abstraction, input validation, rate limiting, cooldowns, Pino logging, graceful shutdown, and `/health`

## Requirements

Node.js 22 LTS, pnpm 9+, Discord application token, and LM Studio with a chat model loaded.

## Install

```bash
pnpm install
copy .env.example .env
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm deploy:commands
pnpm dev
```

Set `DISCORD_TOKEN`, `CLIENT_ID`, and (for instant guild commands) `GUILD_ID` in `.env`. Start LM Studio's local server at `http://localhost:1234/v1` and set `MODEL` to the loaded model identifier. The health endpoint listens at `http://127.0.0.1:3000/health`.

## Commands

`/ask prompt`, `/reset`, `/memory`, `/model name`, `/config channel`, `/ping`, `/help`, `/about`, `/invite`, `/reload`, and `/shutdown`.

## Structure

Source is organized by AI, commands, events, handlers, database repositories, middleware, services, embeds, and configuration. See [Architecture](docs/ARCHITECTURE.md) and [API](docs/API.md).

## Contributing and license

Read [Contributing](docs/CONTRIBUTING.md), [Security](docs/SECURITY.md), and [Roadmap](docs/ROADMAP.md). Licensed under MIT.
