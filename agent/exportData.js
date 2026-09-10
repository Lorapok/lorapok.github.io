"use strict";
// agent/exportData.ts
// Static Data Export Module for LoLaBo
// Fetches all published posts from Firestore and saves them to public/blog/posts.json
// This improves SEO and significantly speeds up initial blog loads.
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
async function exportBlogData() {
    console.log("🚀 Exporting Firestore posts to static JSON...");
    if (!db) {
        console.warn("⚠️ No Firestore connection available. Skipping blog data export.");
        return;
    }
    try {
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
            return {
                id: d.id,
                ...data,
                publishedAt: publishedAtStr
            };
        });
        // Filter published posts and sort descending by publishedAt
        posts = posts
            .filter((p) => p.status === 'published')
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        const outputPath = path.join(__dirname, '../public/blog/posts.json');
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
        console.log(`✅ Exported ${posts.length} posts to ${outputPath}`);
        // Update Sitemaps and RSS Feed
        updateSitemapsAndRss(posts);
    }
    catch (e) {
        console.error("⚠️ Export encountered an issue (keeping existing static files):", e);
    }
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
        const postDate = post.publishedAt ? post.publishedAt.split('T')[0] : today;
        blogSitemap += `  <url>\n    <loc>${blogBaseUrl}/${post.slug}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    blogSitemap += `</urlset>\n`;
    const blogSitemapPath = path.join(__dirname, '../public/blog/sitemap.xml');
    fs.writeFileSync(blogSitemapPath, blogSitemap);
    console.log(`✅ Blog sitemap updated at ${blogSitemapPath}`);
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
        const postDate = post.publishedAt ? post.publishedAt.split('T')[0] : today;
        rootSitemap += `  <url>\n    <loc>${blogBaseUrl}/${post.slug}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
    rootSitemap += `</urlset>\n`;
    const rootSitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(rootSitemapPath, rootSitemap);
    console.log(`✅ Root SEO sitemap updated with ${posts.length} posts at ${rootSitemapPath}`);
    // 3. Generate RSS 2.0 Feed (public/blog/rss.xml)
    let rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n`;
    rss += `    <title>LoLaBo — Lorapok Labs Blog</title>\n`;
    rss += `    <link>${blogBaseUrl}</link>\n`;
    rss += `    <description>Autonomous AI-curated tech insights, system architecture deep-dives, and research by Lorapok Labs.</description>\n`;
    rss += `    <language>en-us</language>\n`;
    rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
    rss += `    <atom:link href="${blogBaseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
    for (const post of posts) {
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
        const postUrl = `${blogBaseUrl}/${post.slug}`;
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
    fs.writeFileSync(rssPath, rss);
    console.log(`✅ Blog RSS 2.0 feed updated at ${rssPath}`);
}
exportBlogData();
