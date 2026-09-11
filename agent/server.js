"use strict";
// agent/server.ts
// LoLaBo Autonomous Content & Intelligence Microservice
// High-performance, self-contained HTTP microservice with RESTful API & daemon scheduler
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDispatch = executeDispatch;
exports.startServer = startServer;
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const admin = __importStar(require("firebase-admin"));
const collector_1 = require("./collector");
const writer_1 = require("./writer");
const imageGen_1 = require("./imageGen");
const distributor_1 = require("./distributor");
// ─── Environment & Config ───
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';
const SERVICE_TOKEN = process.env.LOLABO_API_KEY || process.env.SERVICE_TOKEN || '';
const POSTS_JSON_PATH = path.resolve(__dirname, '../public/blog/posts.json');
// ─── Firebase Initialization ───
let serviceAccount = {};
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
}
catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
}
let db = null;
if (serviceAccount && serviceAccount.project_id) {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        db = admin.firestore();
    }
    catch (err) {
        console.error("❌ Failed to initialize Firebase Admin:", err);
    }
}
const telemetry = {
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
function sendJson(res, statusCode, data) {
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
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => {
            raw += chunk;
            if (raw.length > 5 * 1024 * 1024) {
                reject(new Error('Payload too large'));
            }
        });
        req.on('end', () => {
            if (!raw)
                return resolve({});
            try {
                resolve(JSON.parse(raw));
            }
            catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}
function checkAuth(req, reqUrl) {
    if (!SERVICE_TOKEN)
        return true; // Open if no token configured
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const apiKey = req.headers['x-api-key'] || reqUrl.searchParams.get('token') || '';
    return bearerToken === SERVICE_TOKEN || apiKey === SERVICE_TOKEN;
}
function getCachedPosts() {
    try {
        if (fs.existsSync(POSTS_JSON_PATH)) {
            return JSON.parse(fs.readFileSync(POSTS_JSON_PATH, 'utf8'));
        }
    }
    catch (err) {
        console.warn("⚠️ Could not read posts.json cache:", err);
    }
    return [];
}
// ─── Export Data Helper ───
async function exportStaticData() {
    if (!db) {
        console.warn("⚠️ No Firestore connection. Skipping export.");
        return 0;
    }
    const snap = await db.collection('blog_posts').get();
    let posts = snap.docs.map(d => {
        const data = d.data();
        let publishedAtStr = new Date().toISOString();
        if (data.publishedAt && typeof data.publishedAt.toDate === 'function') {
            publishedAtStr = data.publishedAt.toDate().toISOString();
        }
        else if (data.publishedAt) {
            publishedAtStr = new Date(data.publishedAt).toISOString();
        }
        return { id: d.id, ...data, publishedAt: publishedAtStr };
    });
    posts = posts
        .filter((p) => p.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const dir = path.dirname(POSTS_JSON_PATH);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(posts, null, 2), 'utf8');
    // Regenerate XML Sitemaps and RSS
    const sitemapDir = path.dirname(POSTS_JSON_PATH);
    const nowIso = new Date().toISOString().split('T')[0];
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    for (const p of posts) {
        if (!p.slug)
            continue;
        const pDate = p.publishedAt ? p.publishedAt.split('T')[0] : nowIso;
        sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    sitemapXml += `</urlset>\n`;
    fs.writeFileSync(path.join(sitemapDir, 'sitemap.xml'), sitemapXml, 'utf8');
    let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
    rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>https://lorapok.tech/blog</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
    for (const p of posts.slice(0, 20)) {
        if (!p.slug)
            continue;
        rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>https://lorapok.tech/blog/${p.slug}</link>\n    <guid>https://lorapok.tech/blog/${p.slug}</guid>\n    <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt}]]></description>\n  </item>\n`;
    }
    rssXml += `</channel>\n</rss>\n`;
    fs.writeFileSync(path.join(sitemapDir, 'rss.xml'), rssXml, 'utf8');
    return posts.length;
}
// ─── Autonomous Dispatch Pipeline ───
async function executeDispatch(options = {}) {
    if (telemetry.isDispatching) {
        throw new Error("Dispatch pipeline is currently active. Try again shortly.");
    }
    telemetry.isDispatching = true;
    telemetry.lastDispatchStatus = "in_progress";
    console.log("⚡ [LoLaBo Microservice] Executing autonomous dispatch cycle...");
    try {
        let config = {
            isEnabled: true,
            writingProvider: 'gemini',
            targetAudience: 'Developers & Systems Architects',
            tone: 'Technical, deep-dive & architectural',
            imageGenMode: 'auto',
            enabledSocials: ['discord'],
            discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL
        };
        if (db) {
            try {
                const configDoc = await db.collection('agent_config').doc('lolabo_settings').get();
                if (configDoc.exists) {
                    config = { ...config, ...configDoc.data() };
                }
            }
            catch (e) {
                console.warn("⚠️ Could not fetch remote Firestore config; using environment fallback.");
            }
        }
        // 1. Ingest News or use custom topic
        let news = [];
        if (options.customTopic) {
            news = [{ title: options.customTopic, url: 'https://lorapok.tech/blog', source: 'Microservice Trigger' }];
        }
        else {
            news = await (0, collector_1.collectNews)();
        }
        if (!news || news.length === 0) {
            throw new Error("No upstream articles collected for synthesis.");
        }
        // 2. Synthesize Content
        console.log("✍️ Synthesizing blog post via Gemini model...");
        const blogPost = await (0, writer_1.writeBlogPost)(news, {
            provider: config.writingProvider || 'gemini',
            targetAudience: config.targetAudience || 'Developers',
            tone: config.tone || 'Technical'
        });
        // 3. Generate Editorial Visual
        console.log("🎨 Generating topic-relevant cover visual...");
        blogPost.coverImage = await (0, imageGen_1.generateCoverImage)(blogPost.title, blogPost.tags, config.imageGenMode || 'auto', blogPost.category, blogPost.imageKeywords || [], blogPost.imagePrompt);
        // 4. Sluggify
        blogPost.slug = blogPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        // 5. Persist to Firestore
        let postId = 'local-' + Date.now();
        if (db) {
            console.log(`💾 Persisting post to Firestore: ${blogPost.title}`);
            const postRef = await db.collection('blog_posts').add(blogPost);
            postId = postRef.id;
            await db.collection('agent_config').doc('lolabo_settings').update({
                lastRunAt: admin.firestore.Timestamp.now(),
                triggerRequested: false
            }).catch(() => { });
        }
        // 6. Social Distribution (Discord)
        const webhookUrl = config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
        if (webhookUrl) {
            console.log("📢 Broadcasting to Discord webhook...");
            await (0, distributor_1.distributeSocially)(blogPost, ['discord'], webhookUrl);
        }
        // 7. Update Static JSON & Sitemaps
        console.log("📁 Updating static posts.json and XML feeds...");
        await exportStaticData();
        // 8. Update Telemetry
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
            coverImage: blogPost.coverImage,
            category: blogPost.category,
            publishedAt: telemetry.lastDispatchAt
        };
    }
    catch (err) {
        telemetry.lastDispatchStatus = "failed";
        telemetry.lastError = err.message || String(err);
        console.error("💥 [LoLaBo Microservice] Dispatch failed:", err);
        throw err;
    }
    finally {
        telemetry.isDispatching = false;
    }
}
// ─── Autonomous Daemon Scheduler ───
function startAutonomousDaemon(intervalHours = 1) {
    if (telemetry.daemonActive)
        return;
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
        }
        catch (err) {
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
        return sendJson(res, 200, {
            status: "ok",
            service: telemetry.service,
            version: telemetry.version,
            uptimeSeconds: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
            nodeVersion: process.version
        });
    }
    // 2. Microservice Telemetry & Status (GET /api/status)
    if (pathname === '/api/status' && method === 'GET') {
        const posts = getCachedPosts();
        return sendJson(res, 200, {
            telemetry,
            databaseConnected: Boolean(db),
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
        const posts = getCachedPosts();
        const tag = reqUrl.searchParams.get('tag') || undefined;
        const category = reqUrl.searchParams.get('category') || undefined;
        const limit = parseInt(reqUrl.searchParams.get('limit') || '50', 10);
        let filtered = posts;
        if (tag)
            filtered = filtered.filter(p => p.tags && p.tags.includes(tag));
        if (category)
            filtered = filtered.filter(p => p.category === category);
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
            const result = await executeDispatch({ force: true, customTopic: body.topic });
            return sendJson(res, 200, result);
        }
        catch (err) {
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
            const result = await executeDispatch({ force: true, customTopic: body.topic });
            return sendJson(res, 200, result);
        }
        catch (err) {
            return sendJson(res, 500, { error: err.message || 'Generation failed' });
        }
    }
    // 7. Refresh Static Data & Sitemaps (POST /api/export)
    if (pathname === '/api/export' && method === 'POST') {
        if (!checkAuth(req, reqUrl)) {
            return sendJson(res, 401, { error: 'Unauthorized' });
        }
        try {
            const count = await exportStaticData();
            return sendJson(res, 200, { success: true, exportedPosts: count });
        }
        catch (err) {
            return sendJson(res, 500, { error: err.message || 'Export failed' });
        }
    }
    // 8. Prometheus / OpenTelemetry Metrics (GET /metrics)
    if (pathname === '/metrics' && method === 'GET') {
        const mem = process.memoryUsage();
        const metrics = [
            `# HELP lolabo_uptime_seconds Process uptime in seconds`,
            `# TYPE lolabo_uptime_seconds counter`,
            `lolabo_uptime_seconds ${process.uptime()}`,
            `# HELP lolabo_dispatches_total Total autonomous dispatches executed`,
            `# TYPE lolabo_dispatches_total counter`,
            `lolabo_dispatches_total ${telemetry.totalDispatches}`,
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
            'POST /api/export',
            'GET  /metrics'
        ]
    });
});
// ─── Startup Handler ───
function startServer(port = PORT, host = HOST) {
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
