# Architecture

Discord events call command/event handlers. Handlers delegate to services, middleware, and repositories. `AskAI` builds a bounded conversation context, calls the abstract `AIProvider`, and persists messages through Prisma. The current provider is LM Studio; adding another provider only requires implementing `AIProvider`.

Development uses SQLite. Prisma datasource providers are compile-time choices; for PostgreSQL production, use a PostgreSQL-specific Prisma schema/migration deployment and `DATABASE_URL` for that database.
