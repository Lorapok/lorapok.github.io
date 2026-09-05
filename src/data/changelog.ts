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
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor" },
    ],
  },
  {
    date: "2026-08-29",
    product: "Loragent",
    title: "Multi-agent orchestration framework",
    description:
      "Enterprise-grade agent framework with 250-resource AI marketplace, MCP integration, and mission control.",
    type: "launch",
    links: [{ label: "GitHub", url: "https://github.com/Maijied/Loragent" }],
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
    date: "2026-05-06",
    product: "Lorapok Atlas",
    title: "Product Hunt Launch",
    description:
      "Launched Lorapok Atlas on Product Hunt — a directory for browsing and live-testing 2,100+ free APIs across 34 categories.",
    type: "launch",
    links: [
      { label: "Product Hunt", url: "https://www.producthunt.com/posts/lorapok-atlas" },
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-atlas" },
    ],
  },
  {
    date: "2026-05-01",
    product: "Lorapok Atlas",
    title: "VS Code + MCP + npm packages shipped",
    description:
      "Atlas available as VS Code extension, npm package (lorapok-atlas), and MCP server (lorapok-atlas-mcp) for Claude/Cursor.",
    type: "feature",
    links: [
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=lorapok.lorapok-atlas" },
      { label: "MCP npm", url: "https://www.npmjs.com/package/lorapok-atlas-mcp" },
    ],
  },
  {
    date: "2026-04-15",
    product: "Roast as a Service",
    title: "Multi-platform API published",
    description:
      "Fun roast API available on npm, PyPI, and Packagist simultaneously.",
    type: "launch",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/roast-api" },
      { label: "PyPI", url: "https://pypi.org/project/roast-api/" },
      { label: "Packagist", url: "https://packagist.org/packages/maizied/roast-api" },
    ],
  },
  {
    date: "2026-03-01",
    product: "Lorapok Media Player",
    title: "Desktop media player with Snap support",
    description:
      "Cross-platform media player published to npm and Snapcraft with low-latency playback.",
    type: "launch",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-player" },
      { label: "Snap", url: "https://snapcraft.io/lorapokmediaplayer" },
    ],
  },
];
