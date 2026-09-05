---
name: loragent-amo-publish
description: Firefox AMO publish pipeline for Lorapok browser extensions — web-ext sign, amo-metadata, CI, Mission Control, credential vault.
---

# 🤖 loragent-amo-publish

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent AMO Publish

Project home: `<PROJECT_ROOT>/skills/loragent-amo-publish`

See full skill in repo; key points:

- Use `publish-amo.mjs` with `--approval-timeout 0` (human review does not fail CI)
- Homepage: `https://loragent.lorapok.tech/`
- Sync listing: `node browser-extension/scripts/sync-amo-listing.mjs`
- Kit: `~/Documents/Lorapok-AMO-Developer-Kit/`

Related: `loragent-amo-mcp`, `loragent-amo-publish-advanced`, `loragent-unified-deployment`
