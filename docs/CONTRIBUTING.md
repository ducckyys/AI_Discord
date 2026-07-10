# Contributing

Thank you for improving Duccky AI. Contributions should preserve the project’s self-hosted, LM Studio-only design and maintain a reliable experience for Discord communities.

## Development setup

1. Fork the repository and create a feature branch.
2. Install Node.js 22 and dependencies with `corepack pnpm install`.
3. Copy `.env.example` to `.env` and provide non-production test credentials.
4. Generate Prisma Client with `corepack pnpm prisma:generate`.

## Engineering standards

- Use strict TypeScript and `async`/`await`.
- Validate external input with Zod.
- Keep Discord-facing errors concise; log diagnostics rather than exposing stacks or tokens.
- Preserve repository and service boundaries instead of placing persistence or provider logic directly in event handlers.
- Add or update tests when behavior changes.
- Do not commit `.env`, bot tokens, local SQLite files, or generated output.

## Before opening a pull request

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

Describe the user-facing impact, any configuration changes, and how you tested the change. Keep pull requests focused and update relevant documentation.
