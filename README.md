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
- Optional live web search through your SearXNG instance
- Optional image generation through your ComfyUI instance
- Slash commands for memory, status, setup, and maintenance
- SQLite for local development, with a documented path to PostgreSQL production deployments
- Pino logging, graceful shutdown, health endpoint, Zod validation, cooldowns, and rate limiting

## Requirements

- Node.js 22 LTS or newer
- pnpm 9 or newer (Corepack is included with modern Node.js)
- A Discord application and bot token
- LM Studio with a chat-capable model loaded
- Optional: ComfyUI for local image generation

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
IMAGE_PROVIDER=comfyui
COMFYUI_URL=http://127.0.0.1:8188
IMAGE_MODEL=flux1-schnell
COMFYUI_WORKFLOW_PATH=
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
corepack pnpm prisma migrate deploy
corepack pnpm deploy:commands
corepack pnpm dev
```

When `bot started` appears in the terminal, open Discord and try `/ping` or mention the bot. Keep both LM Studio and this terminal running while using the bot.

### 6. Enable web search with SearXNG (optional)

Run a SearXNG instance, then set `SEARXNG_URL` in `.env` to its base URL. The default is `http://127.0.0.1:8080`. Its JSON response format must be enabled in SearXNG's `settings.yml`; this bot sends requests to `/search` with `format=json`.

For example, ask `cari berita AI terbaru` or `latest Node.js release`. The bot supplies the returned results to LM Studio and includes the source links in its reply. Configure `SEARXNG_TIMEOUT_MS` and `SEARXNG_MAX_RESULTS` only if the defaults (10 seconds and 5 results) do not suit your instance.

### 7. Enable image generation with ComfyUI (optional)

Start ComfyUI and keep `COMFYUI_URL` pointed at its API server. The default is `http://127.0.0.1:8188`.

The bot sends a workflow to `/prompt`, waits through `/history/{prompt_id}`, downloads the generated image from `/view`, and sends it back to Discord as an attachment.

By default the bot uses `src/ai/image/workflow/flux-schnell.json`, which contains `{{PROMPT}}` and `{{MODEL}}` placeholders. If your ComfyUI setup uses a different graph, export the API workflow JSON from ComfyUI, put it in this project, and set `COMFYUI_WORKFLOW_PATH` to that file path. The workflow must include `{{PROMPT}}` where the user prompt should be injected and may include `{{MODEL}}` where `IMAGE_MODEL` should be injected.

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
