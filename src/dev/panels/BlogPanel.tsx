// src/dev/panels/BlogPanel.tsx
import { useState, useEffect } from "react";
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
  Edit
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
  
  const { activeProvider, apiKeys } = useDevAuth();
  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const live = await blogService.getPublishedPosts(50);
        setPosts(live);
      } catch (e) {
        console.error("Failed to load blog posts:", e);
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
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      
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
    } catch (e: any) {
      setGeneratedPost(`⚠ Network error: ${e.message}. Please try again.`);
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
        author: { name: "Lorapok Admin", designation: "Maintainer", avatar: "👨‍💻" },
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
    if (loadingPosts) return <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>Scanning library...</div>;
    
    const filtered = posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length === 0) return <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No publications found.</div>;
    
    return filtered.map((post: LivePost) => {
      const isSelected = selectedPost && selectedPost.id === post.id;
      return (
        <button 
          key={post.id} 
          onClick={() => setSelectedPost(post)}
          className="dev-card"
          style={{ 
            padding: '1rem', 
            textAlign: 'left', 
            width: '100%',
            background: isSelected ? 'var(--dev-accent-dim)' : 'rgba(255,255,255,0.02)',
            borderColor: isSelected ? 'var(--dev-accent)' : 'rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{post.title}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, display: 'flex', gap: '0.75rem' }}>
              <span>{post.readTime} min</span>
              <span>{post.publishedAt?.toDate?.().toLocaleDateString()}</span>
            </div>
          </div>
          <div className={`dev-badge ${BADGE_MAP[post.status] || 'dev-badge-muted'}`} style={{ fontSize: '0.6rem' }}>
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
            <button className="dev-btn dev-btn-primary"><Edit size={16} style={{ marginRight: '0.5rem' }} /> EDIT POST</button>
            <button className="dev-btn dev-btn-ghost"><ExternalLink size={16} style={{ marginRight: '0.5rem' }} /> VIEW LIVE</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-panel-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      {/* ─── Header ─── */}
      <div className="dev-panel-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="dev-panel-title" style={{ fontSize: '2rem' }}>Blog <span>System</span></div>
          <div className="dev-panel-sub" style={{ opacity: 0.6 }}>AI-powered blog pipeline. Context → AI Writing → Design → Publish.</div>
        </div>
        <button className="dev-btn dev-btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Plus size={18} /> NEW PUBLICATION
        </button>
      </div>

      <div className="dev-g12" style={{ gap: '3rem', alignItems: 'start' }}>
        
        {/* LEFT: Content Library */}
        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <div className="dev-stitle" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={18} /> CONTENT LIBRARY
          </div>
          
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <input 
              type="text" 
              placeholder="Search library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dev-form-input"
              style={{ paddingLeft: '36px', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {renderContentLibrary()}
          </div>
        </div>

        {/* RIGHT: Authoring Suite */}
        <div>
          <div className="dev-stitle" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={18} /> AUTHORING SUITE
          </div>
          <div className="dev-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            
            <div className="dev-form-group" style={{ marginBottom: '2rem' }}>
              <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Type size={14} /> TOPIC OR WORKING TITLE
              </label>
              <input 
                className="dev-form-input" 
                type="text" 
                placeholder="e.g. Why open-source software needs a non-profit future" 
                value={topic} 
                onChange={e => setTopic(e.target.value)} 
                style={{ fontSize: '1.1rem', padding: '12px 16px' }}
              />
            </div>

            <div className="dev-form-group" style={{ marginBottom: '2rem' }}>
              <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layout size={14} /> CONTEXT & KEY ARGUMENTS
              </label>
              <textarea 
                className="dev-form-textarea" 
                placeholder="Paste your raw notes, bullet points, or research here..." 
                value={context} 
                onChange={e => setContext(e.target.value)} 
                style={{ minHeight: '150px' }}
              />
            </div>

            <div className="dev-g2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="dev-form-group">
                <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Users size={14} /> TARGET AUDIENCE
                </label>
                <select className="dev-form-select" value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="dev-form-group">
                <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={14} /> EDITORIAL TONE
                </label>
                <select className="dev-form-select" value={tone} onChange={e => setTone(e.target.value)}>
                  {TONE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="dev-form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FileText size={14} /> TAGS
              </label>
              <input className="dev-form-input" type="text" placeholder="ai, dev-tools" value={tags} onChange={e => setTags(e.target.value)} />
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
              <button 
                className="dev-btn dev-btn-primary" 
                onClick={generatePost} 
                disabled={generating}
                style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 800 }}
              >
                {generating ? "CRAFTING CONTENT..." : "GENERATE PUBLICATION"}
              </button>
            </div>

            {generatedPost && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>PREVIEW</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={handleCopy}>{copied ? "COPIED" : "COPY"}</button>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => setGeneratedPost("")}>CLEAR</button>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '400px', overflowY: 'auto' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{generatedPost}</pre>
                </div>
                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                   <button className="dev-btn" style={{ background: 'var(--dev-accent)', color: '#000' }} onClick={handlePublish} disabled={publishing}>
                    {publishing ? "PUBLISHING..." : "PUBLISH TO LOLABO"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
