// src/blog/BlogApp.tsx
// LoLaBo — Lorapok Labs Blog
// Premium tech blog with AI-powered content generation

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, Eye, Heart, MessageSquare, Share2, Sparkles } from "lucide-react";
import { blogService } from "../lib/blogService";
import SEOHead from "./components/SEOHead";
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
    excerpt: "The developer stack is being rewritten by AI-native tools. Here's why open-source alternatives are leading the charge across production systems.",
    content: "The developer stack is being rewritten by AI-native tools. Open-source local models, standardized tool protocols (MCP), and edge execution pipelines give developers total control over their data, latencies, and runtime destiny.",
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
  {
    id: "2",
    slug: "zero-runtime-ui-framework",
    title: "Building UI Frameworks With Zero Runtime Dependencies",
    excerpt: "We shipped a production biological UI library with zero runtime overhead using modern CSS custom properties and canvas rendering.",
    content: "We shipped a production biological UI library with zero runtime overhead using modern CSS custom properties and canvas rendering.",
    coverImage: "/assets/projects/aswitchi-hero.png",
    tags: ["frontend", "performance", "ui-design"],
    category: "Frontend Engineering",
    author: AUTHOR_POOL[3],
    seo: { metaTitle: "Zero Runtime UI", metaDescription: "Zero dependencies.", keywords: ["ui"] },
    source: "ai-agent",
    status: "published",
    publishedAt: { toDate: () => new Date("2026-05-06") },
    socialShares: [],
    readTime: 5,
    views: 1890,
    likes: 312,
    commentsCount: 24,
  },
];

export default function BlogApp() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 1. Try static JSON first (fastest, SEO-friendly)
        const staticRes = await fetch("/blog/posts.json");
        if (staticRes.ok) {
          const staticPosts = await staticRes.json();
          // Convert ISO strings back to pseudo-Firestore timestamps for compatibility
          const formatted = staticPosts.map((p: any) => ({
            ...p,
            publishedAt: { toDate: () => new Date(p.publishedAt) },
          }));
          setPosts(formatted);
          setLoading(false);
          return;
        }

        // 2. Fallback to Firestore (live data)
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

  // ─── Article View ───
  if (slug && currentPost) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const tweetText = encodeURIComponent(`${currentPost.title} via @LorapokLabs`);

    return (
      <div className="lolabo pb-16">
        <SEOHead post={currentPost} />

        {/* Back navigation bar */}
        <div className="max-w-[var(--lb-max-w)] mx-auto px-4 sm:px-8 pt-8">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--lp-accent,#67ff8f)] hover:opacity-80 transition-opacity bg-white/5 px-3 py-1.5 rounded-md border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO FEED</span>
          </button>
        </div>

        <article className="lolabo-article">
          <div className="article-hero">
            <div className="article-meta-top">
              <span className="article-category">{currentPost.category}</span>
              <span className="article-date flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 inline" />
                {currentPost.readTime} MIN READ
              </span>
            </div>
            <h1 className="article-title">{currentPost.title}</h1>
            <p className="article-excerpt">{currentPost.excerpt}</p>
            <div className="article-author-bar">
              <div className="author-badge">
                <div className="author-avatar">{currentPost.author.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{currentPost.author.name}</div>
                  <div className="author-designation">{currentPost.author.designation}</div>
                </div>
              </div>
              <div className="article-stats flex items-center gap-4 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {currentPost.views}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {currentPost.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {currentPost.commentsCount}</span>
              </div>
            </div>
          </div>

          {currentPost.coverImage && (
            <div className="article-cover">
              <img src={currentPost.coverImage} alt={currentPost.title} className="w-full h-auto rounded-xl object-cover" />
            </div>
          )}

          <div className="article-body prose prose-invert max-w-none text-gray-300 leading-relaxed text-base space-y-4">
            <ReactMarkdown>{currentPost.content}</ReactMarkdown>
          </div>

          <div className="article-share-bar mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="share-label flex items-center gap-2 text-xs font-mono tracking-widest text-gray-400 uppercase">
              <Share2 className="w-4 h-4 text-[var(--lp-accent,#67ff8f)]" />
              <span>Share this insight</span>
            </div>
            <div className="share-buttons flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-x"
                title="Share on X"
              >
                X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-linkedin"
                title="Share on LinkedIn"
              >
                LN
              </a>
              <a
                href={`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(currentPost.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn share-reddit"
                title="Share on Reddit"
              >
                RD
              </a>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // ─── Feed View ───
  return (
    <div className="lolabo pb-16">
      <SEOHead />

      <section className="lolabo-hero relative overflow-hidden pt-12 pb-16 border-b border-white/5">
        <div className="hero-glow"></div>
        <div className="hero-content text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[var(--lp-accent,#67ff8f)] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AUTONOMOUS CONTENT ENGINE // LoLaBo
          </div>
          <h1 className="hero-title text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white">
            <span className="hero-lo text-[var(--lp-accent,#67ff8f)]">Lo</span>
            <span className="hero-la text-[#38bdf8]">La</span>
            <span className="hero-bo text-[#c084fc]">Bo</span>
          </h1>
          <p className="hero-subtitle text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Exploring the frontiers of open-source intelligence, sensory computing, and autonomous multi-agent engineering.
          </p>
        </div>
      </section>

      <main className="lolabo-feed max-w-[var(--lb-max-w)] mx-auto px-4 sm:px-8 pt-8">
        <div className="feed-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="feed-title text-xl font-bold text-white tracking-wide">
            Latest Publications
          </div>
          <div className="feed-tags flex flex-wrap gap-2">
            <button
              className={`feed-tag px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                !selectedTag ? "active bg-[var(--lp-accent,#67ff8f)] text-black" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All ({posts.length})
            </button>
            {Array.from(new Set(posts.flatMap((p) => p.tags))).map((tag) => (
              <button
                key={tag}
                className={`feed-tag px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  selectedTag === tag ? "active bg-[var(--lp-accent,#67ff8f)] text-black" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {selectedTag && (
          <div className="tag-filter-bar mb-6 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
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

        <div className="post-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
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
                <h2 className="post-card-title text-xl font-bold text-white group-hover:text-[var(--lp-accent,#67ff8f)] transition-colors mb-2 line-clamp-2">
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
