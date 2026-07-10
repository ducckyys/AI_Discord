# Duccky AI

[Bahasa Indonesia](README.id.md)

Duccky AI is a self-hosted Discord assistant powered by a locally running [LM Studio](https://lmstudio.ai/) server. It keeps conversations and configuration in a local SQLite database, and can optionally search the web through SearXNG.

## Features

- Chat by mentioning the bot, in a dedicated AI channel, or with `/ask`
- Optional image attachment analysis with `/ask`
- Per-server AI channel and LM Studio model settings
- Channel conversation memory that users can clear with `/reset`
- Optional web search through a self-hosted SearXNG instance
- Slash commands for health, setup, moderation, and maintenance
- Local-only defaults: no hosted AI API key is required

## Requirements

- Node.js 22 or newer
- pnpm 9 or newer (recommended), or npm
- A Discord application and bot token
- LM Studio running locally with a loaded chat-capable model
- Optional: a SearXNG instance for `/search`

## Setup

### 1. Install dependencies

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/duccky-ai.git
cd duccky-ai
corepack pnpm install
```

With npm:

```bash
npm install
```

### 2. Create and configure `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Copy the values from `.env.example` and replace the placeholders. The required Discord credentials are:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_discord_application_id
GUILD_ID=your_development_server_id
DATABASE_URL="file:./dev.db"
LMSTUDIO_URL=http://localhost:1234/v1
MODEL=qwen3
```

`GUILD_ID` is optional. When present, commands are registered only in that server and appear quickly; without it, commands are registered globally and can take longer to propagate.

Available settings:

| Variable | Required | Description |
| --- | --- | --- |
| `DISCORD_TOKEN` | Yes | Discord bot token. Keep it secret. |
| `CLIENT_ID` | Yes | Discord application ID. |
| `GUILD_ID` | No | Development server ID for guild-scoped commands. |
| `DATABASE_URL` | Yes | Prisma SQLite URL, normally `file:./dev.db`. |
| `LMSTUDIO_URL` | No | LM Studio OpenAI-compatible base URL. Default: `http://localhost:1234/v1`. |
| `AI_PROVIDER` | No | AI provider. Only `lmstudio` is supported. |
| `MODEL` | No | Fallback LM Studio model identifier. Default: `qwen3`. |
| `CREATOR_ID` | No | Discord user ID shown by `/about`. |
| `SEARXNG_URL` | No | SearXNG base URL for `/search`. |
| `SEARXNG_TIMEOUT_MS` | No | Search timeout in milliseconds. Default: `10000`. |
| `SEARXNG_MAX_RESULTS` | No | Search results sent to the bot, from 1 to 10. Default: `5`. |
| `LOG_LEVEL` | No | Pino log level. Default: `info`. |
| `PORT` | No | Local health endpoint port. Default: `3000`. |

### 3. Configure Discord

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy its **Application ID** to `CLIENT_ID`.
3. On the **Bot** page, create or reset the token and set it as `DISCORD_TOKEN`.
4. Enable **Message Content Intent** under **Bot → Privileged Gateway Intents**.
5. Under **Installation**, add the `bot` and `applications.commands` scopes. Grant the bot View Channels, Send Messages, Embed Links, and Read Message History.
6. Install the bot in your server using the generated install link.

### 4. Start LM Studio

1. Load a chat-capable model in LM Studio.
2. Open **Developer → Local Server** and start the server.
3. Copy the displayed API model identifier to `MODEL` if it differs from `qwen3`.

When LM Studio and the bot run on the same machine, leave `LMSTUDIO_URL` set to `http://localhost:1234/v1`. Verify the server with:

```powershell
Invoke-RestMethod http://localhost:1234/v1/models
```

### 5. Create the database and run the bot

```bash
corepack pnpm prisma:generate
corepack pnpm prisma:migrate
corepack pnpm deploy:commands
corepack pnpm dev
```

For a production build:

```bash
corepack pnpm build
corepack pnpm start
```

Use the npm equivalents (`npm run <script>`) if you installed with npm. After changing a slash command, run `corepack pnpm deploy:commands` again.

## Optional web search

Run a SearXNG instance that supports JSON output, then set `SEARXNG_URL` to its base URL. Duccky AI requests SearXNG's `/search?format=json` endpoint.

Once configured, use `/search query:<terms>`. Search errors usually mean the URL is unreachable or the instance does not expose JSON search results.

## How to use it

By default, mention the bot in a server channel:

```text
@Duccky AI Explain TypeScript generics simply.
```

An administrator can set a dedicated channel with `/config channel`. Messages in that channel are sent to the bot without a mention. Run `/config channel` without selecting a channel to return to mention-only mode.

You can also use `/ask prompt:<text>` and optionally attach an image for analysis.

## Commands

| Command | Description | Access |
| --- | --- | --- |
| `@Duccky AI <message>` | Chat with the bot from an allowed channel. | Everyone |
| `/ask prompt:<text> [image]` | Ask through a slash command; an image attachment is optional. | Everyone |
| `/search query:<terms>` | Search the web through SearXNG. | Everyone |
| `/reset` | Clear your saved conversation context in the current channel. | Everyone |
| `/memory` | Explain the conversation memory behaviour. | Everyone |
| `/status` | Show uptime, latency, channel, model, and limits. | Everyone |
| `/ping` | Show Discord gateway latency. | Everyone |
| `/help` | Show in-Discord usage help. | Everyone |
| `/about` | Show information about the bot and its creator. | Everyone |
| `/invite` | Return the bot's invite link. | Everyone |
| `/config channel [channel]` | Set or disable the dedicated AI channel. | Administrator |
| `/model name:<model-id>` | Set the LM Studio model for this server. | Administrator |
| `/reload` | Explain the command reload procedure. | Administrator |
| `/shutdown` | Gracefully stop the bot process. | Administrator |

Model selection uses this priority: the model set with `/model`, then a model discovered from LM Studio, then `MODEL` in `.env`.

## Slash command examples

- `/ask prompt:Explain TypeScript generics simply` — ask the bot directly. You may add an image in the `image` field for analysis.
- `/search query:latest Node.js release` — search through the configured SearXNG instance.
- `/reset` — remove your current-channel conversation context.
- `/memory` — see what conversation memory is used for.
- `/status` — check the active model, AI channel, uptime, and limits.
- `/config channel channel:#ai` — administrator: make `#ai` the dedicated channel where no mention is needed.
- `/config channel` — administrator: disable the dedicated channel and return to mention-only chat.
- `/model name:qwen3` — administrator: select the model identifier exposed by LM Studio.
- `/ping`, `/help`, `/about`, and `/invite` — quick connection, usage, bot-information, and installation-link commands.
- `/reload` and `/shutdown` — administrator maintenance commands. `/reload` explains the command redeployment process; `/shutdown` stops the bot gracefully.

## Development

```bash
corepack pnpm lint
corepack pnpm format:check
corepack pnpm test
```

See the [documentation index](docs/README.md) for architecture, API, contribution, privacy, security, and terms documentation.

## License

Distributed under the [MIT License](LICENSE).
