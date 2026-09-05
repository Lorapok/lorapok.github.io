---
name: lorapok-frontend
description: >-
---

# 🤖 lorapok-frontend

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# Lorapok frontend

This product already has a distinctive identity. Polish it; do not reinvent it.

## Subject

**Loragent Monitor by Lorapok** — a live usage dashboard for Cursor and other VS Code–wrapper AI IDEs. Audience: developers who need quota, billing cycle, and fallback status at a glance. The page's job is to get them to install, then trust that data stays local.

## Brand tokens (do not invent new hexes)

| Role | Token | Value |
|------|--------|--------|
| Canvas | `--bg` | `#06080d` |
| Elevated | `--bg-elevated` | `#0c1018` |
| Surface | `--surface` | `#111827` |
| Text | `--text` | `#f1f5fb` |
| Muted | `--muted` | `#8b9bb8` |
| Accent | `--accent` | `#4d9fff` |
| Secondary | `--accent-2` | `#7c5cff` |
| OK | `--ok` | `#34d399` |
| Warn | `--warn` | `#fbbf24` |
| Body font | `--font` | DM Sans |
| Data font | `--mono` | JetBrains Mono |

Shared CSS: `website/shared/tokens.css`. Admin, marketing site, and extension should stay aligned.

## Signature

The memorable element is the **live community stats card** in the hero (grand total first, then Open VSX / VS Code / GitHub breakdown with channel colors) plus the Lorapok larvae mascot — not a screenshot carousel.

## Quality floor (live users)

- Fail closed on unverified download stats (`—`, never fake zeros)
- Honor `prefers-reduced-motion`
- Visible `:focus-visible` rings; never `outline: none` without a replacement
- Skip link to `#main-content`
- `color-scheme: dark` on dark pages
- Tabular nums on live counts
- Do not break install links, Firebase auth, or marketplace URLs

## Brand vs product

- **Marketing site** (`website/`): editorial, generous space, hero thesis, motion that encodes live data
- **Admin Mission Control** (`website/admin/`): dense product UI, KPIs, tables, fail-closed numbers
- **IDE / browser extensions**: compact, local-first, footer always credits Lorapok Labs + Cursor

## Do not

- Swap to Inter / Roboto / Space Grotesk
- Restyle as cream+serif or acid-green-on-black templates
- Duplicate marketing PNGs across sections
- Zero-fill marketplace stats
- Ship unreviewed third-party agent skills that execute shell (see Snyk ToxicSkills)
