---
name: loragent-cloudflare-mail-master
description: Cloudflare Email Sending on Cloudflare Pages via REST API. Use when configuring outbound mail, routing rules, token split, or troubleshooting 401/10203 errors for Lorapok projects.
---

# 🤖 loragent-cloudflare-mail-master

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent Cloudflare Mail Master

## Decision tree

| Host | Pattern |
|------|---------|
| **Cloudflare Pages** | REST API + `CLOUDFLARE_EMAIL_API_TOKEN` secret — **no** `[[send_email]]` binding |
| **Cloudflare Workers** | `send_email` binding or REST |

Pages Functions cannot use `send_email` in `wrangler.toml`; deploy will fail or secrets will not apply correctly.

## Credential split

| Token | Purpose |
|-------|---------|
| `CLOUDFLARE_API_TOKEN` (deploy) | Pages deploy, wrangler |
| `CLOUDFLARE_EMAIL_API_TOKEN` | Email Sending REST only |
| GitHub secret | Sync email token to Pages via `enable-mail.mjs` |

Never sync the deploy token as the email secret.

## Key scripts (Loragent Monitor)

- `website/admin/scripts/enable-mail.mjs` — split deploy vs email tokens
- `website/admin/scripts/verify-mail-setup.mjs` — probe send to ops inbox
- `website/admin/scripts/setup-email-addresses.mjs` — `wrangler email routing rules`

## REST send pattern

`POST https://api.cloudflare.com/client/v4/accounts/{accountId}/email/sending/send`

Headers: `Authorization: Bearer {CLOUDFLARE_EMAIL_API_TOKEN}`

Implementation: `website/admin/functions/api/_shared/mail.js`

## Routing CLI

```bash
npx wrangler email routing enable lorapok.tech
npx wrangler email routing rules list lorapok.tech
```

Route product addresses (`cursor.monitor@`, `cursor.curse.help@`) to ops inbox.

## Troubleshooting

| Error | Fix |
|-------|-----|
| HTTP 401 | Token needs `Account.Email Sending: Edit`; verify Pages secret after deploy |
| Code 10203 | Enable Email Sending (Workers Paid); onboard domain in dashboard |
| `send_email` on Pages | Remove binding; use REST only |
| Mail works locally, fails in prod | Redeploy Pages after `wrangler pages secret put` |

## Branding

Per-category logos: `website/assets/mail/` + `mail-branding.js` map. Use absolute GitHub Pages URLs in HTML emails.

See also: `~/.claude/skills/cloudflare-email-service/SKILL.md`
