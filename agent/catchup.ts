// agent/catchup.ts
// Autonomous Catch-Up Engine for LoLaBo
// Generates missing articles for elapsed hours using the adaptive Gemini waterfall & multi-image suite

import * as fs from 'fs';
import * as path from 'path';
import { collectNews } from './collector';
import { writeBlogPost } from './writer';
import { keyManager } from './keyManager';
import { validateDuplicatePost } from './validator';

// Auto-load environment
try {
  const localEnv = path.resolve(__dirname, '.env');
  const rootEnv = path.resolve(__dirname, '../.env');
  if (typeof (process as any).loadEnvFile === 'function') {
    if (fs.existsSync(localEnv)) (process as any).loadEnvFile(localEnv);
    else if (fs.existsSync(rootEnv)) (process as any).loadEnvFile(rootEnv);
  }
} catch (e) {}

keyManager.initializeKeys();

const POSTS_JSON_PATH = path.resolve(__dirname, '../public/blog/posts.json');

const NOVEL_RESEARCH_TOPICS = [
  {
    title: "Post-Quantum Cryptographic Key Encapsulation (ML-KEM/Kyber) in Distributed Consensus Fabrics",
    content: "An exhaustive academic treatise examining the integration of lattice-based ML-KEM/FIPS 203 post-quantum key encapsulation mechanisms into Byzantine fault-tolerant consensus layers. Analyzing handshake latency, cipher state enlargement, and hardware-accelerated polynomial multiplication.",
    link: "https://lorapok.tech/blog",
    source: "Lorapok Quantum Systems Research Unit"
  },
  {
    title: "Zero-Copy WebAssembly Edge Sandboxing: Memory Isolation, Linear Memory Boundaries, and Cold-Start Profiling",
    content: "Architectural deep-dive into running untrusted multi-tenant microservices in WebAssembly runtimes with zero-copy linear memory boundaries, Wasmtime epoch interruption, and sub-millisecond cold starts.",
    link: "https://lorapok.tech/blog",
    source: "Lorapok Systems Architecture Lab"
  },
  {
    title: "Formal Verification of Distributed Raft State Invariants using TLA+ and Dafny Proof Assistants",
    content: "Formal verification specification modeling Raft leader completeness, term monotonicity, and log matching properties using TLA+ model checking and Dafny inductive invariant generation.",
    link: "https://lorapok.tech/blog",
    source: "Lorapok Formal Methods Group"
  },
  {
    title: "SIMD-Vectorized Lexical Parsing Engines: Accelerating Structured Telemetry with AVX-512 and ARM Neon",
    content: "Low-level micro-architectural benchmark and evaluation of structural bitmask vectorization, SIMD character classification, and branchless dispatch for gigabyte-per-second serialization pipelines.",
    link: "https://lorapok.tech/blog",
    source: "Lorapok High Performance Computing Unit"
  }
];

function updateSitemapsAndRss(posts: any[]) {
  const sitemapDir = path.dirname(POSTS_JSON_PATH);
  const nowIso = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog</loc>\n    <lastmod>${nowIso}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  for (const p of posts) {
    if (!p.slug) continue;
    const pDate = p.publishedAt ? String(p.publishedAt).split('T')[0] : nowIso;
    sitemapXml += `  <url>\n    <loc>https://lorapok.tech/blog/${p.slug}</loc>\n    <lastmod>${pDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  sitemapXml += `</urlset>\n`;
  fs.writeFileSync(path.join(sitemapDir, 'sitemap.xml'), sitemapXml, 'utf8');

  let rssXml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n`;
  rssXml += `  <title>LoLaBo — Lorapok Labs Blog</title>\n  <link>https://lorapok.tech/blog</link>\n  <description>Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.</description>\n  <language>en-us</language>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
  for (const p of posts.slice(0, 20)) {
    if (!p.slug) continue;
    rssXml += `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>https://lorapok.tech/blog/${p.slug}</link>\n    <guid>https://lorapok.tech/blog/${p.slug}</guid>\n    <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt || p.title}]]></description>\n  </item>\n`;
  }
  rssXml += `</channel>\n</rss>\n`;
  fs.writeFileSync(path.join(sitemapDir, 'rss.xml'), rssXml, 'utf8');
}

async function runCatchUp(targetPostCount = 2) {
  console.log("=================================================================");
  console.log("⚡ [LoLaBo Catch-Up Engine] Starting missing post generation batch...");
  console.log(`🎯 Target posts to generate: ${targetPostCount}`);
  console.log("=================================================================\n");

  let currentPosts: any[] = [];
  if (fs.existsSync(POSTS_JSON_PATH)) {
    try {
      currentPosts = JSON.parse(fs.readFileSync(POSTS_JSON_PATH, 'utf8'));
    } catch {}
  }

  console.log(`📚 Initial Catalog Size: ${currentPosts.length} posts.`);
  let generatedCount = 0;

  for (let i = 0; i < targetPostCount; i++) {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`📝 [Batch ${i + 1}/${targetPostCount}] Collecting trending tech news or research agenda...`);

    let news = await collectNews(currentPosts);
    if (!news || news.length === 0) {
      console.log("ℹ️ RSS feeds yielded no fresh non-duplicate topics; dispatching from Lorapok Novel Research Agenda...");
      const agendaItem = NOVEL_RESEARCH_TOPICS[i % NOVEL_RESEARCH_TOPICS.length];
      news = [{
        title: agendaItem.title,
        content: agendaItem.content,
        link: agendaItem.link,
        pubDate: new Date().toISOString(),
        source: agendaItem.source
      }];
    }

    // Alternate between Flagship Research Treatise and Architectural Deep-Dive
    const isResearchMode = (i % 2 === 0);
    const category = isResearchMode ? 'AI & Machine Learning' : 'Backend & Infrastructure';
    const provider = isResearchMode ? 'gemini-pro' : 'gemini';

    console.log(`🧠 Writing article ${i + 1} (Mode: ${isResearchMode ? 'PRO RESEARCH TREATISE' : 'ARCHITECTURAL DEEP DIVE'})...`);

    const blogPost = await writeBlogPost(news, {
      provider,
      targetAudience: 'Systems Architects & Senior Engineers',
      tone: isResearchMode ? 'Rigorous academic systems engineering with formal proofs' : 'Deep-dive architectural precision',
      isResearch: isResearchMode
    }, currentPosts);

    // Generate slug
    blogPost.slug = blogPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Duplicate Validation
    const val = validateDuplicatePost({ title: blogPost.title, slug: blogPost.slug }, currentPosts);
    if (val.isDuplicate) {
      console.warn(`🛑 Duplicate detected: ${val.reason}. Skipping to next candidate...`);
      continue;
    }

    const postEntry = {
      id: blogPost.slug,
      ...blogPost,
      publishedAt: new Date(Date.now() - (targetPostCount - 1 - i) * 3600000).toISOString() // realistically distribute
    };

    currentPosts.unshift(postEntry);
    fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(currentPosts, null, 2), 'utf8');
    updateSitemapsAndRss(currentPosts);
    generatedCount++;

    console.log(`✅ Successfully synthesized and cataloged post #${generatedCount}:`);
    console.log(`   📌 Title: "${blogPost.title}"`);
    console.log(`   🏷️  Category: ${blogPost.category} | Type: ${blogPost.type}`);
    console.log(`   🤖 Model Used: ${blogPost.modelUsed} | Tier: ${blogPost.editorialTier}`);
    console.log(`   🖼️  Cover: ${blogPost.coverImage}`);
    console.log(`   📐 Figure 1 (Arch): ${blogPost.architectureImage}`);
    console.log(`   📊 Figure 2 (Bench): ${blogPost.benchmarkImage}`);
    console.log(`   📚 Citations: ${(blogPost.citations || []).length} formal citations`);

    // Polite pause between generations
    if (i < targetPostCount - 1) {
      console.log("⏳ Pausing 4s before next generation cycle...");
      await new Promise(r => setTimeout(r, 4000));
    }
  }

  console.log(`\n=================================================================`);
  console.log(`🎉 [Catch-Up Complete] Generated ${generatedCount} fresh articles.`);
  console.log(`📁 Total posts now in catalog: ${currentPosts.length}`);
  console.log(`=================================================================\n`);
}

if (require.main === module) {
  const count = parseInt(process.argv[2] || '2', 10);
  runCatchUp(count);
}
