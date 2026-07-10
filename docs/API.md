# API

`GET /health` returns `{ status: "ok", discord: "ready" | "connecting" }` and is intended for local/container health checks.

LM Studio is called at `POST {LMSTUDIO_URL}/chat/completions` using the OpenAI-compatible chat-completions format. No OpenAI API is used.
