// agent/index.ts
// LoLaBo Orchestrator Script
// Designed to run in GitHub Actions environment or local standalone microservice mode

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';
import { collectNews } from './collector';
import { writeBlogPost } from './writer';
import { generateCoverImage } from './imageGen';
import { distributeSocially } from './distributor';

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

// ─── Firebase Initialization ───
let serviceAccount: any = {};
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} catch (err) {
  console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
}

let db: FirebaseFirestore.Firestore | null = null;
if (serviceAccount && serviceAccount.project_id) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    db = admin.firestore();
    console.log("🔥 Connected to Firebase Firestore successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin:", err);
  }
} else {
  console.log("⚡ Standalone / Local mode active (no remote FIREBASE_SERVICE_ACCOUNT configured).");
}

function updateFeedsLocally(posts: any[], baseDir: string) {
  try {
    const nowIso = new Date().toISOString().split('T')[0];
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    for (const p of posts) {
      if (!p.slug) continue;
      const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
      sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    sitemapXml += `</urlset>\n`;
    fs.writeFileSync(path.join(baseDir, 'sitemap.xml'), sitemapXml, 'utf8');

    let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
    rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>https://lorapok.tech/blog</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
    for (const p of posts.slice(0, 20)) {
      if (!p.slug) continue;
      rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>https://lorapok.tech/blog/${p.slug}</link>\n    <guid>https://lorapok.tech/blog/${p.slug}</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt}]]></description>\n  </item>\n`;
    }
    rssXml += `</channel>\n</rss>\n`;
    fs.writeFileSync(path.join(baseDir, 'rss.xml'), rssXml, 'utf8');
    console.log("📁 Sitemaps and RSS feed regenerated at", baseDir);
  } catch (err) {
    console.warn("⚠️ Could not update feeds locally:", err);
  }
}

async function runAgent() {
  console.log("🚀 Starting LoLaBo Agent...");

  let config: any = {
    isEnabled: true,
    intervalHours: 1,
    lastRunAt: null,
    writingProvider: 'gemini',
    imageGenMode: 'auto',
    enabledSocials: ['discord'],
    targetAudience: 'Developers & Engineers',
    tone: 'Technical & precise',
    triggerRequested: true,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL
  };

  // 1. Fetch Config if Firestore is available
  if (db) {
    try {
      const configDoc = await db.collection('agent_config').doc('lolabo_settings').get();
      if (configDoc.exists) {
        config = { ...config, ...configDoc.data() };
      } else {
        await db.collection('agent_config').doc('lolabo_settings').set(config);
        console.log("✅ Default agent config initialized in Firestore (1-hour publishing interval).");
      }
    } catch (err) {
      console.warn("⚠️ Could not read remote Firestore config:", err);
    }
  }

  const isOnceFlag = process.argv.includes('--once') || process.argv.includes('--force');
  if (!config.isEnabled && !process.env.FORCE_RUN && !isOnceFlag) {
    console.log("⏸️ Agent is currently disabled. Skipping run.");
    return;
  }

  // 2. Check Interval or Manual Trigger
  let lastRun = new Date(0);
  if (config.lastRunAt && typeof config.lastRunAt.toDate === 'function') {
    lastRun = config.lastRunAt.toDate();
  } else if (config.lastRunAt) {
    lastRun = new Date(config.lastRunAt);
  }
  const now = new Date();
  const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
  const targetInterval = typeof config.intervalHours === 'number' ? config.intervalHours : 1;
  const jitterThreshold = Math.max(0.75, targetInterval * 0.85);
  const isManualTrigger = config.triggerRequested === true || process.env.FORCE_RUN === 'true' || isOnceFlag;

  if (hoursSinceLastRun < jitterThreshold && !process.env.FORCE_RUN && !isManualTrigger) {
    console.log(`⏳ Only ${hoursSinceLastRun.toFixed(2)}h since last run. Interval target is ${targetInterval}h (jitter threshold: ${jitterThreshold.toFixed(2)}h). Skipping.`);
    return;
  }

  if (isManualTrigger) {
    console.log("⚡ Manual trigger detected (--once / triggerRequested). Bypassing interval check.");
  } else {
    console.log(`⏱️ Hourly cycle triggered (${hoursSinceLastRun.toFixed(2)}h elapsed >= ${jitterThreshold.toFixed(2)}h threshold). Generating post...`);
  }

  try {
    // 3. News Collection
    const news = await collectNews();
    if (news.length === 0) throw new Error("No news collected.");

    // 4. Content Generation
    const blogPost = await writeBlogPost(news, {
      provider: config.writingProvider || 'gemini',
      targetAudience: config.targetAudience || 'Developers',
      tone: config.tone || 'Technical'
    });

    // 5. Image Generation (Distinct, topic-relevant editorial cover)
    blogPost.coverImage = await generateCoverImage(
      blogPost.title,
      blogPost.tags,
      config.imageGenMode || 'auto',
      blogPost.category,
      blogPost.imageKeywords || [],
      blogPost.imagePrompt
    );

    // 6. Generate Slug
    blogPost.slug = blogPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 7. Save to Firestore or local filesystem
    const postsJsonPath = path.resolve(__dirname, '../public/blog/posts.json');
    if (db) {
      console.log(`📝 Publishing post to Firestore: ${blogPost.title}`);
      const postRef = await db.collection('blog_posts').add(blogPost);
      console.log(`✅ Post saved to Firestore with ID: ${postRef.id}`);

      await db.collection('agent_config').doc('lolabo_settings').update({
        lastRunAt: admin.firestore.Timestamp.now(),
        triggerRequested: false
      }).catch(() => {});
    } else {
      console.log(`📝 [Local Standalone] Publishing post to local catalog: ${blogPost.title}`);
      let currentPosts: any[] = [];
      try {
        if (fs.existsSync(postsJsonPath)) {
          currentPosts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
        }
      } catch (err) {}

      const newPost = {
        id: 'local-' + Date.now(),
        ...blogPost,
        publishedAt: new Date().toISOString()
      };
      const updatedPosts = [newPost, ...currentPosts.filter((p: any) => p.slug !== blogPost.slug)];
      const dir = path.dirname(postsJsonPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(postsJsonPath, JSON.stringify(updatedPosts, null, 2), 'utf8');
      console.log(`✅ Post persisted locally to ${postsJsonPath} (${updatedPosts.length} total posts)`);

      // Update sitemaps & RSS feed
      updateFeedsLocally(updatedPosts, dir);
    }

    // 8. Social Distribution
    const webhookUrl = config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      await distributeSocially(blogPost, config.enabledSocials || ['discord'], webhookUrl);
    }

    console.log("🎉 LoLaBo Agent run completed successfully!");
  } catch (e) {
    console.error("💥 LoLaBo Agent failed:", e);
    process.exit(1);
  }
}

runAgent();
