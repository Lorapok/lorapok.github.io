---
name: seo
description: >-
---

# 🤖 seo

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# SEO — Reach & Discoverability

Optimize the project website, GitHub Pages, and marketplace listings so users can find **Codex Curse Monitor by Lorapok** everywhere they search.

## When to use

- User invokes `/seo`
- Requests: sitemap, robots.txt, meta tags, JSON-LD, Open Graph, marketplace keywords, Search Console
- After version releases or marketplace sync changes

## Canonical URLs (never substitute duplicates)

| Channel | URL |
|---------|-----|
| Website | `https://maijied.github.io/Codex-Curse-Monitor-by-Lorapok/` |
| Open VSX | `https://open-vsx.org/extension/lorapok-labs/cursor-curse-monitor-by-lorapok` |
| VS Code | `https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor-by-lorapok` |
| GitHub | `https://github.com/Maijied/Codex-Curse-Monitor-by-Lorapok` |

**Do not** link to `open-vsx.org/extension/LorapokLabs/...` (duplicate listing).

## Workflow

### 1. Audit

Run read-only checks:

```bash
node scripts/generate-site-data.mjs
node scripts/generate-seo.mjs
node scripts/validate-seo.mjs
```

Review:

- `website/seo.json` — version, syncStatus, marketplace URLs
- `website/sitemap.xml` — lastmod dates, all public pages
- `website/index.html` — title, description, canonical, og:*, JSON-LD
- `package.json` — keywords, description, homepage
- README badges — point to canonical Open VSX URL only

Checklist file: `.skills/seo/checklist.md`

### 2. Generate

If artifacts are stale or missing:

```bash
npm run site:data
npm run site:seo
npm run site:seo:validate
```

CI also runs on push (`.github/workflows/seo.yml`) and weekly.

### 3. Fix common issues

| Issue | Fix |
|-------|-----|
| Open VSX version drift | `npm run publish:ovsx` or Actions → **Sync Open VSX (Canonical)** |
| Stale sitemap lastmod | Re-run `generate-seo.mjs` after page edits |
| Wrong marketplace link in README/website | Replace with `lorapok-labs` Open VSX URL |
| Missing keywords | Add to `package.json` keywords + `website/seo.json` |
| OG image 404 | Ensure `website/assets/marketing/og-social-card.png` exists |

### 4. Structured data

Keep `SoftwareApplication` JSON-LD in sync with:

- `softwareVersion` = package.json version
- `downloadUrl` = latest GitHub VSIX URL from site-data
- `publisher` = Lorapok Labs

### 5. Post-release reach

After marketplace publish:

1. Regenerate site-data + SEO artifacts
2. Deploy website (CI/CD website job)
3. Verify sitemap at `{homepage}sitemap.xml`
4. Optional: submit sitemap in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster

### 6. Open VSX discoverability

- Publisher page: complete description on [open-vsx.org](https://open-vsx.org)
- Keywords in extension displayName/description match website
- Apply for [OSS rate-limit elevation](https://github.com/EclipseFdn/open-vsx.org/wiki/Rate-limiting) if CI hits 429

## Output

After running this skill, report:

1. **Audit results** — pass/fail per checklist item
2. **syncStatus** from site-data.json
3. **Files changed** (if any)
4. **Manual steps** remaining (Search Console, duplicate deprecation request)

## Scripts reference

| Script | Purpose |
|--------|---------|
| `scripts/generate-site-data.mjs` | Live marketplace + GitHub versions |
| `scripts/generate-seo.mjs` | sitemap.xml, robots.txt, seo.json |
| `scripts/validate-seo.mjs` | Lint SEO artifacts |
| `scripts/publish-ovsx.mjs` | Fix Open VSX canonical namespace |
| `scripts/verify-marketplace-sync.mjs` | Version parity guard |
