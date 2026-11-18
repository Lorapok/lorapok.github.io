export type ChangelogEntry = {
  date: string;
  version?: string;
  product: string;
  title: string;
  description: string;
  type: "launch" | "feature" | "fix" | "milestone";
  links?: { label: string; url: string }[];
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-10-19",
    version: "2.0.0",
    product: "NoCatch",
    title: "Stable npm and Packagist distributions published",
    description:
      "NoCatch shipped as both lorapok-nocatch for JavaScript workflows and lorapok/nocatch for Composer projects. Both active registry records resolve to the same public Lorapok repository.",
    type: "launch",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-nocatch" },
      { label: "Packagist", url: "https://packagist.org/packages/lorapok/nocatch" },
      { label: "Repository", url: "https://github.com/Lorapok/nocatch" },
    ],
  },
  {
    date: "2026-10-11",
    version: "2.0.1",
    product: "Loragent",
    title: "Loragent 2.0.1 released on npm",
    description:
      "The published package documents the 224-agent virtual software firm, six formations, MCP integration, and autonomous multi-agent orchestration.",
    type: "feature",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/loragent" },
      { label: "Product site", url: "https://loragent.lorapok.tech/" },
    ],
  },
  {
    date: "2026-08-09",
    version: "0.1.1 beta",
    product: "ReportKit",
    title: "ReportKit browser and Laravel packages enter public beta",
    description:
      "The browser UI shipped on npm alongside modern and legacy Laravel adapters on Packagist, giving current and older Laravel applications explicit installation paths.",
    type: "launch",
    links: [
      { label: "npm UI", url: "https://www.npmjs.com/package/@lorapok-labs/reportkit-ui" },
      { label: "Laravel", url: "https://packagist.org/packages/reportkit/laravel" },
      { label: "Laravel Legacy", url: "https://packagist.org/packages/reportkit/laravel-legacy" },
      { label: "Product site", url: "https://reportkit.lorapok.tech/" },
    ],
  },
  {
    date: "2026-10-17",
    product: "HomeDyn",
    title: "HomeDyn Restaurant System Showcase & Prototype Handoff",
    description:
      "Interactive multi-role restaurant management prototype developed for HomeDyn by Lorapok Labs. Features 95 responsive routes spanning guest table booking, dine-in ordering, kitchen station gates, verified billing, and stock ledger.",
    type: "launch",
    links: [
      { label: "Live Demo", url: "https://homedyn.lorapok.tech" },
      { label: "GitHub", url: "https://github.com/Lorapok/homedyn" },
    ],
  },
  {
    date: "2026-10-17",
    product: "lorapok.tech",
    title: "Senior Full-Stack Engineer Shamim Ahammed Joins Collective",
    description:
      "Welcomed Shamim Ahammed (@sasoibal) as Senior Full-Stack Software Engineer in Core Engineering, bringing 8+ years of enterprise PHP/Laravel, modern React/Next.js, and high-concurrency ERP/HRMS architecture experience.",
    type: "milestone",
    links: [{ label: "Team Directory", url: "/team" }],
  },
  {
    date: "2026-09-05",
    product: "lorapok.tech",
    title: "Brand Showcase, Sensory Media Banners & Privacy Guard",
    description:
      "Ingested flagship systems from personal projects (FreqGhost, LARVOX, Cursor Duplicator), authentic CV portraits, dynamic category count filtering, and complete contact privacy hardening.",
    type: "feature",
    links: [{ label: "Product Catalog", url: "/projects" }],
  },
  {
    date: "2026-09-05",
    product: "lorapok.tech",
    title: "Collective Showcase & CV Directory Launched",
    description:
      "Interactive collective directory showcasing 6 core engineering, AI, clinical, and strategy specialists with comprehensive career histories, verified credentials, and downloadable CV PDFs.",
    type: "launch",
    links: [{ label: "Team Directory", url: "/team" }],
  },
  {
    date: "2026-09-05",
    product: "Ecosystem Infra",
    title: "5 Live Cloud Subdomains Activated",
    description:
      "Zero-latency edge routing activated for atlas.lorapok.tech, cursor.lorapok.tech, loragent.lorapok.tech, media.lorapok.tech, and ai.lorapok.tech.",
    type: "milestone",
    links: [{ label: "Atlas Console", url: "https://atlas.lorapok.tech" }],
  },
  {
    date: "2026-09-05",
    product: "lorapok.tech",
    title: "Lorapok Labs v2.0 — Complete Redesign",
    description:
      "Multi-page architecture, 32+ products catalogued, global search, SEO overhaul, and sensory dark glassmorphism design.",
    type: "launch",
    links: [{ label: "Live Site", url: "https://lorapok.tech" }],
  },
  {
    date: "2026-09-05",
    version: "2.3.0",
    product: "Cursor Curse Monitor",
    title: "Latest release with enhanced billing dashboard",
    description:
      "Live usage tracking for Cursor AI with model switching, quota monitoring, and budget alerts.",
    type: "feature",
    links: [
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor-by-lorapok" },
    ],
  },
  {
    date: "2026-07-24",
    product: "lorapok.tech",
    title: "Custom domain lorapok.tech configured",
    description:
      "Migrated from lorapok.github.io to the custom domain lorapok.tech with GitHub Pages CNAME.",
    type: "milestone",
  },
  {
    date: "2026-07-20",
    product: "LoraCon",
    title: "Configuration library published",
    description: "Lightweight configuration management utility for the Lorapok ecosystem.",
    type: "launch",
    links: [{ label: "GitHub", url: "https://github.com/Lorapok/LoraCon" }],
  },
  {
    date: "2026-06-23",
    product: "Hadi Memoriam",
    title: "Memorial tribute page",
    description:
      "GitHub README banner and hosted memorial page, built so the people who carry his name forward have something to point to.",
    type: "milestone",
    links: [{ label: "GitHub", url: "https://github.com/Lorapok/Hadi-Memoriam" }],
  },
  {
    date: "2026-05-03",
    version: "1.0.0",
    product: "Lorapok Atlas",
    title: "Atlas API directory and MCP server published on npm",
    description:
      "The Atlas programmatic API and its MCP server shipped as separate npm packages for direct application and AI-assistant integrations.",
    type: "feature",
    links: [
      { label: "Atlas npm", url: "https://www.npmjs.com/package/lorapok-atlas" },
      { label: "MCP npm", url: "https://www.npmjs.com/package/lorapok-atlas-mcp" },
    ],
  },
  {
    date: "2026-02-17",
    version: "1.5.0",
    product: "Roast as a Service",
    title: "JavaScript and PHP clients reach version 1.5.0",
    description:
      "The unscoped JavaScript package and Composer client were published from the same public source repository for the static, CDN-backed developer roast API.",
    type: "launch",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/roast-api" },
      { label: "Packagist", url: "https://packagist.org/packages/maizied/roast-api" },
    ],
  },
  {
    date: "2026-01-20",
    version: "1.4.0",
    product: "Lorapok Media Player",
    title: "React media engine published on npm",
    description:
      "The npm release provides HLS, DASH, and hardware-accelerated playback through the Lorapok player engine.",
    type: "launch",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-player" },
    ],
  },
];
