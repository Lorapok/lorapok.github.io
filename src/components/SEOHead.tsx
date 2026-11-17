import { useEffect } from "react";

type SEOHeadProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  keywords?: string;
  robots?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const BASE_TITLE = "Lorapok Labs";
const BASE_DESCRIPTION =
  "Open-source products that feel alive. Sensory computing, biological UI, and practical engineering.";
const BASE_URL = "https://lorapok.tech";
const BASE_IMAGE = "/assets/lorapok-hero.png";

export function SEOHead({
  title,
  description = BASE_DESCRIPTION,
  path = "/",
  image = BASE_IMAGE,
  imageAlt,
  imageWidth,
  imageHeight,
  keywords,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  type = "website",
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
  const canonicalUrl = new URL(path, `${BASE_URL}/`).toString();
  const imageUrl = new URL(image, `${BASE_URL}/`).toString();
  const socialImageAlt = imageAlt || `${fullTitle} social preview`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (property: string, content: string) => {
      const isProperty = property.startsWith("og:") || property.startsWith("article:");
      const attribute = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attribute, property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const removeMeta = (name: string) => {
      document.querySelector(`meta[name="${name}"]`)?.remove();
    };
    const removePropertyMeta = (property: string) => {
      document.querySelector(`meta[property="${property}"]`)?.remove();
    };

    setMeta("description", description);
    setMeta("robots", robots);
    setMeta("googlebot", robots);
    if (keywords) setMeta("keywords", keywords);
    else removeMeta("keywords");
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:url", canonicalUrl);
    setMeta("og:image", imageUrl);
    setMeta("og:image:secure_url", imageUrl);
    setMeta("og:image:alt", socialImageAlt);
    if (imageWidth && imageHeight) {
      setMeta("og:image:width", String(imageWidth));
      setMeta("og:image:height", String(imageHeight));
    } else {
      removePropertyMeta("og:image:width");
      removePropertyMeta("og:image:height");
    }
    setMeta("og:type", type);
    setMeta("og:site_name", BASE_TITLE);
    setMeta("og:locale", "en_US");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);
    setMeta("twitter:image:alt", socialImageAlt);
    setMeta("twitter:site", "@LorapokLabs");
    setMeta("twitter:creator", "@LorapokLabs");
    setMeta("twitter:url", canonicalUrl);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const jsonLdId = "lorapok-page-jsonld";
    const existing = document.getElementById(jsonLdId);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Push SPA virtual pageview to Google Tag Manager dataLayer & Meta Pixel
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        dataLayer?: Record<string, unknown>[];
      };
      win.dataLayer = win.dataLayer || [];
      win.dataLayer.push({
        event: "page_view",
        page_title: fullTitle,
        page_location: canonicalUrl,
        page_path: path,
      });
    }
  }, [fullTitle, description, canonicalUrl, imageUrl, socialImageAlt, imageWidth, imageHeight, keywords, robots, type, jsonLd, path]);

  return null;
}
