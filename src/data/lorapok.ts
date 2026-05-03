export type ProjectCategory =
  | "AI"
  | "Developer Tools"
  | "Media"
  | "Language/Input"
  | "Laravel/PHP"
  | "Desktop/Linux"
  | "Browser Extensions"
  | "Games/Utilities";

export type Project = {
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  language: string;
  repo: string;
  demo?: string;
  featured?: boolean;
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
    description:
      "A polished atlas for discovering public APIs and open data sources with a fast, searchable interface.",
    category: "Developer Tools",
    language: "TypeScript",
    repo: "https://github.com/Maijied/Lorapok-API_Atlas",
    demo: "https://maijied.github.io/Lorapok-API_Atlas/",
    featured: true,
  },
  {
    name: "Lorapok Media Player",
    tagline: "High-performance biological media engine",
    description:
      "A desktop-grade media player built for low-latency playback, high-fidelity control, and sensory UI aesthetics.",
    category: "Media",
    language: "TypeScript",
    repo: "https://github.com/Maijied/Lorapok_Media_Player",
    demo: "https://maijied.github.io/Lorapok_Media_Player/",
    featured: true,
  },
  {
    name: "Lorapok Keyboard",
    tagline: "Professional Bengali input system",
    description:
      "Android Bengali keyboard with phonetic typing, context-aware prediction, and a large vocabulary engine.",
    category: "Language/Input",
    language: "Kotlin",
    repo: "https://github.com/Maijied/Lorapok-Keyboard",
    demo: "https://maijied.github.io/Lorapok-Keyboard/",
    featured: true,
  },
  {
    name: "Lorapok AI Agent",
    tagline: "Action-oriented coding agent",
    description:
      "A terminal-first AI coding agent that plans, executes, verifies, and helps move codebases from reasoning to deployment.",
    category: "AI",
    language: "JavaScript",
    repo: "https://github.com/Maijied/Lorapok_AI_Agent",
    featured: true,
  },
  {
    name: "Lorapok LocalSync",
    tagline: "Local-first private communication",
    description:
      "A privacy-focused communication platform designed to work over a local router network without external servers.",
    category: "Developer Tools",
    language: "JavaScript",
    repo: "https://github.com/Maijied/Lorapok-LocalSync",
    demo: "https://maijied.github.io/Lorapok-LocalSync/",
    featured: true,
  },
  {
    name: "Dynamic Ollama LLM Chat",
    tagline: "Local LLM console and web UI setup",
    description:
      "A complete setup for running local models with Ollama, API access, VS Code workflows, and a dynamic console UI.",
    category: "AI",
    language: "Python",
    repo: "https://github.com/Maijied/Lorapok-Dynamic-Ollama-LLM-Chat-Interface",
    demo: "https://maijied.github.io/Lorapok-Dynamic-Ollama-LLM-Chat-Interface/",
    featured: true,
  },
  {
    name: "Laravel Execution Monitor",
    tagline: "Zero-config Laravel performance monitor",
    description:
      "A Laravel-focused monitoring tool for tracking runtime behavior and performance with minimal setup.",
    category: "Laravel/PHP",
    language: "PHP",
    repo: "https://github.com/Maijied/Lorapok-Laravel-Execution-Monitor",
    demo: "https://maijied.github.io/Lorapok-Laravel-Execution-Monitor/",
    featured: true,
  },
  {
    name: "Hazari Scoreboard",
    tagline: "Animated scoreboard for Hazari",
    description:
      "A responsive glassmorphism scoreboard for tracking four-player Hazari card game sessions.",
    category: "Games/Utilities",
    language: "HTML",
    repo: "https://github.com/Maijied/Hazari_Scoreboard",
    demo: "https://maijied.github.io/Hazari_Scoreboard/",
  },
  {
    name: "Linpad",
    tagline: "Minimal text editor for Ubuntu",
    description:
      "A lightweight editor focused on essentials like syntax highlighting, word count, and light/dark modes.",
    category: "Desktop/Linux",
    language: "Python",
    repo: "https://github.com/Maijied/linpad",
    demo: "https://maijied.github.io/linpad/",
  },
  {
    name: "SubtitleMaster Chrome",
    tagline: "Subtitle search and download extension",
    description:
      "A browser extension that searches and downloads subtitles using the OpenSubtitles API.",
    category: "Browser Extensions",
    language: "JavaScript",
    repo: "https://github.com/Maijied/SubtitleMaster-Chrome",
  },
  {
    name: "Linux File Replacer",
    tagline: "Laravel database config switcher",
    description:
      "A Zenity and Bash desktop utility for quickly switching Laravel database configuration files.",
    category: "Desktop/Linux",
    language: "Shell",
    repo: "https://github.com/Maijied/Linux-File-Replacer",
  },
  {
    name: "xsnap Media Downloader",
    tagline: "Media capture utility",
    description:
      "A JavaScript utility project for downloading and managing media assets from supported sources.",
    category: "Media",
    language: "JavaScript",
    repo: "https://github.com/Maijied/xsnap-media-downloader",
  },
  {
    name: "spotlight tickets",
    tagline: "Ticketing and event workflow",
    description:
      "A PHP-based project for ticket management and event-oriented workflow experiments.",
    category: "Laravel/PHP",
    language: "PHP",
    repo: "https://github.com/Maijied/spotlight-tickets",
  },
  {
    name: "Lorapok Windows Activator",
    tagline: "Windows utility reference",
    description:
      "A neutral utility listing retained as part of the broader open-source catalog with a direct repository link.",
    category: "Games/Utilities",
    language: "Docs",
    repo: "https://github.com/Maijied/Lorapok-Windows-Activator",
    demo: "https://maijied.github.io/Lorapok-Windows-Activator/",
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
  "Games/Utilities",
];
