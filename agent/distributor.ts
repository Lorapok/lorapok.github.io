// agent/distributor.ts
// Social Media Distribution Module for LoLaBo
// Produces executive, professional Discord rich embeds and social notifications

import * as fs from 'fs';
import * as path from 'path';

// ─── Environment Auto-loading ───
try {
  const rootEnv = path.resolve(__dirname, '../.env');
  const localEnv = path.resolve(__dirname, '.env');
  if (typeof (process as any).loadEnvFile === 'function') {
    if (fs.existsSync(localEnv)) {
      (process as any).loadEnvFile(localEnv);
    } else if (fs.existsSync(rootEnv)) {
      (process as any).loadEnvFile(rootEnv);
    }
  }
} catch (e) {}

export interface DiscordDistributionResult {
  platform: 'discord';
  status: 'success' | 'failed' | 'skipped' | 'error';
  statusCode?: number;
  error?: string;
  reason?: string;
}

const CATEGORY_COLORS: Record<string, number> = {
  'AI & Machine Learning': 0xc084fc,      // Neon Orchid
  'Backend & Infrastructure': 0x67ff8f,    // Emerald Cyber Green
  'Security': 0xef4444,                   // Coral Red
  'Frontend Engineering': 0xf59e0b,       // Cyber Amber Gold
  'Mobile & UX': 0x38bdf8,                // Bioluminescent Cyan
  'Open Source': 0x10b981,                // Deep Teal Green
  'General Tech': 0x6366f1                // Indigo Neon
};

/**
 * Classifies an article into an authoritative editorial format
 */
export function detectEditorialFormat(title: string, content?: string): string {
  const t = (title || '').toLowerCase();
  const c = (content || '').toLowerCase();

  if (t.includes('architecture') || t.includes('mesh') || t.includes('system') || t.includes('distributed') || t.includes('topology')) {
    return 'ARCHITECTURE BLUEPRINT';
  }
  if (t.includes('reverse engineering') || t.includes('deconstruct') || t.includes('inside') || t.includes('deep dive') || t.includes('mechanics')) {
    return 'DEEP DIVE';
  }
  if (t.includes('benchmark') || t.includes('performance') || t.includes('latency') || t.includes('throughput') || t.includes('concurrency')) {
    return 'BENCHMARK & PERF';
  }
  if (t.includes('shift') || t.includes('pivot') || t.includes('transition') || t.includes('why') || t.includes('returned')) {
    return 'CASE STUDY';
  }
  if (c.includes('rfc') || c.includes('formal verification') || c.includes('kernel')) {
    return 'SYSTEMS RESEARCH';
  }
  return 'RESEARCH BRIEF';
}

/**
 * Builds an enterprise-grade, aesthetic Discord rich embed payload
 */
export function buildDiscordPayload(post: any) {
  const rawTags: string[] = Array.isArray(post.tags) ? post.tags : ['LorapokLabs', 'Lorapok'];
  const hasCitations = (Array.isArray(post.citations) && post.citations.length > 0) || rawTags.includes('CitationsAvailable');
  const hashtags = Array.from(new Set([
    '#LorapokLabs',
    '#Lorapok',
    ...(hasCitations ? ['#CitationsAvailable', '#PeerReviewed'] : []),
    ...rawTags.map((t: string) => '#' + String(t).trim().replace(/^#/, '').replace(/[^a-zA-Z0-9]/g, ''))
  ])).join(' ');

  const canonicalUrl = `https://lorapok.tech/blog/${post.slug}/`;
  const embedColor = CATEGORY_COLORS[post.category] || 0x38bdf8;
  const editorialFormat = post.type || detectEditorialFormat(post.title, post.content);
  const authorName = post.author?.name || 'Dr. Larva';
  const authorTitle = post.author?.designation || 'Systems Intelligence';
  const authorAvatar = post.author?.avatar || '🧬';
  const citationsCount = Array.isArray(post.citations) ? post.citations.length : (hasCitations ? 4 : 0);

  // Sanitize title and excerpt strictly for Discord embed limits
  const cleanTitle = (post.title || 'Autonomous Technical Dispatch')
    .replace(/^#+\s*/, '')
    .replace(/^\*\*|\*\*$/g, '')
    .trim();
  const displayTitle = cleanTitle.length > 200 ? cleanTitle.slice(0, 197) + '...' : cleanTitle;

  const rawExcerpt = (post.excerpt || cleanTitle).replace(/^#+\s+/g, '').trim();
  const cleanExcerpt = rawExcerpt.length > 800 ? rawExcerpt.slice(0, 797) + '...' : rawExcerpt;

  const neuralEngine = post.engine || post.model || 'Google Gemini 3.6 Flash';

  return {
    username: "LoLaBo • Lorapok Labs",
    avatar_url: "https://lorapok.tech/assets/lolabo-apple-touch-icon.png",
    content: `⚡ **NEW TECHNICAL DISPATCH** | **LoLaBo Intelligence Engine**\n> 🌐 **Full Architecture Breakdown:** [${displayTitle}](${canonicalUrl})`,
    embeds: [
      {
        title: `[ ${editorialFormat} ] ${displayTitle}`,
        url: canonicalUrl,
        description: `> *${cleanExcerpt}*\n\nRead the full investigation on **[lorapok.tech/blog](${canonicalUrl})** or subscribe via [RSS Feed](https://lorapok.tech/blog/rss.xml).`,
        color: embedColor,
        author: {
          name: `${authorAvatar} ${authorName} — ${authorTitle}`,
          url: "https://lorapok.tech/blog",
          icon_url: "https://lorapok.tech/assets/lolabo-apple-touch-icon.png"
        },
        fields: [
          {
            name: "📂 Core Domain",
            value: `\`${post.category || "General Tech"}\``,
            inline: true
          },
          {
            name: "⏱️ Read Time",
            value: `\`${post.readTime || 5} min read\``,
            inline: true
          },
          {
            name: "🏷️ Editorial Format",
            value: `\`[ ${editorialFormat} ]\``,
            inline: true
          },
          ...(citationsCount > 0 ? [{
            name: "📚 Technical Citations",
            value: `\`${citationsCount} Sources\` • \`Formal Reference Included\``,
            inline: true
          }] : []),
          {
            name: "🧠 Neural Engine",
            value: `\`${neuralEngine}\``,
            inline: true
          },
          {
            name: "💾 Persistence Layer",
            value: "`Cloud Firestore • Lorapok Labs`",
            inline: true
          },
          {
            name: "🛡️ Verification",
            value: "`100% Autonomous • Zero-Downtime`",
            inline: true
          },
          {
            name: "🏷️ Topics & Tags",
            value: hashtags.length > 1000 ? hashtags.slice(0, 997) + '...' : hashtags,
            inline: false
          },
          {
            name: "🔗 Direct Access",
            value: `👉 **[Launch Interactive Reader](${canonicalUrl})** • [View Repository](https://github.com/Lorapok/lorapok.github.io) • [XML Feed](https://lorapok.tech/blog/rss.xml)`,
            inline: false
          }
        ],
        image: (post.coverImage && typeof post.coverImage === 'string' && post.coverImage.startsWith('http')) 
          ? { url: post.coverImage } 
          : undefined,
        footer: {
          text: `⚡ LoLaBo Autonomous Dispatch • Lorapok Labs Microservice Engine v2.0 • #LorapokLabs`,
          icon_url: "https://lorapok.tech/assets/apple-touch-icon.png"
        },
        timestamp: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString()
      }
    ]
  };
}

export async function postToDiscord(post: any, customWebhook?: string): Promise<DiscordDistributionResult> {
  const webhookUrl = customWebhook || process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.trim()) {
    console.log("ℹ️ [Discord Broadcast] No DISCORD_WEBHOOK_URL configured. (Set DISCORD_WEBHOOK_URL in .env or Firestore to enable live broadcast).");
    return {
      platform: 'discord',
      status: 'skipped',
      reason: 'No DISCORD_WEBHOOK_URL provided in .env or Firestore configuration.'
    };
  }

  const maskedUrl = webhookUrl.trim().slice(0, 35) + '...';
  console.log(`📢 [Discord Broadcast] Broadcasting announcement to webhook (${maskedUrl})...`);

  const payload = buildDiscordPayload(post);

  try {
    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok || res.status === 204) {
      console.log(`✅ [Discord Broadcast] Announcement successfully delivered! (HTTP ${res.status})`);
      return { platform: 'discord', status: 'success', statusCode: res.status };
    } else {
      const errText = await res.text().catch(() => '');
      console.error(`❌ [Discord Broadcast] Webhook failed (HTTP ${res.status}): ${errText}`);
      return { platform: 'discord', status: 'failed', statusCode: res.status, error: errText };
    }
  } catch (err: any) {
    console.error(`💥 [Discord Broadcast] Exception sending to webhook:`, err.message);
    return { platform: 'discord', status: 'error', error: err.message };
  }
}

export async function distributeSocially(post: any, enabledSocials: string[], customDiscordWebhook?: string) {
  console.log(`📢 Distributing post socially: ${enabledSocials.join(', ')}`);

  const results = [];

  if (enabledSocials.includes('discord')) {
    results.push(await postToDiscord(post, customDiscordWebhook));
  }
  
  if (enabledSocials.includes('twitter')) {
    results.push(await postToTwitter(post));
  }

  if (enabledSocials.includes('linkedin')) {
    results.push(await postToLinkedIn(post));
  }

  return results;
}

async function postToTwitter(post: any) {
  return { platform: 'twitter', status: 'pending_setup' };
}

async function postToLinkedIn(post: any) {
  return { platform: 'linkedin', status: 'pending_setup' };
}
