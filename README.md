# 🧬 Lorapok Labs — Digital Ecosystem & Developer Portal v2.0

[![Deployment](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lorapok/lorapok.github.io/actions/workflows/deploy.yml)
[![LoLaBo AI Agent](https://github.com/Lorapok/lorapok.github.io/actions/workflows/lolabo-agent.yml/badge.svg)](https://github.com/Lorapok/lorapok.github.io/actions/workflows/lolabo-agent.yml)
[![Live Production Edge](https://img.shields.io/badge/Live-lorapok.tech-67ff8f?style=flat-square&logo=cloudflare)](https://lorapok.tech)
[![React 19](https://img.shields.io/badge/React-19.2.5-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0.10-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-~6.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Lorapok Labs** is an open-source software collective focused on **Sensory Computing**, **Biological UI**, and **Autonomous AI Engineering**. This portal serves as the primary gateway for 30+ open-source tools, browser extensions, developer CLIs, and autonomous research publications across 7 global distribution platforms.

---

## 🏗️ System Architecture Topology

Lorapok Labs operates on a multi-tier distributed architecture spanning an edge ingress network, client-side sensory SPA, static pre-rendering build pipeline, and an autonomous AI systems research engine (**LoLaBo**).

```mermaid
flowchart TD
    subgraph Ingress ["🌐 Ingress & Edge Layer"]
        Users["🖥️ Web Visitors & Engineers"]
        Bots["🤖 Search Crawlers & Social Indexers"]
        DiscordChannel["💬 Discord Community (#announcements)"]
        
        CF["🛡️ Cloudflare Global Edge Network<br/>• Custom Domain: lorapok.tech<br/>• SSL/TLS Termination & DDoS Shield<br/>• Edge Worker Proxies"]
        GH_CDN["📦 GitHub Pages Global CDN<br/>• Static Asset Edge Distribution<br/>• Geo-Distributed Cache"]
    end

    subgraph ClientApp ["🎨 Client Presentation Tier (React 19 SPA)"]
        Router["🧭 React Router v7<br/>• Route-Level Code Splitting (React.lazy)<br/>• URL Deep-Linking & History"]
        
        subgraph Views ["Application Views"]
            HomeView["🏠 / (Home & Hero)"]
            ProjectsView["🚀 /projects (30+ Catalog & ⌘K)"]
            TeamView["👥 /team (Interactive Dossiers)"]
            AboutView["📖 /about (Mission & Philosophy)"]
            DevPortal["🔬 /dev (DevModePortal & AI Lab)"]
            BlogView["📰 /blog & /blog/:slug (LoLaBo Portal)"]
        end

        ImgCache["⚡ Progressive Image Engine<br/>• In-Memory Session Cache (Set)<br/>• Low-Poly Blur-Up Skeletons<br/>• Runtime Dedup Guard"]
    end

    subgraph BuildPipeline ["⚙️ Pre-Rendering & Postbuild Engine"]
        ViteCompiler["⚡ Vite 8 + Rollup<br/>• TypeScript Compilation<br/>• Tailwind v4 Token Shake"]
        PostBuildScript["🛠️ scripts/postbuild.js<br/>• Pre-renders 7 Core HTML Routes<br/>• Pre-renders 19+ Static Blog SEO Pages<br/>• Injects Schema.org JSON-LD<br/>• Generates XML Sitemaps & RSS 2.0"]
    end

    subgraph LoLaBoAI ["🧠 LoLaBo Autonomous AI Subsystem (agent/)"]
        Trigger["⏱️ Staggered Cron / CI Trigger<br/>(GitHub Actions: :17, :47)"]
        
        KeyPool["🔑 Multi-Account Key Rotator (keyManager.ts)<br/>• 4+ Google Account Pool<br/>• Smart Round-Robin & Instant 429 Failover"]
        
        Validator["🛡️ Model Validator & Deprecation Guard (modelValidator.ts)<br/>• Real-Time Google API Discovery<br/>• Auto-Quarantine Deprecated Models (404/Retired)<br/>• Zero-Downtime Cascade"]
        
        ModelTiering["⚖️ Multi-Tier Model Matrix (writer.ts)<br/>• Gemini 3.x Primary (3.8/3.7/3.6/3.1/3.5)<br/>• Gemini 2.x Resilient Fallbacks (2.5/2.0/Thinking)"]
        
        Author["✍️ Research Authoring Engine (writer.ts)<br/>• Zero-Truncation Completeness Barrier<br/>• ASCII Topologies, Benchmarks & Formal Proofs"]
        
        PeerReview["🔬 Autonomous Review Unit (reviewer.ts)<br/>• 100-Point Academic Rubric<br/>• Dynamic Revision Feedback Loop (<85)"]
        
        VisualEngine["🎨 Swiss Editorial Visual Suite (imageAgent.ts)<br/>• Hero Cover: Swiss / Bauhaus Minimalist Illustration<br/>• Fig 1: Native Code-to-Diagram Mermaid.js Flowchart<br/>• Fig 2: Crisp 100% Vector SVG Latency CDF Plot"]
        
        Consolidator["💾 Export & Normalizer (exportData.ts)<br/>• Zero-Duplicate Catalog Enforcement<br/>• Dual Persistence Normalizer"]
        
        Verifier["🌐 Production Edge Verifier (broadcastLivePost.ts)<br/>• Validates 200 OK on Edge<br/>• Atomic Discord Embed Dispatch"]
    end

    subgraph DataStorage ["🗄️ Multi-Tier Persistence"]
        FirestoreDB[("🔥 Google Cloud Firestore<br/>• Canonical Cloud Store<br/>• blog_posts collection")]
        StaticJSON[("📁 Static Catalog Baseline<br/>• public/blog/posts.json")]
        ModelQuarantine[("🛡️ Deprecated Models Quarantine<br/>• .loragent-debug/deprecated-models.json")]
    end

    Users --> CF
    Bots --> CF
    CF --> GH_CDN
    GH_CDN --> Router
    Router --> HomeView
    Router --> ProjectsView
    Router --> TeamView
    Router --> AboutView
    Router --> DevPortal
    Router --> BlogView
    BlogView --> ImgCache

    Trigger --> KeyPool
    KeyPool --> Validator
    Validator --> ModelTiering
    ModelTiering --> Author
    Author --> PeerReview
    PeerReview -->|"Score &lt; 85 (Revisions Required)"| Author
    PeerReview -->|"Score &gt;= 85 (Approved)"| VisualEngine
    VisualEngine --> Consolidator
    Validator -.-> ModelQuarantine
    Consolidator --> FirestoreDB
    Consolidator --> StaticJSON

    StaticJSON --> PostBuildScript
    ViteCompiler --> PostBuildScript
    PostBuildScript --> GH_CDN

    Consolidator --> Verifier
    Verifier -->|"Live 200 OK Verified"| DiscordChannel
```

---

## 🔄 LoLaBo Autonomous AI Publication Pipeline

The sequence diagram below illustrates the end-to-end autonomous research synthesis, peer-review refinement, online AI visual generation, and gated edge broadcast:

```mermaid
sequenceDiagram
    autonumber
    actor Cron as ⏱️ Cron Runner (:17, :47)
    participant KeyMgr as 🔑 KeyManager (4-Key Pool)
    participant Validator as 🛡️ Model Validator (modelValidator.ts)
    participant Writer as ✍️ LoLaBo Authoring Engine
    participant Reviewer as 🔬 Autonomous Peer Review Unit
    participant Visuals as 🎨 Swiss Editorial Visual Suite
    participant Export as 💾 Consolidator & Normalizer
    participant Storage as 🗄️ Firestore & posts.json
    participant Deploy as 🚀 GitHub Actions Deploy
    participant Probe as 🌐 Production Edge Probe
    participant Discord as 💬 Discord Webhook

    Cron->>KeyMgr: Request active Google AI Key (Pool 1..4)
    KeyMgr-->>Writer: Yield healthy key (cooldown on 429 errors)

    Writer->>Validator: Validate candidate models ladder (query /v1beta/models)
    Validator-->>Writer: Return active candidate models (filter quarantined 404/deprecated)

    alt Model returns 404 / NOT_FOUND / Deprecated
        Writer->>Validator: Auto-prune model from candidate ladder & persist to quarantine
        Writer->>Writer: Cascade immediately to next candidate model in ladder
    end

    alt Topic is Deep Systems Research, RFC, or Thesis
        Writer->>Writer: Flagship Tier: Gemini 3.8/3.7/3.6 Flash → 3.1 Pro → Pro Latest → 2.5 Pro → 2.0 Thinking
    else Topic is Standard Technical Dispatch or News
        Writer->>Writer: Technical Tier: Gemini 3.8/3.7/3.6 Flash → Flash Latest → 2.5 Flash → 2.0 Flash
    end

    Writer->>Writer: Synthesize manuscript (Zero-Truncation Barrier, ASCII diagrams, formal math, benchmark tables)

    loop Peer-Review Verification Loop (Max 2 Passes)
        Writer->>Reviewer: Submit draft for evaluation
        Reviewer->>Validator: Validate reviewer candidate models
        Reviewer->>Reviewer: Audit against 100-Point Rubric (Rigor, Math, Code, Citations)
        alt Score below 85 (Defects or Missing Proofs)
            Reviewer-->>Writer: Reject with structured critique instructions
            Writer->>Writer: Revise manuscript addressing critique
        else Score 85 or above (Approved)
            Reviewer-->>Writer: Issue peer-review approval badge
        end
    end

    Writer->>Visuals: Request publication-grade visual suite (Swiss Cover, Fig 1 Mermaid, Fig 2 SVG)
    Visuals->>Visuals: Synthesize Swiss flat vector cover, Mermaid architecture flowchart & vector latency CDF plot
    Visuals-->>Writer: Yield complete visual suite & inject into markdown sections

    Writer->>Export: Send verified post package
    Export->>Storage: Atomically commit to Cloud Firestore & public/blog/posts.json
    Storage->>Deploy: Trigger static build & pre-rendering (scripts/postbuild.js)
    Deploy->>Deploy: Publish static pages & OpenGraph tags to Edge CDN

    Deploy->>Probe: Poll https://lorapok.tech/blog/:slug until HTTP 200 OK
    Probe-->>Deploy: Edge verification confirmed
    Deploy->>Discord: Broadcast rich publication embed with verified live link
```

---

## 🛡️ Triple-Layer Visual Deduplication Architecture

To permanently guarantee that no two articles ever share the same visual and eliminate stock photography fallbacks, LoLaBo enforces a three-layer defense matrix:

```mermaid
flowchart LR
    subgraph Layer1 ["Layer 1: Generation Time (imageGen.ts)"]
        A1["Authoring Engine"] --> A2["Extract Technical imagePrompt"]
        A2 --> A3["Query usedImages Set"]
        A3 --> A4["Calculate Prime Seed: (baseSeed + i * 104729)"]
        A4 --> A5["Unique Pollinations AI Flux URL"]
    end

    subgraph Layer2 ["Layer 2: Export & Normalization (exportData.ts)"]
        B1["Consolidator Process"] --> B2["Scan Merged Catalog"]
        B2 --> B3{"Unsplash or Duplicate?"}
        B3 -->|Yes| B4["Re-synthesize Online AI Flux Visual"]
        B3 -->|No| B5["Retain Valid Visual"]
        B4 --> B6["Sync Back to Cloud Firestore"]
        B5 --> B7["Write to public/blog/posts.json"]
        B6 --> B7
    end

    subgraph Layer3 ["Layer 3: Browser Runtime (BlogApp.tsx)"]
        C1["Client Fetches posts.json / Live Sync"] --> C2["ensureUniqueVisuals() Guard"]
        C2 --> C3{"In-Memory URL Conflict?"}
        C3 -->|Yes| C4["On-the-Fly Prime Salt Resolution"]
        C3 -->|No| C5["Render Progressive Image Component"]
        C4 --> C5
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
```

---

## 🌐 The Multi-Page Architecture (v2.0)

Lorapok Labs v2.0 transitions the ecosystem from a single-page portfolio into a full-fledged, multi-page open-source product organization with route-level code splitting:

| Route | View Component | Key Architectural Capabilities |
| :--- | :--- | :--- |
| `/` | [`HomePage.tsx`](src/pages/HomePage.tsx) | Sensory hero, animated stats counter, 3-pillar philosophy, featured product spotlights. |
| `/projects` | [`ProjectsPage.tsx`](src/pages/ProjectsPage.tsx) | 30+ products across 10 categories, multi-criteria filtering, keyboard `⌘K` search overlay. |
| `/team` | [`TeamPage.tsx`](src/pages/TeamPage.tsx) | Interactive dossiers, skills matrices, career trajectories, and modal deep dives. |
| `/about` | [`AboutPage.tsx`](src/pages/AboutPage.tsx) | Organizational backstory, founder profile, design system manifesto, and ethics. |
| `/changelog` | [`ChangelogPage.tsx`](src/pages/ChangelogPage.tsx) | Chronological release milestones, semantic versions, and platform launch notes. |
| `/support` | [`SupportPage.tsx`](src/pages/SupportPage.tsx) | bKash funding channel, multi-chain crypto addresses, and backer recognition. |
| `/contact` | [`ContactPage.tsx`](src/pages/ContactPage.tsx) | Direct routing contact bridge for commercial inquiries, partnerships, and bug reports. |
| `/dev` | [`DevModePortal.tsx`](src/dev/DevModePortal.tsx) | Authenticated developer workspace, multi-provider AI lab, API playground, live system telemetry. |
| `/blog` | [`BlogApp.tsx`](src/blog/BlogApp.tsx) | LoLaBo research portal, category/format filters, progressive image caching, reading progress. |
| `/blog/:slug` | [`BlogApp.tsx`](src/blog/BlogApp.tsx) | Pre-rendered individual research treatise view, formal citations, LaTeX math, code highlighting. |

---

## 🔬 LoLaBo Autonomous AI Engine Specifications

### 1. Multi-Account Key Pool (`agent/keyManager.ts`)
Connects to multiple Google AI Studio accounts to multiply rate limits and ensure zero publication downtime:
- **Environment Key Matrix**: Accepts `GEMINI_API_KEYS="key1,key2,key3,key4"` or individual keys `GEMINI_API_KEY_1..4`.
- **Smart Failover**: Catches HTTP `429 Too Many Requests` or `RESOURCE_EXHAUSTED` responses, enters a cooldown state for the exhausted account, and automatically fails over to the next healthy account in $< 5\text{ ms}$.

### 2. Multi-Generation Model Tiering Matrix (Gemini 3.x Primary + 2.x Fallback)
Enforces a multi-tiered, latency- and depth-optimized fallback ladder across model families:

| Content Tier | Primary Gemini 3.x Models | Preserved Resilient 2.x Fallbacks | Target Depth & Invariants |
| :--- | :--- | :--- | :--- |
| **Flagship Research Treatises & RFCs** | `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.1-pro-preview`, `gemini-pro-latest`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-flash-lite-latest` | `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-2.0-flash-lite`, `gemini-2.0-pro-exp-02-05`, `gemini-2.0-flash-thinking-exp-01-21`, `gemini-1.5-pro`, `gemini-1.5-flash` | **2,500–3,500 words**, formal math ($O(n \log n)$), ASCII topologies, memory invariants, 4–6 peer-reviewed citations. |
| **Technical Dispatches & Engineering Blogs** | `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, `gemini-flash-lite-latest` | `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-2.0-flash-lite`, `gemini-1.5-flash` | **1,400–2,200 words**, working code implementations, low-level data-plane dynamics, actionable takeaways. |

### 3. Automated Model Validation & Deprecation Removal Engine (`agent/modelValidator.ts`)
To prevent stalled execution caused by retired, deprecated, or unavailable model aliases:
- **Real-Time Deprecation Interception**: Monitors Google API responses for HTTP `404 NOT_FOUND`, `INVALID_ARGUMENT`, and explicit deprecation signatures (`"is not found for API version"`, `"is deprecated"`, `"no longer available"`, `"unsupported model"`).
- **Automated Quarantine & Pruning**: Automatically purges deprecated models from in-memory candidate arrays and persists them to `.loragent-debug/deprecated-models.json` so retries never waste quota on defunct endpoints.
- **Remote Model Discovery**: Automatically queries `GET https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}` to verify active `generateContent` capabilities against Google's live catalog.
- **Zero-Downtime Cascade**: If a model alias is rejected, the engine cascades to the next candidate model in $< 10\text{ ms}$ without dropping the publication task.

### 4. Zero-Token-Loss Completeness Barrier (`agent/writer.ts`)
Prevents half-done, truncated, or unclosed articles from reaching production:
- **Integrity Validation**: Rigorously inspects markdown code fences, unclosed backticks, truncated tables, incomplete formulas, and ensures mandatory `## Key Takeaways & Summary` and `## References & Technical Citations` headers.
- **Surgical Continuation Pass (`completeArticleSections`)**: If token ceilings are encountered, a targeted completion agent cleanly closes severed code blocks and generates formal takeaways and academic references.

### 5. Swiss Editorial Visual Suite (`agent/imageAgent.ts` & `agent/imageGen.ts`)
Replaces generic sci-fi tropes (`octane render`, `glowing neon`, `cyberpunk`, `cybernetic`, `holographic`, `futuristic`, `laser lines`) with publication-grade engineering graphics:
- **Hero Cover (1200x630)**: Swiss / Bauhaus minimalist 2D vector technical illustration with clean graphite backdrops, muted slate/cobalt palettes, and precision line art.
- **Figure 1 (Architecture Blueprint)**: Authentic code-to-diagram **Mermaid.js flowcharts** (`flowchart TD`) rendered natively with interactive expand, copy source, and dark themes.
- **Figure 2 (Empirical Benchmarks)**: Publication-grade **100% Vector SVG latency CDF curves** ($P_{50}, P_{90}, P_{99}, P_{99.9}$) with microsecond coordinates and throughput distributions.

### 6. Autonomous Peer-Review Verification Unit (`agent/reviewer.ts`)
Audits all generated manuscripts against an academic 100-point rubric before publication:

| Evaluation Dimension | Weight | Acceptance Criteria |
| :--- | :---: | :--- |
| **Architectural Depth & Rigor** | **30 pts** | Kernel-level mechanics, memory alignments, cache hierarchy impacts, and invariants. |
| **Structural Completeness** | **25 pts** | ASCII topology diagrams, comparative benchmark matrices, and formal conclusion. |
| **Code & Mathematical Soundness** | **20 pts** | Idiomatic Rust/Go/C++ snippets, asymptotic complexity bounds ($O(n \log n)$). |
| **Citations & Literature Integrity** | **15 pts** | Inline citations referencing authoritative RFCs/papers, dedicated references section ($\ge 3$). |
| **Anti-Hallucination & Tone** | **10 pts** | Zero template placeholders (`TODO`, `TBD`), zero abrupt cutoffs, authoritative engineering voice. |

*Drafts scoring $< 85$ receive targeted critique prompts and enter an iterative revision cycle (up to 2 passes).*

### 7. Aggregate Publishing Capacity (4 Google Accounts + Free Mesh)

| Content Tier | 1 Google Account | 4 Google Accounts Pooled | With Free Provider Mesh (Groq / Cerebras) |
| :--- | :---: | :---: | :---: |
| **Standard Blogs & Dispatches** | 1,500 / day (62.5/hr) | **6,000 / day (250/hr)** | **20,000+ / day** |
| **Flagship Research & Thesis Papers** | 50 / day (2.08/hr) | **200 / day (8.33/hr)** | **500+ / day** |
| **Peer-Review Verification Passes** | 1,000 / day | **4,000 / day** | **10,000+ / day** |

---

## ⚡ Progressive Image Loading & Client Performance

All visual assets in the LoLaBo blog portal utilize [`LoLaBoImage.tsx`](src/blog/components/LoLaBoImage.tsx):
- **In-Memory Session Cache**: Tracks loaded images via `loadedImageCache: Set<string>`, eliminating network re-fetches during internal client navigation.
- **Low-Poly Blur-Up Skeletons**: Displays an animated SVG shimmer skeleton while assets decode.
- **Hero Image Prefetching**: Automatically prefetches hero images for the top articles upon initial portal hydration.
- **Deterministic AI Fallback**: If an image fails to load over the network, a dynamic vector SVG with technical glyphs and domain branding renders instantly.

---

## 🛠️ Static SEO Pre-Rendering Engine (`scripts/postbuild.js`)

To guarantee first-class indexability on search engines and instant social sharing previews without server-side rendering (SSR) overhead:
1. **Isolated Static HTML Routes**: Pre-renders separate `index.html` files for `/projects`, `/about`, `/team`, `/changelog`, `/support`, `/contact`, and `/dev`.
2. **Dedicated Article SEO Pages**: Generates static HTML folders for all 19+ research articles under `dist/blog/:slug/index.html`.
3. **Automated Metadata Injection**: Injects page-specific `<title>`, `<meta name="description">`, `og:image`, `twitter:card`, and canonical URLs.
4. **Structured Data (JSON-LD)**: Injects Schema.org `Article` and `Organization` structured data into every page's `<head>`.
5. **Sitemaps & RSS Feed**: Automatically synthesizes `public/sitemap.xml`, `public/blog/sitemap.xml`, and `public/blog/rss.xml`.

---

## 📂 Codebase Directory Topology

```text
lorapok.github.io/
├── agent/                         # LoLaBo Autonomous AI Subsystem
│   ├── index.ts                   # CLI entry point & publication orchestration
│   ├── server.ts                  # Autonomous daemon & REST API service
│   ├── writer.ts                  # Multi-model authoring engine & zero-truncation barrier
│   ├── modelValidator.ts          # Real-time model health & automated deprecation pruner
│   ├── reviewer.ts                # Autonomous Research Review Unit (100-pt rubric)
│   ├── keyManager.ts              # 4-account Google AI key rotator & 429 failover
│   ├── imageAgent.ts              # Swiss editorial visual synthesizer (Mermaid & vector SVG)
│   ├── imageGen.ts                # 100% online AI Flux engine & prompt normalizer
│   ├── exportData.ts              # Static data consolidator & Firestore synchronizer
│   ├── broadcastLivePost.ts       # Edge verification probe & Discord broadcaster
│   └── capacity.ts                # Multi-account publishing capacity analyzer
├── public/                        # Static Web Assets
│   ├── blog/
│   │   ├── posts.json             # Canonical static research catalog (19 articles)
│   │   ├── sitemap.xml            # Blog XML sitemap
│   │   └── rss.xml                # RSS 2.0 publication feed
│   ├── sitemap.xml                # Root website XML sitemap
│   └── robots.txt                 # Search engine crawler policies
├── scripts/                       # Build & Release Tooling
│   └── postbuild.js               # Static HTML pre-renderer & SEO tag injector
├── src/                           # React 19 Client SPA Source
│   ├── blog/                      # LoLaBo Research Portal
│   │   ├── BlogApp.tsx            # Main blog application & Mermaid.js renderer
│   │   └── components/            # Blog components (LoLaBoImage, CodeBlocks, etc.)
│   ├── components/                # Shared UI Components (Navbar, Footer, Search)
│   ├── data/                      # Structured Ecosystem Data
│   │   ├── lorapok.ts             # 30+ products, categories, and brand metadata
│   │   ├── team.ts                # Core team profiles & interactive dossiers
│   │   └── changelog.ts           # Ecosystem version milestones
│   ├── dev/                       # Developer Workspace & AI Playground
│   ├── pages/                     # Core Route Page Views
│   └── styles/                    # Tailwind CSS v4 & custom design tokens
├── .github/workflows/             # Continuous Integration & Automation
│   ├── lolabo-agent.yml           # Twice-hourly autonomous research publisher
│   └── deploy.yml                 # Automated edge build & GitHub Pages deploy
└── package.json                   # Project dependencies & operational scripts
```

---

## 🚀 Marketplace Distribution & Ecosystem Presence

Lorapok products are distributed across 7 major software registries:

* **VS Code Marketplace:** [LorapokLabs](https://marketplace.visualstudio.com/publishers/LorapokLabs) — *Cursor Curse Monitor, Lorapok Atlas*
* **Open VSX Registry:** [LorapokLabs](https://open-vsx.org/namespace/LorapokLabs) — *Cursor Curse Monitor, Lorapok Atlas*
* **Firefox AMO:** [Lorapok Add-ons](https://addons.mozilla.org/firefox/user/lorapok/) — *Atlas API Directory, XSnap Media Downloader, SubtitleMaster*
* **npm Registry:** `@lorapok-labs/reportkit-ui`, `lorapok-atlas`, `lorapok-atlas-mcp`, `roast-api`, `lorapok-player`
* **PyPI:** `roast-api`
* **Packagist:** `lorapok/laravel-execution-monitor`, `maizied/roast-api`
* **Snapcraft:** `lorapokmediaplayer`
* **Product Hunt:** [Lorapok Atlas Launch](https://www.producthunt.com/posts/lorapok-atlas)

---

## ⚙️ Development & Operational Commands

```bash
# Clone the repository
git clone https://github.com/Lorapok/lorapok.github.io.git
cd lorapok.github.io

# Install client and agent dependencies
npm install
cd agent && npm install && cd ..

# Start local sensory development server
npm run dev

# Run type checking across client application
npx tsc --noEmit

# Compile agent TypeScript modules to CommonJS
npm run agent:build

# Execute full production build with static HTML SEO pre-rendering
npm run build

# Run LoLaBo autonomous publisher manually (single dispatch)
npm run agent:dispatch

# Start LoLaBo autonomous daemon service
npm run service:lolabo:daemon
```

---

## 🔐 Zero-Trust Governance & Credentials

In accordance with Loragent Governance Standards:
- Plaintext secrets, private keys, and passphrases are never committed to Git, passed via argv, or exposed in client bundles.
- Production credentials are synchronised through the centralized machine AES-256 vault:
  ```bash
  cred get cloudflare account_id_lorapok
  cred get google_ai gemini_api_keys
  ```

---

## 📜 Team & License

Designed, engineered, and maintained by **[Mohammad Maizied Hasan Majumder (@Maijied)](https://github.com/Maijied)** and the **[Lorapok Labs](https://github.com/Lorapok)** open-source collective.

Released under the **[MIT License](LICENSE)**.
