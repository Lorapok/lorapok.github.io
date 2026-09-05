---
name: loragent-marketplace-crosslink
description: Add consistent "Also available on" platform links across IDE extensions, browser add-ons, AMO, VSCE, Open VSX, README, and marketing site.
---

# 🤖 loragent-marketplace-crosslink

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent Marketplace Crosslink

Keeps *"This app is also available on…"* consistent across every Lorapok distribution channel.

## Source of truth (CCM)

`packages/shared/src/platformAvailability.ts`

```typescript
import {
  formatAlsoAvailableOn,
  formatAlsoAvailableHtml,
  alsoAvailablePlatforms,
  PLATFORM_LINKS,
} from "@lorapok/cursor-monitor-shared";
```

| Surface | Function | Example output |
|---------|----------|----------------|
| IDE extension | `formatAlsoAvailableOn("ide")` | VS Code, Firefox, Chrome zip, GitHub, Website |
| Browser addon | `formatAlsoAvailableOn("browser")` | Open VSX, VS Code, GitHub, Website |
| AMO HTML | `formatAlsoAvailableHtml("browser")` | Linked paragraph for listing |

## Where to apply

| Channel | File |
|---------|------|
| VS Code / Open VSX | Root `package.json` → `description` |
| Firefox AMO | `browser-extension/amo/amo-metadata.base.json` |
| Browser manifest | `browser-extension/manifest.json` → `description` |
| Browser popup footer | `browser-extension/src/components/Footer.tsx` |
| README | `## Installation` callout block |
| Website | `.platform-ribbon` in `website/index.html` |

## Open VSX duplicate namespace

- **Canonical:** `lorapok-labs` — use in all user-facing links
- **Duplicate:** `LorapokLabs` — show download count on website only; link as deprecated
- Never promote duplicate URL in README, AMO, or VSCE description

## Website stats

`site-data.json` fields:

```json
{
  "downloads": {
    "breakdown": {
      "openVsxCanonical": 3253,
      "openVsxDuplicate": 1058
    },
    "openVsxCombined": 4311
  }
}
```

## Agent workflow

1. Edit `platformAvailability.ts` if URLs change
2. `npm run build -w @lorapok/cursor-monitor-shared`
3. Update descriptions in package.json, AMO, manifest, Footer
4. `npm run site:data` + verify website KPI strip
5. Republish marketplaces from Mission Control if description-only changes need live sync
