# Security Policy

## Supported version

Security fixes are applied to the latest version on the default branch.

## Reporting a vulnerability

Do not disclose vulnerabilities through public issues, Discord messages, or pull requests. Contact the repository owner privately with a clear description, reproduction steps, impact, and any suggested mitigation. The maintainer will acknowledge the report, investigate it, and coordinate a responsible resolution.

## Operator responsibilities

- Treat `DISCORD_TOKEN` as a password. Rotate it immediately if it is exposed.
- Keep `.env` outside source control.
- Restrict access to the host that runs the bot and LM Studio.
- Do not publicly expose the LM Studio server unless it is protected by appropriate authentication and network controls.
- Review Discord permissions before inviting the bot to a server.
- Keep Node.js, dependencies, and the operating system patched.

Duccky AI validates prompts and avoids exposing stack traces in Discord, but server operators remain responsible for access control, retention, moderation, and their deployed infrastructure.
