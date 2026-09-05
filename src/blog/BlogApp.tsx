// src/blog/BlogApp.tsx
// LoLaBo — Lorapok Labs Blog
// Premium tech blog with AI-powered content generation

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    id: "1", slug: "ai-tooling-eating-the-stack",
    title: "Why Open-Source AI Tooling Is Eating the Stack",
    excerpt: "The developer stack is being rewritten by AI-native tools. Here's why open-source alternatives are leading the charge.",
    content: "Content summary...",
    coverImage: "",
    tags: ["ai", "open-source"],
    category: "AI & Machine Learning",
    author: AUTHOR_POOL[0],
    seo: { metaTitle: "AI Tooling", metaDescription: "AI is eating the stack.", keywords: ["ai"] },
    source: "ai-agent",
    status: "published",
    publishedAt: { toDate: () => new Date("2025-05-08") },
    socialShares: [],
    readTime: 4,
    views: 342,
    likes: 120,
    commentsCount: 8
  },
  {
    id: "2", slug: "zero-runtime-ui-framework",
    title: "Building UI Frameworks With Zero Runtime Dependencies",
    excerpt: "We shipped a production UI library with exactly zero runtime dependencies.",
    content: "Content summary...",
    coverImage: "",
    tags: ["frontend", "performance"],
    category: "Frontend Engineering",
    author: AUTHOR_POOL[3],
    seo: { metaTitle: "Zero Runtime UI", metaDescription: "Zero dependencies.", keywords: ["ui"] },
    source: "ai-agent",
    status: "published",
    publishedAt: { toDate: () => new Date("2025-05-06") },
    socialShares: [],
    readTime: 6,
    views: 1240,
    likes: 85,
    commentsCount: 12
  }
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
            publishedAt: { toDate: () => new Date(p.publishedAt) }
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

  const currentPost = posts.find(p => p.slug === slug);
  const filteredPosts = selectedTag 
    ? posts.filter(p => p.tags.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="lolabo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>SYNCHRONIZING...</p>
      </div>
    );
  }

  // ─── Article View ───
  if (slug && currentPost) {
    return (
      <div className="lolabo">
        <SEOHead post={currentPost} />
        <header className="lolabo-header">
          <div className="lolabo-header-inner">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/blog"); }} className="lolabo-logo">
              <span className="logo-larva">🧬</span>
              <div className="logo-text"><span className="lo">Lo</span><span className="la">La</span><span className="bo">Bo</span></div>
            </a>
            <nav className="lolabo-nav">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/blog"); }}>BACK TO FEED</a>
            </nav>
          </div>
        </header>

        <article className="lolabo-article">
          <div className="article-hero">
            <div className="article-meta-top">
              <span className="article-category">{currentPost.category}</span>
              <span className="article-date">{currentPost.readTime} MIN READ</span>
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
              <div className="article-stats">
                <span>{currentPost.views} views</span>
                <span>{currentPost.likes} likes</span>
              </div>
            </div>
          </div>

          {currentPost.coverImage && (
            <div className="article-cover">
              <img src={currentPost.coverImage} alt="" />
            </div>
          )}

          <div className="article-body">
            <p className="article-lead">{currentPost.content}</p>
          </div>

          <div className="article-share-bar">
            <div className="share-label">SHARE THIS INSIGHT</div>
            <div className="share-buttons">
              <a href="#" className="share-btn share-x">X</a>
              <a href="#" className="share-btn share-linkedin">LN</a>
              <a href="#" className="share-btn share-reddit">RD</a>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // ─── Feed View ───
  return (
    <div className="lolabo">
      <header className="lolabo-header">
        <div className="lolabo-header-inner">
          <div className="lolabo-logo">
            <span className="logo-larva">🧬</span>
            <div className="logo-text"><span className="lo">Lo</span><span className="la">La</span><span className="bo">Bo</span></div>
          </div>
        </div>
      </header>

      <section className="lolabo-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">AUTONOMOUS CONTENT ENGINE</div>
          <h1 className="hero-title"><span className="hero-lo">Lo</span><span className="hero-la">La</span><span className="hero-bo">Bo</span></h1>
          <p className="hero-subtitle">Exploring the frontiers of open-source intelligence and AI engineering.</p>
        </div>
      </section>

      <main className="lolabo-feed">
        <div className="feed-header">
          <div className="feed-title">Latest Insights</div>
          <div className="feed-tags">
            <a href="#" className={`feed-tag ${!selectedTag ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedTag(null); }}>All</a>
            {Array.from(new Set(posts.flatMap(p => p.tags))).map(tag => (
              <a 
                key={tag} href="#" 
                className={`feed-tag ${selectedTag === tag ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setSelectedTag(tag); }}
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>

        {selectedTag && (
          <div className="tag-filter-bar" style={{ marginBottom: '2rem' }}>
            <span>Filtering by <strong>#{selectedTag}</strong></span>
            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedTag(null); }} className="clear-filter">Clear</a>
          </div>
        )}

        <div className="post-grid">
          {filteredPosts.map(post => (
            <a key={post.id} href="#" className="post-card" onClick={(e) => { e.preventDefault(); navigate(`/blog/${post.slug}`); }}>
              <div className="post-card-image">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" />
                ) : (
                  <div className="post-card-placeholder">
                    <span className="placeholder-icon">{post.author.avatar}</span>
                  </div>
                )}
                <span className="post-card-category">{post.category}</span>
              </div>
              <div className="post-card-body">
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-excerpt">{post.excerpt}</p>
                <div className="post-card-footer">
                  <div className="post-card-author">
                    <span className="author-avatar-sm">{post.author.avatar}</span>
                    <span className="author-name-sm">{post.author.name}</span>
                  </div>
                  <div className="post-card-meta">
                    <span>{post.readTime}m read</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="lolabo-footer">
        <div className="footer-inner">
          <div className="footer-bottom">
            <span>© 2026 Lorapok Labs // LoLaBo</span>
            <span className="footer-badge">AGENT STATUS: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
