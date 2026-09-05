import { useEffect } from "react";

type SEOHeadProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
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
}: SEOHeadProps) {
  const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement | null;
      }
      if (!el) {
        el = document.createElement("meta");
        if (property.startsWith("og:") || property.startsWith("article:")) {
          el.setAttribute("property", property);
        } else {
          el.setAttribute("name", property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:url", canonicalUrl);
    setMeta("og:image", imageUrl);
    setMeta("og:type", "website");
    setMeta("og:site_name", BASE_TITLE);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);
    setMeta("twitter:site", "@LorapokLabs");

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [fullTitle, description, canonicalUrl, imageUrl]);

  return null;
}
