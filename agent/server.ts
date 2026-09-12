// agent/server.ts
// LoLaBo Autonomous Content & Intelligence Microservice
// High-performance, self-contained HTTP microservice with RESTful API & daemon scheduler

import * as http from 'http';
import * as url from 'url';
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

// ─── Environment & Config ───
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';
const SERVICE_TOKEN = process.env.LOLABO_API_KEY || process.env.SERVICE_TOKEN || '';
const POSTS_JSON_PATH = process.env.POSTS_JSON_PATH || path.resolve(__dirname, '../public/blog/posts.json');

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

async function syncDatabaseOnStartup() {
  if (!db) return;
  try {
    const snap = await db.collection('blog_posts').limit(1).get();
    if (snap.empty) {
      console.log("📦 Cloud Firestore collection 'blog_posts' is empty. Seeding from local catalog...");
      const localPosts = getCachedPosts();
      if (localPosts.length > 0) {
        const batch = db.batch();
        for (const p of localPosts) {
          const docId = p.id || ('local-' + (p.slug || Math.random().toString(36).substring(7)));
          const docRef = db.collection('blog_posts').doc(docId);
          batch.set(docRef, {
            ...p,
            id: docId,
            publishedAt: p.publishedAt || new Date().toISOString()
          });
        }
        await batch.commit();
        console.log(`✅ Successfully seeded ${localPosts.length} posts into Cloud Firestore.`);
      }
    } else {
      console.log("🔥 Cloud Firestore collection 'blog_posts' is active and synchronized.");
    }
  } catch (err: any) {
    console.warn("⚠️ Cloud Firestore startup sync notice:", err.message);
  }
}

// ─── Microservice State & Telemetry ───
interface MicroserviceTelemetry {
  service: string;
  version: string;
  startTime: string;
  lastDispatchAt: string | null;
  lastDispatchStatus: string;
  lastError: string | null;
  totalDispatches: number;
  isDispatching: boolean;
  daemonActive: boolean;
  intervalHours: number;
  nextScheduledDispatch: string | null;
}

const telemetry: MicroserviceTelemetry = {
  service: "lolabo-microservice",
  version: "2.0.0",
  startTime: new Date().toISOString(),
  lastDispatchAt: null,
  lastDispatchStatus: "idle",
  lastError: null,
  totalDispatches: 0,
  isDispatching: false,
  daemonActive: false,
  intervalHours: 1,
  nextScheduledDispatch: null,
};

// ─── Helper Functions ───
function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
    'Content-Length': Buffer.byteLength(body),
    'X-Service': 'LoLaBo-Microservice/2.0'
  });
  res.end(body);
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function checkAuth(req: http.IncomingMessage, reqUrl: URL): boolean {
  if (!SERVICE_TOKEN) return true; // Open if no token configured
  const authHeader = req.headers['authorization'] || '';
  const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const apiKey = (req.headers['x-api-key'] as string) || (reqUrl.searchParams.get('token') as string) || '';
  return bearerToken === SERVICE_TOKEN || apiKey === SERVICE_TOKEN;
}

function getCachedPosts(): any[] {
  try {
    if (fs.existsSync(POSTS_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(POSTS_JSON_PATH, 'utf8'));
    }
  } catch (err) {
    console.warn("⚠️ Could not read posts.json cache:", err);
  }
  return [];
}

async function getActivePosts(): Promise<any[]> {
  if (db) {
    try {
      const snap = await db.collection('blog_posts').orderBy('publishedAt', 'desc').limit(100).get();
      if (!snap.empty) {
        return snap.docs.map(d => {
          const data = d.data();
          let pDate = data.publishedAt;
          if (pDate && typeof pDate.toDate === 'function') {
            pDate = pDate.toDate().toISOString();
          } else if (pDate) {
            pDate = new Date(pDate).toISOString();
          }
          return { id: d.id, ...data, publishedAt: pDate };
        });
      }
    } catch (err) {
      console.warn("⚠️ Error fetching active posts from Firestore, falling back to cache:", err);
    }
  }
  return getCachedPosts();
}

// ─── Export Data Helper ───
async function exportStaticData(): Promise<number> {
  let posts: any[] = [];

  if (db) {
    try {
      const snap = await db.collection('blog_posts').get();
      if (!snap.empty) {
        posts = snap.docs.map(d => {
          const data = d.data();
          let publishedAtStr = new Date().toISOString();
          if (data.publishedAt && typeof data.publishedAt.toDate === 'function') {
            publishedAtStr = data.publishedAt.toDate().toISOString();
          } else if (data.publishedAt) {
            publishedAtStr = new Date(data.publishedAt).toISOString();
          }
          return { id: d.id, ...data, publishedAt: publishedAtStr };
        });

        posts = posts
          .filter((p: any) => p.status === 'published')
          .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        const dir = path.dirname(POSTS_JSON_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(posts, null, 2), 'utf8');
      } else {
        posts = getCachedPosts();
      }
    } catch (dbErr) {
      console.warn("⚠️ Error fetching from Firestore for export, falling back to local posts:", dbErr);
      posts = getCachedPosts();
    }
  } else {
    posts = getCachedPosts();
  }

  // Regenerate XML Sitemaps and RSS
  const sitemapDir = path.dirname(POSTS_JSON_PATH);
  const nowIso = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  for (const p of (posts as any[])) {
    if (!p.slug) continue;
    const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
    sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  sitemapXml += `</urlset>\n`;
  fs.writeFileSync(path.join(sitemapDir, 'sitemap.xml'), sitemapXml, 'utf8');

  let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
  rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>https://lorapok.tech/blog</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
  for (const p of (posts as any[]).slice(0, 20)) {
    if (!p.slug) continue;
    rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>https://lorapok.tech/blog/${p.slug}</link>\n    <guid>https://lorapok.tech/blog/${p.slug}</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt}]]></description>\n  </item>\n`;
  }
  rssXml += `</channel>\n</rss>\n`;
  fs.writeFileSync(path.join(sitemapDir, 'rss.xml'), rssXml, 'utf8');

  return posts.length;
}

// ─── Autonomous Dispatch Pipeline ───
export async function executeDispatch(options: { force?: boolean; customTopic?: string } = {}): Promise<any> {
  if (telemetry.isDispatching) {
    throw new Error("Dispatch pipeline is currently active. Try again shortly.");
  }

  telemetry.isDispatching = true;
  telemetry.lastDispatchStatus = "in_progress";
  console.log("⚡ [LoLaBo Microservice] Executing autonomous dispatch cycle...");

  try {
    let config: any = {
      isEnabled: true,
      writingProvider: 'gemini',
      targetAudience: 'Developers & Systems Architects',
      tone: 'Technical, deep-dive & architectural',
      imageGenMode: 'ai',
      enabledSocials: ['discord'],
      discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL
    };

    if (db) {
      try {
        const configDoc = await db.collection('agent_config').doc('lolabo_settings').get();
        if (configDoc.exists) {
          config = { ...config, ...configDoc.data() };
        }
      } catch (e) {
        console.warn("⚠️ Could not fetch remote Firestore config; using environment fallback.");
      }
    }

    // 0. Load active catalog for anti-duplication baseline
    const currentPosts = await getActivePosts();

    // 1. Ingest News or use custom topic
    let news: any[] = [];
    if (options.customTopic) {
      news = [{
        title: options.customTopic,
        content: `In-depth architectural investigation into ${options.customTopic}`,
        url: 'https://lorapok.tech/blog',
        source: 'Microservice Trigger'
      }];
    } else {
      news = await collectNews(currentPosts);
    }

    if (!news || news.length === 0) {
      throw new Error("No upstream articles collected for synthesis.");
    }

    // 2. Synthesize Content
    console.log("✍️ Synthesizing blog post via Gemini model...");
    const blogPost = await writeBlogPost(news, {
      provider: config.writingProvider || 'gemini',
      targetAudience: config.targetAudience || 'Developers',
      tone: config.tone || 'Technical'
    }, currentPosts);

    // 3. Sluggify
    blogPost.slug = blogPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 4. Duplicate Validation Barrier
    const validation = validateDuplicatePost({
      title: blogPost.title,
      slug: blogPost.slug
    }, currentPosts);

    if (validation.isDuplicate) {
      console.warn(`🛑 [LoLaBo Duplicate Rejection] Candidate article rejected: ${validation.reason}`);
      if (!options.force) {
        telemetry.lastDispatchStatus = "skipped_duplicate";
        telemetry.lastDispatchAt = new Date().toISOString();
        return {
          success: false,
          duplicate: true,
          reason: validation.reason,
          title: blogPost.title,
          slug: blogPost.slug
        };
      } else {
        console.log("⚠️ Force flag active: Proceeding with publication despite duplicate detection.");
      }
    }

    // 5. Generate Editorial Visual (100% Online AI with Catalog Deduplication)
    console.log("🎨 Generating topic-relevant cover visual...");
    blogPost.coverImage = await generateCoverImage(
      blogPost.title,
      blogPost.tags,
      config.imageGenMode || 'ai',
      blogPost.category,
      blogPost.imageKeywords || [],
      blogPost.imagePrompt,
      currentPosts
    );

    // 6. Dual-Tier Persistence (Cloud Firestore + Local Filesystem)
    // Deterministic slug-based ID prevents duplicate document creations in Firestore
    const postId = blogPost.slug;
    const newPostEntry = {
      id: postId,
      ...blogPost,
      publishedAt: new Date().toISOString()
    };

    if (db) {
      try {
        console.log(`🔥 [Cloud Firestore] Persisting post idempotently to Firestore: ${blogPost.title} (doc: ${postId})`);
        await db.collection('blog_posts').doc(postId).set({
          ...blogPost,
          id: postId,
          publishedAt: newPostEntry.publishedAt
        }, { merge: true });

        await db.collection('agent_config').doc('lolabo_settings').set({
          lastRunAt: admin.firestore.Timestamp.now(),
          triggerRequested: false
        }, { merge: true }).catch(() => {});
        console.log(`✅ [Cloud Firestore] Document '${postId}' committed successfully.`);
      } catch (firestoreErr) {
        console.error("⚠️ [Cloud Firestore] Write error (relying on local store):", firestoreErr);
      }
    }

    // Always persist to local catalog as well (for dual-tier high-availability)
    console.log(`💾 [Local Microservice] Persisting post to local catalog: ${blogPost.title}`);
    const updatedPosts = [newPostEntry, ...currentPosts.filter((p: any) => p.slug !== blogPost.slug)];
    const dir = path.dirname(POSTS_JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(updatedPosts, null, 2), 'utf8');
    console.log(`✅ Post saved locally to ${POSTS_JSON_PATH} (${updatedPosts.length} total posts)`);

    // 7. Social Distribution (Discord)
    const webhookUrl = config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim()) {
      console.log("📢 Broadcasting to Discord webhook...");
      await distributeSocially(blogPost, ['discord'], webhookUrl);
    } else {
      console.log("ℹ️ [Discord Broadcast] Skipped: No DISCORD_WEBHOOK_URL configured. (Set DISCORD_WEBHOOK_URL in environment or Firestore).");
    }

    // 8. Update Static JSON & Sitemaps
    console.log("📁 Updating static posts.json and XML feeds...");
    await exportStaticData();

    // 9. Update Telemetry
    telemetry.lastDispatchAt = new Date().toISOString();
    telemetry.lastDispatchStatus = "success";
    telemetry.lastError = null;
    telemetry.totalDispatches++;

    console.log(`🎉 [LoLaBo Microservice] Dispatch completed: ${blogPost.title} (${postId})`);
    return {
      success: true,
      postId,
      title: blogPost.title,
      slug: blogPost.slug,
      type: blogPost.type,
      citationsCount: (blogPost.citations || []).length,
      coverImage: blogPost.coverImage,
      category: blogPost.category,
      publishedAt: telemetry.lastDispatchAt
    };

  } catch (err: any) {
    telemetry.lastDispatchStatus = "failed";
    telemetry.lastError = err.message || String(err);
    console.error("💥 [LoLaBo Microservice] Dispatch failed:", err);
    throw err;
  } finally {
    telemetry.isDispatching = false;
  }
}

// ─── Autonomous Daemon Scheduler ───
function startAutonomousDaemon(intervalHours = 1) {
  if (telemetry.daemonActive) return;
  telemetry.daemonActive = true;
  telemetry.intervalHours = intervalHours;
  const intervalMs = intervalHours * 60 * 60 * 1000;

  const scheduleNext = () => {
    const nextDate = new Date(Date.now() + intervalMs);
    telemetry.nextScheduledDispatch = nextDate.toISOString();
    console.log(`⏱️ [LoLaBo Daemon] Next dispatch scheduled for: ${telemetry.nextScheduledDispatch}`);
  };

  scheduleNext();

  setInterval(async () => {
    console.log(`⏰ [LoLaBo Daemon] Triggering scheduled hourly dispatch cycle...`);
    try {
      await executeDispatch();
    } catch (err) {
      console.error("⚠️ Scheduled cycle encountered error, daemon will retry on next tick:", err);
    }
    scheduleNext();
  }, intervalMs);

  console.log(`🤖 [LoLaBo Daemon] Autonomous scheduler activated (interval: ${intervalHours}h).`);
}

// ─── HTTP Server Router ───
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
    });
    return res.end();
  }

  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const method = req.method || 'GET';

  // 1. Healthcheck (GET / or GET /health)
  if (pathname === '/' || pathname === '/health') {
    const hasAiKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
    return sendJson(res, 200, {
      status: "ok",
      service: telemetry.service,
      version: telemetry.version,
      uptimeSeconds: Math.round(process.uptime()),
      databaseConnected: Boolean(db),
      databaseType: db ? `Cloud Firestore (${serviceAccount?.project_id || 'active'})` : 'Local Fallback',
      aiConfigured: hasAiKey,
      aiProvider: hasAiKey ? 'Google Gemini' : 'Online AI Required',
      aiModel: hasAiKey ? 'gemini-2.5-flash' : 'none',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version
    });
  }

  // 2. Microservice Telemetry & Status (GET /api/status)
  if (pathname === '/api/status' && method === 'GET') {
    const posts = getCachedPosts();
    const hasAiKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
    return sendJson(res, 200, {
      telemetry,
      databaseConnected: Boolean(db),
      databaseType: db ? `Cloud Firestore (${serviceAccount?.project_id || 'active'})` : 'Local Fallback',
      aiConfigured: hasAiKey,
      aiProvider: hasAiKey ? 'Google Gemini' : 'Online AI Required',
      aiModel: hasAiKey ? 'gemini-2.5-flash' : 'none',
      cachedPostsCount: posts.length,
      memory: process.memoryUsage(),
      system: {
        platform: process.platform,
        arch: process.arch,
        pid: process.pid
      }
    });
  }

  // 3. Posts Catalog (GET /api/posts)
  if (pathname === '/api/posts' && method === 'GET') {
    let posts = getCachedPosts();
    if (db) {
      try {
        const snap = await db.collection('blog_posts').orderBy('publishedAt', 'desc').limit(100).get();
        if (!snap.empty) {
          posts = snap.docs.map(d => {
            const data = d.data();
            let pDate = data.publishedAt;
            if (pDate && typeof pDate.toDate === 'function') {
              pDate = pDate.toDate().toISOString();
            } else if (pDate) {
              pDate = new Date(pDate).toISOString();
            }
            return { id: d.id, ...data, publishedAt: pDate };
          });
        }
      } catch (err) {
        // Fall back to local posts cache smoothly
      }
    }

    const tag = reqUrl.searchParams.get('tag') || undefined;
    const category = reqUrl.searchParams.get('category') || undefined;
    const limit = parseInt(reqUrl.searchParams.get('limit') || '50', 10);

    let filtered = posts;
    if (tag) filtered = filtered.filter(p => p.tags && p.tags.includes(tag));
    if (category) filtered = filtered.filter(p => p.category === category);
    filtered = filtered.slice(0, limit);

    return sendJson(res, 200, {
      total: posts.length,
      count: filtered.length,
      posts: filtered
    });
  }

  // 4. Single Post by Slug (GET /api/posts/:slug)
  if (pathname.startsWith('/api/posts/') && method === 'GET') {
    const slug = pathname.replace('/api/posts/', '').trim();
    const posts = getCachedPosts();
    const post = posts.find(p => p.slug === slug || p.id === slug);
    if (!post) {
      return sendJson(res, 404, { error: `Post not found with slug: ${slug}` });
    }
    return sendJson(res, 200, post);
  }

  // 5. Trigger Autonomous Dispatch (POST /api/dispatch)
  if (pathname === '/api/dispatch' && method === 'POST') {
    if (!checkAuth(req, reqUrl)) {
      return sendJson(res, 401, { error: 'Unauthorized. Invalid or missing API key.' });
    }

    try {
      const body = await parseJsonBody(req);
      const forceFlag = body.force === true || body.force === 'true';
      const result = await executeDispatch({ force: forceFlag, customTopic: body.topic });
      return sendJson(res, 200, result);
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || 'Dispatch failed' });
    }
  }

  // 6. Generate Custom Article On Demand (POST /api/generate)
  if (pathname === '/api/generate' && method === 'POST') {
    if (!checkAuth(req, reqUrl)) {
      return sendJson(res, 401, { error: 'Unauthorized. Invalid or missing API key.' });
    }

    try {
      const body = await parseJsonBody(req);
      if (!body.topic) {
        return sendJson(res, 400, { error: 'Missing required field "topic" in payload.' });
      }
      const forceFlag = body.force === true || body.force === 'true';
      const result = await executeDispatch({ force: forceFlag, customTopic: body.topic });
      return sendJson(res, 200, result);
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || 'Generation failed' });
    }
  }

  // 7. Test Discord Webhook Notification & Rich Embed Template (POST /api/test-discord)
  if (pathname === '/api/test-discord' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const targetWebhook = body.webhookUrl || process.env.DISCORD_WEBHOOK_URL;
      if (!targetWebhook || !String(targetWebhook).trim()) {
        return sendJson(res, 400, {
          error: 'No Discord webhook URL provided in payload {"webhookUrl": "https://..."} or DISCORD_WEBHOOK_URL environment variable.',
          tip: 'Configure DISCORD_WEBHOOK_URL in .env or pass {"webhookUrl": "https://discord.com/api/webhooks/..."} in the JSON body.'
        });
      }

      const samplePost = {
        title: body.title || 'Kernel-Bypass Networking in Rust: Production io_uring vs DPDK Benchmarks',
        slug: body.slug || 'kernel-bypass-networking-in-rust',
        excerpt: body.excerpt || 'Zero-copy packet ring buffers, non-blocking asynchronous system calls, and sub-microsecond P99 tail latency in high-throughput cloud networking architectures.',
        category: body.category || 'Backend & Infrastructure',
        tags: body.tags || ['Rust', 'Networking', 'io_uring', 'Performance', 'SystemsArchitecture'],
        coverImage: body.coverImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=80',
        readTime: body.readTime || 11,
        author: body.author || {
          name: 'Captain Deploy',
          designation: 'Infrastructure Overlord',
          avatar: '🚀'
        },
        type: body.type || 'DEEP DIVE',
        publishedAt: new Date().toISOString()
      };

      const results = await distributeSocially(samplePost, ['discord'], String(targetWebhook).trim());
      return sendJson(res, 200, {
        success: true,
        message: 'Discord rich embed test notification dispatched.',
        webhookTarget: String(targetWebhook).trim().slice(0, 35) + '...',
        post: {
          title: samplePost.title,
          category: samplePost.category,
          slug: samplePost.slug
        },
        distributionResults: results
      });
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || 'Failed to dispatch Discord test notification' });
    }
  }

  // 8. Validate Candidate Post Duplication (POST /api/validate-post)
  if (pathname === '/api/validate-post' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      if (!body.title) {
        return sendJson(res, 400, { error: 'Missing "title" in request body.' });
      }
      const posts = await getActivePosts();
      const validation = validateDuplicatePost({
        title: body.title,
        slug: body.slug
      }, posts, body.threshold ? parseFloat(body.threshold) : 0.55);

      return sendJson(res, 200, {
        candidateTitle: body.title,
        validation,
        catalogSize: posts.length
      });
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || 'Validation failed' });
    }
  }

  // 9. Refresh Static Data & Sitemaps (POST /api/export)
  if (pathname === '/api/export' && method === 'POST') {
    if (!checkAuth(req, reqUrl)) {
      return sendJson(res, 401, { error: 'Unauthorized' });
    }
    try {
      const count = await exportStaticData();
      return sendJson(res, 200, { success: true, exportedPosts: count });
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || 'Export failed' });
    }
  }

  // 10. Prometheus / OpenTelemetry Metrics (GET /metrics)
  if (pathname === '/metrics' && method === 'GET') {
    const mem = process.memoryUsage();
    const hasAiKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
    const metrics = [
      `# HELP lolabo_uptime_seconds Process uptime in seconds`,
      `# TYPE lolabo_uptime_seconds counter`,
      `lolabo_uptime_seconds ${process.uptime()}`,
      `# HELP lolabo_dispatches_total Total autonomous dispatches executed`,
      `# TYPE lolabo_dispatches_total counter`,
      `lolabo_dispatches_total ${telemetry.totalDispatches}`,
      `# HELP lolabo_firestore_connected Cloud Firestore connection status (1 = connected, 0 = offline)`,
      `# TYPE lolabo_firestore_connected gauge`,
      `lolabo_firestore_connected ${db ? 1 : 0}`,
      `# HELP lolabo_ai_configured Gemini AI configuration status (1 = active, 0 = offline)`,
      `# TYPE lolabo_ai_configured gauge`,
      `lolabo_ai_configured ${hasAiKey ? 1 : 0}`,
      `# HELP lolabo_memory_rss_bytes Process RSS memory`,
      `# TYPE lolabo_memory_rss_bytes gauge`,
      `lolabo_memory_rss_bytes ${mem.rss}`,
      `# HELP lolabo_cached_posts_count Number of published posts in catalog`,
      `# TYPE lolabo_cached_posts_count gauge`,
      `lolabo_cached_posts_count ${getCachedPosts().length}`
    ].join('\n');

    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
    return res.end(metrics);
  }

  // 404 Route Not Found
  return sendJson(res, 404, {
    error: 'Endpoint not found',
    endpoints: [
      'GET  /health',
      'GET  /api/status',
      'GET  /api/posts',
      'GET  /api/posts/:slug',
      'POST /api/dispatch',
      'POST /api/generate',
      'POST /api/test-discord',
      'POST /api/validate-post',
      'POST /api/export',
      'GET  /metrics'
    ]
  });
});

// ─── Startup Handler ───
export function startServer(port = PORT, host = HOST) {
  // Run startup database synchronization in background
  syncDatabaseOnStartup();

  server.listen(port, host, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [LoLaBo Microservice Engine] Live on http://${host}:${port}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - GET  /health          Liveness probe`);
    console.log(`   - GET  /api/status      Telemetry & health metrics`);
    console.log(`   - GET  /api/posts       Full article catalog`);
    console.log(`   - POST /api/dispatch    Trigger autonomous publication`);
    console.log(`   - POST /api/generate    Custom on-demand article`);
    console.log(`   - GET  /metrics         Prometheus metrics`);
    console.log(`======================================================\n`);
  });

  // Check if autonomous daemon mode was requested
  const isDaemonArg = process.argv.includes('--daemon') || process.argv.includes('--cron') || process.env.DAEMON === 'true';
  if (isDaemonArg) {
    const intervalHours = parseFloat(process.env.INTERVAL_HOURS || '1');
    startAutonomousDaemon(intervalHours);
  }

  return server;
}

// Auto-run if executed directly via node / ts-node
if (require.main === module) {
  startServer();
}
