---
name: loragent-website-design
description: Design and refresh Lorapok marketing sites — gallery images, platform ribbons, KPI stats, SEO, and Mission Control infra deploy.
---

# 🤖 loragent-website-design

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Loragent Website Design

Use when improving Lorapok product marketing sites (e.g. https://loragent.lorapok.tech).

## Stack

| Asset | Path (CCM) |
|-------|------------|
| Static site | `website/index.html`, `styles.css`, `site.js` |
| Live data | `website/site-data.json` (generated) |
| SEO | `website/seo.yml` → `npm run site:seo` |
| Images | `website/assets/marketing/*.png` |
| Deploy | Mission Control → **Infra** → deploy website |

## Design principles

1. **Dark glass aesthetic** — `#06080d` base, blue/violet accents, DM Sans + JetBrains Mono
2. **Real screenshots first** — restore git history images for hero/dashboard; use generated art for OG/social only
3. **Platform ribbon** — "Also available on" pills in hero + cross-links in README/listings
4. **Honest stats** — show Open VSX canonical + duplicate counts separately; combined KPI for transparency
5. **Accessibility** — lightbox keyboard nav, `aria-label` on KPI/breakdown, reduced motion respect

## Regenerate data

```bash
cd ~/cursor-usage-monitor
npm run site:data    # marketplace counts, versions
npm run site:seo     # sitemap, meta, json-ld
```

## Restore previous gallery images

```bash
git checkout 336de1f -- website/assets/marketing/showcase-*.png
# Keeps newer founder-profile.png, showcase-admin.png, showcase-browser-ext.png
```

## Deploy (production)

**Never** `wrangler pages deploy` directly for production.

Mission Control → Deployments → **Infra** → ✅ Marketing site → Run

## Frontend-design orchestration

For large visual refreshes, use the `frontend-design` skill:

1. Write brief to `/tmp/loragent-website-brief.md`
2. Spawn implementation subagent with `implementation.md`
3. Run evaluator loop (max 3 rounds)
4. Deploy via Infra mode

## Checklist

- [ ] `loragent.lorapok.tech` canonical URLs in seo.yml
- [ ] `site-data.json` includes `openVsxCombined`
- [ ] Platform ribbon links wired via `data-href-*` attributes
- [ ] Gallery uses restored screenshots where applicable
- [ ] Infra deploy triggered from Mission Control
