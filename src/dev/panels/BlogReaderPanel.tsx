// src/dev/panels/BlogReaderPanel.tsx
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
  icon: string;
}

const DEMO_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Why open-source AI tooling is eating the stack",
    content: "Open-source AI is not just a trend; it's the future of how we build and deploy intelligent systems. At Lorapok Labs, we believe in the power of community-driven software...\n\n## The Shift to Local Models\nWith the rise of efficient small language models (SLMs), developers are moving away from centralized APIs...",
    author: "Maizied",
    date: "May 15, 2025",
    tags: ["AI", "Open Source", "Trends"],
    readTime: "4 min",
    icon: "🤖"
  }
];

function sanitizeMarkdown(content: string): string {
  if (!content) return "";
  let processed = content;
  const fences = processed.match(/```/g);
  if (fences && fences.length % 2 !== 0) {
    const footerIdx = processed.lastIndexOf("\n---\n*Authored autonomously");
    if (footerIdx !== -1) {
      processed = processed.slice(0, footerIdx) + "\n```\n" + processed.slice(footerIdx);
    } else {
      processed = processed + "\n```\n";
    }
  }
  return processed;
}

export default function BlogReaderPanel() {
  const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch('/blog/posts.json?_t=' + Date.now())
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: BlogPost[] = data.map((p, idx) => ({
            id: p.slug || String(idx),
            title: p.title,
            content: p.content,
            author: p.author?.name || "LoLaBo Agent",
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "Recently",
            tags: (p.tags || []).slice(0, 3),
            readTime: `${p.readTime || 5} min`,
            icon: p.author?.avatar || "📄"
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  if (selectedPost) {
    return (
      <div className="dev-panel-content">
        <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ marginBottom: "1.5rem" }} onClick={() => setSelectedPost(null)}>
          ← Back to blog
        </button>
        <article className="dev-blog-article">
          <div className="dev-blog-article-header">
            <div className="dev-blog-thumb-icon" style={{ fontSize: "3rem", marginBottom: "1rem" }}>{selectedPost.icon}</div>
            <h1 className="dev-blog-article-title">{selectedPost.title}</h1>
            <div className="dev-blog-article-meta">
              <span>By {selectedPost.author}</span>
              <span className="dev-dot"></span>
              <span>{selectedPost.date}</span>
              <span className="dev-dot"></span>
              <span>{selectedPost.readTime} read</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {selectedPost.tags.map(t => <span key={t} className="dev-badge dev-badge-muted">{t}</span>)}
            </div>
          </div>
          <div className="dev-divider" />
          <div className="dev-blog-article-body prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sanitizeMarkdown(selectedPost.content)}</ReactMarkdown>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">LoLaBo <span>Catalog</span></div>
        <div className="dev-panel-sub">Autonomous technical treatises, blueprints, and systems deep dives.</div>
      </div>

      <div className="dev-g3">
        {posts.map(post => (
          <div key={post.id} className="dev-blog-reader-card" onClick={() => setSelectedPost(post)}>
            <div className="dev-blog-reader-thumb">
              <div className="dev-blog-reader-pattern" />
              <span className="dev-blog-reader-icon">{post.icon}</span>
            </div>
            <div className="dev-blog-reader-content">
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
                {post.tags.slice(0, 2).map(t => <span key={t} className="dev-badge dev-badge-green" style={{ fontSize: "0.6rem" }}>{t}</span>)}
              </div>
              <h3 className="dev-blog-reader-title">{post.title}</h3>
              <div className="dev-blog-reader-meta">
                <span>{post.date}</span>
                <span className="dev-dot"></span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
