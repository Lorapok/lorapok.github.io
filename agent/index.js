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
const validator_1 = require("./validator");
const catalogPolicy_1 = require("./catalogPolicy");
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
        const domain = 'https://lorapok.tech';
        const blogBaseUrl = `${domain}/blog`;
        const nowIso = new Date().toISOString().split('T')[0];
        // 1. Blog Sitemap
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        sitemapXml += `  <url>\n    <loc>${blogBaseUrl}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        for (const p of posts) {
            if (!p.slug)
                continue;
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
            { path: 'privacy', priority: '0.4', changefreq: 'yearly' },
            { path: 'terms', priority: '0.4', changefreq: 'yearly' },
        ];
        let rootSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        for (const route of coreRoutes) {
            const loc = route.path ? `${domain}/${route.path}` : `${domain}/`;
            rootSitemap += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
        }
        for (const p of posts) {
            if (!p.slug)
                continue;
            const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
            rootSitemap += `  <url>\n    <loc>${blogBaseUrl}/${p.slug}/</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
        }
        rootSitemap += `</urlset>\n`;
        fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), rootSitemap, 'utf8');
        // 3. Blog RSS 2.0 Feed
        let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
        rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>${blogBaseUrl}</link>\n  <description>Notes on public Lorapok Labs repositories, written from each project's README.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n  <atom:link href="${blogBaseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
        for (const p of posts.slice(0, 30)) {
            if (!p.slug)
                continue;
            rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>${blogBaseUrl}/${p.slug}/</link>\n    <guid isPermaLink="true">${blogBaseUrl}/${p.slug}/</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt || p.title}]]></description>\n  </item>\n`;
        }
        rssXml += `</channel>\n</rss>\n`;
        fs.writeFileSync(path.join(baseDir, 'rss.xml'), rssXml, 'utf8');
        console.log("📁 Sitemaps (root & blog) and RSS feed regenerated at", baseDir);
    }
    catch (err) {
        console.warn("⚠️ Could not update feeds locally:", err);
    }
}
async function runAgent() {
    console.log("🚀 Starting LoLaBo Agent...");
    let config = {
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
            }
            else {
                await db.collection('agent_config').doc('lolabo_settings').set(config);
                console.log("✅ Default agent config initialized in Firestore (15-minute publishing interval).");
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
    // 2. Check Interval or Manual Trigger (Default 15 minutes)
    let lastRun = new Date(0);
    if (config.lastRunAt && typeof config.lastRunAt.toDate === 'function') {
        lastRun = config.lastRunAt.toDate();
    }
    else if (config.lastRunAt) {
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
    }
    else {
        console.log(`⏱️ 15-minute cycle triggered (${minutesSinceLastRun.toFixed(1)}m elapsed >= ${jitterThresholdMinutes.toFixed(1)}m threshold). Generating post...`);
    }
    try {
        // 0. Load active catalog for anti-duplication baseline
        const postsJsonPath = process.env.POSTS_JSON_PATH || path.resolve(__dirname, '../public/blog/posts.json');
        const currentPosts = (0, catalogPolicy_1.loadAllForDedup)();
        // 3. News Collection (with catalog duplicate exclusion)
        const news = await (0, collector_1.collectNews)(currentPosts);
        if (news.length === 0)
            throw new Error("No news collected.");
        // 4. Content Generation (with model tiering: 3.8 Flash for Blogs, 3.8/3.1 Pro for Research)
        const isResearchMode = config.isResearchMode === true ||
            config.writingProvider === 'gemini-pro' ||
            config.writingProvider === 'gemini-3.8-pro' ||
            config.writingProvider === 'gemini-3.1-pro' ||
            (config.category && ['Architecture', 'AI & Machine Learning', 'Security'].includes(config.category));
        const blogPost = await (0, writer_1.writeBlogPost)(news, {
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
        const validation = (0, validator_1.validateDuplicatePost)({
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
            blogPost.coverImage = await (0, imageGen_1.generateCoverImage)(blogPost.title, blogPost.tags, config.imageGenMode || 'ai', blogPost.category, blogPost.imageKeywords || [], blogPost.imagePrompt, currentPosts);
        }
        // 8. Deterministic Dual-Tier Persistence (Cloud Firestore + Local Filesystem)
        const docId = blogPost.slug;
        const newPost = {
            id: docId,
            ...blogPost,
            source: 'ai-agent',
            status: 'draft',
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
            }).catch(() => { });
        }
        console.log(`📝 [Local Catalog] Archiving draft: ${blogPost.title}`);
        (0, catalogPolicy_1.persistDraft)(newPost);
        const publicNotes = (0, catalogPolicy_1.loadPublicPosts)();
        const dir = path.dirname(postsJsonPath);
        updateFeedsLocally(publicNotes, dir);
        console.log(`✅ Draft archived. Public index still has ${publicNotes.length} manual notes.`);
        console.log("ℹ️ Draft archived only. Discord broadcast stays off until a note is published as source=manual.");
        console.log("🎉 LoLaBo Agent run completed successfully!");
    }
    catch (e) {
        console.error("💥 LoLaBo Agent failed:", e);
        process.exit(1);
    }
}
runAgent();
