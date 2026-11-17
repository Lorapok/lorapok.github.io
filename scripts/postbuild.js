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

function renderMarkdown(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLanguage = '';
  let codeLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    const fence = line.match(/^```\s*([^\s]*)/);
    if (fence) {
      flushParagraph();
      closeList();
      if (inCode) {
        output.push(`<pre><code${codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCode = false;
        codeLanguage = '';
        codeLines = [];
      } else {
        inCode = true;
        codeLanguage = fence[1] || '';
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      output.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextType = ordered ? 'ol' : 'ul';
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        output.push(`<${listType}>`);
      }
      output.push(`<li>${escapeHtml((ordered || unordered)[1])}</li>`);
      continue;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      closeList();
      output.push(`<blockquote>${escapeHtml(quote[1])}</blockquote>`);
      continue;
    }
    paragraph.push(line.trim());
  }

  if (inCode) output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  flushParagraph();
  closeList();
  return `<article class="seo-prerender__article">${output.join('\n')}</article>`;
}

function renderSections(sections = []) {
  return sections.map(({ heading, body }) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(body)}</p></section>`).join('\n');
}

function injectSeo(html, { title, description, keywords, canonical, image, type = 'website', robots, jsonLd, prerenderBody = '' }) {
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

  if (robots) {
    modified = modified.replace('</head>', `    <meta name="robots" content="${escapeHtml(robots)}" />\n</head>`);
  }
  
  if (jsonLd) {
    const jsonLdScript = `\n    <!-- Dynamic Server Pre-rendered SEO JSON-LD -->\n    <script type="application/ld+json" id="json-ld-post">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>\n`;
    modified = modified.replace('</head>', `${jsonLdScript}</head>`);
  }

  // Give crawlers and no-JavaScript visitors meaningful route content immediately.
  // React replaces this server-built document on startup.
  if (title && description) {
    const prerender = `
    <main class="seo-prerender" aria-label="${type === 'article' ? 'Article content' : 'Page content'}">
      <p>${type === 'article' ? 'Lorapok journal' : 'Lorapok Labs'}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      ${prerenderBody}
      <nav aria-label="Related pages"><a href="https://lorapok.tech/">Lorapok Labs home</a></nav>
    </main>`;
    const prerenderStyles = `<style id="seo-prerender-styles">
      .seo-prerender{min-height:100vh;box-sizing:border-box;padding:clamp(3rem,8vw,8rem);background:#061c17;color:#effff8;font-family:system-ui,sans-serif;display:grid;align-content:start;gap:1.25rem}.seo-prerender>*{max-width:980px;width:100%;margin-inline:auto}
      .seo-prerender>p:first-child{color:#67f5bb;text-transform:uppercase;letter-spacing:.14em;font-size:.75rem}.seo-prerender h1{margin-block:0;font-size:clamp(2.5rem,7vw,6rem);line-height:1;letter-spacing:-.055em}.seo-prerender h2{margin:2.5rem 0 .65rem;font-size:clamp(1.5rem,3vw,2.5rem)}.seo-prerender h3,.seo-prerender h4{margin:2rem 0 .5rem}.seo-prerender p,.seo-prerender li,.seo-prerender blockquote{color:#aac8bd;line-height:1.75}.seo-prerender pre{overflow:auto;padding:1rem;border:1px solid rgba(103,245,187,.16);border-radius:12px;background:#03100c;color:#dffbf0}.seo-prerender blockquote{margin-left:0;padding-left:1rem;border-left:3px solid #67f5bb}.seo-prerender a{color:#67f5bb}.seo-prerender nav{padding-top:2rem;border-top:1px solid rgba(103,245,187,.16)}
    </style>`;
    modified = modified.replace('</head>', `${prerenderStyles}</head>`);
    modified = modified.replace('<div id="root"></div>', `<div id="root">${prerender}</div>`);
  }
  
  return modified;
}

if (!fs.existsSync(indexHtml)) {
  console.error("❌ dist/index.html not found. Skipping postbuild.");
  process.exit(0);
}

const baseContent = fs.readFileSync(indexHtml, 'utf8');
const blogMetaPath = path.resolve('src/blog/seo.json');
const blogMeta = JSON.parse(fs.readFileSync(blogMetaPath, 'utf8'));

const routePrerender = {
  projects: [
    { heading: "Open-source product catalog", body: "Browse developer tools, AI systems, media software, browser extensions, mobile applications, sensory-computing experiments, and public release links maintained across the Lorapok ecosystem." },
    { heading: "Evidence with every project", body: "Project entries connect to source repositories, live demonstrations, package registries, extension stores, or release documentation so visitors can inspect the work directly." },
  ],
  "creator-works": [
    { heading: "Selected studio work", body: "The Creator Works collection documents sculpture, kinetic installations, clay studies, Bengali folk craft, and other physical or digital artwork from Lorapok collective creators." },
    { heading: "Creator context", body: "Each work is presented with its creator, medium, story, and portfolio path rather than being treated as anonymous decoration." },
  ],
  agents: [
    { heading: "Loragent catalog", body: "Explore published agent definitions, specialist roles, skills, formations, and commands designed for multi-agent engineering workflows." },
    { heading: "Readable orchestration", body: "The catalog explains what each agent is for and how it participates in a wider formation instead of presenting an inflated capability count without context." },
  ],
  mascots: [
    { heading: "A living character archive", body: "Explore restored cyber-biological larvae species, useful Ribo roles, original character studies, and the visual experiments preserved across the Lorapok asset drive." },
    { heading: "One identity across many worlds", body: "The gallery documents how shared anatomy, leaf antennae, segmented forms, and sensory signals evolve across Labs, LoLaBo, Automate, LoraHost, and Instar without flattening each product identity." },
  ],
  partners: [
    { heading: "Verified relationships and benefits", body: "Explore approved affiliate relationships and independent references with exact visitor benefits, relationship labels, and the date each offer was last checked." },
    { heading: "Transparent commercial disclosure", body: "Tracked links may support Lorapok Labs. Provider-controlled pricing, eligibility, fulfillment, privacy, and offer terms remain authoritative." },
  ],
  blog: [
    { heading: "Engineering stories and research", body: "LoLaBo publishes architecture notes, project explainers, research briefs, performance analysis, and source-backed dispatches from the Lorapok ecosystem." },
    { heading: "Public source trail", body: "Articles identify their authorship, publication status, related repositories, citations, and available technical diagrams." },
  ],
  team: [
    { heading: "People behind the work", body: "Meet the engineers, artists, quality specialists, and contributors responsible for Lorapok products, research, and Creator Works." },
    { heading: "Portfolio-first profiles", body: "Team profiles connect roles to real projects, public portfolios, specialties, and contribution evidence." },
  ],
  about: [
    { heading: "Biological UI", body: "Lorapok uses depth, signal, organic rhythm, and responsive feedback to make software feel active without sacrificing clarity or accessibility." },
    { heading: "Open engineering", body: "The lab favors readable systems, inspectable source, direct feedback loops, and practical tools that people can learn from, fork, and extend." },
  ],
  changelog: [
    { heading: "Release history", body: "Follow product launches, ecosystem milestones, catalog updates, design changes, and engineering improvements across Lorapok Labs." },
    { heading: "Traceable progress", body: "Entries point visitors toward the affected product or public source whenever supporting evidence is available." },
  ],
  contact: [
    { heading: "Start a conversation", body: "Contact Lorapok Labs about open-source collaboration, product work, Creator Works, partnerships, support, or responsible issue reporting." },
    { heading: "Community channels", body: "The contact page provides direct paths to the founder, GitHub organization, social channels, and relevant project issue trackers." },
  ],
  privacy: [
    { heading: "Consent and measurement", body: "Non-essential advertising and analytics tags remain blocked until a visitor makes an affirmative choice, and that choice can be reviewed or withdrawn later." },
    { heading: "Data handling", body: "The policy explains site storage, third-party services, contact messages, advertising, and the options available to visitors." },
  ],
  terms: [
    { heading: "Using Lorapok resources", body: "These terms describe the relationship between the public website, linked open-source repositories, third-party services, advertising, and sponsored references." },
    { heading: "Repository licenses", body: "Individual project licenses remain authoritative for copying, modification, redistribution, and contribution terms." },
  ],
  dev: [
    { heading: "Developer Studio", body: "Open the authenticated Lorapok workspace for content, provider, project, analytics, and studio operations." },
    { heading: "Private workspace boundary", body: "Studio credentials remain session-isolated and administrative actions require the configured authentication and access rules." },
  ],
};

// 1. Static Core Routes Meta Map
const routeMeta = {
  projects: {
    title: "Projects & Products — Lorapok Labs",
    description: "Public open-source repositories from @Maijied and @Lorapok, plus Creator Works in 3D art and design, with GitHub links and live demos.",
    keywords: "Lorapok, open source projects, developer tools, 3D art and design, AI, sensory computing, browser extensions",
    canonical: "https://lorapok.tech/projects/"
  },
  'creator-works': {
    title: "Creator Works — Studio Sculpture & 3D Art — Lorapok Labs",
    description: "Selected studio works in 3D art and design from Lorapok collective creators — figurative sculpture, kinetic installations, clay life studies, and Bengali folk craft.",
    keywords: "Creator Works, 3D art and design, sculpture, Borshon Mondol, Lorapok Labs, mixed media, figurative art",
    canonical: "https://lorapok.tech/creator-works/",
    image: "https://lorapok.tech/assets/projects/borshon-frozen-liquidity.jpg"
  },
  agents: {
    title: "AI Agents & Autonomous Multi-Agent Ecosystem — Lorapok Labs",
    description: "224 agent skill definitions in the Loragent catalog, grouped by formation.",
    keywords: "Loragent, AI agents, multi-agent systems, autonomous coding, LoLaBo agent, Lorapok Labs",
    canonical: "https://lorapok.tech/agents/"
  },
  mascots: {
    title: "Larvae Planetarium & Mascot Archive — Lorapok Labs",
    description: "Explore Lorapok's living mascot universe: cyber-biological larvae species, operational Ribo roles, and original artwork from the permanent drive archive.",
    keywords: "Lorapok mascot, Ribo, larvae characters, cyber biological design, mascot gallery, Instar",
    canonical: "https://lorapok.tech/mascots/",
    image: "https://lorapok.tech/assets/ribo/archive/metamorphosis-stages.webp"
  },
  partners: {
    title: "Partners & Verified Benefits — Lorapok Labs",
    description: "Transparent Lorapok Labs partner and affiliate references, including verified customer benefits, relationship labels, and provider terms.",
    keywords: "Lorapok partners, verified benefits, affiliate disclosure, Dynadot referral credit",
    canonical: "https://lorapok.tech/partners/",
    image: "https://lorapok.tech/assets/ribo/generated/20261117/founder-navigator.webp"
  },
  blog: {
    ...blogMeta
  },
  team: {
    title: "The Team & Autonomous Agents — Lorapok Labs",
    description: "Engineers, 3D artists, and specialists at Lorapok Labs — including founder Mohammad Maizied Hasan Majumder, senior full-stack engineer Shamim Ahammed, 3D Artist Borshon Mondol, and SQA engineer Tanjil Bhoiyan.",
    keywords: "Lorapok Labs team, engineers, Shamim Ahammed, 3D art and design, Borshon Mondol, SQA, Mohammad Maizied Hasan Majumder",
    canonical: "https://lorapok.tech/team/"
  },
  about: {
    title: "About Lorapok Labs — Biological UI & Sensory Computing",
    description: "Our philosophy, mission, and engineering ethos blending sensory computing with resilient open-source tools.",
    keywords: "About Lorapok Labs, sensory computing, biological UI, mission",
    canonical: "https://lorapok.tech/about/"
  },
  changelog: {
    title: "Changelog & Releases — Lorapok Labs",
    description: "Release history, product updates, agent logs, and ecosystem milestones across Lorapok Labs.",
    keywords: "Lorapok changelog, release history, updates, milestones",
    canonical: "https://lorapok.tech/changelog/"
  },
  contact: {
    title: "Contact & Community — Lorapok Labs",
    description: "Connect with Lorapok Labs creators, report issues, join Discord, or partner on open source.",
    keywords: "Contact Lorapok Labs, Discord, GitHub, support, partnership",
    canonical: "https://lorapok.tech/contact/"
  },
  privacy: {
    title: "Privacy Policy — Lorapok Labs",
    description: "How lorapok.tech uses cookies, Google AdSense, and contact-form messages.",
    keywords: "Lorapok privacy policy, AdSense, cookies",
    canonical: "https://lorapok.tech/privacy/"
  },
  terms: {
    title: "Terms of Use — Lorapok Labs",
    description: "Terms for using lorapok.tech, including open-source projects, ads, and the sponsored partner link.",
    keywords: "Lorapok terms, advertising, open source",
    canonical: "https://lorapok.tech/terms/"
  },
  dev: {
    title: "Developer Studio — Lorapok Labs",
    description: "Authenticated Lorapok developer workspace for content, AI providers, projects, analytics, and studio operations.",
    keywords: "",
    canonical: "https://lorapok.tech/dev/",
    robots: "noindex, nofollow"
  }
};

for (const [route, meta] of Object.entries(routeMeta)) {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  const rendered = injectSeo(baseContent, { ...meta, prerenderBody: renderSections(routePrerender[route]) });
  fs.writeFileSync(path.join(routeDir, 'index.html'), rendered);
}
console.log(`✓ Postbuild: generated SEO-optimized index.html for ${Object.keys(routeMeta).length} core routes.`);

const homeSeo = injectSeo(baseContent, {
  title: "Lorapok Labs — Open-source Products That Feel Alive",
  description: "Lorapok Labs ships open-source software, 224 Loragent skills, and Creator Works in 3D art and design — biological UI, sensory computing, and practical engineering from Dhaka.",
  keywords: "Lorapok Labs, open source, Creator Works, 3D art and design, Loragent, developer tools, sensory computing, biological UI, LoLaBo",
  canonical: "https://lorapok.tech/",
  image: "https://lorapok.tech/assets/lorapok-labs-logo.png",
  prerenderBody: renderSections([
    { heading: "Open Source Universe", body: "Explore public products, repositories, releases, engineering stories, research, contributors, and opportunities to collaborate." },
    { heading: "Business Universe", body: "Discover commercial products, cloud services, partnership paths, customer inquiries, and the operational work that remains distinct from community projects." },
    { heading: "Living Universe", body: "Both experiences share Lorapok's biological interface system, evidence-first storytelling, and commitment to accurately labeling live, connected, and prototype capabilities." },
  ])
});
fs.writeFileSync(indexHtml, homeSeo);
console.log("✓ Postbuild: refreshed root index.html SEO meta.");

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
  const isPublic = (post.status || "published") === "published" && (post.source === "manual" || (post.source === "ai-agent" && post.gate === "passed"));
  if (!isPublic) continue;

  const postDir = path.join(distDir, 'blog', post.slug);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  const canonicalUrl = `https://lorapok.tech/blog/${post.slug}/`;
  const allTags = Array.from(new Set([...(post.tags || []), 'LorapokLabs', 'Lorapok']));
  const publishedIso = post.publishedAt || post.createdAt;
  const modifiedIso = post.updatedAt || post.modifiedAt || publishedIso;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://lorapok.tech/blog/",
          "name": "LoLaBo — Lorapok Labs Blog"
        },
        "headline": post.title,
        "description": post.excerpt,
        "image": [post.coverImage || "https://lorapok.tech/assets/lorapok-hero.png"],
        "datePublished": publishedIso,
        "dateModified": modifiedIso,
        "author": {
          "@type": "Person",
          "name": post.author?.name || "LoLaBo AI Agent",
          "jobTitle": post.author?.designation || "Autonomous Technical Writer"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lorapok Labs",
          "url": "https://lorapok.tech/",
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
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lorapok.tech/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://lorapok.tech/blog/" },
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
    jsonLd,
    prerenderBody: `<p class="seo-prerender__byline">By ${escapeHtml(post.author?.name || "LoLaBo AI Agent")}${publishedIso ? ` · Published ${escapeHtml(publishedIso)}` : ""}</p>${renderMarkdown(post.content || post.excerpt)}`
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
