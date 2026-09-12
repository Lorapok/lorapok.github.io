// src/blog/components/LoLaBoImage.tsx
// High-performance image component with progressive loading, blur-up skeleton,
// in-memory session caching, prefetching, and guaranteed zero-fail fallback for LoLaBo

import React, { useState, useEffect, useRef } from "react";
import { ImageOff, Sparkles } from "lucide-react";

// Global cache for images already loaded during this browser session
const loadedImageCache = new Set<string>();

export function preloadImage(src: string): Promise<void> {
  if (!src || loadedImageCache.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImageCache.add(src);
      resolve();
    };
    img.onerror = () => resolve();
  });
}

export function preloadImages(srcList: string[]) {
  if (typeof window === "undefined" || !Array.isArray(srcList)) return;
  srcList.filter(Boolean).slice(0, 10).forEach(src => {
    if (!loadedImageCache.has(src)) {
      preloadImage(src);
    }
  });
}

interface LoLaBoImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackCategory?: string;
}

export default function LoLaBoImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  priority = false,
  aspectRatio,
  fallbackCategory = "Systems Architecture",
}: LoLaBoImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(() => loadedImageCache.has(src));
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }
    if (loadedImageCache.has(src)) {
      setIsLoaded(true);
      setHasError(false);
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    // If image was already complete in DOM cache (e.g. back/forward navigation)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      loadedImageCache.add(src);
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    loadedImageCache.add(src);
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#0a0c10] ${aspectRatio || ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* 1. Shimmering Skeleton Loader (active while loading) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] animate-pulse flex items-center justify-center">
          <div className="flex items-center gap-2 text-white/20 font-mono text-xs">
            <Sparkles className="w-4 h-4 animate-spin text-[var(--lp-accent,#67ff8f)]/40" />
            <span className="tracking-widest uppercase text-[10px]">Loading Visual...</span>
          </div>
        </div>
      )}

      {/* 2. Primary Image with Smooth Opacity Fade-In */}
      {!hasError && src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-all duration-500 ease-out ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02] filter blur-sm"
          }`}
        />
      )}

      {/* 3. Guaranteed Editorial Fallback (Displayed if image link errors or fails) */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0e111a] via-[#090b10] to-[#121624] border border-white/5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-[var(--lp-accent,#67ff8f)] shadow-lg">
            <ImageOff className="w-6 h-6 opacity-70" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--lp-accent,#67ff8f)] font-bold mb-1">
            {fallbackCategory}
          </span>
          <p className="text-xs text-gray-400 font-sans font-medium line-clamp-2 max-w-sm px-2">
            {alt}
          </p>
        </div>
      )}
    </div>
  );
}
