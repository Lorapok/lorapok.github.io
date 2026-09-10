// agent/exportData.ts
// Static Data Export Module for LoLaBo
// Fetches all published posts from Firestore and saves them to public/blog/posts.json
// This improves SEO and significantly speeds up initial blog loads.

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

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
  } catch (err) {
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
      } else if (data.publishedAt) {
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
      .filter((p: any) => p.status === 'published')
      .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const outputPath = path.join(__dirname, '../public/blog/posts.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    console.log(`✅ Exported ${posts.length} posts to ${outputPath}`);

    // Update Sitemap
    updateSitemap(posts);
    
  } catch (e) {
    console.error("⚠️ Export encountered an issue (keeping existing static files):", e);
  }
}

function updateSitemap(posts: any[]) {
  const baseUrl = 'https://lorapok.github.io/blog';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Home
  sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Posts
  for (const post of posts) {
    sitemap += `  <url>\n    <loc>${baseUrl}/${post.slug}</loc>\n    <lastmod>${post.publishedAt.split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  
  sitemap += `</urlset>`;
  
  const sitemapPath = path.join(__dirname, '../public/blog/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap updated at ${sitemapPath}`);
}

exportBlogData();
