# Duccky AI

Duccky AI is a self-hosted Discord assistant that runs on local AI services.

- Chat: **LM Studio**
- Optional live search: **SearXNG**

This repository is for people who want a local Discord AI bot without cloud API keys.

## What this repo contains

- TypeScript Discord bot implementation
- LM Studio chat integration
- Optional SearXNG search integration
- Prisma schema for local development
- Tests, linting, and documentation

## Requirements

- Node.js 22 or newer
- A Discord application and bot token
- LM Studio running locally with a chat-capable model
- Optional: SearXNG for search

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/duccky-ai.git
dcd duccky-ai
npm install
```

If you use pnpm:

```bash
corepack pnpm install
```

### 2. Create `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

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

`GUILD_ID` is useful during development because commands register faster in one server, but it is optional for global deployment.

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
npm run prisma:generate
npm run build
npm run prisma:migrate deploy
npm run deploy:commands
npm run dev
```

If you use pnpm:

```bash
corepack pnpm prisma:generate
corepack pnpm build
corepack pnpm prisma:migrate deploy
corepack pnpm deploy:commands
corepack pnpm dev
```

When the terminal shows `bot started`, open Discord and test `/ping` or mention the bot. Keep LM Studio and this terminal running while using the bot.

### 6. Enable web search with SearXNG (optional)

Start a SearXNG instance, then set `SEARXNG_URL` in `.env` to its base URL. The default is `http://127.0.0.1:8080`.

This bot sends requests to `/search?format=json`. Your SearXNG instance must support JSON search output.

For example, ask `cari berita AI terbaru` or `latest Node.js release`. The bot will include the search results in the prompt sent to LM Studio.


## Commands

Duccky AI is mainly designed to be used by mentioning the bot or by talking in the configured AI channel. Slash commands are kept for actions that need a clear button-like intent, such as clearing memory, checking setup, or changing server settings.

| Command           | What it does                                  | When to use it                                      | Access        |
| ----------------- | --------------------------------------------- | --------------------------------------------------- | ------------- |
| `@Duccky AI ...`  | Ask from any allowed channel                  | Best default way to chat with the bot               | Everyone      |
| `/ask prompt`     | Ask through a slash command                   | Useful as a fallback, but mostly redundant to tags  | Everyone      |
| `/reset`          | Clear your saved context in the current channel | Use when the bot is stuck on old context          | Everyone      |
| `/memory`         | Explain what conversation memory stores       | Use when users ask what the bot remembers           | Everyone      |
| `/status`         | Show latency, uptime, channel, model, memory, and limits | Best quick check for server setup           | Everyone      |
| `/ping`           | Show Discord gateway latency                  | Quick check that the bot is alive                   | Everyone      |
| `/help`           | Show short usage guidance                     | Quick reminder for normal users                     | Everyone      |
| `/about`          | Show what powers the bot                      | Good for transparency about local LM Studio usage   | Everyone      |
| `/invite`         | Return the bot invite URL                     | Use when adding the bot to another server           | Everyone      |
| `/config channel` | Set or disable the dedicated AI channel       | Server setup: let users chat without tagging        | Administrator |
| `/model name`     | Change the LM Studio model identifier         | Server setup: match the model loaded in LM Studio   | Administrator |
| `/reload`         | Explain that commands load on restart         | Developer/admin diagnostic only                     | Administrator |
| `/shutdown`       | Gracefully stop the bot process               | Owner/admin maintenance only                        | Administrator |

## Command usage and examples

Here are concise examples showing how to use the slash commands from Discord's command UI. Replace placeholders like `<text>` or `#channel` with real values.

- `/ask prompt:<text>` — Ask Duccky AI a question. Example: `/ask prompt:What's new in Node.js 22?` or mention the bot directly: `@Duccky AI What is the weather today?` If you want the bot to analyze an image attach the image when using the slash UI or mention the bot and attach the image.

- `/reset` — Clear your conversation memory in the current channel. Example: `/reset`

- `/memory` — Show what the bot keeps in conversation memory for the current channel. Example: `/memory`

- `/model name:<model-id>` — Administrator-only: set the LM Studio model used for this server. Example: `/model name:google/gemma-4-e2b`

- `/status` — Show bot status, configured AI channel, model, memory window, cooldowns, and rate limits. Example: `/status`

- `/ping` — Check Discord gateway latency. Example: `/ping`

- `/help` — Shows short usage guidance and examples. Example: `/help`

- `/about` — Brief description of Duccky AI. Example: `/about`

- `/invite` — Returns an invite URL for this bot. Example: `/invite`

- `/search query:<terms>` — Run a live web search using the configured SearXNG instance. Example: `/search query:latest Node.js release`.

- `/config channel [channel]` — Administrator-only: set a dedicated AI channel or disable it. Examples:
	- Set: choose a text channel in the slash UI (e.g. `/config channel channel:#ai`).
	- Disable: run `/config channel` and leave the `channel` option empty in the UI (submit without selecting a channel) — the bot will switch to mention-only mode.

- `/reload` — Developer/admin diagnostic: explains commands are loaded on restart. Example: `/reload`

- `/shutdown` — Administrator-only: gracefully stops the bot process. Example: `/shutdown`

Registering commands after changes

After you add or modify commands, redeploy the registered slash commands so Discord's UI shows the new options. In development you can run:

```bash
tsx src/deployCommands.ts
```

Or after building:

```bash
node ./dist/deployCommands.js
```

If your bot uses a `GUILD_ID` in `.env` the commands register faster for that server; otherwise they are registered globally and may take longer to appear.

Useful command ideas if `/ask` feels unnecessary:

| Command idea     | Why it is more useful                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `/settings`      | Show the active AI channel, model, cooldown, rate limit, and memory size. |
| `/forget`        | Clear memory with clearer wording than `/reset`; can later support scopes like user/channel/server. |
| `/privacy`       | Explain where prompts go, what is stored, and how to clear memory.       |
| `/summarize`     | Summarize the recent channel conversation when users need a recap.       |
| `/prompt`        | Let admins view or switch bot behavior presets, such as helpful, concise, or roleplay-safe. |

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
