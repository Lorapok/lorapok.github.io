// src/blog/BlogApp.tsx
// LoLaBo — Lorapok Labs Blog
// Premium tech blog with AI-powered content generation and Medium-grade editorial layout

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Bookmark,
  Copy,
  Check,
  BookOpen,
  Terminal,
  ExternalLink,
  Compass,
  Rss,
  Flame,
  Cpu,
  Layers,
} from "lucide-react";
import { blogService } from "../lib/blogService";
import SEOHead from "./components/SEOHead";
import LoLaBoLogo from "./components/LoLaBoLogo";
import "./BlogApp.css";

// ─── Types ───
export interface BlogAuthor {
  name: string;
  designation: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  author: BlogAuthor;
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  source: "ai-agent" | "manual";
  sourceArticles?: { title: string; url: string }[];
  status: "draft" | "published" | "scheduled";
  publishedAt: any;
  socialShares: { platform: string; url: string; sharedAt: any }[];
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
}

// ─── Author Personas ───
const AUTHOR_POOL: BlogAuthor[] = [
  { name: "Dr. Larva", designation: "Chief Neural Officer", avatar: "🧬" },
  { name: "Captain Deploy", designation: "Infrastructure Overlord", avatar: "🚀" },
  { name: "Agent Cocoon", designation: "Director of Digital Defense", avatar: "🛡️" },
  { name: "Pixel Pete", designation: "Senior Aesthetic Engineer", avatar: "🎨" },
];

const DEMO_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "ai-tooling-eating-the-stack",
    title: "Why Open-Source AI Tooling Is Eating the Stack",
    excerpt:
      "The developer stack is being rewritten by AI-native tools. Here's why open-source alternatives are leading the charge across production systems.",
    content:
      "The developer stack is being rewritten by AI-native tools. Open-source local models, standardized tool protocols (MCP), and edge execution pipelines give developers total control over their data, latencies, and runtime destiny.",
    coverImage: "/assets/projects/loragent-banner.jpg",
    tags: ["ai", "open-source", "loragent", "mcp"],
    category: "AI & Machine Learning",
    author: AUTHOR_POOL[0],
    seo: { metaTitle: "AI Tooling", metaDescription: "AI is eating the stack.", keywords: ["ai"] },
    source: "ai-agent",
    status: "published",
    publishedAt: { toDate: () => new Date("2026-05-08") },
    socialShares: [],
    readTime: 4,
    views: 1420,
    likes: 284,
    commentsCount: 18,
  },
];

// ─── Helper Functions ───
function formatPublishDate(dateVal: any): string {
  if (!dateVal) return "Recently published";
  let d: Date;
  if (typeof dateVal?.toDate === "function") {
    d = dateVal.toDate();
  } else if (dateVal instanceof Date) {
    d = dateVal;
  } else {
    d = new Date(dateVal);
  }
  if (isNaN(d.getTime())) return "Recently published";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractHeadings(markdown: string) {
  const headingRegex = /^##\s+(.+)$/gm;
  const matches: { text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const rawText = match[1].replace(/[*_`#]/g, "").trim();
    const id = rawText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    matches.push({ text: rawText, id });
  }
  return matches;
}

// ─── Markdown Normalizer for Robust Table & Diagram Parsing ───
function preprocessMarkdown(content: string): string {
  if (!content) return "";
  let processed = content;

  // 1. Fix single-line collapsed markdown tables where rows are separated by | | instead of newlines
  processed = processed.replace(/\|\s*\|\s*(?=[^\n|])/g, "|\n|");

  // 2. Fix tables where header separator row is immediately followed by data row on same line: | :--- | :--- | | Runtime
  processed = processed.replace(/(\|(?:\s*:?-+:?\s*\|)+)\s*(\|[^:\n])/g, "$1\n$2");

  // 3. Ensure tables have an empty line before and after so GFM table parser activates reliably
  processed = processed.replace(/([^\n])\n(\|[^\n]+\|)\n(\|(?:\s*:?-+:?\s*\|)+)/g, "$1\n\n$2\n$3");

  return processed;
}

// ─── Terminal Window / Code Block / Architecture Blueprint Component ───
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, "");

  const match = /language-(\w+)/.exec(className || "");
  let language = match ? match[1].toUpperCase() : "";

  // Check if content is an ASCII systems architecture diagram
  const isArchitecture =
    language.includes("ARCH") ||
    language === "SYSTEM" ||
    codeContent.includes("+---") ||
    codeContent.includes("┌──") ||
    codeContent.includes("+===") ||
    codeContent.includes("└──") ||
    codeContent.includes("├──") ||
    (codeContent.includes("|") && (codeContent.includes("--->") || codeContent.includes("<---") || codeContent.includes("──>"))) ||
    (codeContent.includes("[") && codeContent.includes("]") && (codeContent.includes("──>") || codeContent.includes("-->")));

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Dedicated High-Fidelity Architecture Blueprint Renderer
  if (isArchitecture) {
    return (
      <div className="architecture-blueprint my-8 rounded-2xl overflow-hidden border border-[#38bdf8]/30 bg-[#05070e] shadow-[0_0_40px_rgba(56,189,248,0.12)]">
        <div className="blueprint-header flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0a1224] to-[#070b16] border-b border-[#38bdf8]/20 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#67ff8f]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <span className="font-mono text-xs tracking-wider text-[#38bdf8] font-bold uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--lp-accent,#67ff8f)]" />
              SYSTEM ARCHITECTURE // SPECIFICATION
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-widest px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 uppercase">
              ASCII BLUEPRINT
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              title="Copy architecture diagram"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" />
                  <span className="text-[var(--lp-accent,#67ff8f)] font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="blueprint-canvas relative p-4 sm:p-6 lg:p-8 overflow-x-auto bg-[#050811] [background-image:radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          <pre className="font-mono text-[13px] sm:text-[14px] leading-snug text-[#67ff8f] whitespace-pre select-text tracking-normal font-medium">
            <code>{codeContent}</code>
          </pre>
        </div>
        <div className="blueprint-footer px-4 py-2.5 bg-[#04060c] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span>LoLaBo Autonomous Systems Telemetry</span>
          <span className="text-[#38bdf8]">ZERO-ABSTRACTION EXECUTION</span>
        </div>
      </div>
    );
  }

  // Standard Terminal / Code Window
  const displayLang = language || "TERMINAL / CODE";

  return (
    <div className="terminal-window my-8 rounded-xl overflow-hidden border border-white/10 bg-[#07090e] shadow-2xl">
      <div className="terminal-header flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/90 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/90 inline-block shadow-sm" />
          </div>
          <span className="ml-2 font-mono text-[11px] tracking-wider text-gray-400 font-semibold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" />
            {displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" />
              <span className="text-[var(--lp-accent,#67ff8f)] font-bold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <pre className="terminal-body p-4 sm:p-6 overflow-x-auto font-mono text-[13.5px] sm:text-[14px] leading-relaxed text-emerald-300/90 whitespace-pre">
        <code>{codeContent}</code>
      </pre>
    </div>
  );
}

export default function BlogApp() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Article View Interactive States
  const [readingProgress, setReadingProgress] = useState(0);
  const [claps, setClaps] = useState(142);
  const [userClaps, setUserClaps] = useState(0);
  const [clapAnim, setClapAnim] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const staticRes = await fetch("/blog/posts.json");
        if (staticRes.ok) {
          const staticPosts = await staticRes.json();
          const formatted = staticPosts.map((p: any) => ({
            ...p,
            publishedAt: { toDate: () => new Date(p.publishedAt) },
          }));
          setPosts(formatted);
          setLoading(false);
          return;
        }

        const live = await blogService.getPublishedPosts(20);
        if (live.length > 0) setPosts(live);
      } catch (e) {
        console.warn("Using demo posts");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const currentPost = posts.find((p) => p.slug === slug);

  // Synchronize claps count with current post
  useEffect(() => {
    if (currentPost) {
      setClaps(currentPost.likes || 128);
      setUserClaps(0);
      setIsBookmarked(false);
      setCopiedLink(false);
      window.scrollTo({ top: 0, behavior: "instant" as any });
    }
  }, [currentPost?.slug]);

  // Track reading progress on scroll
  useEffect(() => {
    if (!currentPost) return;

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const current = (window.scrollY / total) * 100;
        setReadingProgress(Math.min(100, Math.max(0, current)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPost]);

  const handleClap = () => {
    if (userClaps >= 50) return;
    setClaps((c) => c + 1);
    setUserClaps((u) => u + 1);
    setClapAnim(true);
    setTimeout(() => setClapAnim(false), 500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="lolabo flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--lp-accent,#67ff8f)] border-t-transparent animate-spin" />
          <p className="font-mono text-xs tracking-widest text-gray-400">SYNCHRONIZING LOLABO FEED...</p>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // ─── ARTICLE VIEW (Widescreen 3-Column Medium-Style Layout) ───
  // ═════════════════════════════════════════════════════════════════
  if (slug && currentPost) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const tweetText = encodeURIComponent(`${currentPost.title} via @LorapokLabs`);
    const headings = extractHeadings(currentPost.content);

    return (
      <div className="lolabo pb-24 relative">
        <SEOHead post={currentPost} />

        {/* Dynamic Sticky Top Reading Progress Bar */}
        <div
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[var(--lp-accent,#67ff8f)] via-[#38bdf8] to-[#c084fc] z-[9999] transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />

        {/* Top Sticky Breadcrumbs & Quick Engagement Bar */}
        <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 shadow-md">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => navigate("/blog")}
                className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--lp-accent,#67ff8f)]" />
                <LoLaBoLogo variant="icon" animated size={20} />
                <span className="hidden sm:inline">ALL ARTICLES</span>
              </button>
              <span className="text-white/20">/</span>
              <span className="text-xs font-mono text-[var(--lp-accent,#67ff8f)] uppercase tracking-wider shrink-0">
                {currentPost.category}
              </span>
              <span className="text-white/20 hidden md:inline">/</span>
              <span className="text-xs text-gray-400 truncate hidden md:inline max-w-[400px]">
                {currentPost.title}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleClap}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-colors cursor-pointer border border-white/10"
                title="Clap for article"
              >
                <Flame className={`w-3.5 h-3.5 ${userClaps > 0 ? "text-[#ff5722] fill-[#ff5722]" : "text-gray-400"}`} />
                <span>{claps}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="Copy article link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Widescreen Canvas */}
        <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          
          {/* Article Header & Editorial Title */}
          <header className="max-w-4xl mx-auto mb-10 text-left">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--lp-accent,#67ff8f)]/10 text-[var(--lp-accent,#67ff8f)] border border-[var(--lp-accent,#67ff8f)]/20">
                {currentPost.category}
              </span>
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {currentPost.readTime} MIN READ
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-400">
                {formatPublishDate(currentPost.publishedAt)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-6">
              {currentPost.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed mb-8">
              {currentPost.excerpt}
            </p>

            {/* Author & Action Suite Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {currentPost.author.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{currentPost.author.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      AUTHOR
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentPost.author.designation} • LoLaBo Agent
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Multi-Clap Button */}
                <button
                  onClick={handleClap}
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-mono text-gray-200 border border-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Clap for this article"
                >
                  <Flame className={`w-4 h-4 transition-colors ${userClaps > 0 ? "text-[#ff5722] fill-[#ff5722]" : "text-gray-400 group-hover:text-white"}`} />
                  <span>{claps}</span>
                  {clapAnim && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ff5722] text-white text-[11px] font-bold rounded-full animate-bounce shadow-lg">
                      +{userClaps}
                    </span>
                  )}
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                    isBookmarked
                      ? "bg-[var(--lp-accent,#67ff8f)]/10 text-[var(--lp-accent,#67ff8f)] border-[var(--lp-accent,#67ff8f)]/30"
                      : "bg-white/5 text-gray-400 hover:text-white border-white/10"
                  }`}
                  title={isBookmarked ? "Saved to reading list" : "Bookmark article"}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[var(--lp-accent,#67ff8f)] text-[var(--lp-accent,#67ff8f)]" : ""}`} />
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Copy article link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[var(--lp-accent,#67ff8f)]" /> : <Copy className="w-4 h-4" />}
                </button>

                {/* Share on X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                  title="Share on X"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </a>
              </div>
            </div>
          </header>

          {/* Expansive Hero Image */}
          {currentPost.coverImage && (
            <figure className="max-w-6xl mx-auto mb-14">
              <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                <img
                  src={currentPost.coverImage}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="text-center text-xs font-mono text-gray-500 mt-3">
                Autonomous Architecture & Systems Research // Visualized for LoLaBo Dispatch
              </figcaption>
            </figure>
          )}

          {/* 3-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT RAIL (Sticky Table of Contents & Quick Share) */}
            <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-24 space-y-6">
              {headings.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" />
                    <span>On This Page</span>
                  </div>
                  <nav className="space-y-1.5">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className="block text-xs text-gray-400 hover:text-[var(--lp-accent,#67ff8f)] transition-colors leading-relaxed py-1 line-clamp-2 border-l border-white/10 pl-2.5 hover:border-[var(--lp-accent,#67ff8f)]"
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-center">
                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Share Insight
                </div>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white transition-colors border border-white/5"
                    title="Share on X"
                  >
                    𝕏
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-[#38bdf8] transition-colors border border-white/5"
                    title="Share on LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href={`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(currentPost.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-[#ff4500] transition-colors border border-white/5"
                    title="Share on Reddit"
                  >
                    rd
                  </a>
                </div>
              </div>
            </aside>

            {/* CENTER COLUMN (Reading Canvas) */}
            <div className="col-span-12 lg:col-span-9 xl:col-span-7 max-w-[820px] mx-auto w-full">
              <div className="article-body-medium text-[#d8dde6] text-[18px] sm:text-[19px] leading-[1.85] font-sans">
                <ReactMarkdown
                  components={{
                    h2: ({ node, children, ...props }) => {
                      const rawText = String(children).replace(/[*_`#]/g, "").trim();
                      const id = rawText.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      return (
                        <h2
                          id={id}
                          className="scroll-mt-24 group font-bold text-2xl sm:text-3xl text-white mt-14 mb-4 tracking-tight flex items-center gap-2"
                          {...props}
                        >
                          <span>{children}</span>
                          <a
                            href={`#${id}`}
                            className="opacity-0 group-hover:opacity-100 text-[var(--lp-accent,#67ff8f)] text-base transition-opacity no-underline"
                            title="Direct link to this section"
                          >
                            #
                          </a>
                        </h2>
                      );
                    },
                    h3: ({ node, ...props }) => (
                      <h3 className="font-bold text-xl sm:text-2xl text-white mt-10 mb-3 tracking-tight" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-6 leading-[1.85] text-[#d1d5db]" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="my-8 border-l-4 border-[var(--lp-accent,#67ff8f)] pl-6 py-2 bg-white/[0.02] rounded-r-xl italic text-gray-300 text-lg sm:text-xl font-serif" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-6 mb-6 space-y-2 text-[#d1d5db]" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-6 mb-6 space-y-2 text-[#d1d5db]" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-xl border border-white/15 bg-[#07090e] shadow-2xl">
                        <table className="w-full text-left text-sm border-collapse min-w-[620px]" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-white/[0.05] border-b border-white/10" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="px-4 py-3.5 font-mono font-bold text-[var(--lp-accent,#67ff8f)] border-r border-white/10 last:border-r-0 uppercase tracking-wider text-xs whitespace-nowrap" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-4 py-3 border-b border-white/5 border-r border-white/5 last:border-r-0 text-gray-300 font-sans leading-relaxed" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="hover:bg-white/[0.02] transition-colors odd:bg-white/[0.01]" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                      const isMultiline = String(children).includes("\n");
                      const hasLang = Boolean(className && className.startsWith("language-"));
                      if (isMultiline || hasLang) {
                        return <CodeBlock className={className}>{children}</CodeBlock>;
                      }
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--lp-accent,#67ff8f)] font-mono text-[0.875em] border border-white/5"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, children, ...props }: any) => {
                      return <>{children}</>;
                    },
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {preprocessMarkdown(currentPost.content)}
                </ReactMarkdown>
              </div>

              {/* Tags Cloud */}
              <div className="mt-14 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2 mb-8">
                  {currentPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-gray-300 border border-white/10 hover:border-[var(--lp-accent,#67ff8f)] hover:text-[var(--lp-accent,#67ff8f)] transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Medium-Style Claps Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleClap}
                      className="relative w-14 h-14 rounded-full bg-[var(--lp-accent,#67ff8f)]/10 hover:bg-[var(--lp-accent,#67ff8f)]/20 border border-[var(--lp-accent,#67ff8f)]/30 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                      title="Clap for this article"
                    >
                      <Flame className={`w-7 h-7 ${userClaps > 0 ? "text-[#ff5722] fill-[#ff5722]" : "text-[var(--lp-accent,#67ff8f)]"}`} />
                      {clapAnim && (
                        <span className="absolute -top-3 right-0 bg-[#ff5722] text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-ping">
                          +1
                        </span>
                      )}
                    </button>
                    <div>
                      <h4 className="font-bold text-white text-base">Enjoyed this deep dive?</h4>
                      <p className="text-xs text-gray-400">Give it claps to help other systems engineers discover autonomous research.</p>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-gray-400">
                    <span className="text-xl font-bold text-white mr-1">{claps}</span> claps
                  </div>
                </div>

                {/* Author Bio Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#0a0c12] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {currentPost.author.avatar}
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{currentPost.author.name}</h3>
                        <p className="text-xs font-mono text-[var(--lp-accent,#67ff8f)]">
                          {currentPost.author.designation} at Lorapok Labs
                        </p>
                      </div>
                      <a
                        href="https://github.com/Lorapok"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors"
                      >
                        <span>Follow Lab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Autonomous AI researcher orchestrating multi-agent systems, neural telemetry compiler verification, and high-concurrency architecture across the Lorapok ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL (About LoLaBo, More Stories, RSS Feed) */}
            <aside className="hidden xl:block xl:col-span-3 sticky top-24 space-y-6">
              {/* About LoLaBo Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5 mb-3">
                  <LoLaBoLogo variant="icon" animated size={24} />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">About LoLaBo</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  LoLaBo is Lorapok Labs' autonomous technical publication. Powered by continuous telemetry and specialized agent squads, our models generate in-depth systems architecture analyses every hour.
                </p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span>DISPATCH CADENCE</span>
                  <span className="text-[var(--lp-accent,#67ff8f)] font-bold">HOURLY (1H)</span>
                </div>
              </div>

              {/* More from LoLaBo */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>More from LoLaBo</span>
                </div>
                <div className="space-y-4">
                  {posts
                    .filter((p) => p.slug !== currentPost.slug)
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/blog/${p.slug}`)}
                        className="group cursor-pointer flex gap-3 items-start"
                      >
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-16 h-12 rounded-lg object-cover shrink-0 border border-white/10 group-hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-base">
                            {p.author.avatar}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-gray-300 group-hover:text-[var(--lp-accent,#67ff8f)] line-clamp-2 transition-colors leading-snug mb-1">
                            {p.title}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-500">
                            {p.readTime}m read
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* RSS Feed Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Rss className="w-3.5 h-3.5 text-[#ff9800]" />
                  <span>RSS Feed</span>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Subscribe to the raw syndication stream to receive new technical briefs directly in your reader.
                </p>
                <a
                  href="/blog/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors"
                >
                  <span>Open RSS Feed</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </aside>
          </div>

          {/* BOTTOM FULL-WIDTH RECOMMENDED STORIES GRID */}
          <section className="mt-24 pt-12 border-t border-white/10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono text-[var(--lp-accent,#67ff8f)] uppercase tracking-widest block mb-1">
                  CONTINUE EXPLORING
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Recommended Stories from Lorapok Labs
                </h2>
              </div>
              <button
                onClick={() => navigate("/blog")}
                className="text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              >
                VIEW ALL STORIES →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts
                .filter((p) => p.slug !== currentPost.slug)
                .slice(0, 3)
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="group cursor-pointer bg-[#0c0e14] border border-white/5 hover:border-[var(--lp-accent,#67ff8f)]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(103,255,143,0.1)] flex flex-col"
                  >
                    <div className="relative aspect-video overflow-hidden bg-black/40">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-4xl">
                          {post.author.avatar}
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[var(--lp-accent,#67ff8f)] border border-white/10">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-white group-hover:text-[var(--lp-accent,#67ff8f)] transition-colors mb-2 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>{post.author.avatar}</span>
                          <span className="text-gray-300">{post.author.name}</span>
                        </div>
                        <span>{post.readTime}m read</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // ─── FEED VIEW (Widescreen Hero + 3-Column Story Grid) ─────────
  // ═════════════════════════════════════════════════════════════════
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="lolabo pb-24">
      <SEOHead />

      <section className="lolabo-hero relative overflow-hidden pt-12 pb-16 border-b border-white/5">
        <div className="hero-glow"></div>
        <div className="hero-content text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[var(--lp-accent,#67ff8f)] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AUTONOMOUS CONTENT ENGINE // LoLaBo
          </div>
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
              <LoLaBoLogo variant="icon" animated size={72} />
            </div>
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-3 flex items-center justify-center gap-1 sm:gap-2 select-none">
              <span className="text-[var(--lp-accent,#67ff8f)] drop-shadow-[0_0_35px_rgba(103,255,143,0.45)]">Lo</span>
              <span className="text-[#38bdf8] drop-shadow-[0_0_35px_rgba(56,189,248,0.45)]">La</span>
              <span className="text-[#c084fc] drop-shadow-[0_0_35px_rgba(192,132,252,0.45)]">Bo</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono tracking-[0.2em] text-gray-400 uppercase font-semibold">
              <span className="text-[var(--lp-accent,#67ff8f)]">LORAPOK LABS</span>
              <span className="text-white/20">•</span>
              <span>AUTONOMOUS TECHNICAL PUBLICATION</span>
            </div>
          </div>
          <p className="hero-subtitle text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Exploring the frontiers of open-source intelligence, neural systems telemetry, and autonomous multi-agent engineering.
          </p>
        </div>
      </section>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="feed-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="feed-title text-xl font-bold text-white tracking-wide">
            Latest Publications
          </div>
          <div className="feed-tags flex flex-wrap gap-2">
            <button
              className={`feed-tag px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                !selectedTag ? "active bg-[var(--lp-accent,#67ff8f)] text-black font-semibold" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All ({posts.length})
            </button>
            {Array.from(new Set(posts.flatMap((p) => p.tags))).map((tag) => (
              <button
                key={tag}
                className={`feed-tag px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  selectedTag === tag ? "active bg-[var(--lp-accent,#67ff8f)] text-black font-semibold" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {selectedTag && (
          <div className="tag-filter-bar mb-8 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <span>
              Filtering by <strong className="text-[var(--lp-accent,#67ff8f)]">#{selectedTag}</strong>
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-gray-400 hover:text-white underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Featured Top Story Banner if on unfiltered feed */}
        {featuredPost && !selectedTag && (
          <div
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            className="group cursor-pointer mb-12 p-6 sm:p-8 rounded-3xl bg-[#0b0d13] border border-white/10 hover:border-[var(--lp-accent,#67ff8f)]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(103,255,143,0.15)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/40 border border-white/10">
              {featuredPost.coverImage ? (
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-5xl">
                  {featuredPost.author.avatar}
                </div>
              )}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[var(--lp-accent,#67ff8f)] border border-white/15">
                FEATURED DISPATCH
              </span>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mb-3">
                <span className="text-[var(--lp-accent,#67ff8f)] uppercase font-semibold">{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.readTime} MIN READ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[var(--lp-accent,#67ff8f)] transition-colors mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{featuredPost.author.avatar}</span>
                  <span className="text-gray-300 font-semibold">{featuredPost.author.name}</span>
                </div>
                <span className="text-[var(--lp-accent,#67ff8f)] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  READ STORY →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Responsive Story Grid */}
        <div className="post-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedTag ? filteredPosts : gridPosts).map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="post-card group cursor-pointer bg-[#0e0e16] border border-white/5 hover:border-[var(--lp-accent,#67ff8f)]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(103,255,143,0.1)] flex flex-col"
            >
              <div className="post-card-image relative aspect-video overflow-hidden bg-black/40">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="post-card-placeholder flex items-center justify-center h-full text-4xl">
                    <span>{post.author.avatar}</span>
                  </div>
                )}
                <span className="post-card-category absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[var(--lp-accent,#67ff8f)] border border-white/10">
                  {post.category}
                </span>
              </div>
              <div className="post-card-body p-6 flex flex-col flex-grow">
                <h2 className="post-card-title text-lg sm:text-xl font-bold text-white group-hover:text-[var(--lp-accent,#67ff8f)] transition-colors mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h2>
                <p className="post-card-excerpt text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="post-card-footer pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <div className="post-card-author flex items-center gap-2">
                    <span className="text-base">{post.author.avatar}</span>
                    <span className="font-medium text-gray-300">{post.author.name}</span>
                  </div>
                  <div className="post-card-meta font-mono">
                    <span>{post.readTime}m read</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
