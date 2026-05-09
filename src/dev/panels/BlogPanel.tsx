// src/dev/panels/BlogPanel.tsx
import { useState } from "react";

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
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState("Developers");
  const [tone, setTone] = useState("Technical & precise");
  const [tags, setTags] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [genTime, setGenTime] = useState("");

  const generatePost = async () => {
    if (!topic && !context) return;
    const key = localStorage.getItem("lpk_key_claude") || localStorage.getItem("lpk_key_openai") || "";
    if (!key) {
      alert("Please save a Claude or OpenAI API key in AI Labs first.");
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
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: "You are a professional technical writer for Lorapok Labs. Write engaging, accurate blog posts about open-source software development. Output only valid Markdown, no preamble.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const result = data.content?.[0]?.text || "Generation failed.";
      setGeneratedPost(result);
      setGenTime(((Date.now() - start) / 1000).toFixed(1));
    } catch (e) {
      setGeneratedPost("⚠ Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Blog <span>System</span></div>
        <div className="dev-panel-sub">AI-powered blog pipeline. You provide context — the system writes, illustrates, and publishes.</div>
      </div>

      <div className="dev-g12">
        {/* Post List */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
            <div className="dev-stitle" style={{ margin: 0 }}><span className="dev-stitle-dot" />Posts</div>
            <button className="dev-btn dev-btn-primary dev-btn-sm">+ New post</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {DEMO_POSTS.map(post => (
              <div key={post.id} className="dev-blog-card">
                <div className="dev-blog-thumb">
                  <div className="dev-blog-thumb-pattern" />
                  <span className="dev-blog-thumb-icon">{post.icon}</span>
                </div>
                <div className="dev-blog-body">
                  <div className="dev-blog-title">{post.title}</div>
                  <div className="dev-blog-meta">
                    <span className={`dev-badge ${BADGE_MAP[post.status]}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span>
                    <span>{post.readTime} read</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generator */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Generate new post</div>
          <div className="dev-card">
            <div className="dev-form-group">
              <label className="dev-form-label">Topic / title idea</label>
              <input className="dev-form-input" type="text" placeholder="e.g. How Lorapok builds developer tools that last" value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">Context & key points</label>
              <textarea className="dev-form-textarea" placeholder="Paste notes, bullet points, or rough thoughts. AI will structure and expand into a full post." value={context} onChange={e => setContext(e.target.value)} />
            </div>
            <div className="dev-g2">
              <div className="dev-form-group">
                <label className="dev-form-label">Target audience</label>
                <select className="dev-form-select" value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="dev-form-group">
                <label className="dev-form-label">Tone</label>
                <select className="dev-form-select" value={tone} onChange={e => setTone(e.target.value)}>
                  {TONE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">Tags (comma-separated)</label>
              <input className="dev-form-input" type="text" placeholder="open-source, AI, developer-tools" value={tags} onChange={e => setTags(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
              <button className="dev-btn dev-btn-primary" onClick={generatePost} disabled={generating}>
                {generating ? "Generating…" : "✦ Generate post"}
              </button>
              <button className="dev-btn dev-btn-secondary dev-btn-sm">Save draft</button>
              <span style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)", marginLeft: "auto" }}>
                AI-powered · Markdown output
              </span>
            </div>

            {generatedPost && (
              <div style={{ marginTop: "1.25rem" }}>
                <div className="dev-divider" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                  <span className="dev-badge dev-badge-green">Generated</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)" }}>in {genTime}s</span>
                </div>
                <pre className="dev-blog-output">{generatedPost}</pre>
                <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.75rem" }}>
                  <button className="dev-btn dev-btn-primary dev-btn-sm">Publish</button>
                  <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => navigator.clipboard.writeText(generatedPost)}>Copy Markdown</button>
                  <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => setGeneratedPost("")}>Clear</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
