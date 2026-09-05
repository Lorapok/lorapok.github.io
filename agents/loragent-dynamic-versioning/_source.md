---
name: loragent-dynamic-versioning
description: Lorapok dynamic versioning matrix for production, beta, dev, and PR builds. Use when bumping releases, wiring CI, or Mission Control deploy flows.
---

# 🤖 loragent-dynamic-versioning

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent Dynamic Versioning

## Golden rule

**Only bump root `package.json` on production release.** Workspace packages (`browser-extension`, `packages/shared`) stay at `0.0.0` in git; run `npm run version:sync` at build time.

## Version matrix

| Channel | Format | Example |
|---------|--------|---------|
| Production (git tag) | `MAJOR.MINOR.PATCH` | `1.0.1` |
| Beta (workflow / pre-release) | `{base}-beta.{shortSha}` | `1.0.1-beta.a1b2c3d` |
| Dev / main CI push | `{base}-dev.{commitCount}` | `1.0.1-dev.842` |
| Pull request CI | `{base}-pr.{prNumber}` | `1.0.1-pr.42` |

Production **base** lives in root `package.json` only. Do not commit `-beta.*` or `-dev.*` to `main` as the permanent version.

## Scripts

```bash
npm run version:compute
npm run version:sync      # propagate to all workspace targets (CI/local build)
npm run version:check     # fail if workspace versions != 0.0.0 in git
```

| Script | Path |
|--------|------|
| Compute | `scripts/compute-version.mjs` |
| Sync workspaces | `scripts/sync-workspace-versions.mjs` |

## CI integration

```yaml
- run: npm run version:check
- run: npm run version:sync   # on push to main (non-tag)
```

## Mission Control release

1. Master admin → Deployments → **Release**
2. Custom version `1.0.1` → Production → Both markets
3. Dispatches `ci-cd.yml` with `action_type: full-release`
4. Sets `deploy_admin` / `deploy_website` for chained infra deploy

## Anti-patterns

- Manually bumping every `package.json` in the monorepo on each release
- Leaving workspace packages at stale semver in git instead of `0.0.0`
- Dispatching removed workflows (`publish-tag.yml`, `deployment.yml`)

## Project example

Loragent Monitor: `.skills/loragent-dynamic-versioning/SKILL.md` in repo.
