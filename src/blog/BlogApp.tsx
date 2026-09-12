// src/blog/BlogApp.tsx
// LoLaBo — Lorapok Labs Blog
// Premium tech blog with AI-powered content generation and Medium-grade editorial layout

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Search,
  X,
  Radio,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Tag,
  Activity,
  FileText,
  ShieldCheck,
  BookmarkCheck,
} from "lucide-react";
import { blogService } from "../lib/blogService";
import { isFirebaseConfigured } from "../lib/firebase";
import SEOHead from "./components/SEOHead";
import LoLaBoLogo from "./components/LoLaBoLogo";
import LoLaBoImage, { preloadImages } from "./components/LoLaBoImage";
import "./BlogApp.css";

// ─── Types ───
export interface BlogAuthor {
  name: string;
  designation: string;
  avatar: string;
}

export interface Citation {
  id?: string;
  title: string;
  source: string;
  url?: string;
  author?: string;
  year?: number | string;
  relevance?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type?: string;
  citations?: Citation[];
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

export interface EditorialCategory {
  id: string;
  label: string;
  count?: number;
}

export const CORE_EDITORIAL_CATEGORIES: EditorialCategory[] = [
  { id: "all", label: "All Dispatches" },
  { id: "architecture", label: "Systems Architecture" },
  { id: "ai", label: "AI & Neural Systems" },
  { id: "backend", label: "Backend & Cloud" },
  { id: "mobile", label: "Mobile & Native" },
  { id: "security", label: "Security & Zero-Trust" },
  { id: "distributed", label: "Distributed Systems" },
  { id: "devops", label: "DevOps & SRE" },
  { id: "performance", label: "Performance & Concurrency" },
  { id: "agentic", label: "Autonomous Agents" },
];

export interface EditorialTypeMeta {
  id: string;
  label: string;
  badgeClass: string;
  count?: number;
}

export const EDITORIAL_TYPES: EditorialTypeMeta[] = [
  { id: "all", label: "All Formats", badgeClass: "bg-white/10 text-gray-300 border-white/10" },
  { id: "architecture", label: "Architecture Blueprint", badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { id: "deep-dive", label: "Deep Dive", badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { id: "case-study", label: "Case Study", badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { id: "benchmark", label: "Benchmark & Perf", badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { id: "research-brief", label: "Research Brief", badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
];

export function getPostEditorialType(post: BlogPost): EditorialTypeMeta {
  if (post.type) {
    const normalized = post.type.toLowerCase().trim();
    if (normalized.includes("architecture") || normalized.includes("blueprint")) {
      return EDITORIAL_TYPES.find((t) => t.id === "architecture")!;
    }
    if (normalized.includes("deep") || normalized.includes("dive") || normalized.includes("spec")) {
      return EDITORIAL_TYPES.find((t) => t.id === "deep-dive")!;
    }
    if (normalized.includes("benchmark") || normalized.includes("perf")) {
      return EDITORIAL_TYPES.find((t) => t.id === "benchmark")!;
    }
    if (normalized.includes("case") || normalized.includes("study")) {
      return EDITORIAL_TYPES.find((t) => t.id === "case-study")!;
    }
  }

  const text = `${post.title} ${post.excerpt || ""} ${(post.tags || []).join(" ")}`.toLowerCase();
  if (text.startsWith("architectural deep dive") || text.includes("architecture blueprint") || text.includes("systems architecture") || text.includes("topology specification")) {
    return EDITORIAL_TYPES.find((t) => t.id === "architecture")!;
  }
  if (text.includes("deep dive") || text.includes("inside the mechanics") || text.includes("reverse engineering") || text.includes("distillation")) {
    return EDITORIAL_TYPES.find((t) => t.id === "deep-dive")!;
  }
  if (text.includes("case study") || text.includes("shift back") || text.includes("shopify") || text.includes("migration") || text.includes("beyond the bridge")) {
    return EDITORIAL_TYPES.find((t) => t.id === "case-study")!;
  }
  if (text.includes("benchmark") || text.includes("latency") || text.includes("throughput") || text.includes("tradeoff") || text.includes("metric")) {
    return EDITORIAL_TYPES.find((t) => t.id === "benchmark")!;
  }
  if (text.includes("architecture") || text.includes("topology") || text.includes("microservice") || text.includes("systems") || text.includes("blueprint")) {
    return EDITORIAL_TYPES.find((t) => t.id === "architecture")!;
  }
  return EDITORIAL_TYPES.find((t) => t.id === "research-brief")!;
}

export function matchesCategory(post: BlogPost, catId: string): boolean {
  if (catId === "all") return true;
  const postCat = (post.category || "").toLowerCase();
  const tagsStr = (post.tags || []).join(" ").toLowerCase();
  const titleStr = (post.title || "").toLowerCase();
  const slugCat = postCat.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  if (slugCat === catId) return true;

  if (catId === "architecture") {
    return postCat.includes("architecture") || postCat.includes("infra") || tagsStr.includes("architecture") || titleStr.includes("architectur");
  }
  if (catId === "ai") {
    return postCat.includes("ai") || postCat.includes("machine") || tagsStr.includes("ai") || tagsStr.includes("llm") || tagsStr.includes("model") || tagsStr.includes("neural");
  }
  if (catId === "backend") {
    return postCat.includes("backend") || postCat.includes("infra") || tagsStr.includes("backend") || tagsStr.includes("microservices") || tagsStr.includes("cloudnative") || tagsStr.includes("cloud");
  }
  if (catId === "mobile") {
    return postCat.includes("mobile") || postCat.includes("ux") || tagsStr.includes("swift") || tagsStr.includes("kotlin") || tagsStr.includes("reactnative") || tagsStr.includes("android") || tagsStr.includes("ios");
  }
  if (catId === "security") {
    return postCat.includes("security") || tagsStr.includes("security") || tagsStr.includes("defense") || tagsStr.includes("evasion") || tagsStr.includes("zero-trust") || tagsStr.includes("watermark");
  }
  if (catId === "distributed") {
    return postCat.includes("distributed") || tagsStr.includes("distributed") || tagsStr.includes("distributedsystems") || tagsStr.includes("concurrency");
  }
  if (catId === "devops") {
    return postCat.includes("devops") || postCat.includes("deploy") || postCat.includes("infra") || tagsStr.includes("devops") || tagsStr.includes("docker") || tagsStr.includes("kubernetes") || tagsStr.includes("cloudnative");
  }
  if (catId === "performance") {
    return postCat.includes("performance") || tagsStr.includes("performance") || tagsStr.includes("concurrency") || tagsStr.includes("latency") || tagsStr.includes("optimization");
  }
  if (catId === "agentic") {
    return postCat.includes("agent") || tagsStr.includes("agent") || tagsStr.includes("autonomous") || tagsStr.includes("multi-agent") || tagsStr.includes("loragent") || tagsStr.includes("lorapok");
  }
  return false;
}

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

// ─── Markdown Normalizer for Robust Table, Code Block & Diagram Parsing ───
function preprocessMarkdown(content: string): string {
  if (!content) return "";
  let processed = content;

  // 1. Balance unclosed code blocks (fences with ```) so trailing content is never swallowed into code
  const codeBlockMatches = processed.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    // If odd number of ```, find last occurrence and close it cleanly before footer/hashtags
    const footerIdx = processed.lastIndexOf("\n---\n*Authored autonomously");
    if (footerIdx !== -1) {
      processed = processed.slice(0, footerIdx) + "\n```\n" + processed.slice(footerIdx);
    } else {
      processed = processed + "\n```\n";
    }
  }

  // 2. Ensure headings have an empty line before them so they always parse as blocks
  processed = processed.replace(/([^\n])\n(#{1,6}\s+[^\n]+)/g, "$1\n\n$2");

  // 3. Fix single-line collapsed markdown tables where rows are separated by | | instead of newlines
  processed = processed.replace(/\|\s*\|\s*(?=[^\n|])/g, "|\n|");

  // 4. Fix tables where header separator row is immediately followed by data row on same line: | :--- | :--- | | Runtime
  processed = processed.replace(/(\|(?:\s*:?-+:?\s*\|)+)\s*(\|[^:\n])/g, "$1\n$2");

  // 5. Ensure tables have an empty line before and after so GFM table parser activates reliably
  processed = processed.replace(/([^\n])\n(\|[^\n]+\|)\n(\|(?:\s*:?-+:?\s*\|)+)/g, "$1\n\n$2\n$3");

  return processed;
}

// ─── Mermaid Architectural Schematic Component ───
function MermaidBlock({ code }: { code: string }) {
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    async function renderMermaid() {
      try {
        let mermaid: any = (window as any).mermaid;
        if (!mermaid) {
          const mod = await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs");
          mermaid = mod.default || mod;
          (window as any).mermaid = mermaid;
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              darkMode: true,
              background: "#05070e",
              primaryColor: "#0f172a",
              primaryTextColor: "#f8fafc",
              primaryBorderColor: "#38bdf8",
              lineColor: "#67ff8f",
              secondaryColor: "#1e293b",
              tertiaryColor: "#0b1329",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "13px"
            },
            securityLevel: "loose"
          });
        }
        const { svg } = await mermaid.render(idRef.current, code);
        if (isMounted) {
          setSvgHtml(svg);
          setHasError(false);
        }
      } catch (err) {
        console.warn("Mermaid dynamic render fallback:", err);
        if (isMounted) setHasError(true);
      }
    }
    renderMermaid();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`mermaid-container my-8 rounded-2xl overflow-hidden border border-[#38bdf8]/40 bg-[#05070e] shadow-[0_0_40px_rgba(56,189,248,0.12)] transition-all ${
        isZoomed ? "fixed inset-4 sm:inset-10 z-50 flex flex-col bg-[#05070e]/95 backdrop-blur-xl border-[#38bdf8]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0a1224] to-[#070b16] border-b border-[#38bdf8]/20 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#67ff8f]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <span className="font-mono text-xs tracking-wider text-[#38bdf8] font-bold uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--lp-accent,#67ff8f)]" />
            SYSTEM ARCHITECTURE // MERMAID.JS SCHEMATIC
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="px-2.5 py-1 rounded text-xs font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title={isZoomed ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isZoomed ? "CLOSE" : "EXPAND"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Copy Mermaid code"
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
      <div
        className={`mermaid-canvas p-6 overflow-x-auto flex justify-center items-center bg-[#050811] [background-image:radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] ${
          isZoomed ? "flex-1 overflow-auto" : "min-h-[200px]"
        }`}
      >
        {svgHtml && !hasError ? (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        ) : hasError ? (
          <pre className="font-mono text-xs text-[#67ff8f] p-4 bg-[#0a1020] rounded border border-white/10 whitespace-pre">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs text-[#38bdf8] animate-pulse">
            <span>Compiling vector architecture schematic...</span>
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-[#04060c] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>Deterministic Architecture Invariant</span>
        <span className="text-[#38bdf8]">CRISP CODE-TO-SVG SCHEMATIC</span>
      </div>
    </div>
  );
}

// ─── Terminal Window / Code Block / Architecture Blueprint Component ───
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).replace(/\n$/, "");

  const match = /language-(\w+)/.exec(className || "");
  let language = match ? match[1].toUpperCase() : "";

  if (language === "MERMAID") {
    return <MermaidBlock code={codeContent} />;
  }

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

function ensureUniqueVisuals(postsList: BlogPost[]): BlogPost[] {
  const seenUrls = new Set<string>();
  return postsList.map((p, idx) => {
    let url = (p.coverImage || "").trim();
    const isUnsplash = url.includes("unsplash.com") || url.includes("photo-");
    const isDup = seenUrls.has(url);
    if (!url || isDup || isUnsplash) {
      const cleanTitle = (p.title || `research-paper-${idx + 1}`).replace(/[^\w\s-]/g, " ").trim();
      const prompt = `${cleanTitle}, systems architecture diagram, physical hardware cutaway, isometric blueprint, dark graphite chassis, glowing telemetry paths, octane render 8k, zero text`;
      const charSum = (p.slug || p.title || "").split("").reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0);
      const seed = Math.abs(charSum + (idx + 1) * 7919) % 10000000;
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.slice(0, 320))}?width=1200&height=630&nologo=true&seed=${seed}&model=flux`;
    }
    seenUrls.add(url);
    return { ...p, coverImage: url };
  });
}

export default function BlogApp() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "readTime" | "claps">("newest");
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
        const cacheBuster = `?_t=${Date.now()}`;
        const staticRes = await fetch(`/blog/posts.json${cacheBuster}`, { cache: "no-store" });
        if (staticRes.ok) {
          const staticPosts = await staticRes.json();
          const formatted = ensureUniqueVisuals(staticPosts.map((p: any) => ({
            ...p,
            publishedAt: { toDate: () => new Date(p.publishedAt) },
          })));
          setPosts(formatted);
          setLoading(false);
          // Prefetch top hero images in background for instant side-loading
          preloadImages(formatted.map((p: any) => p.coverImage));
        }

        // Live Firestore synchronization: merge newly published articles into state
        if (isFirebaseConfigured) {
          try {
            const live = await blogService.getPublishedPosts(30);
            if (live.length > 0) {
              setPosts((prev) => {
                const map = new Map<string, any>();
                prev.forEach((p) => map.set(p.slug || p.id, p));
                live.forEach((p) => map.set(p.slug || p.id, p));
                const sorted = Array.from(map.values()).sort((a: any, b: any) => {
                  const dateA = a.publishedAt?.toDate ? a.publishedAt.toDate().getTime() : new Date(a.publishedAt).getTime();
                  const dateB = b.publishedAt?.toDate ? b.publishedAt.toDate().getTime() : new Date(b.publishedAt).getTime();
                  return dateB - dateA;
                });
                return ensureUniqueVisuals(sorted);
              });
            }
          } catch (liveErr) {
            console.warn("Live Firestore sync skipped:", liveErr);
          }
        }
      } catch (e) {
        console.warn("Using demo posts or local cache fallback");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Direct slug lookup fallback: if URL has an individual article slug not in initial list, load it from Firestore
  useEffect(() => {
    if (!slug || loading) return;
    const exists = posts.some((p) => p.slug === slug);
    if (!exists && isFirebaseConfigured) {
      let active = true;
      blogService.getPostBySlug(slug).then((livePost) => {
        if (active && livePost) {
          setPosts((prev) => {
            if (prev.some((p) => p.slug === slug)) return prev;
            return [livePost, ...prev];
          });
        }
      }).catch(() => {});
      return () => { active = false; };
    }
  }, [slug, loading, posts.length]);

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

  // ─── Dynamic Aggregations & Metrics (100% Data-Driven) ───
  const dynamicCategories = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    CORE_EDITORIAL_CATEGORIES.forEach((cat) => {
      if (cat.id === "all") return;
      counts[cat.id] = posts.filter((p) => matchesCategory(p, cat.id)).length;
    });

    const list: EditorialCategory[] = CORE_EDITORIAL_CATEGORIES.map((cat) => ({
      ...cat,
      count: counts[cat.id] || 0,
    }));

    // Dynamically surface any unexpected categories published by agents
    posts.forEach((p) => {
      if (!p.category) return;
      const isCovered = CORE_EDITORIAL_CATEGORIES.some(
        (c) => c.id !== "all" && matchesCategory(p, c.id)
      );
      if (!isCovered) {
        const slug = p.category
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        const existing = list.find((c) => c.id === slug);
        if (existing) {
          existing.count = (existing.count || 0) + 1;
        } else {
          list.push({
            id: slug,
            label: p.category,
            count: 1,
          });
        }
      }
    });

    // Only surface categories that actually contain published dispatches (plus 'all')
    return list.filter((cat) => cat.id === "all" || (cat.count || 0) > 0);
  }, [posts]);

  const dynamicTypes = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      const t = getPostEditorialType(p).id;
      counts[t] = (counts[t] || 0) + 1;
    });
    return EDITORIAL_TYPES.map((t) => ({
      ...t,
      count: counts[t.id] || 0,
    })).filter((t) => t.id === "all" || (t.count || 0) > 0);
  }, [posts]);

  const dynamicTrendingTags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const clean = tag.trim().replace(/^#/, "");
        if (!clean) return;
        counts[clean] = (counts[clean] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const dynamicStats = useMemo(() => {
    const totalPosts = posts.length;
    const activeCategoriesCount = dynamicCategories.filter(
      (c) => c.id !== "all" && (c.count || 0) > 0
    ).length;
    const totalReadTime = posts.reduce((acc, p) => acc + (p.readTime || 5), 0);
    const avgRead = totalPosts > 0 ? Math.round(totalReadTime / totalPosts) : 5;
    const totalTopics = dynamicTrendingTags.length;

    return {
      totalPosts,
      activeCategoriesCount,
      avgRead,
      totalTopics,
    };
  }, [posts, dynamicCategories, dynamicTrendingTags]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // 1. Dynamic Category Filter
        if (selectedCategory !== "all") {
          if (!matchesCategory(post, selectedCategory)) return false;
        }

        // 2. Dynamic Type Filter
        if (selectedType !== "all") {
          const typeMeta = getPostEditorialType(post);
          if (typeMeta.id !== selectedType) return false;
        }

        // 3. Dynamic Tag Filter
        if (selectedTag) {
          const normalizedSelected = selectedTag.toLowerCase().replace(/^#/, "").trim();
          const hasTag = (post.tags || []).some(
            (t) => t.toLowerCase().replace(/^#/, "").trim() === normalizedSelected
          );
          if (!hasTag) return false;
        }

        // 4. Search Query (Multi-Dimensional Search)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const typeMeta = getPostEditorialType(post);
          const inTitle = post.title.toLowerCase().includes(q);
          const inExcerpt = (post.excerpt || "").toLowerCase().includes(q);
          const inCategory = (post.category || "").toLowerCase().includes(q);
          const inAuthor = (post.author?.name || "").toLowerCase().includes(q);
          const inTags = (post.tags || []).some((t) => t.toLowerCase().includes(q));
          const inType = typeMeta.label.toLowerCase().includes(q);
          if (!inTitle && !inExcerpt && !inCategory && !inAuthor && !inTags && !inType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          const dateA = new Date(a.publishedAt?.toDate ? a.publishedAt.toDate() : a.publishedAt).getTime() || 0;
          const dateB = new Date(b.publishedAt?.toDate ? b.publishedAt.toDate() : b.publishedAt).getTime() || 0;
          return dateA - dateB;
        }
        if (sortBy === "readTime") {
          return (b.readTime || 0) - (a.readTime || 0);
        }
        if (sortBy === "claps") {
          return (b.likes || 0) - (a.likes || 0);
        }
        // default: newest
        const dateA = new Date(a.publishedAt?.toDate ? a.publishedAt.toDate() : a.publishedAt).getTime() || 0;
        const dateB = new Date(b.publishedAt?.toDate ? b.publishedAt.toDate() : b.publishedAt).getTime() || 0;
        return dateB - dateA;
      });
  }, [posts, selectedCategory, selectedType, selectedTag, searchQuery, sortBy]);

  // ─── Smart Filter Actions & Conflict Sanitization ───
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedTag(null);
    setSearchQuery("");
    setSortBy("newest");
  };

  const handleCategoryClick = (catId: string) => {
    if (selectedCategory === catId) {
      // Toggle off back to all
      setSelectedCategory("all");
      return;
    }
    setSelectedCategory(catId);
    // Conflict resolution: if the active tag or format type yields 0 results in this category, clear them automatically
    if (selectedTag) {
      const normTag = selectedTag.toLowerCase().replace(/^#/, "").trim();
      const hasTagInCat = posts.some(
        (p) =>
          matchesCategory(p, catId) &&
          (p.tags || []).some((t) => t.toLowerCase().replace(/^#/, "").trim() === normTag)
      );
      if (!hasTagInCat) {
        setSelectedTag(null);
      }
    }
    if (selectedType !== "all") {
      const hasTypeInCat = posts.some(
        (p) => matchesCategory(p, catId) && getPostEditorialType(p).id === selectedType
      );
      if (!hasTypeInCat) {
        setSelectedType("all");
      }
    }
  };

  const handleTypeClick = (typeId: string) => {
    if (selectedType === typeId) {
      setSelectedType("all");
      return;
    }
    setSelectedType(typeId);
    if (selectedCategory !== "all") {
      const hasCatInType = posts.some(
        (p) =>
          matchesCategory(p, selectedCategory) &&
          (typeId === "all" || getPostEditorialType(p).id === typeId)
      );
      if (!hasCatInType) {
        setSelectedCategory("all");
      }
    }
    if (selectedTag) {
      const normTag = selectedTag.toLowerCase().replace(/^#/, "").trim();
      const hasTagInType = posts.some(
        (p) =>
          (typeId === "all" || getPostEditorialType(p).id === typeId) &&
          (p.tags || []).some((t) => t.toLowerCase().replace(/^#/, "").trim() === normTag)
      );
      if (!hasTagInType) {
        setSelectedTag(null);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      return;
    }
    setSelectedTag(tag);
    const normTag = tag.toLowerCase().replace(/^#/, "").trim();
    if (selectedCategory !== "all") {
      const hasCatWithTag = posts.some(
        (p) =>
          matchesCategory(p, selectedCategory) &&
          (p.tags || []).some((t) => t.toLowerCase().replace(/^#/, "").trim() === normTag)
      );
      if (!hasCatWithTag) {
        setSelectedCategory("all");
      }
    }
    if (selectedType !== "all") {
      const hasTypeWithTag = posts.some(
        (p) =>
          getPostEditorialType(p).id === selectedType &&
          (p.tags || []).some((t) => t.toLowerCase().replace(/^#/, "").trim() === normTag)
      );
      if (!hasTypeWithTag) {
        setSelectedType("all");
      }
    }
  };

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
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider border ${getPostEditorialType(currentPost).badgeClass}`}>
                {currentPost.type || getPostEditorialType(currentPost).label}
              </span>
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {currentPost.readTime} MIN READ
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-400">
                {formatPublishDate(currentPost.publishedAt)}
              </span>
              {currentPost.citations && currentPost.citations.length > 0 && (
                <a
                  href="#citations-panel"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all shadow-sm"
                  title="Jump to verified technical citations"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>{currentPost.citations.length} CITATIONS TAGGED</span>
                </a>
              )}
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

          {/* Expansive Hero Image with Progressive Loading & Zero-Fail Fallback */}
          {currentPost.coverImage && (
            <figure className="max-w-6xl mx-auto mb-14">
              <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                <LoLaBoImage
                  src={currentPost.coverImage}
                  alt={currentPost.title}
                  priority={true}
                  fallbackCategory={currentPost.category}
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
                    {currentPost.citations && currentPost.citations.length > 0 && (
                      <a
                        href="#citations-panel"
                        className="block text-xs text-purple-400 hover:text-purple-300 transition-colors leading-relaxed py-1 line-clamp-2 border-l border-purple-500/30 pl-2.5 hover:border-purple-400 font-mono font-medium"
                      >
                        📚 Citations ({currentPost.citations.length})
                      </a>
                    )}
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
                    img: ({ src, alt, ...props }: any) => {
                      const isFigure = alt && alt.startsWith("Figure");
                      return (
                        <figure className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#080b12] shadow-2xl">
                          <div className="relative group overflow-hidden bg-black/40">
                            <img
                              src={src}
                              alt={alt || "LoLaBo Technical Visual"}
                              className="w-full h-auto max-h-[520px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                              loading="lazy"
                              {...props}
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 text-xs font-mono bg-black/80 hover:bg-black text-white rounded border border-white/20 backdrop-blur"
                              >
                                Open Full-Res ↗
                              </a>
                            </div>
                          </div>
                          {alt && (
                            <figcaption className="px-5 py-3.5 bg-[#05070d] border-t border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                              <span className="font-mono text-[var(--lp-accent,#67ff8f)] font-bold shrink-0 uppercase tracking-wider">
                                {isFigure ? alt.split(":")[0] : "Visual"}
                              </span>
                              <span className="text-gray-400">
                                {isFigure ? alt.replace(/^Figure\s*\d+:\s*/i, "") : alt}
                              </span>
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {preprocessMarkdown(currentPost.content)}
                </ReactMarkdown>
              </div>

              {/* Technical Citations & Formal References Panel */}
              {currentPost.citations && currentPost.citations.length > 0 && (
                <section
                  id="citations-panel"
                  className="scroll-mt-24 mt-12 p-6 sm:p-8 rounded-2xl bg-[#080b11] border border-white/10 shadow-2xl space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5 text-sm font-mono font-bold text-white uppercase tracking-wider">
                      <BookmarkCheck className="w-5 h-5 text-[var(--lp-accent,#67ff8f)]" />
                      <span>Technical Citations & References ({currentPost.citations.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                        Formal Specifications & Papers
                      </span>
                      <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Peer-Reviewed
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPost.citations.map((cite, i) => (
                      <div
                        key={cite.id || i}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold text-[var(--lp-accent,#67ff8f)] px-2 py-0.5 rounded bg-[var(--lp-accent,#67ff8f)]/10 border border-[var(--lp-accent,#67ff8f)]/20">
                              [{cite.id || (i + 1)}]
                            </span>
                            {cite.year && (
                              <span className="text-[11px] font-mono text-gray-400">{cite.year}</span>
                            )}
                          </div>
                          <h5 className="font-bold text-sm text-white leading-snug">{cite.title}</h5>
                          {cite.author && (
                            <p className="text-xs text-gray-400 mt-1">Author: {cite.author}</p>
                          )}
                          <p className="text-xs text-gray-400 italic mt-0.5">{cite.source}</p>
                          {cite.relevance && (
                            <p className="text-xs text-gray-300 mt-2 border-t border-white/5 pt-2 leading-relaxed">
                              <strong className="text-gray-400">Relevance:</strong> {cite.relevance}
                            </p>
                          )}
                        </div>
                        {cite.url && (
                          <a
                            href={cite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--lp-accent,#67ff8f)] hover:underline pt-2"
                          >
                            <span>View Source Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

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
                          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:opacity-80 transition-opacity">
                            <LoLaBoImage
                              src={p.coverImage}
                              alt={p.title}
                              fallbackCategory={p.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
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
                        <LoLaBoImage
                          src={post.coverImage}
                          alt={post.title}
                          fallbackCategory={post.category}
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
                        <div className="flex items-center gap-2">
                          {post.citations && post.citations.length > 0 && (
                            <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                              <BookmarkCheck className="w-2.5 h-2.5 text-purple-400" />
                              <span>{post.citations.length}</span>
                            </span>
                          )}
                          <span>{post.readTime}m read</span>
                        </div>
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

  // If a slug was specifically requested in the URL but could not be located in local or remote catalog
  if (slug && !currentPost) {
    return (
      <div className="lolabo min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">
          📡
        </div>
        <span className="font-mono text-xs text-[var(--lp-accent,#67ff8f)] uppercase tracking-widest mb-2">
          AUTONOMOUS ARCHIVE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
          Dispatch Synchronizing or Relocated
        </h1>
        <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
          The requested technical treatise may still be compiling from our autonomous agent squads, or the slug has been updated.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10 hover:border-white/20"
        >
          ← Return to All Dispatches
        </button>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // ─── FEED VIEW (World-Class Editorial Masthead & Navigation) ───
  // ═════════════════════════════════════════════════════════════════
  const isFiltering = Boolean(selectedTag || selectedCategory !== "all" || selectedType !== "all" || searchQuery.trim());
  const featuredPost = isFiltering ? null : filteredPosts[0];
  const gridPosts = isFiltering ? filteredPosts : filteredPosts.slice(1);

  return (
    <div className="lolabo pb-24">
      <SEOHead />

      {/* World-Class Editorial Masthead */}
      <section className="lolabo-hero relative overflow-hidden pt-14 pb-14 border-b border-white/5 bg-[#06080e] [background-image:radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(56,189,248,0.1),rgba(103,255,143,0.04)_45%,transparent_75%)]">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="hero-content relative z-10 text-center max-w-5xl mx-auto px-4">
          
          {/* Kicker Badge with Live Beacon */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lp-accent,#67ff8f)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lp-accent,#67ff8f)]" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--lp-accent,#67ff8f)] uppercase">
              AUTONOMOUS RESEARCH PUBLICATION // HOURLY DISPATCH
            </span>
          </div>

          {/* Master Brand Typography & Insignia */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-5 group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#67ff8f]/20 via-[#38bdf8]/20 to-[#c084fc]/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <LoLaBoLogo variant="icon" animated size={68} />
              </div>
            </div>
            
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] mb-2 flex items-center justify-center select-none">
              <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_4px_35px_rgba(255,255,255,0.15)]">
                LoLaBo
              </span>
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono tracking-[0.22em] text-gray-400 uppercase font-semibold">
              <span className="text-[var(--lp-accent,#67ff8f)] font-bold">LORAPOK LABS</span>
              <span className="text-white/20">•</span>
              <span className="text-gray-300">SYSTEMS ARCHITECTURE & ENGINEERING JOURNAL</span>
            </div>
          </div>

          {/* Intellectual Manifesto */}
          <p className="hero-subtitle text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Rigorous systems architecture investigations, distributed runtime telemetry, and autonomous multi-agent engineering — synthesized and published every hour.
          </p>

          {/* Dynamic Live Publication Telemetry Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-400">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[var(--lp-accent,#67ff8f)] animate-pulse" />
                <span>CADENCE: <strong className="text-white font-semibold">1-HOUR AUTONOMOUS</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span>INDEXED: <strong className="text-white font-semibold">{dynamicStats.totalPosts} DISPATCHES</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                <span>DOMAINS: <strong className="text-white font-semibold">{dynamicStats.activeCategoriesCount} ACTIVE</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 hidden md:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>AVG READ: <strong className="text-white font-semibold">{dynamicStats.avgRead} MINS</strong></span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                title="Subscribe to RSS Feed"
              >
                <Rss className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>RSS FEED</span>
              </a>
              <a
                href="https://discord.com/api/webhooks/1547726176125059122/gR6aBXenu4RosF1IVXIUqzKjz0QuW0iLYqbCvo6-eLKaUiusVV8HrLRDyk2s_aq63t3u"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#5865F2] border border-white/10 transition-colors"
                title="Lorapok Discord Feed"
              >
                <Radio className="w-3.5 h-3.5 text-[#5865F2]" />
                <span>DISCORD</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Editorial Navigation & Dynamic Multi-Dimensional Search Console */}
        <div className="mb-10 space-y-4">
          {/* Header Row: Title, Real-Time Search & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>Publications & Research Index</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--lp-accent,#67ff8f)] border border-white/10">
                  {filteredPosts.length}
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                AUTONOMOUS KNOWLEDGE GRAPH // {dynamicStats.totalPosts} DISPATCHES ACROSS {dynamicStats.totalTopics} TRACKED TOPICS
              </p>
            </div>

            {/* Controls: Search + Sort Dropdown */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {/* Instant Real-Time Search Input */}
              <div className="relative w-full sm:w-64 lg:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search architecture, tags, types..."
                  className="w-full bg-[#0b0d14] border border-white/10 focus:border-[var(--lp-accent,#67ff8f)] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--lp-accent,#67ff8f)]/40 transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dynamic Sort Selector */}
              <div className="relative shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b0d14] border border-white/10 text-xs font-mono text-gray-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[var(--lp-accent,#67ff8f)]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-gray-300 text-xs focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="newest" className="bg-[#0b0d14] text-white">Newest First</option>
                    <option value="oldest" className="bg-[#0b0d14] text-white">Oldest First</option>
                    <option value="readTime" className="bg-[#0b0d14] text-white">Longest Reads</option>
                    <option value="claps" className="bg-[#0b0d14] text-white">Most Clapped</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Editorial Category Tabs with Live Counts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dynamicCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const hasItems = (cat.count || 0) > 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-[var(--lp-accent,#67ff8f)] text-black font-bold shadow-[0_0_20px_rgba(103,255,143,0.3)]"
                      : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-black/20 text-black font-bold"
                        : hasItems
                        ? "bg-white/10 text-[var(--lp-accent,#67ff8f)]"
                        : "text-gray-500"
                    }`}
                  >
                    {cat.count || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Editorial Types / Formats Filter Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
            <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <FileText className="w-3 h-3 text-purple-400" />
              <span>Format:</span>
            </span>
            {dynamicTypes.map((t) => {
              const isActive = selectedType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTypeClick(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                    isActive
                      ? "bg-white/15 text-white border-white/30 shadow-sm"
                      : "bg-white/[0.02] text-gray-400 hover:text-gray-200 border-white/5 hover:border-white/10"
                  }`}
                >
                  <span>{t.label}</span>
                  <span className="text-[10px] text-gray-500">({t.count})</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Trending Topics Bar (Computed directly from post tags) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
            <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              <span>Trending:</span>
            </span>
            {dynamicTrendingTags.map(({ tag, count }) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] cursor-pointer transition-all shrink-0 border ${
                    isSelected
                      ? "bg-[var(--lp-accent,#67ff8f)]/15 text-[var(--lp-accent,#67ff8f)] border-[var(--lp-accent,#67ff8f)]/50 shadow-sm"
                      : "bg-white/[0.02] text-gray-400 hover:text-gray-200 border-white/5 hover:border-white/10"
                  }`}
                >
                  <span>#{tag}</span>
                  <span className="text-[9px] text-gray-500 ml-1">({count})</span>
                </button>
              );
            })}
            {isFiltering && (
              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs text-red-400 hover:text-red-300 underline font-mono shrink-0 cursor-pointer pl-2"
              >
                Reset all
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Notification Bar */}
        {isFiltering && (
          <div className="mb-8 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-gray-300">
              <span className="text-gray-500">Filtered view:</span>
              {selectedCategory !== "all" && (
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                  Category: {dynamicCategories.find((c) => c.id === selectedCategory)?.label || selectedCategory}
                </span>
              )}
              {selectedType !== "all" && (
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                  Format: {dynamicTypes.find((t) => t.id === selectedType)?.label || selectedType}
                </span>
              )}
              {selectedTag && (
                <span className="px-2 py-0.5 rounded bg-[var(--lp-accent,#67ff8f)]/10 text-[var(--lp-accent,#67ff8f)] font-mono border border-[var(--lp-accent,#67ff8f)]/20">
                  #{selectedTag}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] font-mono border border-[#38bdf8]/20">
                  Query: "{searchQuery}"
                </span>
              )}
              {sortBy !== "newest" && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                  Sorted: {sortBy}
                </span>
              )}
              <span className="text-gray-500">({filteredPosts.length} matches)</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-gray-400 hover:text-white underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Empty State when 0 posts match */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 px-4 bg-[#0a0c12] rounded-3xl border border-white/10 my-8">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Matching Dispatches</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
              No technical articles matched your current combination of categories, editorial formats, or keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-[var(--lp-accent,#67ff8f)] text-black font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer shadow-[0_0_20px_rgba(103,255,143,0.2)]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Featured Top Story Banner if on unfiltered feed */}
        {featuredPost && !isFiltering && (
          <div
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            className="group cursor-pointer mb-12 p-6 sm:p-8 rounded-3xl bg-[#0b0d13] border border-white/10 hover:border-[var(--lp-accent,#67ff8f)]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(103,255,143,0.15)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/40 border border-white/10">
              {featuredPost.coverImage ? (
                <LoLaBoImage
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  priority={true}
                  fallbackCategory={featuredPost.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-5xl">
                  {featuredPost.author.avatar}
                </div>
              )}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[var(--lp-accent,#67ff8f)] border border-white/15 z-10">
                FEATURED DISPATCH
              </span>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-gray-400 mb-3 flex-wrap">
                <span className="text-[var(--lp-accent,#67ff8f)] uppercase font-semibold">{featuredPost.category}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getPostEditorialType(featuredPost).badgeClass}`}>
                  {getPostEditorialType(featuredPost).label}
                </span>
                <span>•</span>
                <span>{featuredPost.readTime} MIN READ</span>
                {featuredPost.citations && featuredPost.citations.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-purple-300 flex items-center gap-1 font-mono">
                      <BookmarkCheck className="w-3 h-3 text-purple-400" />
                      <span>{featuredPost.citations.length} CITATIONS</span>
                    </span>
                  </>
                )}
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

        {/* 3-Column Responsive Story Grid with Dynamic Category & Format Badges */}
        <div className="post-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => {
            const postType = getPostEditorialType(post);
            return (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="post-card group cursor-pointer bg-[#0e0e16] border border-white/5 hover:border-[var(--lp-accent,#67ff8f)]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(103,255,143,0.1)] flex flex-col"
              >
                <div className="post-card-image relative aspect-video overflow-hidden bg-black/40">
                  {post.coverImage ? (
                    <LoLaBoImage
                      src={post.coverImage}
                      alt={post.title}
                      fallbackCategory={post.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="post-card-placeholder flex items-center justify-center h-full text-4xl">
                      <span>{post.author.avatar}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
                    <span className="post-card-category px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[var(--lp-accent,#67ff8f)] border border-white/10">
                      {post.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider backdrop-blur-md border ${postType.badgeClass} bg-black/70`}>
                      {postType.label}
                    </span>
                  </div>
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
                    <div className="post-card-meta font-mono flex items-center gap-2">
                      {post.citations && post.citations.length > 0 && (
                        <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                          <BookmarkCheck className="w-2.5 h-2.5 text-purple-400" />
                          <span>{post.citations.length}</span>
                        </span>
                      )}
                      <span>{post.readTime}m read</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
