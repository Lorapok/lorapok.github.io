"use strict";
// agent/index.ts
// LoLaBo Orchestrator Script
// Designed to run in GitHub Actions environment or local standalone microservice mode
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const admin = __importStar(require("firebase-admin"));
const collector_1 = require("./collector");
const writer_1 = require("./writer");
const imageGen_1 = require("./imageGen");
const distributor_1 = require("./distributor");
// ─── Environment Auto-loading ───
try {
    const rootEnv = path.resolve(__dirname, '../.env');
    const localEnv = path.resolve(__dirname, '.env');
    if (typeof process.loadEnvFile === 'function') {
        if (fs.existsSync(localEnv)) {
            process.loadEnvFile(localEnv);
        }
        else if (fs.existsSync(rootEnv)) {
            process.loadEnvFile(rootEnv);
        }
    }
}
catch (e) { }
// ─── Firebase Initialization ───
function loadServiceAccount() {
    // 1. Base64 encoded JSON
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        try {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), 'base64').toString('utf8');
            const parsed = JSON.parse(decoded);
            if (parsed && parsed.project_id)
                return parsed;
        }
        catch (e) { }
    }
    // 2. Direct string or file path in FIREBASE_SERVICE_ACCOUNT
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        if (raw.startsWith('"') && raw.endsWith('"')) {
            try {
                raw = JSON.parse(raw);
            }
            catch (e) { }
        }
        if (typeof raw === 'string' && raw.startsWith('{')) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.project_id)
                    return parsed;
            }
            catch (e) { }
        }
        else if (typeof raw === 'string' && fs.existsSync(raw)) {
            try {
                const parsed = JSON.parse(fs.readFileSync(raw, 'utf8'));
                if (parsed && parsed.project_id)
                    return parsed;
            }
            catch (e) { }
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
    ].filter(Boolean);
    for (const cp of candidatePaths) {
        if (fs.existsSync(cp)) {
            try {
                const parsed = JSON.parse(fs.readFileSync(cp, 'utf8'));
                if (parsed && parsed.project_id) {
                    console.log(`🔐 Loaded Firebase Service Account from: ${cp}`);
                    return parsed;
                }
            }
            catch (e) { }
        }
    }
    return null;
}
const serviceAccount = loadServiceAccount();
let db = null;
if (serviceAccount && serviceAccount.project_id) {
    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        db = admin.firestore();
        console.log(`🔥 Connected to Cloud Firestore successfully (Project: ${serviceAccount.project_id}).`);
    }
    catch (err) {
        console.error("❌ Failed to initialize Firebase Admin with service account:", err);
    }
}
else {
    // Try Application Default Credentials fallback
    try {
        if (!admin.apps.length) {
            admin.initializeApp();
        }
        db = admin.firestore();
        console.log("🔥 Connected to Cloud Firestore via Application Default Credentials.");
    }
    catch {
        console.log("⚡ Standalone / Local mode active (Cloud Firestore not configured).");
    }
}
function updateFeedsLocally(posts, baseDir) {
    try {
        const nowIso = new Date().toISOString().split('T')[0];
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        for (const p of posts) {
            if (!p.slug)
                continue;
            const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
            sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
        sitemapXml += `</urlset>\n`;
        fs.writeFileSync(path.join(baseDir, 'sitemap.xml'), sitemapXml, 'utf8');
        let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
        rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>https://lorapok.tech/blog</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
        for (const p of posts.slice(0, 20)) {
            if (!p.slug)
                continue;
            rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>https://lorapok.tech/blog/${p.slug}</link>\n    <guid>https://lorapok.tech/blog/${p.slug}</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt}]]></description>\n  </item>\n`;
        }
        rssXml += `</channel>\n</rss>\n`;
        fs.writeFileSync(path.join(baseDir, 'rss.xml'), rssXml, 'utf8');
        console.log("📁 Sitemaps and RSS feed regenerated at", baseDir);
    }
    catch (err) {
        console.warn("⚠️ Could not update feeds locally:", err);
    }
}
async function runAgent() {
    console.log("🚀 Starting LoLaBo Agent...");
    let config = {
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
            }
            else {
                await db.collection('agent_config').doc('lolabo_settings').set(config);
                console.log("✅ Default agent config initialized in Firestore (1-hour publishing interval).");
            }
        }
        catch (err) {
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
    }
    else if (config.lastRunAt) {
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
    }
    else {
        console.log(`⏱️ Hourly cycle triggered (${hoursSinceLastRun.toFixed(2)}h elapsed >= ${jitterThreshold.toFixed(2)}h threshold). Generating post...`);
    }
    try {
        // 3. News Collection
        const news = await (0, collector_1.collectNews)();
        if (news.length === 0)
            throw new Error("No news collected.");
        // 4. Content Generation
        const blogPost = await (0, writer_1.writeBlogPost)(news, {
            provider: config.writingProvider || 'gemini',
            targetAudience: config.targetAudience || 'Developers',
            tone: config.tone || 'Technical'
        });
        // 5. Image Generation (Distinct, topic-relevant editorial cover)
        blogPost.coverImage = await (0, imageGen_1.generateCoverImage)(blogPost.title, blogPost.tags, config.imageGenMode || 'auto', blogPost.category, blogPost.imageKeywords || [], blogPost.imagePrompt);
        // 6. Generate Slug
        blogPost.slug = blogPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        // 7. Save to Firestore or local filesystem
        const postsJsonPath = process.env.POSTS_JSON_PATH || path.resolve(__dirname, '../public/blog/posts.json');
        if (db) {
            console.log(`📝 Publishing post to Firestore: ${blogPost.title}`);
            const postRef = await db.collection('blog_posts').add(blogPost);
            console.log(`✅ Post saved to Firestore with ID: ${postRef.id}`);
            await db.collection('agent_config').doc('lolabo_settings').update({
                lastRunAt: admin.firestore.Timestamp.now(),
                triggerRequested: false
            }).catch(() => { });
        }
        else {
            console.log(`📝 [Local Standalone] Publishing post to local catalog: ${blogPost.title}`);
            let currentPosts = [];
            try {
                if (fs.existsSync(postsJsonPath)) {
                    currentPosts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
                }
            }
            catch (err) { }
            const newPost = {
                id: 'local-' + Date.now(),
                ...blogPost,
                publishedAt: new Date().toISOString()
            };
            const updatedPosts = [newPost, ...currentPosts.filter((p) => p.slug !== blogPost.slug)];
            const dir = path.dirname(postsJsonPath);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(postsJsonPath, JSON.stringify(updatedPosts, null, 2), 'utf8');
            console.log(`✅ Post persisted locally to ${postsJsonPath} (${updatedPosts.length} total posts)`);
            // Update sitemaps & RSS feed
            updateFeedsLocally(updatedPosts, dir);
        }
        // 8. Social Distribution
        const webhookUrl = config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
        if (webhookUrl) {
            await (0, distributor_1.distributeSocially)(blogPost, config.enabledSocials || ['discord'], webhookUrl);
        }
        console.log("🎉 LoLaBo Agent run completed successfully!");
    }
    catch (e) {
        console.error("💥 LoLaBo Agent failed:", e);
        process.exit(1);
    }
}
runAgent();
