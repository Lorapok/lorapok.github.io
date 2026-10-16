export type ProjectCategory =
  | "AI"
  | "Developer Tools"
  | "Media"
  | "Language/Input"
  | "Laravel/PHP"
  | "Desktop/Linux"
  | "Browser Extensions"
  | "Games/Utilities"
  | "Mobile Apps"
  | "Sensory & Hardware"
  | "3D Art & Design";

export type ProjectLink = {
  label: string;
  url: string;
  icon?: "web" | "npm" | "github" | "vscode" | "openvsx" | "api" | "snap" | "download" | "pypi" | "packagist" | "firefox" | "chrome" | "terminal" | "android" | "gamepad" | "monitor" | "book" | "cloud" | "box" | "cpu" | "server" | "layers";
};

export type MarketplaceBadge = {
  platform: "npm" | "pypi" | "packagist" | "vscode" | "openvsx" | "amo" | "snap" | "producthunt";
  url: string;
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  language: string;
  featured?: boolean;
  isNew?: boolean;
  image?: string;
  imageType?: "cover" | "icon";
  badge?: string;
  links: ProjectLink[];
  ownerAvatar?: string;
};

export type SupportAddress = {
  network: string;
  token: string;
  address: string;
};

export const brand = {
  name: "Lorapok Labs",
  shortName: "Lorapok",
  tagline: "Open-source products that feel alive.",
  description:
    "Lorapok blends biological UI, sensory computing, and practical engineering into products that feel fast, intuitive, and alive. From Dhaka 🇧🇩 to the world 🌍.",
  githubOrg: "https://github.com/lorapok",
  sourceOrg: "https://github.com/Maijied",
  twitter: "https://x.com/LorapokLabs",
  linkedin: "https://www.linkedin.com/showcase/lorapok/",
  reddit: "https://www.reddit.com/r/LorapokLabs/",
};

export const founder = {
  name: "Mohammad Maizied Hasan Majumder",
  handle: "@Maijied",
  role: "Senior Software Engineer @ Shohoz",
  location: "Dhaka, Bangladesh",
  email: "mdshvo40@gmail.com",
  bio: "Full Stack Systems Architect and open-source engineer building biological UI, sensory computing systems, and high-concurrency digital platforms. Senior Software Engineer at Shohoz and maintainer of the public Lorapok repositories.",
  links: {
    portfolio: "https://maijied.github.io/Maijied/",
    github: "https://github.com/Maijied",
    linkedin: "https://www.linkedin.com/in/maijied/",
    telegram: "https://t.me/Maijied",
    twitter: "https://x.com/LorapokLabs",
  },
};

export const support = {
  bkash: "",
  note: "Only send USDT to the matching network. Do not send NFTs or other tokens.",
  addresses: [
    {
      network: "BNB Smart Chain (BEP20)",
      token: "USDT",
      address: "0xfbaae60922e40bdcc82142ac6d6ff9c69bb12d26",
    },
    {
      network: "Ethereum (ERC20)",
      token: "USDT",
      address: "0xfbaae60922e40bdcc82142ac6d6ff9c69bb12d26",
    },
    {
      network: "Solana",
      token: "USDT",
      address: "HMbxpSyhS599xC9fVdMMtbnrbjBEvSP2ww2KXUoqwe7D",
    },
    {
      network: "Tron (TRC20)",
      token: "USDT",
      address: "TNicohFHB9VYPSq2ksqRD73Ubhi9QVAVZm",
    },
    {
      network: "Aptos",
      token: "USDT",
      address: "0xb9a6776cfce10ee3755ecaa39f8aeb5b4f1edaa0adaccf4c79260c63bce27e3d",
    },
  ] satisfies SupportAddress[],
};

export const philosophy = [
  {
    label: "Biological UI",
    title: "Interfaces with pulse",
    body: "Visual systems use depth, signal, and organic rhythm so software feels responsive instead of static.",
  },
  {
    label: "Sensory Computing",
    title: "Fast feedback loops",
    body: "Products prioritize latency, clarity, and direct interaction so users can feel what the system is doing.",
  },
  {
    label: "Open Engineering",
    title: "Readable by default",
    body: "Projects ship with practical docs, public repositories, and simple paths for people to learn, fork, and extend.",
  },
];

export const projects: Project[] = [
  {
    name: "HomeDyn Restaurant System",
    tagline: "Interactive restaurant operating system & hospitality demo",
    description:
      "Enterprise multi-role restaurant management prototype developed for HomeDyn (founded by MD IMRAN HOSSAIN) by Lorapok Labs. Features 95 responsive routes spanning guest table booking, dine-in order rounds, station gates, verified billing, inventory & stock ledger, recipe batching, CRM retention, and audit trails.",
    category: "Developer Tools",
    language: "JavaScript / HTML5",
    featured: true,
    isNew: true,
    badge: "Client Showcase",
    image: "/assets/projects/homedyn-preview.png",
    imageType: "cover",
    ownerAvatar: "/assets/team/shamim-ahammed.jpg",
    links: [
      { label: "Live Demo", url: "https://homedyn.lorapok.tech", icon: "web" },
      { label: "GitHub", url: "https://github.com/Lorapok/homedyn", icon: "github" },
      { label: "Review Guide", url: "https://github.com/Lorapok/homedyn/blob/main/HomeDyn-Prototype-Review-Guide-v3.md", icon: "book" },
    ],
  },
  {
    name: "SmartOffice.ai",
    tagline: "Modular ERP & business automation platform",
    description:
      "Enterprise ERP and business process automation system featuring modular HRMS, Supply Chain Management (SCM), role-based permissions, and real-time operational workflows.",
    category: "Laravel/PHP",
    language: "Laravel / React",
    featured: false,
    image: "/assets/projects/smartoffice-og.svg",
    imageType: "cover",
    ownerAvatar: "/assets/team/shamim-ahammed.jpg",
    links: [
      { label: "Portal", url: "https://smartoffice.ai", icon: "web" },
      { label: "Architect", url: "https://github.com/sasoibal", icon: "github" },
    ],
  },
  {
    name: "Property Index",
    tagline: "Modern real estate listing & property search portal",
    description:
      "High-performance property search, listing workflows, and real estate inquiry platform built with Laravel, React, and MySQL to support renting, buying, and commercial operations.",
    category: "Laravel/PHP",
    language: "Laravel / React",
    featured: false,
    image: "/assets/projects/property-index-og.svg",
    imageType: "cover",
    ownerAvatar: "/assets/team/shamim-ahammed.jpg",
    links: [
      { label: "Portal", url: "https://propertyindexbd.com", icon: "web" },
      { label: "Architect", url: "https://github.com/sasoibal", icon: "github" },
    ],
  },
  {
    name: "SeeYou",
    tagline: "iCanSeeYou — agentic SEO specialist",
    description:
      "Remote MCP + API + dashboard that audits sites the way Googlebot and AI crawlers see them: render gaps, schema, AEO, and ROI-ranked fix plans for every MCP IDE.",
    category: "Developer Tools",
    language: "JavaScript",
    featured: true,
    isNew: true,
    badge: "New",
    image: "/assets/projects/seeyou-cover.png",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/280749521?v=4",
    links: [
      { label: "Live", url: "https://seeyou.lorapok.tech/", icon: "web" },
      { label: "API", url: "https://seeyou-api.mdshuvo40.workers.dev/", icon: "server" },
      { label: "GitHub", url: "https://github.com/Lorapok/SeeYou", icon: "github" },
    ],
  },
  {
    name: "Lorapok API Atlas",
    tagline: "Open-source data exploration console",
    description: "A polished atlas for discovering public APIs and open data sources with a fast, searchable interface.",
    category: "Developer Tools",
    language: "TypeScript",
    featured: true,
    image: "/assets/projects/atlas-social.jpg",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://atlas.lorapok.tech/", icon: "web" },
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-atlas", icon: "npm" },
      { label: "MCP", url: "https://www.npmjs.com/package/lorapok-atlas-mcp", icon: "box" },
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=lorapok.lorapok-atlas", icon: "vscode" },
      { label: "Firefox", url: "https://addons.mozilla.org/firefox/addon/lorapok-atlas/", icon: "firefox" },
      { label: "GitHub", url: "https://github.com/Lorapok/Lorapok-API_Atlas", icon: "github" },
    ],
  },
  {
    name: "Lorapok Media Player",
    tagline: "High-performance biological media engine",
    description: "A desktop-grade media player built for low-latency playback, high-fidelity control, and sensory UI aesthetics.",
    category: "Media",
    language: "TypeScript",
    featured: true,
    image: "/assets/projects/player-preview.png",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://media.lorapok.tech/", icon: "web" },
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-player", icon: "npm" },
      { label: "Snap", url: "https://snapcraft.io/lorapokmediaplayer", icon: "snap" },
      { label: "CI/CD", url: "https://github.com/Maijied/Lorapok_Media_Player/blob/main/.github/workflows/workflow-unified.yml", icon: "server" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok_Media_Player", icon: "github" },
    ],
  },
  {
    name: "Lorapok Keyboard",
    tagline: "Professional Bengali input system",
    description: "Android Bengali keyboard with phonetic typing, context-aware prediction, and a large vocabulary engine.",
    category: "Language/Input",
    language: "Kotlin",
    featured: true,
    image: "/assets/projects/keyboard-banner.png",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Keyboard/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Keyboard", icon: "github" },
    ],
  },
  {
    name: "Lorapok AI Agent",
    tagline: "Action-oriented coding agent",
    description: "A terminal-first AI coding agent that plans, executes, verifies, and helps move codebases from reasoning to deployment.",
    category: "AI",
    language: "JavaScript",
    featured: true,
    image: "/assets/projects/ai-agent-preview.png",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://ai.lorapok.tech/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok_AI_Agent", icon: "github" },
    ],
  },
  {
    name: "Roast as a Service",
    tagline: "Multi-platform roast API",
    description: "A fun and dynamic API service providing customizable roasts. Distributed across npm, PyPI, and Packagist.",
    category: "Developer Tools",
    language: "TypeScript",
    featured: true,
    image: "/assets/projects/roast-service-logo.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://maijied.github.io/roast-as-a-service/", icon: "web" },
      { label: "npm", url: "https://www.npmjs.com/package/roast-api", icon: "npm" },
      { label: "PyPI", url: "https://pypi.org/project/roast-api/", icon: "pypi" },
      { label: "Packagist", url: "https://packagist.org/packages/maizied/roast-api", icon: "packagist" },
      { label: "GitHub", url: "https://github.com/Maijied/roast-as-a-service", icon: "github" },
    ],
  },
  {
    name: "Lorapok LocalSync",
    tagline: "Local-first private communication",
    description: "A privacy-focused communication platform designed to work over a local router network without external servers.",
    category: "Developer Tools",
    language: "JavaScript",
    image: "/assets/projects/localsync-icon.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-LocalSync/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-LocalSync", icon: "github" },
    ],
  },
  {
    name: "Dynamic Ollama LLM Chat",
    tagline: "Local LLM console and web UI setup",
    description: "A complete setup for running local models with Ollama, API access, VS Code workflows, and a dynamic console UI.",
    category: "AI",
    language: "Python",
    image: "/assets/projects/ollama-chat-banner.svg",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Dynamic-Ollama-LLM-Chat-Interface/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Dynamic-Ollama-LLM-Chat-Interface", icon: "github" },
    ],
  },
  {
    name: "Laravel Execution Monitor",
    tagline: "Zero-config Laravel performance monitor",
    description: "A Laravel-focused monitoring tool for tracking runtime behavior and performance with minimal setup.",
    category: "Laravel/PHP",
    language: "PHP",
    featured: true,
    image: "/assets/projects/laravel-monitor.png",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/lorapok/", icon: "web" },
      { label: "Packagist", url: "https://packagist.org/packages/lorapok/laravel-execution-monitor", icon: "packagist" },
      { label: "GitHub", url: "https://github.com/Maijied/lorapok", icon: "github" },
    ],
  },
  {
    name: "SubtitleMaster Firefox",
    tagline: "Subtitle downloader extension",
    description: "A browser extension that searches and downloads subtitles using the OpenSubtitles API.",
    category: "Browser Extensions",
    language: "JavaScript",
    image: "/assets/projects/subtitle-master-icon.png",
    imageType: "icon",
    links: [
      { label: "AMO", url: "https://addons.mozilla.org/en-US/firefox/addon/subtitle-master/", icon: "firefox" },
      { label: "GitHub", url: "https://github.com/Maijied/SubtitleMaster-Firefox", icon: "github" },
    ],
  },
  {
    name: "XSnap Media Downloader",
    tagline: "Cross-browser media capture utility",
    description: "Opera & Firefox browser extension for downloading and capturing videos, GIFs, and images in high fidelity.",
    category: "Browser Extensions",
    language: "JavaScript",
    image: "/assets/projects/xsnap-banner.png",
    imageType: "cover",
    links: [
      { label: "AMO", url: "https://addons.mozilla.org/firefox/addon/xsnap-media-downloader/", icon: "firefox" },
      { label: "GitHub", url: "https://github.com/Maijied/xsnap-media-downloader_Opera", icon: "github" },
    ],
  },
  {
    name: "Spotlight Tickets",
    tagline: "Self-hosted ticketing platform",
    description: "A PHP-based platform for self-hosted ticket selling and event-oriented workflow management.",
    category: "Laravel/PHP",
    language: "PHP",
    image: "/assets/projects/spotlight-tickets.png",
    imageType: "cover",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/spotlight-tickets", icon: "github" },
    ],
  },
  {
    name: "Hazari Scoreboard",
    tagline: "Animated scoreboard for Hazari",
    description: "A responsive glassmorphism scoreboard for tracking four-player Hazari card game sessions.",
    category: "Games/Utilities",
    language: "HTML",
    image: "/assets/projects/hazari-scoreboard.png",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://maijied.github.io/Hazari_Scoreboard/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Hazari_Scoreboard", icon: "github" },
    ],
  },
  {
    name: "Linpad",
    tagline: "Minimal text editor for Ubuntu",
    description: "A lightweight editor focused on essentials like syntax highlighting, word count, and light/dark modes.",
    category: "Desktop/Linux",
    language: "Python",
    image: "/assets/projects/linpad-preview.png",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/linpad/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/linpad", icon: "github" },
    ],
  },
  {
    name: "AirHockey Unity3D",
    tagline: "Single & multiplayer Air Hockey",
    description: "A fun and interactive Air Hockey game for Android built with Unity3D, C#, and Blender.",
    category: "Games/Utilities",
    language: "C#",
    image: "/assets/projects/airhockey-preview.png",
    imageType: "cover",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/AirHockey_Unity3D_AndroidGame", icon: "github" },
    ],
  },
  {
    name: "Bangla Character Recognition",
    tagline: "AI-powered Bangla OCR",
    description: "An Android application utilizing machine learning for real-time Bengali character recognition.",
    category: "Mobile Apps",
    language: "Java",
    image: "/assets/projects/bcr-neural.svg",
    imageType: "cover",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Bangla-Character-Recognition-Android-application", icon: "github" },
    ],
  },
  {
    name: "Expense Manager Pro",
    tagline: "Personal finance tracker",
    description: "A feature-rich Android app designed for tracking daily expenses and managing personal finances seamlessly.",
    category: "Mobile Apps",
    language: "Java",
    image: "/assets/projects/expense-manager-icon.jpg",
    imageType: "icon",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/ExpenseManagerPro", icon: "github" },
    ],
  },
  {
    name: "Linux File Replacer",
    tagline: "Laravel config switcher",
    description: "A Zenity and Bash desktop utility for quickly switching Laravel database configuration files.",
    category: "Desktop/Linux",
    language: "Shell",
    image: "/assets/projects/linux-file-replacer.svg",
    imageType: "icon",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Linux-File-Replacer", icon: "github" },
    ],
  },
  {
    name: "Cursor Curse Monitor",
    tagline: "Live Cursor usage dashboard",
    description:
      "Real-time dashboard for Cursor AI usage limits, budget tracking, billing cycles, and free-fallback model switching.",
    category: "Developer Tools",
    language: "JavaScript",
    featured: true,
    image: "/assets/projects/cursor-monitor-preview.png",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://cursor.lorapok.tech/", icon: "web" },
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor", icon: "vscode" },
      { label: "Open VSX", url: "https://open-vsx.org/extension/LorapokLabs/cursor-curse-monitor", icon: "openvsx" },
      { label: "Firefox", url: "https://addons.mozilla.org/firefox/addon/cursor-curse-monitor/", icon: "firefox" },
      { label: "GitHub", url: "https://github.com/Maijied/Cursor-Curse-Monitor-by-Lorapok", icon: "github" },
    ],
  },
  {
    name: "Loragent",
    tagline: "Enterprise multi-agent orchestration",
    description:
      "Multi-agent orchestration framework. The catalog on this site counts 224 skill definitions.",
    category: "AI",
    language: "JavaScript",
    featured: true,
    image: "/assets/projects/loragent-social.png",
    imageType: "cover",
    links: [
      { label: "Live", url: "https://loragent.lorapok.tech/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Loragent", icon: "github" },
    ],
  },
  {
    name: "ReportKit",
    tagline: "Prepare → Secure Store → Zero Re-Query PHP & Laravel Stack",
    description:
      "High-performance chunked prepare, in-memory secure store, and zero re-query reporting engine for Laravel (4.1 to 13+) and plain PHP. Features DateRangeChunker for concurrency-capped SQL reads, in-memory secure store, and streaming exports for Excel, CSV, PDF, and DataTables.",
    category: "Laravel/PHP",
    language: "PHP",
    featured: true,
    badge: "Monorepo Suite",
    image: "/assets/projects/reportkit-banner.png",
    imageType: "cover",
    links: [
      { label: "Live Site", url: "https://reportkit.lorapok.tech/", icon: "web" },
      { label: "Docs", url: "https://reportkit.lorapok.tech/docs", icon: "book" },
      { label: "Demo", url: "https://reportkit.lorapok.tech/demo", icon: "terminal" },
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
      { label: "Packagist", url: "https://packagist.org/packages/reportkit/core", icon: "packagist" },
    ],
  },
  {
    name: "ReportKit Core Engine",
    tagline: "In-memory secure store & zero re-query PHP engine",
    description:
      "Core standalone PHP reporting engine (reportkit/core) compatible with PHP 5.6 to 8.3+. Provides DateRangeChunker for weekly database concurrency capping, in-memory secure store, and PseudoPaginator to sort, slice, and deduplicate without redundant database queries.",
    category: "Laravel/PHP",
    language: "PHP",
    badge: "reportkit/core",
    image: "/assets/projects/reportkit-mark.png",
    imageType: "icon",
    links: [
      { label: "Packagist", url: "https://packagist.org/packages/reportkit/core", icon: "packagist" },
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
      { label: "Docs", url: "https://reportkit.lorapok.tech/docs", icon: "book" },
    ],
  },
  {
    name: "ReportKit for Laravel",
    tagline: "Modern Laravel 5.5 to 13+ reporting adapter",
    description:
      "Official modern Laravel adapter (reportkit/laravel). Seamless auto-discovery service provider, ReportKit facade, Blade directives, and response macros for instant DataTables JSON and multi-format reports.",
    category: "Laravel/PHP",
    language: "PHP",
    badge: "reportkit/laravel",
    image: "/assets/projects/reportkit-laravel.svg",
    imageType: "cover",
    links: [
      { label: "Packagist", url: "https://packagist.org/packages/reportkit/laravel", icon: "packagist" },
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-Laravel", icon: "github" },
      { label: "Monorepo", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
      { label: "Docs", url: "https://reportkit.lorapok.tech/docs", icon: "book" },
    ],
  },
  {
    name: "ReportKit Legacy Laravel",
    tagline: "Laravel 4.1 to 5.4 backward-compatible adapter",
    description:
      "Engineered specifically for legacy enterprise production environments running Laravel 4.1–5.4 on PHP 5.6–7.x. Brings modern chunked prepare, secure store, and zero re-query stability to legacy codebases without risky framework upgrades.",
    category: "Laravel/PHP",
    language: "PHP",
    badge: "reportkit/laravel-legacy",
    image: "/assets/projects/reportkit-legacy.svg",
    imageType: "cover",
    links: [
      { label: "Packagist", url: "https://packagist.org/packages/reportkit/laravel-legacy", icon: "packagist" },
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-Laravel-Legacy", icon: "github" },
      { label: "Monorepo", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
      { label: "Live Site", url: "https://reportkit.lorapok.tech/", icon: "web" },
    ],
  },
  {
    name: "ReportKit UI",
    tagline: "Browser UI, CAS security tokens & DataTables helpers",
    description:
      "Browser client library (@lorapok-labs/reportkit-ui) published on npm. Features CAS security token handling, export progress indicators, and DataTables helpers for high-throughput reporting frontends.",
    category: "Developer Tools",
    language: "TypeScript",
    badge: "@reportkit/ui",
    image: "/assets/projects/reportkit-larva.gif",
    imageType: "icon",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/@lorapok-labs/reportkit-ui", icon: "npm" },
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-UI", icon: "github" },
      { label: "Monorepo", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
      { label: "Live Site", url: "https://reportkit.lorapok.tech/", icon: "web" },
    ],
  },
  {
    name: "AswitchI",
    tagline: "macOS Launchpad for Linux",
    description:
      "Native macOS Launchpad & AI Switcher for Ubuntu Linux. Built by Lorapok Labs.",
    category: "Desktop/Linux",
    language: "Python",
    featured: true,
    image: "/assets/projects/aswitchi-social.jpg",
    imageType: "cover",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/AswitchI", icon: "github" },
    ],
  },
  {
    name: "Lorapok Atlas Firefox",
    tagline: "API directory in your browser sidebar",
    description:
      "Browse, search, and live-test 2,100+ free APIs directly from the Firefox sidebar.",
    category: "Browser Extensions",
    language: "JavaScript",
    image: "/assets/projects/atlas-firefox.png",
    imageType: "cover",
    links: [
      { label: "AMO", url: "https://addons.mozilla.org/firefox/addon/lorapok-atlas/", icon: "firefox" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-API_Atlas", icon: "github" },
    ],
  },
  {
    name: "Bab.La",
    tagline: "Omni-channel content broadcasting engine",
    description:
      "Greek for 'All in One' — an open-source broadcasting platform. Post text, images, videos, GIFs, links, and documents simultaneously across all connected channels from a single composer.",
    category: "Developer Tools",
    language: "TypeScript",
    featured: true,
    image: "/assets/projects/babla-banner.svg",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/Bab.La/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Bab.La", icon: "github" },
    ],
  },
  {
    name: "Lorapok BrainSpark",
    tagline: "Daily cognitive training engine",
    description:
      "A free, open-source daily brain training app. Three short cognitive challenges exercise memory, pattern recognition, and vocabulary with zero distractions.",
    category: "Games/Utilities",
    language: "TypeScript",
    image: "/assets/projects/brainspark-preview.jpg",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-GameSpark/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-GameSpark", icon: "github" },
    ],
  },
  {
    name: "Lorapok TabMan",
    tagline: "High-performance memory & tab manager",
    description:
      "A Firefox tab management engine for reclaiming RAM and focus. Features background hibernation, tab workspaces, and biological responsiveness.",
    category: "Browser Extensions",
    language: "TypeScript",
    image: "/assets/projects/tabman-icon.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-TabMan/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-TabMan", icon: "github" },
    ],
  },
  {
    name: "LoraSports",
    tagline: "The Tactician's Logbook — FIFA World Cup 2026",
    description:
      "Real-time tactical intelligence, live match logs, and tournament tracking for FIFA World Cup 2026, embedded directly into your Firefox toolbar.",
    category: "Browser Extensions",
    language: "JavaScript",
    image: "/assets/projects/lorasports-icon.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://maijied.github.io/LoraSports/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/LoraSports", icon: "github" },
    ],
  },
  {
    name: "LoraPok LaraTest",
    tagline: "Zero-latency automated Laravel test runner",
    description:
      "Automatically executes relevant Laravel unit and feature tests the instant test files are modified, compatible across all modern Laravel versions.",
    category: "Laravel/PHP",
    language: "PHP",
    image: "/assets/projects/laratest-daemon.svg",
    imageType: "cover",
    links: [
      { label: "KiroHub", url: "https://kirohub.dev/resource/kirohub-generate/lorapok-laratest", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/LoraPok-LaraTest", icon: "github" },
    ],
  },
  {
    name: "LoraCon",
    tagline: "Sensory data and format converter",
    description:
      "High-speed, client-side data, format, and unit conversion engine built with instant feedback loops and zero server dependencies.",
    category: "Developer Tools",
    language: "JavaScript",
    image: "/assets/projects/loracon-icon.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://lorapok.github.io/LoraCon/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Lorapok/LoraCon", icon: "github" },
    ],
  },
  {
    name: "Hadi Memoriam",
    tagline: "Open memorial and civic tribute portal",
    description:
      "A tribute repository, README banner, and hosted memorial portal built to preserve truth, transparency, and civil justice.",
    category: "Games/Utilities",
    language: "HTML",
    image: "/assets/projects/hadi-memoriam.png",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://hadi-memoriam.vercel.app", icon: "web" },
      { label: "GitHub", url: "https://github.com/Lorapok/Hadi-Memoriam", icon: "github" },
    ],
  },
  {
    name: "Lorapok Red Bot",
    tagline: "Autonomous community Reddit bot",
    description:
      "AI-driven moderation and developer community engagement bot designed for Reddit subreddits including r/LorapokLabs.",
    category: "AI",
    language: "JavaScript",
    image: "/assets/projects/red-bot-icon.png",
    imageType: "icon",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Red-Bot/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Red-Bot", icon: "github" },
    ],
  },
  {
    name: "Lorapok Querycraft",
    tagline: "Interactive SQL and schema designer",
    description:
      "Visual query builder and database schema simulation environment for testing relational joins and indexing strategies in real-time.",
    category: "Developer Tools",
    language: "HTML",
    image: "/assets/projects/querycraft-visual.svg",
    imageType: "cover",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Querycraft/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Querycraft", icon: "github" },
    ],
  },
  {
    name: "FreqGhost",
    tagline: "WiFi DensePose Sensing Observatory",
    description:
      "Advanced through-wall sensing and 3D spatial visualization platform inspired by WiFi DensePose. Detects human presence, room movement, and respiratory vital signs via radio frequency CSI disturbance.",
    category: "Sensory & Hardware",
    language: "Python / Three.js",
    featured: true,
    image: "/assets/projects/freqghost-viz.png",
    imageType: "cover",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/FreqGhost", icon: "github" },
    ],
  },
  {
    name: "CLoraMF",
    tagline: "AI Companion Dashboard for CMF Watch",
    description:
      "Advanced AI-powered companion dashboard for CMF Watch (Nothing ecosystem). Connects wearable biometrics (heart rate, step cadence, sleep metrics) with Git repository monitoring and Google Gemini multimodal assistant.",
    category: "Sensory & Hardware",
    language: "TypeScript",
    featured: true,
    badge: "Wearable AI & IoT",
    image: "/assets/projects/cloramf-icon.png",
    imageType: "icon",
    links: [
      { label: "Live Web", url: "https://maijied.github.io/CLoraMF/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/CLoraMF", icon: "github" },
    ],
  },
  {
    name: "LARVOX",
    tagline: "Linux Voice Operating eXperience",
    description:
      "Next-generation, offline-first voice assistant engineered for Linux environments. Blends Biological UI aesthetics with local IPC control, screen parsing, and container orchestration.",
    category: "AI",
    language: "Python",
    featured: true,
    image: "/assets/projects/larvox-logo.png",
    imageType: "icon",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/larvox", icon: "github" },
    ],
  },
  {
    name: "dCursor",
    tagline: "A second, isolated Cursor install",
    description:
      "dCursor stands for duplicate Cursor: a standalone Debian package that runs a second Cursor instance with its own account, extensions, agent, MCP servers, and settings.",
    category: "Developer Tools",
    language: "Python",
    isNew: true,
    badge: "New",
    featured: true,
    image: "/assets/projects/dcursor-logo.png",
    imageType: "icon",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/dCursor", icon: "github" },
    ],
  },
  {
    name: "Lorapok Inventory System",
    tagline: "Multi-tenant inventory and point of sale",
    description:
      "Multi-tenant inventory and point-of-sale for shops that sell serialised goods. One super admin provisions shops. Each shop gets its own subdomain, branding, and database.",
    category: "Laravel/PHP",
    language: "PHP",
    isNew: true,
    badge: "New",
    featured: true,
    image: "/assets/projects/inventory-og.png",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Inventory-System/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Inventory-System", icon: "github" },
    ],
  },
  {
    name: "Lorapok Sorcerer",
    tagline: "Original-media discovery and Discord delivery",
    description:
      "A Lorapok Labs product for original-media discovery and Discord delivery, powered by the LoraMediaFinder engine.",
    category: "Media",
    language: "JavaScript",
    isNew: true,
    badge: "New",
    featured: true,
    image: "/assets/projects/sorcerer-logo.svg",
    imageType: "icon",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Sorcerer/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Sorcerer", icon: "github" },
    ],
  },
  {
    name: "Lorapok MindNode",
    tagline: "Key-based encrypted notepad",
    description:
      "A key-based digital notepad. Notes are encrypted in the browser with the Web Crypto API (PBKDF2 and AES-GCM) before they leave the device. No accounts and no server-side keys.",
    category: "Developer Tools",
    language: "JavaScript",
    isNew: true,
    badge: "New",
    featured: true,
    image: "/assets/projects/mindnode-logo.svg",
    imageType: "icon",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-MindNode/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-MindNode", icon: "github" },
    ],
  },
  {
    name: "Lorapok Git Geek",
    tagline: "Automated Git agent web platform",
    description:
      "Automated Git agent and web platform from the Lorapok Git Geek repository, with Azure Node handlers and optional Gemini or OpenAI features described in its README.",
    category: "Developer Tools",
    language: "TypeScript",
    isNew: true,
    badge: "New",
    image: "/assets/projects/git-geek-cover.svg",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Git-Geek", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Git-Geek", icon: "github" },
    ],
  },
  {
    name: "IntelliJ Lorapok",
    tagline: "AI agent plugin for JetBrains",
    description:
      "Open-source AI agent IDE plugin for JetBrains, with multi-provider models, MCP, and sub-agent orchestration. The repository lists a public site and a JetBrains Marketplace vendor page.",
    category: "Developer Tools",
    language: "CSS",
    isNew: true,
    badge: "New",
    image: "/assets/projects/intellij-lorapok-og.svg",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Intellij-Lorapok/", icon: "web" },
      { label: "Marketplace", url: "https://plugins.jetbrains.com/vendor/lorapok-labs", icon: "box" },
      { label: "GitHub", url: "https://github.com/Maijied/Intellij-Lorapok", icon: "github" },
    ],
  },
  {
    name: "Lorapok Labs Bible",
    tagline: "Brand guide and ecosystem site",
    description:
      "The public brand guide and website for the Lorapok Labs ecosystem, hosted from the Lorapok-Labs-Bible repository.",
    category: "Developer Tools",
    language: "TypeScript",
    isNew: true,
    badge: "New",
    image: "/assets/projects/labs-bible-cover.svg",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Labs-Bible/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Labs-Bible", icon: "github" },
    ],
  },
  {
    name: "Arduino Laser Stop",
    tagline: "Gear motor stop with a photo resistor and laser",
    description:
      "Arduino Uno project that stops a gear motor using a motor driver, a photo resistor module, and a laser sensor.",
    category: "Sensory & Hardware",
    language: "Arduino",
    isNew: true,
    badge: "New",
    image: "/assets/projects/arduino-laser-cover.svg",
    imageType: "cover",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Arduino-gear-motor-stoping-mechanism-by-Photo-Resistor-Module-and-Laser-sensor", icon: "github" },
    ],
  },
  {
    name: "Smilo",
    tagline: "Rust camera engine and creative studio",
    description:
      "Modular camera suite and studio engine written in Rust. The repository describes real-time filter graphs, smile-detection shutter triggers, lossless recording, and SDK bindings for desktop and web shells.",
    category: "Sensory & Hardware",
    language: "Rust",
    isNew: true,
    badge: "New",
    featured: true,
    image: "/assets/projects/smilo-logo.jpg",
    imageType: "icon",
    ownerAvatar: "https://avatars.githubusercontent.com/u/11429916?v=4",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Smilo", icon: "github" },
    ],
  },
  {
    name: "The Frozen Liquidity",
    tagline: "Frozen kinetic paint pour — acrylic, wire, canvas",
    description:
      "Studio work by Borshon Mondol. A suspended paint can pours red and blue acrylic onto a canvas; the stream and splash are held as a single frozen kinetic sculpture.",
    category: "3D Art & Design",
    language: "Mixed media",
    image: "/assets/projects/borshon-frozen-liquidity.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/frozen-liquidity/", icon: "web" },
      { label: "Studio", url: "https://borshon.lorapok.tech/", icon: "web" },
    ],
  },
  {
    name: "The Weave of Memory and the Inner Cage",
    tagline: "Helical textile sculpture and spatial installation",
    description:
      "Studio work by Borshon Mondol. An ascending helical sculpture hand-wrapped in post-consumer textiles, paired with a geometric arch backdrop, on subconscious memory and protective psychological architectures.",
    category: "3D Art & Design",
    language: "Mixed media",
    image: "/assets/projects/borshon-weave-of-memory.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/weave-of-memory/", icon: "web" },
      { label: "Studio", url: "https://borshon.lorapok.tech/", icon: "web" },
    ],
  },
  {
    name: "Sleeping Dog Study",
    tagline: "Life-size clay anatomical study",
    description:
      "Studio work by Borshon Mondol. Life-size figurative sculpture exploring skeletal alignment, resting body mass distribution, and muscular relaxation.",
    category: "3D Art & Design",
    language: "Clay",
    image: "/assets/projects/borshon-sleeping-dog.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/sleeping-dog/", icon: "web" },
    ],
  },
  {
    name: "Cape Buffalo Head",
    tagline: "High-relief clay bust — animal form",
    description:
      "Studio work by Borshon Mondol. Animal bust analyzing cranial bone architecture and the cantilevered mass of sweeping horn structure.",
    category: "3D Art & Design",
    language: "Clay",
    image: "/assets/projects/borshon-cape-buffalo.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/cape-buffalo-head/", icon: "web" },
    ],
  },
  {
    name: "Female Torso Study",
    tagline: "Classical life-modelling in clay",
    description:
      "Studio work by Borshon Mondol. Figurative clay study from direct observation, capturing contrapposto posture, thoracic twist, and weight distribution.",
    category: "3D Art & Design",
    language: "Clay",
    image: "/assets/projects/borshon-female-torso.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/female-torso/", icon: "web" },
    ],
  },
  {
    name: "Traditional Painted Wooden Panel (Alpana Pidi)",
    tagline: "Bengali ceremonial seating panel with folk ornament",
    description:
      "Studio work by Borshon Mondol. Traditional ceremonial wooden seating panel (pidi) painted with symmetrical Mayur (peacock), sacred Kalka (paisley), and border motifs.",
    category: "3D Art & Design",
    language: "Folk painting",
    image: "/assets/projects/borshon-painted-pidi.jpg",
    imageType: "cover",
    ownerAvatar: "/assets/team/borshon-mondol.jpg",
    links: [
      { label: "Work", url: "https://borshon.lorapok.tech/work/painted-pidi/", icon: "web" },
    ],
  },
];

export const CREATOR_WORKS_CATEGORY: ProjectCategory = "3D Art & Design";

export function getCreatorWorks(): Project[] {
  return projects.filter((p) => p.category === CREATOR_WORKS_CATEGORY);
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "AI",
  "Developer Tools",
  "Sensory & Hardware",
  "Media",
  "Language/Input",
  "Laravel/PHP",
  "Desktop/Linux",
  "Browser Extensions",
  "Mobile Apps",
  "Games/Utilities",
  "3D Art & Design",
];

