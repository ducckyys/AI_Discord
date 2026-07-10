# Privacy Policy

**Effective date:** July 10, 2026

This policy describes the default data handling behavior of a self-hosted Duccky AI installation. The person or organization operating a deployment is the data controller and must provide their own contact details and any additional disclosures required by local law.

## Information processed

Duccky AI processes Discord identifiers needed to function, including server ID, channel ID, user ID, username, message ID, and message content submitted to the bot. It also stores server configuration such as the selected AI channel and model identifier.

## How information is used

Data is used only to respond to prompts, maintain conversation context, enforce operational limits, and operate the bot. Prompt content is sent to the LM Studio endpoint configured by the operator. In the default local configuration, that endpoint runs on the same machine as the bot. When a current-information request triggers web search, the search query is also sent to the configured SearXNG instance. When an image-generation request is made, the image prompt is sent to the configured ComfyUI instance.

## Storage and retention

Conversation messages and settings are stored in the deployment’s configured database. By default this is a local SQLite database. The `/reset` command removes the requesting user’s conversation messages for the current server channel. Operators may retain backups, logs, or use a different database; they must disclose their own retention practices.

## Sharing

Duccky AI does not send prompts to OpenAI or any other cloud AI provider. Information may be accessible to the operator and to infrastructure providers selected by the operator, such as a database host, server host, externally hosted SearXNG instance, or externally hosted ComfyUI instance.

## Your choices

Contact the server administrator or bot operator to request access, correction, or deletion where applicable. Users should not submit sensitive personal data unless they trust the operator’s deployment and retention practices.

## Changes

Operators may update this policy when the bot’s data practices change. Continued use after publication of an updated policy indicates acceptance of the revised policy.
