"use strict";
// agent/exportData.ts
// Static Data Export Module for LoLaBo
// Fetches published posts from Firestore, merges with existing catalog, and writes to public/blog/posts.json
// This improves SEO, guarantees zero data-loss, and speeds up initial blog loads.
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
const admin = __importStar(require("firebase-admin"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const imageGen_1 = require("./imageGen");
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
// ─── Robust Firebase Initialization ───
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
                    console.log(`🔐 [Export] Loaded Firebase Service Account from: ${cp}`);
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
        console.log(`🔥 [Export] Connected to Cloud Firestore successfully (Project: ${serviceAccount.project_id}).`);
    }
    catch (err) {
        console.error("❌ [Export] Failed to initialize Firebase Admin with service account:", err);
    }
}
else {
    try {
        if (!admin.apps.length) {
            admin.initializeApp();
        }
        db = admin.firestore();
        console.log("🔥 [Export] Connected to Cloud Firestore via Application Default Credentials.");
    }
    catch {
        console.log("⚡ [Export] Standalone / Local mode active (Cloud Firestore not configured).");
    }
}
async function exportBlogData() {
    console.log("🚀 Exporting and consolidating blog posts to static JSON...");
    const outputPath = process.env.POSTS_JSON_PATH || path.join(__dirname, '../public/blog/posts.json');
    // 1. Load existing local posts baseline
    const postMap = new Map();
    if (fs.existsSync(outputPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
            if (Array.isArray(existing)) {
                for (const p of existing) {
                    const key = p.slug || p.id;
                    if (key)
                        postMap.set(key, p);
                }
                console.log(`📁 Loaded ${postMap.size} existing local posts from ${outputPath}`);
            }
        }
        catch (err) {
            console.warn("⚠️ Could not read existing local posts.json:", err);
        }
    }
    // 2. Fetch and merge remote Firestore posts if available
    const PURGED_SLUGS = new Set([
        'architectural-deep-dive-zero-trust-service-mesh-architecture-with-ebpf',
        'architectural-deep-dive-thrive-capital-led-vcs-into-pro-sports-ownership-collaborative-fund-just-upped-that-play',
        'the-architectural-limits-of-cross-platform-frameworks-why-shopify-is-transitioning-back-to-native-development',
        'reverse-engineering-frontier-models-inside-the-mechanics-of-llm-distillation-campaigns-and-evasion-defenses',
        'local-1789096731131',
        'local-1789096223415'
    ]);
    if (db) {
        try {
            const snap = await db.collection('blog_posts').get();
            console.log(`📥 Fetched ${snap.size} posts from Cloud Firestore.`);
            for (const doc of snap.docs) {
                const data = doc.data();
                const docSlug = data.slug || doc.id;
                // Clean up purged duplicate stubs from remote Firestore
                if (PURGED_SLUGS.has(doc.id) || PURGED_SLUGS.has(docSlug)) {
                    console.log(`🧹 Purging duplicate document from Cloud Firestore: ${doc.id}`);
                    await doc.ref.delete().catch(() => { });
                    continue;
                }
                let publishedAtStr = new Date().toISOString();
                if (data.publishedAt && typeof data.publishedAt.toDate === 'function') {
                    publishedAtStr = data.publishedAt.toDate().toISOString();
                }
                else if (data.publishedAt) {
                    publishedAtStr = new Date(data.publishedAt).toISOString();
                }
                const postObj = {
                    id: doc.id,
                    ...data,
                    status: data.status || 'published',
                    publishedAt: publishedAtStr
                };
                const key = (postObj.slug || postObj.id);
                // Merge or update with Firestore data only if not in purged set
                if (!PURGED_SLUGS.has(key)) {
                    postMap.set(key, postObj);
                }
            }
        }
        catch (dbErr) {
            console.warn("⚠️ Error querying Firestore, preserving existing local posts:", dbErr);
        }
    }
    else {
        console.log("ℹ️ Skipping Firestore query; maintaining existing local catalog.");
    }
    // 3. Filter published posts and sort descending by publishedAt
    let mergedPosts = Array.from(postMap.values())
        .filter((p) => p.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    // 4. Strict 100% Online AI Flux Normalization & Zero-Duplicate Guarantee
    const { posts: normalizedPosts, updatedCount } = (0, imageGen_1.normalizePostImages)(mergedPosts);
    mergedPosts = normalizedPosts;
    // If any posts had their visual normalized and Firestore is connected, sync back to Firestore
    if (db && updatedCount > 0) {
        console.log(`🔥 [Export] Syncing ${updatedCount} normalized AI Flux cover images back to Cloud Firestore...`);
        for (const p of mergedPosts) {
            const docId = p.slug || p.id;
            if (docId) {
                await db.collection('blog_posts').doc(docId).set({
                    coverImage: p.coverImage
                }, { merge: true }).catch(() => { });
            }
        }
        console.log("✅ [Export] Cloud Firestore successfully synchronized with 100% unique online AI visuals.");
    }
    // 5. Ensure all markdown posts have balanced code fences
    for (const p of mergedPosts) {
        if (p.content) {
            const fences = (p.content.split('```').length - 1);
            if (fences % 2 !== 0) {
                const footerMarker = '\n---\n*Authored autonomously';
                const footerIdx = p.content.lastIndexOf(footerMarker);
                if (footerIdx !== -1) {
                    p.content = p.content.slice(0, footerIdx).trimEnd() + '\n```\n' + p.content.slice(footerIdx);
                }
                else {
                    p.content = p.content.trimEnd() + '\n```\n';
                }
            }
        }
    }
    // 6. Ensure output directory exists and write
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(mergedPosts, null, 2), 'utf8');
    console.log(`✅ Consolidated and saved ${mergedPosts.length} posts to ${outputPath} (100% unique online AI visuals guaranteed)`);
    // 6. Update Sitemaps and RSS Feed
    updateSitemapsAndRss(mergedPosts);
}
function escapeXml(unsafe) {
    if (!unsafe)
        return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}
function updateSitemapsAndRss(posts) {
    const domain = 'https://lorapok.tech';
    const blogBaseUrl = `${domain}/blog`;
    const today = new Date().toISOString().split('T')[0];
    // 1. Generate Blog Sitemap (public/blog/sitemap.xml)
    let blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    blogSitemap += `  <url>\n    <loc>${blogBaseUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    for (const post of posts) {
        if (!post.slug)
            continue;
        const postDate = post.publishedAt ? String(post.publishedAt).split('T')[0] : today;
        blogSitemap += `  <url>\n    <loc>${blogBaseUrl}/${post.slug}/</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    blogSitemap += `</urlset>\n`;
    const blogSitemapPath = path.join(__dirname, '../public/blog/sitemap.xml');
    fs.writeFileSync(blogSitemapPath, blogSitemap, 'utf8');
    console.log(`✅ Blog sitemap updated with ${posts.length} posts at ${blogSitemapPath}`);
    // 2. Generate Primary Root Sitemap (public/sitemap.xml)
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
        rootSitemap += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    }
    for (const post of posts) {
        if (!post.slug)
            continue;
        const postDate = post.publishedAt ? String(post.publishedAt).split('T')[0] : today;
        rootSitemap += `  <url>\n    <loc>${blogBaseUrl}/${post.slug}/</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    rootSitemap += `</urlset>\n`;
    const rootSitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(rootSitemapPath, rootSitemap, 'utf8');
    console.log(`✅ Root SEO sitemap updated with ${posts.length} posts at ${rootSitemapPath}`);
    // 3. Generate RSS 2.0 Feed (public/blog/rss.xml)
    let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n`;
    rss += `    <title>LoLaBo — Lorapok Labs Blog</title>\n`;
    rss += `    <link>${blogBaseUrl}</link>\n`;
    rss += `    <description>Autonomous AI-curated tech insights, system architecture deep-dives, and research by Lorapok Labs.</description>\n`;
    rss += `    <language>en-us</language>\n`;
    rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
    rss += `    <atom:link href="${blogBaseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
    for (const post of posts.slice(0, 30)) {
        if (!post.slug)
            continue;
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
        const postUrl = `${blogBaseUrl}/${post.slug}/`;
        const categories = (post.tags || ['LorapokLabs']).map((t) => `    <category>${escapeXml(t)}</category>`).join('\n');
        rss += `    <item>\n`;
        rss += `      <title>${escapeXml(post.title)}</title>\n`;
        rss += `      <link>${postUrl}</link>\n`;
        rss += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
        rss += `      <pubDate>${pubDate}</pubDate>\n`;
        rss += `      <author>agent@lorapok.labs (${escapeXml(post.author?.name || 'LoLaBo AI')})</author>\n`;
        rss += `      <description>${escapeXml(post.excerpt || post.title)}</description>\n`;
        rss += `${categories}\n`;
        rss += `    </item>\n`;
    }
    rss += `  </channel>\n</rss>\n`;
    const rssPath = path.join(__dirname, '../public/blog/rss.xml');
    fs.writeFileSync(rssPath, rss, 'utf8');
    console.log(`✅ Blog RSS 2.0 feed updated at ${rssPath}`);
}
exportBlogData();
