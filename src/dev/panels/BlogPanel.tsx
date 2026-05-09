// src/dev/panels/BlogPanel.tsx
import { useState } from "react";
import { useDevAuth } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";
import { 
  FileText, 
  Sparkles, 
  Save, 
  Send, 
  ChevronLeft, 
  Plus, 
  BookOpen, 
  Clock, 
  ExternalLink,
  Copy,
  CheckCircle2,
  Layout,
  Type,
  Users
} from "lucide-react";

const AUDIENCE_OPTIONS = ["Developers", "Open-source contributors", "Tech community", "General public"];
const TONE_OPTIONS = ["Technical & precise", "Conversational", "Inspirational", "Tutorial-style"];

interface BlogPost {
  id: string;
  title: string;
  status: "published" | "draft" | "scheduled";
  readTime: string;
  date: string;
  icon: string;
}

const DEMO_POSTS: BlogPost[] = [
  { id: "1", title: "Why open-source AI tooling is eating the stack", status: "published", readTime: "4 min", date: "May 2025", icon: "🤖" },
  { id: "2", title: "Building Lorapok UI with zero runtime dependencies", status: "draft", readTime: "6 min", date: "May 2025", icon: "⚙️" },
  { id: "3", title: "relay-db: SQLite at the edge without the overhead", status: "scheduled", readTime: "3 min", date: "Jun 2025", icon: "🦀" },
];

const BADGE_MAP = {
  published: "dev-badge-green",
  draft: "dev-badge-amber",
  scheduled: "dev-badge-muted",
};

export default function BlogPanel() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState("Developers");
  const [tone, setTone] = useState("Technical & precise");
  const [tags, setTags] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [genTime, setGenTime] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { activeProvider, apiKeys } = useDevAuth();
  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];

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
    const start = Date.now();

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
      setGenTime(((Date.now() - start) / 1000).toFixed(1));
    } catch (e: any) {
      setGeneratedPost(`⚠ Network error: ${e.message}. Please try again.`);
    } finally {
      setGenerating(false);
    }
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{selectedPost.icon}</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{selectedPost.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', opacity: 0.5 }}>
              <span className={`dev-badge ${BADGE_MAP[selectedPost.status]}`} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedPost.status}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {selectedPost.readTime} reading time</span>
              <span>Published {selectedPost.date}</span>
            </div>
          </div>
          
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', maxWidth: '700px' }}>
            <p style={{ marginBottom: '1.5rem' }}>This is a full preview of the blog post as it would appear on the live site. The content is parsed from Markdown and styled with Lorapok's high-fidelity theme.</p>
            <p style={{ marginBottom: '1.5rem' }}>Lorapok Labs focuses on building tools that are radically open. This post explores the technical architecture of our latest CLI tools and how we integrate AI to enhance the developer experience without adding bloat.</p>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px dashed rgba(255,255,255,0.1)', 
              borderRadius: '12px', 
              padding: '3rem', 
              textAlign: 'center', 
              fontFamily: 'var(--dev-font-mono)', 
              fontSize: '0.8rem', 
              color: 'var(--dev-muted)',
              margin: '2rem 0'
            }}>
              [ Full Markdown Content would render here ]
            </div>
            <p>We believe that open-source is not just about the code, but about the community and the knowledge sharing that happens around it. Stay tuned for more technical deep-dives.</p>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {DEMO_POSTS.map(post => (
              <div 
                key={post.id} 
                className="dev-card" 
                onClick={() => setSelectedPost(post)} 
                style={{ 
                  cursor: "pointer", 
                  padding: '1rem', 
                  transition: 'all 0.2s', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.01)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {post.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', lineHeight: 1.2 }}>{post.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.7rem', opacity: 0.4 }}>
                      <span className={`dev-badge ${BADGE_MAP[post.status]}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{post.status}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                style={{ fontSize: '1.1rem', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="dev-form-group" style={{ marginBottom: '2rem' }}>
              <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Layout size={14} /> CONTEXT & KEY ARGUMENTS
              </label>
              <textarea 
                className="dev-form-textarea" 
                placeholder="Paste your raw notes, bullet points, or research here. AI will craft the narrative..." 
                value={context} 
                onChange={e => setContext(e.target.value)} 
                style={{ minHeight: '150px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="dev-g2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="dev-form-group">
                <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Users size={14} /> TARGET AUDIENCE
                </label>
                <select className="dev-form-select" value={audience} onChange={e => setAudience(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {AUDIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="dev-form-group">
                <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={14} /> EDITORIAL TONE
                </label>
                <select className="dev-form-select" value={tone} onChange={e => setTone(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {TONE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="dev-form-group" style={{ marginBottom: '2.5rem' }}>
              <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FileText size={14} /> TAGS
              </label>
              <input className="dev-form-input" type="text" placeholder="ai, dev-tools, opensource" value={tags} onChange={e => setTags(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
              <button 
                className="dev-btn dev-btn-primary" 
                onClick={generatePost} 
                disabled={generating}
                style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                {generating ? "CRAFTING CONTENT..." : <><Sparkles size={18} /> GENERATE PUBLICATION</>}
              </button>
              <button className="dev-btn dev-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={18} /> SAVE AS DRAFT</button>
            </div>

            {generatedPost && (
              <div style={{ marginTop: "3rem", animation: 'dev-fade-in 0.4s ease-out' }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', marginBottom: "1.5rem" }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                    <span style={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.75rem', opacity: 0.6 }}>READY FOR REVIEW</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--dev-muted)", fontFamily: 'var(--dev-font-mono)' }}>[{genTime}s]</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />} {copied ? 'COPIED' : 'COPY'}
                    </button>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => setGeneratedPost("")}>CLEAR</button>
                  </div>
                </div>
                
                <div style={{ 
                  background: '#000', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '2rem', 
                  maxHeight: '500px', 
                  overflowY: 'auto',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {generatedPost}
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button className="dev-btn dev-btn-primary" style={{ flex: 1, padding: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <Send size={18} /> PUBLISH TO LORAPOK.GITHUB.IO
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

// Add missing icon
const Edit = ({ size, style }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
