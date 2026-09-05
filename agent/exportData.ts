// agent/exportData.ts
// Static Data Export Module for LoLaBo
// Fetches all published posts from Firestore and saves them to public/blog/posts.json
// This improves SEO and significantly speeds up initial blog loads.

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// ─── Firebase Initialization ───
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (!admin.apps.length && serviceAccount.project_id) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function exportBlogData() {
  console.log("🚀 Exporting Firestore posts to static JSON...");
  
  try {
    const snap = await db.collection('blog_posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();
    
    const posts = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      publishedAt: d.data().publishedAt?.toDate().toISOString()
    }));

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
    console.error("💥 Export failed:", e);
    process.exit(1);
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
