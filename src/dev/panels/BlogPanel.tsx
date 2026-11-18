// src/dev/panels/BlogPanel.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useDevAuth } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";
import { 
  FileText, 
  Sparkles, 
  ChevronLeft, 
  Plus, 
  BookOpen, 
  Clock, 
  ExternalLink,
  Layout,
  Type,
  Users,
  Search,
  Edit,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { blogService } from "../../lib/blogService";
import type { BlogPost as LivePost } from "../../blog/BlogApp";
import { Timestamp } from "firebase/firestore";

const AUDIENCE_OPTIONS = ["Developers", "Open-source contributors", "Tech community", "General public"];
const TONE_OPTIONS = ["Technical & precise", "Conversational", "Inspirational", "Tutorial-style"];

const BADGE_MAP: Record<string, string> = {
  published: "dev-badge-green",
  draft: "dev-badge-amber",
  scheduled: "dev-badge-muted",
};

export default function BlogPanel() {
  const [posts, setPosts] = useState<LivePost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState<LivePost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState("Developers");
  const [tone, setTone] = useState("Technical & precise");
  const [tags, setTags] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [copied, setCopied] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);
  
  const { activeProvider, apiKeys, role, accessProfile } = useDevAuth();
  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];
  const publishedCount = useMemo(() => posts.filter((post) => post.status === "published").length, [posts]);

  const startNewPublication = () => {
    setSelectedPost(null);
    setTopic("");
    setContext("");
    setTags("");
    setGeneratedPost("");
    requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      topicInputRef.current?.focus({ preventScroll: true });
    });
  };

  const editPublication = (post: LivePost) => {
    setTopic(post.title);
    setContext(post.excerpt || "");
    setTags((post.tags || []).join(", "));
    setGeneratedPost(post.content);
    setSelectedPost(null);
    requestAnimationFrame(() => composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const formatPostDate = (value: LivePost["publishedAt"]) => {
    const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? "Recent" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const live = await blogService.getPublishedPosts(50);
        if (live && live.length > 0) {
          setPosts(live);
          return;
        }
      } catch (e) {
        console.warn("Firestore fetch skipped, falling back to local posts.json:", e);
      }
      try {
        const res = await fetch('/blog/posts.json?_t=' + Date.now());
        if (res.ok) {
          const staticPosts = await res.json();
          let archivePosts: unknown[] = [];
          try {
            const archiveRes = await fetch('/blog/archive/ai-posts.json?_t=' + Date.now());
            if (archiveRes.ok) {
              const archived = await archiveRes.json();
              if (Array.isArray(archived)) archivePosts = archived;
            }
          } catch {
            archivePosts = [];
          }
          setPosts([...(Array.isArray(staticPosts) ? staticPosts : []), ...archivePosts]);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePost = async () => {
    if (!topic && !context) return;
    const key = apiKeys[activeProvider];
    if (!key) {
      alert(`Please save an API key for ${activeP.label} in AI Labs first.`);
      return;
    }
    setGenerating(true);
    setGeneratedPost("");

    const prompt = `Write a professional blog post for Lorapok Labs (nonprofit open-source collective) with these details:
Topic: ${topic || "(use context below)"}
Context/notes: ${context || "none"}
Target audience: ${audience}
Tone: ${tone}
Tags: ${tags || "open-source"}

Structure:
# [Title]
*[2-line intro]*

## [Section 1]
[content]

## [Section 2]
[content]

## [Conclusion]
[1-2 sentences wrapping up]

Write the full blog post now. Output only the Markdown.`;

    try {
      let endpoint = "";
      let body = {};
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      
      const systemInstruction = "You are a professional technical writer for Lorapok Labs. Write engaging, accurate blog posts about open-source software development. Output only valid Markdown, no preamble.";
      
      if (activeProvider === "claude") {
        endpoint = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        body = {
          model: activeP.model,
          max_tokens: 1500,
          system: systemInstruction,
          messages: [{ role: "user", content: prompt }]
        };
      } else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(activeProvider)) {
        if (activeProvider === "openai") endpoint = "https://api.openai.com/v1/chat/completions";
        else if (activeProvider === "groq") endpoint = "https://api.groq.com/openai/v1/chat/completions";
        else if (activeProvider === "mistral") endpoint = "https://api.mistral.ai/v1/chat/completions";
        else if (activeProvider === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";
        else if (activeProvider === "perplexity") endpoint = "https://api.perplexity.ai/chat/completions";
        else if (activeProvider === "xai") endpoint = "https://api.x.ai/v1/chat/completions";
        else if (activeProvider === "together") endpoint = "https://api.together.xyz/v1/chat/completions";
        else if (activeProvider === "openrouter") endpoint = "https://openrouter.ai/api/v1/chat/completions";
        else if (activeProvider === "anyscale") endpoint = "https://api.endpoints.anyscale.com/v1/chat/completions";

        headers["Authorization"] = `Bearer ${key}`;
        body = {
          model: activeP.model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ]
        };
      } else {
        throw new Error("Provider not fully supported here yet.");
      }

      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error.message);

      let result = "";
      if (activeProvider === "claude") result = data.content?.[0]?.text || "Generation failed.";
      else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(activeProvider)) result = data.choices?.[0]?.message?.content || "Generation failed.";
      setGeneratedPost(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "The provider did not return a usable response";
      setGeneratedPost(`⚠ Network error: ${message}. Please try again.`);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedPost || !topic) return;
    setPublishing(true);
    try {
      const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newPost: Omit<LivePost, 'id'> = {
        slug,
        title: topic,
        excerpt: context.slice(0, 150) + "...",
        content: generatedPost,
        coverImage: "",
        tags: tags.split(',').map(t => t.trim()),
        category: "General Tech",
        author: {
          name: accessProfile?.displayName || accessProfile?.email || "Lorapok Labs editor",
          designation: accessProfile?.title || `${role[0].toUpperCase()}${role.slice(1)}`,
          avatar: accessProfile?.photoURL || "/assets/ribo/ribo-focused.webp",
        },
        seo: { 
          metaTitle: `${topic} | LoLaBo`, 
          metaDescription: context.slice(0, 150),
          keywords: tags.split(',').map(t => t.trim())
        },
        source: "manual",
        status: "published",
        publishedAt: Timestamp.now(),
        socialShares: [],
        readTime: Math.ceil(generatedPost.split(' ').length / 200),
        views: 0,
        likes: 0,
        commentsCount: 0
      };
      await blogService.createPost(newPost);
      alert("Post published successfully to LoLaBo!");
      // Refresh list
      const live = await blogService.getPublishedPosts(50);
      setPosts(live);
      setGeneratedPost("");
    } catch (e) {
      console.error("Publishing failed:", e);
      alert("Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  const renderContentLibrary = () => {
    if (loadingPosts) return <div className="blog-studio__empty"><Activity className="dev-auth-spinner" size={17} /> Scanning library…</div>;
    
    const filtered = posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length === 0) return <div className="blog-studio__empty">No publications match this search.</div>;
    
    return filtered.map((post: LivePost) => {
      const isSelected = selectedPost && selectedPost.id === post.id;
      return (
        <button 
          key={post.id || post.slug}
          onClick={() => setSelectedPost(post)}
          className={`blog-studio-library-card${isSelected ? " is-selected" : ""}`}
        >
          <div className="blog-studio-library-card__copy">
            <strong>{post.title}</strong>
            <div>
              <span>{post.readTime} min</span>
              <span>{formatPostDate(post.publishedAt)}</span>
            </div>
          </div>
          <div className={`dev-badge ${BADGE_MAP[post.status] || 'dev-badge-muted'}`}>
            {post.status.toUpperCase()}
          </div>
        </button>
      );
    });
  };

  if (selectedPost) {
    return (
      <div className="dev-panel-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: "2rem" }}>
          <button 
            className="dev-btn dev-btn-ghost dev-btn-sm" 
            onClick={() => setSelectedPost(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <ChevronLeft size={16} /> BACK TO PIPELINE
          </button>
        </div>
        
        <div className="dev-card" style={{ padding: '3rem', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{selectedPost.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.5 }}>
              <span className={`dev-badge ${BADGE_MAP[selectedPost.status] || 'dev-badge-muted'}`} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedPost.status}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {selectedPost.readTime} min read</span>
              <span>{selectedPost.publishedAt?.toDate?.().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', maxWidth: '700px' }}>
             <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{selectedPost.content}</pre>
          </div>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem' }}>
            <button className="dev-btn dev-btn-primary" onClick={() => editPublication(selectedPost)}><Edit size={16} /> EDIT POST</button>
            <a className="dev-btn dev-btn-ghost" href={`/blog/${selectedPost.slug}/`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> VIEW LIVE</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-panel-content blog-studio">
      <header className="blog-studio__header">
        <div className="blog-studio__heading">
          <div className="dev-kicker"><FileText size={13} /> APPROVED EDITORIAL WORKSPACE</div>
          <div className="dev-panel-title">Blog <span>System</span></div>
          <div className="dev-panel-sub">Research, draft, review, and publish from one calm editorial surface.</div>
        </div>
        <div className="blog-studio__header-actions">
          <div className="blog-studio__access"><ShieldCheck size={15} /><span><strong>Publishing access approved</strong><small>{role} · {accessProfile?.email}</small></span></div>
          <button className="dev-btn dev-btn-primary" onClick={startNewPublication}>
            <Plus size={18} /> New publication
          </button>
        </div>
      </header>

      <div className="blog-studio__metrics" aria-label="Blog system overview">
        <div><strong>{posts.length}</strong><span>Library records</span></div>
        <div><strong>{publishedCount}</strong><span>Published</span></div>
        <div><strong>{activeP.label}</strong><span>Writing provider</span></div>
        <div><strong>Role gated</strong><span>Admin-approved access</span></div>
      </div>

      <div className="blog-studio__layout">
        <aside className="blog-studio__library">
          <div className="blog-studio__section-heading"><BookOpen size={17} /><div><strong>Content library</strong><span>Published notes and working records</span></div></div>
          <label className="blog-studio__search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search publications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <div className="blog-studio__library-list">
            {renderContentLibrary()}
          </div>
        </aside>

        <section className="blog-studio__composer" ref={composerRef}>
          <div className="blog-studio__section-heading"><Sparkles size={17} /><div><strong>Authoring suite</strong><span>Context → writing → review → publish</span></div></div>
          <div className="dev-card blog-studio__composer-card">
            <div className="blog-studio__approval-strip"><CheckCircle2 size={15} /><span>Your administrator-approved role includes Blog System publishing. Every release is attributed to this signed-in identity.</span></div>
            
            <div className="dev-form-group">
              <label className="dev-form-label blog-studio__label">
                <Type size={14} /> Topic or working title
              </label>
              <input 
                ref={topicInputRef}
                className="dev-form-input" 
                type="text" 
                placeholder="e.g. Why open-source software needs a non-profit future" 
                value={topic} 
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            <div className="dev-form-group">
              <label className="dev-form-label blog-studio__label">
                <Layout size={14} /> Context &amp; key arguments
              </label>
              <textarea 
                className="dev-form-textarea" 
                placeholder="Paste your raw notes, bullet points, or research here..." 
                value={context} 
                onChange={e => setContext(e.target.value)}
              />
            </div>

            <div className="blog-studio__field-grid">
              <div className="dev-form-group">
                <label className="dev-form-label blog-studio__label">
                  <Users size={14} /> Target audience
                </label>
                <select className="dev-form-select" value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="dev-form-group">
                <label className="dev-form-label blog-studio__label">
                  <Sparkles size={14} /> Editorial tone
                </label>
                <select className="dev-form-select" value={tone} onChange={e => setTone(e.target.value)}>
                  {TONE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="dev-form-group">
              <label className="dev-form-label blog-studio__label">
                <FileText size={14} /> Tags
              </label>
              <input className="dev-form-input" type="text" placeholder="ai, dev-tools, architecture" value={tags} onChange={e => setTags(e.target.value)} />
            </div>

            <div className="blog-studio__composer-actions">
              <button 
                className="dev-btn dev-btn-primary" 
                onClick={generatePost} 
                disabled={generating || (!topic.trim() && !context.trim())}
              >
                {generating ? "Crafting publication…" : "Generate publication"}
              </button>
              <span>Provider: {activeP.label}</span>
            </div>

            {generatedPost && (
              <div className="blog-studio__preview">
                <div className="blog-studio__preview-head">
                  <div><strong>Publication preview</strong><span>Review the generated Markdown before publishing.</span></div>
                  <div>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={handleCopy}>{copied ? "COPIED" : "COPY"}</button>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => setGeneratedPost("")}>CLEAR</button>
                  </div>
                </div>
                <div className="blog-studio__preview-body">
                  <pre>{generatedPost}</pre>
                </div>
                <div className="blog-studio__publish-row">
                  <span><ShieldCheck size={13} /> Publishing uses the approved Office identity.</span>
                  <button className="dev-btn dev-btn-primary" onClick={handlePublish} disabled={publishing || !topic.trim()}>
                    {publishing ? "Publishing…" : "Publish to LoLaBo"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
