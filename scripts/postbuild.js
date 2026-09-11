// scripts/postbuild.js
// Automated Pre-rendering and SEO Generator for Lorapok Labs
// Generates static HTML routes for core pages and pre-renders static SEO pages for every blog post

import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function injectSeo(html, { title, description, keywords, canonical, image, type = 'website', jsonLd }) {
  let modified = html;
  
  if (title) {
    modified = modified.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    modified = modified.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${escapeHtml(title)}$2`);
    modified = modified.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${escapeHtml(title)}$2`);
  }
  
  if (description) {
    modified = modified.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${escapeHtml(description)}$2`);
    modified = modified.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${escapeHtml(description)}$2`);
    modified = modified.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i, `$1${escapeHtml(description)}$2`);
  }
  
  if (keywords) {
    modified = modified.replace(/(<meta\s+name="keywords"\s+content=")[^"]*(")/i, `$1${escapeHtml(keywords)}$2`);
  }
  
  if (canonical) {
    modified = modified.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${escapeHtml(canonical)}$2`);
    modified = modified.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${escapeHtml(canonical)}$2`);
  }
  
  if (image) {
    modified = modified.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/i, `$1${escapeHtml(image)}$2`);
    modified = modified.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/i, `$1${escapeHtml(image)}$2`);
  }
  
  if (type) {
    modified = modified.replace(/(<meta\s+property="og:type"\s+content=")[^"]*(")/i, `$1${escapeHtml(type)}$2`);
  }
  
  if (jsonLd) {
    const jsonLdScript = `\n    <!-- Dynamic Server Pre-rendered SEO JSON-LD -->\n    <script type="application/ld+json" id="json-ld-post">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>\n`;
    modified = modified.replace('</head>', `${jsonLdScript}</head>`);
  }
  
  return modified;
}

if (!fs.existsSync(indexHtml)) {
  console.error("❌ dist/index.html not found. Skipping postbuild.");
  process.exit(0);
}

const baseContent = fs.readFileSync(indexHtml, 'utf8');

// 1. Static Core Routes Meta Map
const routeMeta = {
  projects: {
    title: "Projects & Products — Lorapok Labs",
    description: "Explore 35+ open-source products across AI, developer tools, sensory computing, and biological UI.",
    keywords: "Lorapok, open source projects, developer tools, AI, sensory computing, browser extensions",
    canonical: "https://lorapok.tech/projects"
  },
  agents: {
    title: "AI Agents & Autonomous Multi-Agent Ecosystem — Lorapok Labs",
    description: "224-agent universal multi-agent ecosystem operating on Hub-and-Spoke topology with autonomous CI/CD.",
    keywords: "Loragent, AI agents, multi-agent systems, autonomous coding, LoLaBo agent, Lorapok Labs",
    canonical: "https://lorapok.tech/agents"
  },
  blog: {
    title: "LoLaBo — Lorapok Labs Blog & Technical Architecture",
    description: "Autonomous AI-curated tech insights, system architecture deep-dives, and research published by Lorapok Labs.",
    keywords: "LoLaBo, Lorapok Labs blog, AI writer, engineering architecture, system design, tech news",
    canonical: "https://lorapok.tech/blog",
    image: "https://lorapok.tech/assets/lolabo-logo.png"
  },
  team: {
    title: "The Team & Autonomous Agents — Lorapok Labs",
    description: "Meet the engineers, architects, and autonomous AI personas powering Lorapok Labs.",
    keywords: "Lorapok Labs team, engineers, AI personas, Dr Larva, Captain Deploy",
    canonical: "https://lorapok.tech/team"
  },
  about: {
    title: "About Lorapok Labs — Biological UI & Sensory Computing",
    description: "Our philosophy, mission, and engineering ethos blending sensory computing with resilient open-source tools.",
    keywords: "About Lorapok Labs, sensory computing, biological UI, mission",
    canonical: "https://lorapok.tech/about"
  },
  changelog: {
    title: "Changelog & Releases — Lorapok Labs",
    description: "Release history, product updates, agent logs, and ecosystem milestones across Lorapok Labs.",
    keywords: "Lorapok changelog, release history, updates, milestones",
    canonical: "https://lorapok.tech/changelog"
  },
  contact: {
    title: "Contact & Community — Lorapok Labs",
    description: "Connect with Lorapok Labs creators, report issues, join Discord, or partner on open source.",
    keywords: "Contact Lorapok Labs, Discord, GitHub, support, partnership",
    canonical: "https://lorapok.tech/contact"
  }
};

for (const [route, meta] of Object.entries(routeMeta)) {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  const rendered = injectSeo(baseContent, meta);
  fs.writeFileSync(path.join(routeDir, 'index.html'), rendered);
}
console.log(`✓ Postbuild: generated SEO-optimized index.html for ${Object.keys(routeMeta).length} core routes.`);

// 2. Pre-render Static SEO Pages for Every Blog Post
const postsJsonPath = path.resolve('public/blog/posts.json');
let posts = [];
if (fs.existsSync(postsJsonPath)) {
  try {
    posts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
  } catch (err) {
    console.warn("⚠️ Could not parse public/blog/posts.json:", err);
  }
}

let blogPagesCount = 0;
for (const post of posts) {
  if (!post.slug) continue;

  const postDir = path.join(distDir, 'blog', post.slug);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  const canonicalUrl = `https://lorapok.tech/blog/${post.slug}`;
  const allTags = Array.from(new Set([...(post.tags || []), 'LorapokLabs', 'Lorapok']));
  const publishedIso = post.publishedAt || new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://lorapok.tech/blog",
          "name": "LoLaBo — Lorapok Labs Blog"
        },
        "headline": post.title,
        "description": post.excerpt,
        "image": [post.coverImage || "https://lorapok.tech/assets/lorapok-hero.png"],
        "datePublished": publishedIso,
        "dateModified": publishedIso,
        "author": {
          "@type": "Person",
          "name": post.author?.name || "LoLaBo AI Agent",
          "jobTitle": post.author?.designation || "Autonomous Technical Writer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lorapok Labs",
          "url": "https://lorapok.tech",
          "logo": {
            "@type": "ImageObject",
            "url": "https://lorapok.tech/assets/lorapok-labs-logo.png"
          }
        },
        "mainEntityOfPage": canonicalUrl,
        "keywords": allTags.join(", ")
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lorapok.tech" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://lorapok.tech/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
      }
    ]
  };

  const renderedPost = injectSeo(baseContent, {
    title: post.seo?.metaTitle || `${post.title} | LoLaBo — Lorapok Labs`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: allTags.join(', '),
    canonical: canonicalUrl,
    image: post.coverImage || "https://lorapok.tech/assets/lorapok-hero.png",
    type: "article",
    jsonLd
  });

  fs.writeFileSync(path.join(postDir, 'index.html'), renderedPost);
  blogPagesCount++;
}

console.log(`✓ Postbuild: generated ${blogPagesCount} static pre-rendered blog SEO pages under dist/blog/:slug/index.html.`);

// 3. Ensure sitemaps, favicons, manifests, and RSS are copied to dist
const copyFiles = [
  { src: 'public/favicon.ico', dest: 'dist/favicon.ico' },
  { src: 'public/favicon.svg', dest: 'dist/favicon.svg' },
  { src: 'public/site.webmanifest', dest: 'dist/site.webmanifest' },
  { src: 'public/manifest.json', dest: 'dist/manifest.json' },
  { src: 'public/sitemap.xml', dest: 'dist/sitemap.xml' },
  { src: 'public/blog/sitemap.xml', dest: 'dist/blog/sitemap.xml' },
  { src: 'public/blog/rss.xml', dest: 'dist/blog/rss.xml' },
  { src: 'public/blog/posts.json', dest: 'dist/blog/posts.json' },
  { src: 'public/robots.txt', dest: 'dist/robots.txt' }
];

for (const { src, dest } of copyFiles) {
  if (fs.existsSync(src)) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}
console.log(`✓ Postbuild: verified XML sitemaps, RSS feed, and robots.txt in dist/.`);
