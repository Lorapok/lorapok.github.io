// src/blog/components/SEOHead.tsx
import { useEffect } from "react";
import type { BlogPost } from "../BlogApp";

interface SEOHeadProps {
  post?: BlogPost | null;
}

export default function SEOHead({ post }: SEOHeadProps) {
  useEffect(() => {
    if (!post) {
      document.title = "LoLaBo — Lorapok Labs Blog";
      updateMeta("description", "AI-curated tech insights by Lorapok Labs.");
      return;
    }

    // Standard Tags
    document.title = post.seo.metaTitle || `${post.title} | LoLaBo`;
    updateMeta("description", post.seo.metaDescription || post.excerpt);
    updateMeta("keywords", post.tags.join(", "));

    // Open Graph
    updateMeta("og:title", post.title, "property");
    updateMeta("og:description", post.excerpt, "property");
    updateMeta("og:image", post.coverImage, "property");
    updateMeta("og:url", window.location.href, "property");
    updateMeta("og:type", "article", "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", post.title);
    updateMeta("twitter:description", post.excerpt);
    updateMeta("twitter:image", post.coverImage);

    // Schema.org JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.coverImage],
      "datePublished": post.publishedAt?.toDate?.()?.toISOString(),
      "author": [{
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.designation
      }]
    };
    
    let script = document.getElementById("json-ld") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

  }, [post]);

  return null;
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
