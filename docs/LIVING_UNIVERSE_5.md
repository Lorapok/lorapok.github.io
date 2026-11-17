# Lorapok Labs — Living Universe 5.0

## Source scenario reconstructed

The supplied V7 conversation and the repository's original prototypes describe a single product with three layers:

1. **Public universe** — a living open-source organization site with project discovery, GitHub evidence, journal stories, contribution paths, maintainers, and an interactive Ribo guide.
2. **Business universe** — clearly separated hosting, consulting, service offers, partnership inquiries, and operational work. Commercial claims must not be presented as open-source facts.
3. **Developer Studio** — the local operating environment for AI providers, blog production, project data, README and commit tools, prompt experiments, analytics, administration, and everyday studio operations.

The V7 browser review specifically promised a working product search, Ribo mood selection, Pause/Resume Motion control, responsive page layouts, a local Studio demo, no horizontal overflow, and no missing local assets. The planning prototypes add the multi-provider AI workspace, blog authoring pipeline, prompt library, comparison tools, authenticated administration, self-hosted analytics, social cards, and collaboration surfaces.

## Experience contract

- Ribo is visible in the first mobile experience and exposes six identity-consistent 3D states: Curious, Focused, Celebrating, Thinking, Presenting, and Exploring. The transparent pose set is shared by the public hero, navigation, footer, experience controls, Studio dashboard, and Brand Gallery.
- The expanded character system preserves those six Ribo poses while restoring the five-species Larva Sanctuary (Vaultie, Instar-6 Apex, Neon Scout, Deep Diver, and Robo-Worker), adding five operational Ribo roles, introducing ten authentic full-body mascot roles grounded in the original Lorapok, Automate, and LoraHost references, and adding six context-aware inner-page companions. The production library now contains 32 coordinated characters without replacing earlier artwork.
- The bottom-right surface is the Lorapok system assistant. Navigation and experience controls work without an AI provider; Gemini responses remain explicitly pending until Antigravity supplies and verifies a protected server endpoint.
- Motion can be paused globally and the preference persists locally.
- Product search and category filtering work from the public product universe.
- Mobile Studio navigation is grouped and collapsible instead of presenting one long wall of controls.
- Provider keys remain only in the current browser session. They are not stored in local storage, synchronized to Firebase, displayed to administrators, or copied from the admin console.
- Draft mail, chat, meeting, offer, task, feedback, content, prompt, and brand-state data is explicitly browser-local unless a connected backend is named on the screen.
- Affiliate relationships are described accurately. Higgsfield and Binance are not called formal partners without evidence.
- Unreconciled LoraHost prices and an unconfirmed founding year are not published as facts.

## Scenario summary

Lorapok Labs is one brand with two deliberately separate experiences:

- **Open Source Universe** — public products, repositories, releases, research, engineering stories, contributors, and community collaboration.
- **Business Universe** — commercial products, cloud services, offers, partnerships, customer inquiries, and internal operations.

Both universes share the same biological interface language, Ribo mascot, brand tokens, and evidence-first storytelling. Their intent and claims remain separate so community work is not presented as a sales funnel and business capabilities are not mistaken for confirmed partnerships.

## Product principles

1. **Evidence before assertion.** Live data, connected services, browser simulations, and unresolved claims are labeled separately.
2. **One identity, two intents.** Open-source and commercial content share a brand system without sharing the same publishing context.
3. **Useful interaction.** Studio modules perform real local actions instead of existing only as dashboard cards.
4. **No accidental external actions.** Demo mail, chat, meetings, tasks, offers, and feedback remain browser-local until a production backend is intentionally connected.
5. **Accessible biological UI.** Organic motion, signal colors, glass depth, keyboard access, responsive layouts, and reduced-motion support work together.

## Studio module map

| # | Module | Current mode | Purpose |
|---|---|---|---|
| 01 | Project Office | Live data | Sync public GitHub repositories, privately inventory local project ideas, and manage catalog metadata and business models. |
| 02 | Content desk | Browser demo | Draft and classify Open Source or Business stories. |
| 03 | Team portfolios | Connected | Search real team profiles and public portfolio links. |
| 04 | Offers | Browser demo | Prepare commercial offers without publishing unverified prices. |
| 05 | Feedback inbox | Browser demo | Moderate ideas, questions, and customer signals. |
| 06 | Mail drafts | Browser demo | Prepare responses without sending messages. |
| 07 | Team chat | Browser demo | Simulate internal planning conversations. |
| 08 | Meeting links | Browser demo | Generate copyable Jitsi room URLs without creating accounts. |
| 09 | Task board | Browser demo | Move local tasks through backlog, progress, and completion. |
| 10 | Social cards | Browser demo | Compose and export branded 1200×630 PNG cards. |
| 11 | Brand gallery | Connected | Review 32 coordinated characters, approved color tokens, and 11 reusable source assets with family filters, copyable paths, and downloads. |
| 12 | AI laboratory | Connected | Configure providers and run existing AI experiments. |
| 13 | Prompt library | Connected | Reuse existing prompt workflows. |
| 14 | Analytics | Connected | Review available audience and product signals. |
| 15 | People & access | Connected | Google sign-in, invitation-by-email, approval and suspension states, and database-enforced RBAC protect the Office. |
| 16 | LoLaBo operations | Connected | Operate the restored research pipeline: source focus, model route, peer review, refinement, quality gate, publishing, and verified distribution. |

## Lorapok Labs Office control plane

`/dev` is the private Lorapok Labs Office. The entire route is protected by Firebase Google authentication and database-backed role-based access control; individual panels are not exposed before access is established. Owners can invite teammates, approve pending identities, assign roles and team metadata, suspend access, and review an append-only access audit trail. Administrator, editor, researcher, teammate, and viewer presets limit both visible Office modules and their corresponding Firestore operations. The three bootstrap owner identities remain protected from accidental lockout, while every other account must be invited or explicitly approved.

The public project inventory is generated from repositories owned by `Lorapok` and `Maijied`. A separate local scanner discovers non-Git project folders and writes them only to the administrator-protected `office_projects` collection as private ideas. Nothing from that scan enters the committed browser bundle or the public Firestore projection until an administrator supplies a public URL and explicitly publishes it. Project Office can classify every record as unclassified, open source, or commercial; set its lifecycle stage; and publish, draft, hide, feature, categorize, rename, and summarize it.

LoLaBo is again an autonomous research engine. An hourly runner checks the administrator-selected cadence, while Office can queue the next cycle and configure editorial mode, model route, research agenda, domain focus, audience, tone, visual strategy, and zero-to-three review refinements. The real pipeline performs source collection and novelty ranking, long-form synthesis, multi-model/key failover, academic peer review, technical visual generation, and deterministic score, length, citation, duplicate, completeness, and placeholder checks. Failed candidates stay private; approved candidates can either await Office approval or publish automatically. Distribution is staged only for quality-approved posts and occurs only after the deployed article returns successfully from the live site. Provider credentials and webhooks remain deployment secrets and are never returned to the browser.

## Public experience

The public site presents the product catalog, research and journal stories, team portfolios, Creator Works, the Loragent catalog, release history, contact paths, and the shared Living Universe identity. Generated route and article HTML contains meaningful crawler-visible content before React starts.

## Studio persistence and boundaries

Browser-demo data is stored under `lorapok-studio-v5` in local storage. It is intentionally non-production:

- no draft email is sent;
- no chat message leaves the browser;
- meeting URLs are generated but no invitation is dispatched;
- offers are not published to the public site;
- feedback moderation does not update a server;
- tasks do not create external tickets.

Prompt-library entries and votes are stored under `lorapok-prompt-library-v7`. A prompt loaded into Playground is passed through `lpk_playground_prompt` and consumed when Playground opens. Ribo and motion preferences use `lorapok-ribo-mood` and `lorapok-motion-paused`.

AI provider credentials are an exception: they use browser `sessionStorage`, are cleared when the tab session ends or the user signs out, and are never written to the Studio persistence object.

## Original developer specification coverage

| Original capability | Current implementation |
|---|---|
| Standard / Developer mode | Dedicated `/dev` route plus a public Studio navigation entry. |
| Firebase Auth, Firestore, Storage | Google-authenticated Office route with tracked production Firestore rules and administrator-only mutations. |
| Multi-provider key manager | Session-only credential boundary with provider and model selection. |
| Blog context editor | Connected Blog System authoring suite. |
| AI blog generation | Connected provider workflow; publishing requires the configured backend and access rules. |
| Blog cover workflow | LoLaBo supports cover assets and resilient editorial fallbacks; production generation remains provider-dependent. |
| Blog listing and article pages | Public `/blog` catalog and slug routes with generated crawler-visible HTML. |
| Blog administration | Content library, publishing workflow, LoLaBo command center, and authenticated admin surface. |
| Reactions and moderation | Public claps/bookmarks plus browser-local feedback moderation. |
| Multi-provider chat | AI Laboratory with selectable providers/models and visible connection state. |
| API Playground | Prompt/system configuration, raw response, formatted response, cURL, and JavaScript export. |
| Provider comparison | Concurrent comparison with honest missing-key and unsupported-provider states. |
| Prompt library | Search, provider/category filters, local submissions, upvotes, persistence, and one-click Playground loading. |
| Newsletter workflow | Mail Drafts prepares content locally; delivery is intentionally not claimed without an approved sending backend. |
| Analytics | Connected analytics panel with honest empty/restricted states. |
| Theme and motion | Biological dark-space system, reduced-motion support, and explicit global motion control. |
| SEO and social cards | Route/blog metadata, prerendered article pages, sitemaps/RSS, and downloadable 1200×630 social cards. |

Production activation requires a documented backend, authentication and role rules, database ownership, audit logs, and explicit integration tests.

## Publishing checks

- Reconcile LoraHost pricing before publishing price claims.
- Confirm the official founding year before using it as a headline statistic.
- Describe Higgsfield and Binance as ecosystem references or integrations unless a partnership is formally confirmed.
- Keep the 25 production subdomains and 224 published agent definitions as separate metrics.
- Complete Meta domain confirmation and verify Pixel/CAPI event deduplication in Events Manager before claiming conversion tracking is healthy.
