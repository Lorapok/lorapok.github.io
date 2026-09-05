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
  | "Sensory & Hardware";

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
  image?: string;
  badge?: string;
  links: ProjectLink[];
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
  bio: "Full Stack Systems Architect and open-source engineer building biological UI, sensory computing systems, and high-concurrency digital platforms. Leading infrastructure at Shohoz and directing 28+ open-source Lorapok products.",
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
    name: "Lorapok API Atlas",
    tagline: "Open-source data exploration console",
    description: "A polished atlas for discovering public APIs and open data sources with a fast, searchable interface.",
    category: "Developer Tools",
    language: "TypeScript",
    featured: true,
    image: "/assets/projects/atlas-preview.png",
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
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Linux-File-Replacer", icon: "github" },
    ],
  },
  {
    name: "Lorapok Windows Activator",
    tagline: "Windows utility reference",
    description: "A neutral utility listing retained as part of the broader open-source catalog with a direct repository link.",
    category: "Games/Utilities",
    language: "Docs",
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-Windows-Activator/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-Windows-Activator", icon: "github" },
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
      "Universal, enterprise-grade multi-agent orchestration framework with a 250-resource AI marketplace.",
    category: "AI",
    language: "JavaScript",
    featured: true,
    image: "/assets/projects/loragent-banner.jpg",
    links: [
      { label: "Live", url: "https://loragent.lorapok.tech/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Loragent", icon: "github" },
    ],
  },
  {
    name: "ReportKit Core",
    tagline: "Zero re-query PHP report stack",
    description:
      "Chunked prepare, secure store, zero re-query PHP reporting engine for Laravel applications.",
    category: "Laravel/PHP",
    language: "JavaScript",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Reportkit-Core", icon: "github" },
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
    image: "/assets/projects/aswitchi-hero.png",
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
    links: [
      { label: "Web", url: "https://maijied.github.io/Bab.La/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Maijied/Bab.La", icon: "github" },
    ],
  },
  {
    name: "IrrigationPlanner",
    tagline: "Full-stack visual irrigation design platform",
    description:
      "A professional, full-stack irrigation system design tool — plan, calculate hydraulic flow, and order your irrigation installation directly from an interactive canvas.",
    category: "Developer Tools",
    language: "TypeScript",
    featured: true,
    links: [
      { label: "Live", url: "https://irrigationplanner.craftechbd.com/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Lorapok/IrrigationPlanner", icon: "github" },
    ],
  },
  {
    name: "Lorapok BrainSpark",
    tagline: "Daily cognitive training engine",
    description:
      "A free, open-source daily brain training app. Three short cognitive challenges exercise memory, pattern recognition, and vocabulary with zero distractions.",
    category: "Games/Utilities",
    language: "TypeScript",
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
    links: [
      { label: "Web", url: "https://lorapok.github.io/LoraCon/", icon: "web" },
      { label: "GitHub", url: "https://github.com/Lorapok/LoraCon", icon: "github" },
    ],
  },
  {
    name: "LoraBet",
    tagline: "Sports analytics and probability engine",
    description:
      "Native Kotlin predictive analytics engine for modeling event probabilities and statistical performance vectors.",
    category: "Mobile Apps",
    language: "Kotlin",
    links: [
      { label: "GitHub", url: "https://github.com/Lorapok/LoraBet", icon: "github" },
    ],
  },
  {
    name: "Hadi Memoriam",
    tagline: "Open memorial and civic tribute portal",
    description:
      "A tribute repository, README banner, and hosted memorial portal built to preserve truth, transparency, and civil justice.",
    category: "Games/Utilities",
    language: "HTML",
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
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/FreqGhost", icon: "github" },
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
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/larvox", icon: "github" },
    ],
  },
  {
    name: "Cursor Duplicator",
    tagline: "Multi-instance Cursor IDE environment manager",
    description:
      "Enterprise developer tool for spinning up isolated, parallel Cursor AI development environments with separate keyrings, profiles, and extensions.",
    category: "Developer Tools",
    language: "Shell",
    image: "/assets/projects/dcursor-logo.png",
    links: [
      { label: "GitHub", url: "https://github.com/Maijied/Cursor-Duplicator", icon: "github" },
    ],
  },
];

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
];

