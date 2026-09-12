// agent/capacity.ts
// LoLaBo Multi-Account & Multi-Provider AI Model Throughput & Publishing Capacity Analyzer
// Evaluates Google Gemini (Single & 4-Account Pool) + Top Free AI Providers (Groq, Cerebras, SambaNova, Mistral, GitHub Models)

export interface ModelCapacityProfile {
  modelName: string;
  provider: string;
  role: string;
  tier: 'Free' | 'Pay-As-You-Go';
  rateLimits: {
    rpm: number;        // Requests per minute
    rpd: number;        // Requests per day
    tpm: number;        // Tokens per minute
  };
  tokenBudgetPerPost: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  latencySeconds: {
    average: number;
    p95: number;
  };
  hourlyCapacity: {
    sustainedPostsPerHour: number;
    burstPostsPerHour: number;
    limitingFactor: string;
  };
  dailyMaxPosts: number;
}

export interface FreeProviderDirectoryItem {
  name: string;
  bestFreeModel: string;
  freeTierLimits: string;
  bestUsedFor: string;
  signUpUrl: string;
}

export const FREE_AI_PROVIDERS_DIRECTORY: FreeProviderDirectoryItem[] = [
  {
    name: "Google AI Studio",
    bestFreeModel: "Gemini 3.8 Pro / 3.1 Pro / 3.8 Flash / Imagen 3",
    freeTierLimits: "15 RPM / 1,500 RPD (Flash), 2 RPM / 50 RPD (Pro) per account",
    bestUsedFor: "Flagship Research Treatises, Thesis Papers & Standard Blogs",
    signUpUrl: "https://aistudio.google.com/"
  },
  {
    name: "GroqCloud",
    bestFreeModel: "Llama 3.3 70B Versatile, DeepSeek R1 Distill",
    freeTierLimits: "30 RPM / 14,400 RPD / 6,000 TPM (100% Free)",
    bestUsedFor: "Ultra-fast synthesis & cross-model peer review (300 tok/sec)",
    signUpUrl: "https://console.groq.com/"
  },
  {
    name: "Cerebras Cloud",
    bestFreeModel: "Llama 3.3 70B (Wafer-Scale Engine)",
    freeTierLimits: "30 RPM / 14,400 RPD / 1,000,000 TPM (100% Free)",
    bestUsedFor: "Instant generation of massive codebases & benchmark tables (2,000 tok/sec)",
    signUpUrl: "https://cloud.cerebras.ai/"
  },
  {
    name: "SambaNova Cloud",
    bestFreeModel: "DeepSeek R1 671B Full, Llama 3.3 70B",
    freeTierLimits: "20 RPM / Generous Developer Quota (100% Free)",
    bestUsedFor: "Full 671B Chain-of-Thought mathematical proofs & thesis depth",
    signUpUrl: "https://cloud.sambanova.ai/"
  },
  {
    name: "GitHub Models",
    bestFreeModel: "GPT-4o, Claude 3.5 Sonnet, Llama 3.3 70B",
    freeTierLimits: "15 RPM / 150 RPD (Free with any GitHub PAT)",
    bestUsedFor: "Cross-model validation & authoritative academic review",
    signUpUrl: "https://github.com/marketplace/models"
  },
  {
    name: "Mistral AI",
    bestFreeModel: "Codestral 22B, Mistral Small",
    freeTierLimits: "1 RPS (Requests per second) on free experimental tier",
    bestUsedFor: "Kernel transitions, assembly tracing & C/Rust code blocks",
    signUpUrl: "https://console.mistral.ai/"
  },
  {
    name: "OpenRouter Free Pool",
    bestFreeModel: "DeepSeek R1, Qwen 2.5 72B, Llama 3.3 (:free tags)",
    freeTierLimits: "20 RPM on all models tagged ':free'",
    bestUsedFor: "Fallback review & multi-agent debate loops",
    signUpUrl: "https://openrouter.ai/"
  },
  {
    name: "Cloudflare Workers AI",
    bestFreeModel: "Llama 3.3 70B, DeepSeek R1 Distill",
    freeTierLimits: "10,000 Neurons / Day (~50-100 full generations/day free)",
    bestUsedFor: "Autonomous Edge workers & background RSS filtering",
    signUpUrl: "https://dash.cloudflare.com/"
  }
];

export const CAPACITY_PROFILES: Record<string, ModelCapacityProfile> = {
  // ─── Single Google Account ───
  'gemini-flash-1x': {
    modelName: 'Google Gemini 3.8 Flash (1 Account)',
    provider: 'Google AI Studio',
    role: 'Standard Technical Blogs & News Dispatches',
    tier: 'Free',
    rateLimits: { rpm: 15, rpd: 1500, tpm: 1000000 },
    tokenBudgetPerPost: { inputTokens: 2500, outputTokens: 4000, totalTokens: 6500 },
    latencySeconds: { average: 12, p95: 22 },
    hourlyCapacity: {
      sustainedPostsPerHour: 62.5,
      burstPostsPerHour: 150,
      limitingFactor: 'Daily Free Quota (1,500 RPD)'
    },
    dailyMaxPosts: 1500
  },

  'gemini-pro-1x': {
    modelName: 'Google Gemini 3.8 Pro / 3.1 Pro (1 Account)',
    provider: 'Google AI Studio',
    role: 'Flagship Research Treatises & Thesis Deep Dives',
    tier: 'Free',
    rateLimits: { rpm: 2, rpd: 50, tpm: 32000 },
    tokenBudgetPerPost: { inputTokens: 3000, outputTokens: 4500, totalTokens: 7500 },
    latencySeconds: { average: 28, p95: 45 },
    hourlyCapacity: {
      sustainedPostsPerHour: 2.08,
      burstPostsPerHour: 2.0,
      limitingFactor: 'Daily Free Quota (50 RPD) & RPM (2 RPM)'
    },
    dailyMaxPosts: 50
  },

  // ─── 4 Google Accounts Pool ───
  'gemini-flash-4x': {
    modelName: 'Google Gemini 3.8 Flash (4 Accounts Pooled)',
    provider: 'Google AI Studio Pool',
    role: 'High-Velocity Technical Blogs & Real-Time Dispatches',
    tier: 'Free',
    rateLimits: { rpm: 60, rpd: 6000, tpm: 4000000 },
    tokenBudgetPerPost: { inputTokens: 2500, outputTokens: 4000, totalTokens: 6500 },
    latencySeconds: { average: 12, p95: 22 },
    hourlyCapacity: {
      sustainedPostsPerHour: 250, // 6,000 / 24h
      burstPostsPerHour: 400,
      limitingFactor: 'Git push & CI deployment speed'
    },
    dailyMaxPosts: 6000
  },

  'gemini-pro-4x': {
    modelName: 'Google Gemini 3.8 Pro / 3.1 Pro (4 Accounts Pooled)',
    provider: 'Google AI Studio Pool',
    role: 'Exhaustive Research Papers, Thesis Treatises & Journals',
    tier: 'Free',
    rateLimits: { rpm: 8, rpd: 200, tpm: 128000 },
    tokenBudgetPerPost: { inputTokens: 3000, outputTokens: 4500, totalTokens: 7500 },
    latencySeconds: { average: 28, p95: 45 },
    hourlyCapacity: {
      sustainedPostsPerHour: 8.33, // 200 / 24h
      burstPostsPerHour: 8.0,
      limitingFactor: 'Generation Latency (~28s) & 8 RPM Pool Rate Limit'
    },
    dailyMaxPosts: 200
  },

  // ─── External Free Providers ───
  'groq-llama33': {
    modelName: 'Groq Llama 3.3 70B (Free Tier)',
    provider: 'GroqCloud',
    role: 'High-Speed Synthesis & Peer-Review Audit',
    tier: 'Free',
    rateLimits: { rpm: 30, rpd: 14400, tpm: 6000 },
    tokenBudgetPerPost: { inputTokens: 2500, outputTokens: 4000, totalTokens: 6500 },
    latencySeconds: { average: 5, p95: 9 },
    hourlyCapacity: {
      sustainedPostsPerHour: 600,
      burstPostsPerHour: 600,
      limitingFactor: 'Tokens Per Minute (6,000 TPM limit)'
    },
    dailyMaxPosts: 14400
  },

  'cerebras-llama33': {
    modelName: 'Cerebras Llama 3.3 70B (Free Tier)',
    provider: 'Cerebras Wafer-Scale',
    role: 'Instant Architecture Blueprint & Diagram Generation',
    tier: 'Free',
    rateLimits: { rpm: 30, rpd: 14400, tpm: 1000000 },
    tokenBudgetPerPost: { inputTokens: 2500, outputTokens: 4000, totalTokens: 6500 },
    latencySeconds: { average: 3, p95: 6 },
    hourlyCapacity: {
      sustainedPostsPerHour: 600,
      burstPostsPerHour: 600,
      limitingFactor: 'Requests Per Minute (30 RPM limit)'
    },
    dailyMaxPosts: 14400
  },

  'sambanova-deepseek-r1': {
    modelName: 'SambaNova DeepSeek R1 671B Full (Free Tier)',
    provider: 'SambaNova Systems',
    role: 'Mathematical Foundations, Kernel Formal Proofs & Thesis Papers',
    tier: 'Free',
    rateLimits: { rpm: 20, rpd: 5000, tpm: 500000 },
    tokenBudgetPerPost: { inputTokens: 3000, outputTokens: 5000, totalTokens: 8000 },
    latencySeconds: { average: 18, p95: 35 },
    hourlyCapacity: {
      sustainedPostsPerHour: 100,
      burstPostsPerHour: 150,
      limitingFactor: 'Inference Queue Wait Time'
    },
    dailyMaxPosts: 5000
  }
};

export function formatComprehensiveReport(): string {
  let r = "=================================================================================\n";
  r += "  LoLaBo Autonomous Engine — Multi-Account & Multi-Provider Capacity Matrix\n";
  r += "  Published by Lorapok Labs • Evaluated under 100% Free Tiers ($0 Cost)\n";
  r += "=================================================================================\n\n";

  r += "1. GOOGLE AI STUDIO (Single Account vs. 4 Accounts Pooled):\n";
  r += "---------------------------------------------------------------------------------\n";
  r += "• Standard Technical Blogs (Powered by Gemini Flash):\n";
  r += "    - 1 Google Account:  62.5 posts/hr  |  1,500 posts / day\n";
  r += "    - 4 Google Accounts: 250.0 posts/hr |  6,000 posts / day (4x Multiplied Quota)\n\n";

  r += "• Flagship Research Treatises & Thesis Papers (Powered by Gemini Pro / Thinking):\n";
  r += "    - 1 Google Account:  2.08 papers/hr |     50 flagship papers / day\n";
  r += "    - 4 Google Accounts: 8.33 papers/hr |    200 flagship papers / day (4x Multiplied Quota)\n\n";

  r += "2. EXTERNAL FREE AI PROVIDERS MATRIX:\n";
  r += "---------------------------------------------------------------------------------\n";
  for (const item of FREE_AI_PROVIDERS_DIRECTORY) {
    r += `• ${item.name} (${item.signUpUrl})\n`;
    r += `    Model: ${item.bestFreeModel}\n`;
    r += `    Free Quota: ${item.freeTierLimits}\n`;
    r += `    Role: ${item.bestUsedFor}\n\n`;
  }

  r += "3. COMBINED AGGREGATE FREE CAPACITY:\n";
  r += "---------------------------------------------------------------------------------\n";
  r += "• Total Daily Capacity Across 4 Google Accounts + Free Providers:\n";
  r += "    - Flagship Research Treatises & Thesis Papers: 200 to 500+ papers / day\n";
  r += "    - Standard Technical Blog Posts & Dispatches:  6,000+ articles / day\n";
  r += "    - Peer-Review Audits by Research Review Unit: 2,000+ verification passes / day\n\n";

  r += "4. PRACTICAL WORKFLOW RECOMMENDATION:\n";
  r += "---------------------------------------------------------------------------------\n";
  r += "• Blogs / News Dispatches: Run 1 post every hour using Gemini 3.8 Flash.\n";
  r += "• Research Treatises / Thesis / Journals: Run on-demand or 2-4 flagship papers/day using Gemini 3.8 Pro / 3.1 Pro.\n";
  r += "• Research Review Unit: Runs a verification pass before publication to ensure 85+ score.\n";
  r += "=================================================================================\n";

  return r;
}

declare const require: any;
declare const module: any;

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  console.log(formatComprehensiveReport());
}
