---
name: loragent-unified-deployment
description: Mission Control–only unified deployment for Lorapok projects — release, marketplace publish, admin panel, and website via mission-control.lorapok.tech.
---

# 🤖 loragent-unified-deployment

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent Unified Deployment

Use when wiring or triggering production deploys for Lorapok products (CCM, etc.).

## Golden rule

**All production deploys go through Mission Control** — https://mission-control.lorapok.tech → Deployments.

Never rely on:
- Manual `wrangler pages deploy` (emergency only)
- GitHub Actions UI `workflow_dispatch` without Mission Control
- Push-to-main auto-deploy (disabled in CCM)

## Mission Control modes

| Mode | API | What runs |
|------|-----|-----------|
| **New Release** | `POST /api/release` | Bump version, tag, marketplaces + optional infra |
| **Deploy** | `POST /api/deploy` | Re-publish existing tag to marketplaces |
| **Rollback** | `POST /api/rollback` | Restore tag on main, publish patch |
| **Infra** | `POST /api/deploy-infra` | Admin panel + website only (no marketplaces) |

## Deploy targets (checkboxes)

| Target | URL | CI flag |
|--------|-----|---------|
| Mission Control admin | https://mission-control.lorapok.tech | `deploy_admin` |
| Marketing site | https://loragent.lorapok.tech | `deploy_website` |

## CI workflow

File: `.github/workflows/ci-cd.yml`  
Action types: `full-release`, `publish-tag`, `rollback`, `deploy-infra`, `sync-open-vsx`, `seo-refresh`

## MCP orchestration

1. `github` MCP → `gh run watch` after Mission Control dispatch
2. `browsermcp` → verify loragent.lorapok.tech / mission-control.lorapok.tech
3. Read `loragent-openvsx-publish`, `loragent-vscode-publish`, `loragent-amo-publish` for channel-specific fixes

## Reference repo

`~/cursor-usage-monitor`
