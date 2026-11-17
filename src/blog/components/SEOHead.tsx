// src/blog/components/SEOHead.tsx
// Dynamic Client-Side SEO, OpenGraph, JSON-LD Schema, and Brand Icon Engine for LoLaBo

import { useEffect } from "react";
import type { BlogPost } from "../BlogApp";
import blogMeta from "../seo.json";

interface SEOHeadProps {
  post?: BlogPost | null;
}

export default function SEOHead({ post }: SEOHeadProps) {
  useEffect(() => {
    // Dynamically set LoLaBo brand favicon on blog routes
    updateFavicon("/assets/lolabo-icon.svg", "image/svg+xml");

    if (!post) {
      removeArticleMetadata();
      removeMeta("og:image:width", "property");
      removeMeta("og:image:height", "property");
      document.title = blogMeta.title;
      updateMeta("description", blogMeta.description);
      updateMeta("keywords", blogMeta.keywords);
      updateMeta("og:title", blogMeta.title, "property");
      updateMeta("og:description", blogMeta.description, "property");
      updateMeta("og:image", blogMeta.image, "property");
      updateMeta("og:url", blogMeta.canonical, "property");
      updateMeta("og:type", "website", "property");
      updateMeta("og:site_name", "Lorapok Labs", "property");
      updateMeta("og:locale", "en_US", "property");
      updateMeta("og:image:secure_url", blogMeta.image, "property");
      updateMeta("og:image:alt", "LoLaBo research journal by Lorapok Labs", "property");
      updateMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
      updateMeta("googlebot", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
      updateMeta("twitter:card", "summary_large_image");
      updateMeta("twitter:site", "@LorapokLabs");
      updateMeta("twitter:creator", "@LorapokLabs");
      updateMeta("twitter:title", blogMeta.title);
      updateMeta("twitter:description", blogMeta.description);
      updateMeta("twitter:image", blogMeta.image);
      updateMeta("twitter:image:alt", "LoLaBo research journal by Lorapok Labs");
      updateMeta("twitter:url", blogMeta.canonical);
      updateCanonical(blogMeta.canonical);
      return () => {
        updateFavicon("/assets/lorapok-icon.svg", "image/svg+xml");
        removeArticleMetadata();
      };
    }

    const canonicalUrl = `https://lorapok.tech/blog/${post.slug}/`;
    const allTags = Array.from(new Set([...(post.tags || []), "LorapokLabs", "Lorapok"]));
    const socialImage = post.coverImage || "https://lorapok.tech/assets/lolabo-logo.png";
    removeMeta("og:image:width", "property");
    removeMeta("og:image:height", "property");

    // Standard Tags
    document.title = post.seo?.metaTitle || `${post.title} | LoLaBo — Lorapok Labs`;
    updateMeta("description", post.seo?.metaDescription || post.excerpt);
    updateMeta("keywords", allTags.join(", "));
    updateMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    updateMeta("googlebot", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    updateCanonical(canonicalUrl);

    // Open Graph
    updateMeta("og:title", post.title, "property");
    updateMeta("og:description", post.excerpt, "property");
    updateMeta("og:image", socialImage, "property");
    updateMeta("og:image:secure_url", socialImage, "property");
    updateMeta("og:image:alt", `${post.title} — LoLaBo article cover`, "property");
    updateMeta("og:url", canonicalUrl, "property");
    updateMeta("og:type", "article", "property");
    updateMeta("og:site_name", "Lorapok Labs", "property");
    updateMeta("og:locale", "en_US", "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:site", "@LorapokLabs");
    updateMeta("twitter:creator", "@LorapokLabs");
    updateMeta("twitter:title", post.title);
    updateMeta("twitter:description", post.excerpt);
    updateMeta("twitter:image", socialImage);
    updateMeta("twitter:image:alt", `${post.title} — LoLaBo article cover`);
    updateMeta("twitter:url", canonicalUrl);

    // Published date resolution
    const toIsoDate = (value: unknown): string | undefined => {
      if (!value) return undefined;
      if (typeof value === "object" && value !== null && "toDate" in value) {
        const toDate = (value as { toDate?: unknown }).toDate;
        if (typeof toDate === "function") return (toDate.call(value) as Date).toISOString();
      }
      const date = new Date(value as string | number | Date);
      return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
    };

    const pubDateIso = toIsoDate(post.publishedAt);
    const rawModified = post.updatedAt || post.modifiedAt;
    const modifiedDateIso = toIsoDate(rawModified) || pubDateIso;
    if (pubDateIso) updateMeta("article:published_time", pubDateIso, "property");
    if (modifiedDateIso) updateMeta("article:modified_time", modifiedDateIso, "property");
    updateMeta("article:section", post.category || "Engineering", "property");

    // Schema.org JSON-LD (Graph with Article + Breadcrumbs + Publisher)
    const schema = {
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
          "image": [socialImage],
          ...(pubDateIso ? { "datePublished": pubDateIso } : {}),
          ...(modifiedDateIso ? { "dateModified": modifiedDateIso } : {}),
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
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://lorapok.tech/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "LoLaBo Blog",
              "item": "https://lorapok.tech/blog/"
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
      removeArticleMetadata();
    };
  }, [post]);

  return null;
}

function removeArticleMetadata() {
  document.getElementById("json-ld-post")?.remove();
  document.querySelectorAll('meta[property^="article:"]').forEach((node) => node.remove());
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType?.getAttribute("content") === "article") ogType.setAttribute("content", "website");
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

function removeMeta(name: string, attr: "name" | "property" = "name") {
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
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
