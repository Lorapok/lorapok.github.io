// agent/capacity.ts
// LoLaBo Hourly Post Capacity & AI Model Throughput Analyzer
// Mathematical and operational breakdown of post generation capacity using Google's best AI models

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
}

export interface InfrastructureConstraints {
  githubActionsFreeMinutes: number; // 2000 mins/month
  averageRunDurationSeconds: number; // ~75 seconds
  maxHourlyRunsUnderFreeTier: number;
  discordWebhookLimitRpm: number; // 30 req/min
  optimalRecommendedCadence: string;
}

export const GOOGLE_AI_PROFILES: Record<string, ModelCapacityProfile> = {
  'gemini-2.5-flash-free': {
    modelName: 'Google Gemini 2.5 Flash',
    provider: 'Google AI Studio',
    role: 'Ultra-fast Frontier Research & Synthesis',
    tier: 'Free',
    rateLimits: {
      rpm: 15,
      rpd: 1500,
      tpm: 1000000
    },
    tokenBudgetPerPost: {
      inputTokens: 2500,
      outputTokens: 4000,
      totalTokens: 6500
    },
    latencySeconds: {
      average: 12,
      p95: 22
    },
    hourlyCapacity: {
      sustainedPostsPerHour: 62.5, // 1500 RPD / 24h
      burstPostsPerHour: 150,     // Limited by 15 RPM & latency
      limitingFactor: 'Daily Free Quota (1,500 RPD)'
    }
  },

  'gemini-2.5-flash-paid': {
    modelName: 'Google Gemini 2.5 Flash',
    provider: 'Google AI Studio / Vertex AI',
    role: 'Ultra-fast Frontier Research & Synthesis (Scale)',
    tier: 'Pay-As-You-Go',
    rateLimits: {
      rpm: 1000,
      rpd: 50000,
      tpm: 4000000
    },
    tokenBudgetPerPost: {
      inputTokens: 2500,
      outputTokens: 4000,
      totalTokens: 6500
    },
    latencySeconds: {
      average: 12,
      p95: 22
    },
    hourlyCapacity: {
      sustainedPostsPerHour: 300, // Concurrently 1000+
      burstPostsPerHour: 1000,
      limitingFactor: 'Downstream Git commit & page build latency'
    }
  },

  'gemini-2.5-pro-free': {
    modelName: 'Google Gemini 2.5 Pro',
    provider: 'Google AI Studio',
    role: 'Premier Deep-Reasoning Research Treatises',
    tier: 'Free',
    rateLimits: {
      rpm: 2,
      rpd: 50,
      tpm: 32000
    },
    tokenBudgetPerPost: {
      inputTokens: 3000,
      outputTokens: 4500,
      totalTokens: 7500
    },
    latencySeconds: {
      average: 28,
      p95: 45
    },
    hourlyCapacity: {
      sustainedPostsPerHour: 2.08, // 50 RPD / 24h
      burstPostsPerHour: 2.0,     // 2 RPM max
      limitingFactor: 'Free Tier Daily Quota (50 RPD) & RPM (2 RPM)'
    }
  },

  'gemini-2.5-pro-paid': {
    modelName: 'Google Gemini 2.5 Pro',
    provider: 'Google AI Studio / Vertex AI',
    role: 'Premier Deep-Reasoning Research Treatises (Scale)',
    tier: 'Pay-As-You-Go',
    rateLimits: {
      rpm: 360,
      rpd: 10000,
      tpm: 2000000
    },
    tokenBudgetPerPost: {
      inputTokens: 3000,
      outputTokens: 4500,
      totalTokens: 7500
    },
    latencySeconds: {
      average: 28,
      p95: 45
    },
    hourlyCapacity: {
      sustainedPostsPerHour: 120, // Sequential execution: 3600s / 28s = 128
      burstPostsPerHour: 360,
      limitingFactor: 'Generation Latency (~28s per 2,500-word treatise)'
    }
  },

  'imagen-3-pollinations-flux': {
    modelName: 'Google Imagen 3 & Pollinations Flux',
    provider: 'Vertex AI / Pollinations Distributed GPU',
    role: 'Photorealistic Domain-Accurate Architecture Visuals',
    tier: 'Free',
    rateLimits: {
      rpm: 20,
      rpd: 2000,
      tpm: 0
    },
    tokenBudgetPerPost: {
      inputTokens: 120,
      outputTokens: 0,
      totalTokens: 120
    },
    latencySeconds: {
      average: 6,
      p95: 14
    },
    hourlyCapacity: {
      sustainedPostsPerHour: 80,
      burstPostsPerHour: 120,
      limitingFactor: 'Diffusion Step Computation & Network Delivery'
    }
  }
};

export const INFRASTRUCTURE_GUARDRAILS: InfrastructureConstraints = {
  githubActionsFreeMinutes: 2000,
  averageRunDurationSeconds: 75,
  maxHourlyRunsUnderFreeTier: 1.1,
  discordWebhookLimitRpm: 30,
  optimalRecommendedCadence: '1 post every 1 hour (24 comprehensive research treatises per day)'
};

/**
 * Calculates theoretical and safe hourly capacity based on chosen model and execution mode
 */
export function calculateHourlyCapacity(modelKey: keyof typeof GOOGLE_AI_PROFILES) {
  const profile = GOOGLE_AI_PROFILES[modelKey] || GOOGLE_AI_PROFILES['gemini-2.5-flash-free'];
  
  const dailyCapacity = profile.rateLimits.rpd;
  const sustainedHourly = profile.hourlyCapacity.sustainedPostsPerHour;
  const safeRecommendedHourly = Math.min(2, Math.floor(sustainedHourly));

  return {
    model: profile.modelName,
    tier: profile.tier,
    sustainedPostsPerHour: sustainedHourly,
    safeRecommendedHourly,
    dailyTotalPosts: Math.min(dailyCapacity, sustainedHourly * 24),
    tokensPerHour: sustainedHourly * profile.tokenBudgetPerPost.totalTokens,
    limitingFactor: profile.hourlyCapacity.limitingFactor,
    githubActionsMonthlyMinutesUsed: sustainedHourly * 24 * 30 * (INFRASTRUCTURE_GUARDRAILS.averageRunDurationSeconds / 60)
  };
}

/**
 * Generates a human-readable CLI/diagnostic report of hourly capabilities
 */
export function formatCapacityReport(): string {
  let report = "=================================================================\n";
  report += "  LoLaBo Autonomous Engine — Hourly Post Capacity Analysis\n";
  report += "  Evaluated with Google's Best AI Models & State-of-the-Art Visuals\n";
  report += "=================================================================\n\n";

  for (const [key, profile] of Object.entries(GOOGLE_AI_PROFILES)) {
    report += `Model: ${profile.modelName} (${profile.tier})\n`;
    report += `  • Role: ${profile.role}\n`;
    report += `  • Rate Limits: ${profile.rateLimits.rpm} RPM | ${profile.rateLimits.rpd} RPD | ${profile.rateLimits.tpm.toLocaleString()} TPM\n`;
    report += `  • Average Word & Token Load: ~2,500 words (${profile.tokenBudgetPerPost.totalTokens.toLocaleString()} tokens/post)\n`;
    report += `  • Generation Latency: ~${profile.latencySeconds.average}s\n`;
    report += `  • Sustained Hourly Capacity: ${profile.hourlyCapacity.sustainedPostsPerHour} posts/hour\n`;
    report += `  • Limiting Factor: ${profile.hourlyCapacity.limitingFactor}\n\n`;
  }

  report += "-----------------------------------------------------------------\n";
  report += "PRACTICAL INFRASTRUCTURE & PUBLISHING RECOMMENDATIONS:\n";
  report += `1. Google Gemini 2.5 Flash Free Tier:\n`;
  report += `   - Pure API Limit: Up to 62.5 posts/hour (1,500 posts/day).\n`;
  report += `   - Recommended Cadence: 1 to 2 posts/hour (24–48 papers/day).\n\n`;
  report += `2. Google Gemini 2.5 Pro Free Tier:\n`;
  report += `   - Pure API Limit: 2 posts/hour (50 posts/day maximum daily limit).\n`;
  report += `   - Recommended Cadence: 1 post/hour (24 flagship research papers/day).\n\n`;
  report += `3. GitHub Actions CI Constraint (Free Tier: 2,000 mins/mo):\n`;
  report += `   - 1 run/hr = 720 runs/mo (~900 build mins) -> 45% quota utilization (SAFE & FREE).\n`;
  report += `   - 2 runs/hr = 1,440 runs/mo (~1,800 build mins) -> 90% quota utilization (FREE).\n`;
  report += `   - 3+ runs/hr -> Requires batching or dedicated container runner.\n\n`;
  report += `4. Discord Notification Sweet Spot:\n`;
  report += `   - 1 post/hour maintains peak subscriber engagement without alert fatigue.\n`;
  report += "=================================================================\n";

  return report;
}

declare const require: any;
declare const module: any;

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  console.log(formatCapacityReport());
}
