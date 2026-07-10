# API Reference

Duccky AI does not expose a public business API. Its small Fastify server is for health monitoring, while AI inference is delegated to your local LM Studio server.

## Health check

### `GET /health`

Returns service and Discord gateway status.

```json
{
  "status": "ok",
  "discord": "ready"
}
```

The server listens on `127.0.0.1` and the configured `PORT` (default `3000`). It is intentionally local-only.

## LM Studio integration

The provider sends a `POST` request to:

```text
{LMSTUDIO_URL}/chat/completions
```

With the standard OpenAI-compatible JSON shape:

```json
{
  "model": "google/gemma-4-e2b",
  "messages": [{ "role": "user", "content": "Hello" }],
  "temperature": 0.7
}
```

The bot validates malformed responses and shows a safe Discord-facing error instead of an internal stack trace.

## SearXNG integration

For current-information requests, the bot calls `{SEARXNG_URL}/search` with `q`, `format=json`, `categories=general`, and `safesearch=1`. The configured SearXNG instance must enable JSON output. Search snippets and URLs are supplied to LM Studio as context; the bot does not fetch result pages.

## ComfyUI integration

For image-generation requests, the bot calls:

```text
POST {COMFYUI_URL}/prompt
GET  {COMFYUI_URL}/history/{prompt_id}
GET  {COMFYUI_URL}/view?filename=...&subfolder=...&type=output
```

The workflow JSON is loaded from `COMFYUI_WORKFLOW_PATH` when set, otherwise the bot uses a built-in default workflow.

- If `IMAGE_MODEL` ends with `.gguf`, the bot automatically selects a GGUF-friendly fallback workflow.
- The workflow must include a `{{PROMPT}}` placeholder.
- If your ComfyUI graph uses a model placeholder, the workflow may also include `{{MODEL}}`, which is replaced with `IMAGE_MODEL`.
