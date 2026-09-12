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
import { validateDuplicatePost } from './validator';

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
function loadServiceAccount(): any {
  // 1. Base64 encoded JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.project_id) return parsed;
    } catch (e) {}
  }

  // 2. Direct string or file path in FIREBASE_SERVICE_ACCOUNT
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try { raw = JSON.parse(raw); } catch (e) {}
    }
    if (typeof raw === 'string' && raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.project_id) return parsed;
      } catch (e) {}
    } else if (typeof raw === 'string' && fs.existsSync(raw)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(raw, 'utf8'));
        if (parsed && parsed.project_id) return parsed;
      } catch (e) {}
    }
  }

  // 3. Known file paths
  const candidatePaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.resolve(__dirname, '.credentials/lorapok-labs-sa.json'),
    path.resolve(__dirname, 'agent/.credentials/lorapok-labs-sa.json'),
    path.resolve(__dirname, '../agent/.credentials/lorapok-labs-sa.json'),
    path.resolve(__dirname, '../.credentials/lorapok-labs-sa.json'),
    '/app/.credentials/lorapok-labs-sa.json'
  ].filter(Boolean) as string[];

  for (const cp of candidatePaths) {
    if (fs.existsSync(cp)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(cp, 'utf8'));
        if (parsed && parsed.project_id) {
          console.log(`🔐 Loaded Firebase Service Account from: ${cp}`);
          return parsed;
        }
      } catch (e) {}
    }
  }
  return null;
}

const serviceAccount = loadServiceAccount();
let db: FirebaseFirestore.Firestore | null = null;

if (serviceAccount && serviceAccount.project_id) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    db = admin.firestore();
    console.log(`🔥 Connected to Cloud Firestore successfully (Project: ${serviceAccount.project_id}).`);
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin with service account:", err);
  }
} else {
  // Try Application Default Credentials fallback
  try {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    db = admin.firestore();
    console.log("🔥 Connected to Cloud Firestore via Application Default Credentials.");
  } catch {
    console.log("⚡ Standalone / Local mode active (Cloud Firestore not configured).");
  }
}

function updateFeedsLocally(posts: any[], baseDir: string) {
  try {
    const domain = 'https://lorapok.tech';
    const blogBaseUrl = `${domain}/blog`;
    const nowIso = new Date().toISOString().split('T')[0];

    // 1. Blog Sitemap
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemapXml += `  <url>\n    <loc>${blogBaseUrl}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    for (const p of posts) {
      if (!p.slug) continue;
      const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
      sitemapXml += `  <url>\n    <loc>${blogBaseUrl}/${p.slug}/</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    sitemapXml += `</urlset>\n`;
    fs.writeFileSync(path.join(baseDir, 'sitemap.xml'), sitemapXml, 'utf8');

    // 2. Root SEO Sitemap
    const rootDir = path.resolve(baseDir, '..');
    const coreRoutes = [
      { path: '', priority: '1.0', changefreq: 'weekly' },
      { path: 'projects', priority: '0.9', changefreq: 'weekly' },
      { path: 'agents', priority: '0.9', changefreq: 'weekly' },
      { path: 'blog', priority: '0.95', changefreq: 'hourly' },
      { path: 'team', priority: '0.8', changefreq: 'weekly' },
      { path: 'about', priority: '0.7', changefreq: 'monthly' },
      { path: 'changelog', priority: '0.6', changefreq: 'weekly' },
      { path: 'contact', priority: '0.5', changefreq: 'monthly' },
    ];
    let rootSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const route of coreRoutes) {
      const loc = route.path ? `${domain}/${route.path}` : `${domain}/`;
      rootSitemap += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    }
    for (const p of posts) {
      if (!p.slug) continue;
      const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
      rootSitemap += `  <url>\n    <loc>${blogBaseUrl}/${p.slug}/</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    rootSitemap += `</urlset>\n`;
    fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), rootSitemap, 'utf8');

    // 3. Blog RSS 2.0 Feed
    let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
    rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>${blogBaseUrl}</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n  <atom:link href="${blogBaseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
    for (const p of posts.slice(0, 30)) {
      if (!p.slug) continue;
      rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>${blogBaseUrl}/${p.slug}/</link>\n    <guid isPermaLink="true">${blogBaseUrl}/${p.slug}/</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt || p.title}]]></description>\n  </item>\n`;
    }
    rssXml += `</channel>\n</rss>\n`;
    fs.writeFileSync(path.join(baseDir, 'rss.xml'), rssXml, 'utf8');
    console.log("📁 Sitemaps (root & blog) and RSS feed regenerated at", baseDir);
  } catch (err) {
    console.warn("⚠️ Could not update feeds locally:", err);
  }
}

async function runAgent() {
  console.log("🚀 Starting LoLaBo Agent...");

  let config: any = {
    isEnabled: true,
    intervalHours: 0.25,
    lastRunAt: null,
    writingProvider: 'gemini',
    imageGenMode: 'ai',
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
        console.log("✅ Default agent config initialized in Firestore (15-minute publishing interval).");
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

  // 2. Check Interval or Manual Trigger (Default 15 minutes)
  let lastRun = new Date(0);
  if (config.lastRunAt && typeof config.lastRunAt.toDate === 'function') {
    lastRun = config.lastRunAt.toDate();
  } else if (config.lastRunAt) {
    lastRun = new Date(config.lastRunAt);
  }
  const now = new Date();
  const minutesSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60);
  const targetIntervalHours = typeof config.intervalHours === 'number' 
    ? config.intervalHours 
    : parseFloat(process.env.INTERVAL_HOURS || '0.25');
  const targetMinutes = targetIntervalHours * 60; // 15 minutes default
  const jitterThresholdMinutes = Math.max(12, targetMinutes * 0.8);
  const isManualTrigger = config.triggerRequested === true || process.env.FORCE_RUN === 'true' || isOnceFlag;

  if (minutesSinceLastRun < jitterThresholdMinutes && !process.env.FORCE_RUN && !isManualTrigger) {
    console.log(`⏳ Only ${minutesSinceLastRun.toFixed(1)}m since last run. Interval target is ${targetMinutes.toFixed(1)}m (jitter threshold: ${jitterThresholdMinutes.toFixed(1)}m). Skipping.`);
    return;
  }

  if (isManualTrigger) {
    console.log("⚡ Manual trigger detected (--once / triggerRequested / FORCE_RUN). Bypassing interval check.");
  } else {
    console.log(`⏱️ 15-minute cycle triggered (${minutesSinceLastRun.toFixed(1)}m elapsed >= ${jitterThresholdMinutes.toFixed(1)}m threshold). Generating post...`);
  }

  try {
    // 0. Load active catalog for anti-duplication baseline
    const postsJsonPath = process.env.POSTS_JSON_PATH || path.resolve(__dirname, '../public/blog/posts.json');
    let currentPosts: any[] = [];
    try {
      if (fs.existsSync(postsJsonPath)) {
        currentPosts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
      }
    } catch (err) {}

    // 3. News Collection (with catalog duplicate exclusion)
    const news = await collectNews(currentPosts);
    if (news.length === 0) throw new Error("No news collected.");

    // 4. Content Generation (with model tiering: 3.8 Flash for Blogs, 3.8/3.1 Pro for Research)
    const isResearchMode = config.isResearchMode === true || 
      config.writingProvider === 'gemini-pro' || 
      config.writingProvider === 'gemini-3.8-pro' || 
      config.writingProvider === 'gemini-3.1-pro' ||
      (config.category && ['Architecture', 'AI & Machine Learning', 'Security'].includes(config.category));

    const blogPost = await writeBlogPost(news, {
      provider: config.writingProvider || (isResearchMode ? 'gemini-3.8-pro' : 'gemini-3.8-flash'),
      targetAudience: config.targetAudience || 'Developers & Systems Architects',
      tone: config.tone || (isResearchMode ? 'Rigorous academic systems engineering' : 'Technical & precise'),
      isResearch: isResearchMode
    }, currentPosts);

    if (blogPost.peerReview) {
      console.log(`🎓 [LoLaBo Review Verdict] Decision: ${blogPost.peerReview.decision} (Score: ${blogPost.peerReview.score}/100 by ${blogPost.peerReview.reviewedBy})`);
    }

    // 5. Generate Slug
    blogPost.slug = blogPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 6. Duplicate Post Validation Barrier
    const validation = validateDuplicatePost({
      title: blogPost.title,
      slug: blogPost.slug
    }, currentPosts);

    if (validation.isDuplicate) {
      console.warn(`🛑 [LoLaBo Duplicate Rejection] Candidate article rejected: ${validation.reason}`);
      const isForced = process.argv.includes('--force') || process.env.FORCE_RUN === 'true';
      if (!isForced) {
        console.log("⏸️ Skipping publication to preserve catalog uniqueness. Run with --force to override.");
        return;
      }
      console.log("⚠️ Force flag detected: Proceeding with publication despite duplicate detection.");
    }

    // 7. Online AI Image Generation (Preserves multi-image suite if generated by writer)
    if (!blogPost.coverImage) {
      blogPost.coverImage = await generateCoverImage(
        blogPost.title,
        blogPost.tags,
        config.imageGenMode || 'ai',
        blogPost.category,
        blogPost.imageKeywords || [],
        blogPost.imagePrompt,
        currentPosts
      );
    }

    // 8. Deterministic Dual-Tier Persistence (Cloud Firestore + Local Filesystem)
    const docId = blogPost.slug;
    const newPost = {
      id: docId,
      ...blogPost,
      status: 'published',
      publishedAt: new Date().toISOString()
    };

    if (db) {
      console.log(`📝 [Cloud Firestore] Publishing post idempotently to Firestore: ${blogPost.title} (doc: ${docId})`);
      await db.collection('blog_posts').doc(docId).set({
        ...newPost,
        id: docId
      }, { merge: true });
      console.log(`✅ [Cloud Firestore] Post committed with deterministic document ID: ${docId}`);

      await db.collection('agent_config').doc('lolabo_settings').update({
        lastRunAt: admin.firestore.Timestamp.now(),
        triggerRequested: false
      }).catch(() => {});
    }

    // Always persist to local catalog as well
    console.log(`📝 [Local Catalog] Persisting post: ${blogPost.title}`);
    const updatedPosts = [newPost, ...currentPosts.filter((p: any) => p.slug !== blogPost.slug)];
    const dir = path.dirname(postsJsonPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(postsJsonPath, JSON.stringify(updatedPosts, null, 2), 'utf8');
    console.log(`✅ Post persisted locally to ${postsJsonPath} (${updatedPosts.length} total posts)`);

    // Update sitemaps & RSS feed
    updateFeedsLocally(updatedPosts, dir);

    // 9. Synchronized Social Distribution (Staged for live verification)
    const webhookUrl = config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
    const pendingBroadcastPath = path.resolve(__dirname, '.pending-broadcast.json');
    const isBroadcastNow = process.argv.includes('--broadcast-now');

    if (webhookUrl && webhookUrl.trim()) {
      if (isBroadcastNow) {
        console.log("📢 Immediate broadcast requested (--broadcast-now)...");
        await distributeSocially(newPost, config.enabledSocials || ['discord'], webhookUrl);
      } else {
        console.log("📋 Staging post for synchronized live broadcast (.pending-broadcast.json)...");
        fs.writeFileSync(pendingBroadcastPath, JSON.stringify({
          slug: newPost.slug,
          title: newPost.title,
          post: newPost,
          enabledSocials: config.enabledSocials || ['discord'],
          stagedAt: new Date().toISOString()
        }, null, 2), 'utf8');
        console.log(`✅ Post staged for broadcast after production deployment is confirmed live (HTTP 200).`);
      }
    } else {
      console.log("ℹ️ [Discord Broadcast] Skipped: No DISCORD_WEBHOOK_URL configured in environment or Firestore.");
    }

    console.log("🎉 LoLaBo Agent run completed successfully!");
  } catch (e) {
    console.error("💥 LoLaBo Agent failed:", e);
    process.exit(1);
  }
}

runAgent();
