---
name: loragent-vscode-publish
description: VS Code Marketplace publishing for Lorapok extensions — VSCE token, publisher LorapokLabs, CI and Mission Control wiring.
---

# 🤖 loragent-vscode-publish

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent VS Code Marketplace Publish

## Publisher identity

- **Publisher:** `LorapokLabs`
- **Extension ID:** `LorapokLabs.cursor-curse-monitor-by-lorapok`
- **Marketplace URL:** https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor-by-lorapok

## CI / Mission Control

Triggered via `ci-cd.yml` deploy job when:
- Market = `VS Code Marketplace` or `Both`
- Action = `full-release` or `publish-tag`

## GitHub secrets

| Secret | Purpose |
|--------|---------|
| `VSCE_PAT` | VS Code Marketplace publish token |

## Local publish

```bash
cd ~/cursor-usage-monitor
npm run version:sync
npm run package
npx vsce publish -p "$VSCE_PAT"
```

## Pre-publish checklist

1. `npm run version:sync`
2. Root `package.json` version matches intended release
3. `website/site-data.json` synced (CI integrity gate)
4. VSIX packages successfully in CI `ci` job

## Related

- `loragent-unified-deployment`
- `loragent-openvsx-publish` — publish both marketplaces with market `Both`
