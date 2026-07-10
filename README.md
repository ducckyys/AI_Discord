# Duccky AI

Duccky AI is a self-hosted Discord assistant powered exclusively by [LM Studio](https://lmstudio.ai). Invite it to a server, mention it in a conversation, or configure a dedicated AI channel. Your prompts are processed by the model running on your own machine—no OpenAI API key or cloud AI account is required.

## Why Duccky AI

- **Private by design** — prompts are sent only to your configured LM Studio endpoint.
- **Server-aware** — each Discord server has separate settings and conversation memory.
- **Practical controls** — slash commands, cooldowns, rate limits, permission checks, and safe error messages.
- **Ready to maintain** — TypeScript, Prisma, tests, linting, CI workflows, and clear project documentation.

## Features

- Reply when mentioned: `@Duccky AI explain TypeScript simply`
- Dedicated AI channel configured with `/config channel`
- Persistent conversation context per user and channel
- Local LM Studio OpenAI-compatible chat endpoint
- Slash commands: `/ask`, `/reset`, `/memory`, `/model`, `/config`, `/ping`, `/help`, `/about`, and `/invite`
- SQLite for local development, with a documented path to PostgreSQL production deployments
- Pino logging, graceful shutdown, health endpoint, Zod validation, cooldowns, and rate limiting

## Requirements

- Node.js 22 LTS or newer
- pnpm 9 or newer (Corepack is included with modern Node.js)
- A Discord application and bot token
- LM Studio with a chat-capable model loaded

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/duccky-ai.git
cd duccky-ai
corepack pnpm install
```

### 2. Create your environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Open `.env` and set the required values:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_discord_application_id
GUILD_ID=your_test_server_id
DATABASE_URL="file:./dev.db"
LMSTUDIO_URL=http://127.0.0.1:1234/v1
AI_PROVIDER=lmstudio
MODEL=google/gemma-4-e2b
LOG_LEVEL=info
PORT=3000
```

`GUILD_ID` is recommended while developing because commands appear in the chosen test server immediately. Remove or leave it empty before global deployment.

### 3. Configure Discord

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy its **Application ID** into `CLIENT_ID`.
3. Create or reset the bot token on the **Bot** page and copy it into `DISCORD_TOKEN`. Never commit this token.
4. Enable **Message Content Intent** under **Bot → Privileged Gateway Intents**.
5. Under **Installation**, use the `bot` and `applications.commands` scopes. Grant the bot View Channels, Send Messages, Embed Links, and Read Message History.
6. Invite the bot to your server with the generated install link.

### 4. Configure LM Studio

1. Open LM Studio and load a chat-capable model.
2. Go to **Developer → Local Server** and start the server.
3. Copy the **API Model Identifier** into `MODEL`. For example: `google/gemma-4-e2b`.
4. Keep `LMSTUDIO_URL` as `http://127.0.0.1:1234/v1` when bot and LM Studio run on the same computer.

Test the server:

```powershell
Invoke-RestMethod http://127.0.0.1:1234/v1/models
```

### 5. Create the database and start the bot

```bash
corepack pnpm prisma:generate
corepack pnpm prisma db push
corepack pnpm deploy:commands
corepack pnpm dev
```

When `bot started` appears in the terminal, open Discord and try `/ping` or mention the bot. Keep both LM Studio and this terminal running while using the bot.

## Commands

| Command                               | Description                                    | Access        |
| ------------------------------------- | ---------------------------------------------- | ------------- |
| `/ask prompt`                         | Ask Duccky AI a question                       | Everyone      |
| `/reset`                              | Clear your conversation in the current channel | Everyone      |
| `/memory`                             | Explain how memory works                       | Everyone      |
| `/ping`, `/help`, `/about`, `/invite` | Utility commands                               | Everyone      |
| `/model name`                         | Change the server model identifier             | Administrator |
| `/config channel`                     | Set or disable the dedicated AI channel        | Administrator |
| `/reload`, `/shutdown`                | Operational commands                           | Administrator |

## Deployment notes

For one server, set `GUILD_ID`. For multiple servers, remove `GUILD_ID`, rerun `corepack pnpm deploy:commands`, turn on **Public Bot** in Discord, and distribute the installation link. The host machine must remain online because LM Studio runs locally.

For production, use a managed PostgreSQL database and a PostgreSQL Prisma schema/migration workflow. See [Architecture](docs/ARCHITECTURE.md).

## Documentation

- [Documentation index](docs/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API reference](docs/API.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Security policy](docs/SECURITY.md)
- [Privacy policy](docs/PRIVACY_POLICY.md)
- [Terms of service](docs/TERMS_OF_SERVICE.md)

## License

Licensed under the [MIT License](LICENSE).
