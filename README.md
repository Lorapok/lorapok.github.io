# 🧬 Lorapok Labs — Digital Ecosystem & Developer Portal v2.0

[![Deployment](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live-lorapok.tech-67ff8f?style=flat-square&logo=cloudflare)](https://lorapok.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Lorapok Labs** is an open-source software collective focused on **Sensory Computing** and **Biological UI**. This portal serves as the definitive hub for 24+ open-source products across 7 global distribution platforms.

---

## 🌐 The Multi-Page Architecture (v2.0)

Lorapok Labs v2.0 transitions the ecosystem from a single-page portfolio into a full-fledged, multi-page open-source product organization:

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Cinematic hero, real-time animated stats, 3-pillar philosophy, and featured tools. |
| `/projects` | **Product Directory** | Filterable catalog across 10 categories with real-time `⌘K` search. |
| `/about` | **Founder & Mission** | Story of founder Mohammad Maizied Hasan Majumder, team, and the Lorapok Way. |
| `/changelog` | **Release Timeline** | Chronological timeline of releases, major updates, and platform milestones. |
| `/support` | **Ecosystem Support** | bKash donation channel and verified multi-chain crypto addresses. |
| `/contact` | **Contact Bridge** | Structured contact channels with direct routing for partnerships and developer inquiries. |
| `/dev` | **Developer Workspace** | Authenticated workspace with multi-provider AI Labs, API Playground, and admin metrics. |

---

## 🚀 Marketplace Ecosystem & Distribution

Lorapok products are distributed across 7 major registries and marketplaces:

* **VS Code Marketplace:** [LorapokLabs](https://marketplace.visualstudio.com/publishers/LorapokLabs) — *Cursor Curse Monitor, Lorapok Atlas*
* **Open VSX Registry:** [LorapokLabs](https://open-vsx.org/namespace/LorapokLabs) — *Cursor Curse Monitor, Lorapok Atlas*
* **Firefox AMO:** [Lorapok Add-ons](https://addons.mozilla.org/firefox/user/lorapok/) — *Atlas API Directory, XSnap Media Downloader, SubtitleMaster*
* **npm Registry:** Packages include `lorapok-atlas`, `lorapok-atlas-mcp`, `roast-api`, `lorapok-player`, and `@lorapok-labs/reportkit-ui`
* **PyPI:** `roast-api`
* **Packagist:** `lorapok/laravel-execution-monitor`, `maizied/roast-api`
* **Snapcraft:** `lorapokmediaplayer`
* **Product Hunt:** [Lorapok Atlas Launch](https://www.producthunt.com/posts/lorapok-atlas)

---

## 🛠 Technology Stack

* **Frontend Framework:** React 19, Vite 8, TypeScript ~6.0
* **Routing:** React Router v7 with route-level code splitting (`React.lazy`)
* **Styling & UI Tokens:** Tailwind CSS v4, custom CSS token system (`src/styles/tokens.css`)
* **Motion & Animation:** Framer Motion (reduced-motion accessible)
* **Icons:** Lucide React
* **Backend Services:** Firebase Auth & Cloud Firestore (Admin & Dev Portal)
* **Edge Proxy:** Cloudflare Workers (Email proxy)
* **SEO & Metadata:** Open Graph, Twitter Cards, XML Sitemap, JSON-LD Schema.org Organization data
* **Hosting:** GitHub Pages with custom domain `lorapok.tech` via GitHub Actions

---

## ⚙️ Development & Local Setup

```bash
# Clone the repository
git clone https://github.com/Lorapok/lorapok.github.io.git
cd lorapok.github.io

# Install dependencies
npm install

# Start local sensory development server
npm run dev

# Run type check and production build
npm run build
```

---

## 🔐 Credentials & Secrets Management

Per project standards, API credentials and environment secrets are never committed or exposed in chat. They are managed through the centralized credential vault:

```bash
cred get cloudflare account_id_lorapok
```

---

## 📜 License

Designed and maintained by [Mohammad Maizied Hasan Majumder (@Maijied)](https://github.com/Maijied) and the [Lorapok Labs](https://github.com/Lorapok) collective. Released under the [MIT License](LICENSE).
