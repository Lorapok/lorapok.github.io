export type ProjectCategory =
  | "AI"
  | "Developer Tools"
  | "Media"
  | "Language/Input"
  | "Laravel/PHP"
  | "Desktop/Linux"
  | "Browser Extensions"
  | "Games/Utilities"
  | "Mobile Apps";

export type ProjectLink = {
  label: string;
  url: string;
  icon?: "web" | "npm" | "github" | "vscode" | "api" | "snap" | "download" | "pypi" | "packagist" | "firefox" | "chrome" | "terminal" | "android" | "gamepad" | "monitor" | "book" | "cloud" | "box" | "cpu" | "server" | "layers";
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  language: string;
  featured?: boolean;
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
    "Lorapok blends biological UI, sensory computing, and practical engineering into products that feel fast, intuitive, and alive.",
  githubOrg: "https://github.com/lorapok",
  sourceOrg: "https://github.com/Maijied",
};

export const founder = {
  name: "Mohammad Maizied Hasan Majumder",
  handle: "@Maijied",
  role: "Senior Software Engineer @ Shohoz",
  location: "Dhaka, Bangladesh",
  email: "mdshvo40@gmail.com",
  bio: "Full Stack Software Engineer building premium digital products with performance, precision, and modern technology at the core.",
  links: {
    portfolio: "https://maijied.github.io/Maijied/",
    github: "https://github.com/Maijied",
    linkedin: "https://www.linkedin.com/in/maizied",
    telegram: "https://t.me/Maijied",
  },
};

export const support = {
  bkash: "01629158131",
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
    links: [
      { label: "Web", url: "https://maijied.github.io/Lorapok-API_Atlas/", icon: "web" },
      { label: "npm", url: "https://www.npmjs.com/package/lorapok-atlas", icon: "npm" },
      { label: "MCP npm", url: "https://www.npmjs.com/package/lorapok-atlas-mcp", icon: "box" },
      { label: "VS Code", url: "https://marketplace.visualstudio.com/items?itemName=lorapok.lorapok-atlas", icon: "vscode" },
      { label: "Cloudflare API", url: "https://github.com/Maijied/Lorapok-API_Atlas/tree/main/packages/lorapok-atlas-api", icon: "cloud" },
      { label: "GitHub", url: "https://github.com/Maijied/Lorapok-API_Atlas", icon: "github" },
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
      { label: "Web", url: "https://maijied.github.io/Lorapok_Media_Player/", icon: "web" },
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
    name: "xsnap Media Downloader",
    tagline: "Media capture utility",
    description: "Opera & Mozilla browser addon for downloading and managing media assets from supported sources.",
    category: "Media",
    language: "JavaScript",
    links: [
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
];

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "AI",
  "Developer Tools",
  "Media",
  "Language/Input",
  "Laravel/PHP",
  "Desktop/Linux",
  "Browser Extensions",
  "Mobile Apps",
  "Games/Utilities",
];

