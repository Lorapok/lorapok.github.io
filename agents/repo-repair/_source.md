---
name: repo-repair
description: Performs a structured repository repair across tests, runtime paths, generated release data, CI, SEO, and governance. Use when fixing broad regressions, release drift, or requests involving agents, hooks, skills, rules, MCP, or steering.
---

# 🤖 repo-repair

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Repository Repair

## Audit order

1. Read `AGENTS.md`, git status, and recent history.
2. Run the smallest relevant failing checks.
3. Inspect the changed files and generated artifacts.
4. Fix deterministic failures before polish or optimization.
5. Add regression coverage and CI gates.
6. Re-run the complete verification matrix.

## Release truth

- `package.json` defines the release candidate.
- A release workflow is strict only when publishing or validating a release tag.
- External marketplace versions are observations and may be ahead or behind.
- Never mark a candidate as synced or silently replace its version with live marketplace data.

## Required evidence

For every finding, record the command, failure, root cause, file path, and acceptance check. Do not call a warning fixed until the relevant check passes.

## Required checks

```text
npm test
npm run compile
npm run security:scan
npm run site:seo:validate
npm run validate:release
cd website/admin && npm test && npm run lint && npm run build
```

## Safety

- Preserve unrelated dirty-worktree changes.
- Do not publish or deploy without explicit authorization.
- Do not add production debug beacons.
- Use existing Cloudflare MCP servers only for Cloudflare-specific work.
