// src/blog/components/SEOHead.tsx
// Dynamic Client-Side SEO, OpenGraph, JSON-LD Schema, and Brand Icon Engine for LoLaBo

import { useEffect } from "react";
import type { BlogPost } from "../BlogApp";

interface SEOHeadProps {
  post?: BlogPost | null;
}

export default function SEOHead({ post }: SEOHeadProps) {
  useEffect(() => {
    // Dynamically set LoLaBo brand favicon on blog routes
    updateFavicon("/assets/lolabo-icon.svg", "image/svg+xml");

    if (!post) {
      document.title = "LoLaBo — Lorapok Labs Blog & Technical Architecture";
      updateMeta("description", "Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.");
      updateMeta("keywords", "Lorapok Labs, LoLaBo, AI engineering, biological UI, autonomous agents, open source, tech blog");
      updateMeta("og:title", "LoLaBo — Lorapok Labs Blog & Technical Architecture", "property");
      updateMeta("og:description", "Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.", "property");
      updateMeta("og:image", "https://lorapok.tech/assets/lolabo-logo.png", "property");
      updateMeta("og:url", "https://lorapok.tech/blog", "property");
      updateMeta("twitter:title", "LoLaBo — Lorapok Labs Blog & Technical Architecture");
      updateMeta("twitter:description", "Autonomous AI-curated tech insights, system architecture deep-dives, and engineering research by Lorapok Labs.");
      updateMeta("twitter:image", "https://lorapok.tech/assets/lolabo-logo.png");
      updateCanonical("https://lorapok.tech/blog");
      return () => {
        updateFavicon("/assets/lorapok-icon.svg", "image/svg+xml");
      };
    }

    const canonicalUrl = `https://lorapok.tech/blog/${post.slug}`;
    const allTags = Array.from(new Set([...(post.tags || []), "LorapokLabs", "Lorapok"]));

    // Standard Tags
    document.title = post.seo?.metaTitle || `${post.title} | LoLaBo — Lorapok Labs`;
    updateMeta("description", post.seo?.metaDescription || post.excerpt);
    updateMeta("keywords", allTags.join(", "));
    updateCanonical(canonicalUrl);

    // Open Graph
    updateMeta("og:title", post.title, "property");
    updateMeta("og:description", post.excerpt, "property");
    updateMeta("og:image", post.coverImage || "https://lorapok.tech/assets/lolabo-logo.png", "property");
    updateMeta("og:url", canonicalUrl, "property");
    updateMeta("og:type", "article", "property");
    updateMeta("og:site_name", "Lorapok Labs", "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:site", "@LorapokLabs");
    updateMeta("twitter:title", post.title);
    updateMeta("twitter:description", post.excerpt);
    updateMeta("twitter:image", post.coverImage || "https://lorapok.tech/assets/lolabo-logo.png");

    // Published date resolution
    let pubDateIso = new Date().toISOString();
    if (post.publishedAt && typeof (post.publishedAt as any).toDate === 'function') {
      pubDateIso = (post.publishedAt as any).toDate().toISOString();
    } else if (post.publishedAt) {
      pubDateIso = new Date(post.publishedAt as any).toISOString();
    }

    // Schema.org JSON-LD (Graph with Article + Breadcrumbs + Publisher)
    const schema = {
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
          "image": [post.coverImage || "https://lorapok.tech/assets/lolabo-logo.png"],
          "datePublished": pubDateIso,
          "dateModified": pubDateIso,
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
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://lorapok.tech"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "LoLaBo Blog",
              "item": "https://lorapok.tech/blog"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": canonicalUrl
            }
          ]
        }
      ]
    };
    
    let script = document.getElementById("json-ld-post") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld-post";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

    return () => {
      updateFavicon("/assets/lorapok-icon.svg", "image/svg+xml");
    };
  }, [post]);

  return null;
}

function updateFavicon(href: string, type: string = "image/svg+xml") {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = type;
  link.href = href;
}

function updateMeta(name: string, content: string, attr: "name" | "property" = "name") {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function updateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}
