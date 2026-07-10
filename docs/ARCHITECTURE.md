# Architecture

Duccky AI follows a modular TypeScript architecture designed for a self-hosted Discord bot. The design separates Discord transport concerns from AI orchestration, persistence, and operational controls.

## Request flow

```text
Discord mention or slash command
  → event / command handler
  → validation, permissions, cooldown, rate limit
  → settings and conversation repositories
  → AskAI service
  → LM Studio OpenAI-compatible endpoint
  → persisted response and Discord reply
```

## Components

| Area             | Responsibility                                                           |
| ---------------- | ------------------------------------------------------------------------ |
| `src/events`     | Receives Discord gateway events and routes interactions/messages.        |
| `src/commands`   | Declares slash commands and their access rules.                          |
| `src/ai`         | System prompts, provider abstraction, context assembly, and AI requests. |
| `src/database`   | Prisma client and repository implementations.                            |
| `src/services`   | Application services for guilds, users, settings, and AI orchestration.  |
| `src/middleware` | Cooldown, rate-limit, permission, and command logging helpers.           |
| `src/config`     | Typed application configuration derived from environment variables.      |

## Data model

Prisma stores five primary entities:

- **Guild** — a Discord server known to the bot.
- **User** — a Discord user participating in conversations.
- **Settings** — server-specific AI channel, model, context, cooldown, and rate-limit settings.
- **Conversation** — one user’s context within a server channel.
- **Message** — persisted user and assistant messages belonging to a conversation.

Conversation memory is scoped by `guildId`, `userId`, and `channelId`; messages from one server or channel are never used as context in another.

## AI provider boundary

`AIProvider` defines the small interface required to send chat messages. `LMStudioProvider` is the only enabled implementation and uses the OpenAI-compatible endpoint at `/v1/chat/completions`. Future providers can implement the interface without changing command, event, or repository logic.

For current-information requests, `ToolManager` calls the configured SearXNG instance, passes the returned snippets to LM Studio, and adds result links to the Discord reply. Ordinary chat does not require SearXNG.

For image-generation requests, `ToolManager` calls `ImageService`, which uses the configured ComfyUI instance. The image path is separate from chat completion: it queues a workflow with `/prompt`, polls `/history/{prompt_id}`, downloads the first generated output from `/view`, and returns it to Discord as an attachment.

The source of truth for image generation is `src/ai/image`. The `dist` directory is generated output only.

## Deployment model

Development uses SQLite. For production, deploy the bot with PostgreSQL, a production-specific Prisma datasource and migration workflow, process supervision, encrypted secrets, and persistent logs. The local LM Studio server must be reachable from the bot host; never expose it publicly without authentication and network controls.
