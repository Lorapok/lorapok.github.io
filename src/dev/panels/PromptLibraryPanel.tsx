// src/dev/panels/PromptLibraryPanel.tsx
import { useState } from "react";

const SAMPLE_PROMPTS = [
  {
    id: "1", title: "Senior code reviewer", votes: 42,
    text: "Review this code like a senior engineer. Focus on: correctness, edge cases, performance, and readability. Be direct.",
    provider: "Claude", category: "Code",
  },
  {
    id: "2", title: "README writer for open-source libs", votes: 38,
    text: "Write a professional README for [project]. Include: badges, quick start, API reference, contributing guide, and MIT license section.",
    provider: "OpenAI", category: "Writing",
  },
  {
    id: "3", title: "GitHub issue triager", votes: 29,
    text: "Classify this GitHub issue as: bug / feature request / question / duplicate. Give a one-sentence summary and suggest an assignee label.",
    provider: "Claude", category: "Dev tools",
  },
  {
    id: "4", title: "Commit message generator", votes: 24,
    text: "Generate a conventional commit message for this diff. Use the format: type(scope): short description. Types: feat, fix, docs, chore, refactor.",
    provider: "Gemini", category: "Code",
  },
];

const PROVIDER_BADGE: Record<string, string> = {
  Claude: "dev-badge-green",
  OpenAI: "dev-badge-blue",
  Gemini: "dev-badge-cyan",
  Groq: "dev-badge-purple",
};

interface PromptLibraryPanelProps {
  onLoadToPlayground?: (text: string) => void;
}

export default function PromptLibraryPanel({ onLoadToPlayground }: PromptLibraryPanelProps) {
  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState("All providers");
  const [filterCategory, setFilterCategory] = useState("All categories");
  const [prompts, setPrompts] = useState(SAMPLE_PROMPTS);
  const [showSubmit, setShowSubmit] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newProvider, setNewProvider] = useState("Claude");
  const [newCategory, setNewCategory] = useState("Code");

  const filtered = prompts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase());
    const matchProvider = filterProvider === "All providers" || p.provider === filterProvider;
    const matchCategory = filterCategory === "All categories" || p.category === filterCategory;
    return matchSearch && matchProvider && matchCategory;
  });

  const upvote = (id: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  const submit = () => {
    if (!newTitle || !newText) return;
    setPrompts(prev => [...prev, {
      id: String(Date.now()),
      title: newTitle,
      text: newText,
      provider: newProvider,
      category: newCategory,
      votes: 0,
    }]);
    setNewTitle(""); setNewText("");
    setShowSubmit(false);
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Prompt <span>Library</span></div>
        <div className="dev-panel-sub">Community-shared prompts. Browse, upvote, and load into Playground.</div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <input className="dev-form-input" style={{ flex: 1, minWidth: "200px" }} type="text" placeholder="Search prompts…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="dev-form-select" style={{ width: 160 }} value={filterProvider} onChange={e => setFilterProvider(e.target.value)}>
          <option>All providers</option>
          <option>Claude</option>
          <option>OpenAI</option>
          <option>Gemini</option>
        </select>
        <select className="dev-form-select" style={{ width: 160 }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option>All categories</option>
          <option>Code</option>
          <option>Writing</option>
          <option>Dev tools</option>
          <option>Analysis</option>
        </select>
        <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={() => setShowSubmit(s => !s)}>
          {showSubmit ? "Cancel" : "+ Submit prompt"}
        </button>
      </div>

      {/* Submit Form */}
      {showSubmit && (
        <div className="dev-card" style={{ marginBottom: "1.25rem" }}>
          <div className="dev-stitle" style={{ marginBottom: "1rem" }}><span className="dev-stitle-dot" />Submit a new prompt</div>
          <div className="dev-form-group">
            <label className="dev-form-label">Title</label>
            <input className="dev-form-input" type="text" placeholder="e.g. Senior code reviewer" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          </div>
          <div className="dev-form-group">
            <label className="dev-form-label">Prompt text</label>
            <textarea className="dev-form-textarea" placeholder="The full prompt text…" value={newText} onChange={e => setNewText(e.target.value)} />
          </div>
          <div className="dev-g2">
            <div className="dev-form-group">
              <label className="dev-form-label">Provider</label>
              <select className="dev-form-select" value={newProvider} onChange={e => setNewProvider(e.target.value)}>
                <option>Claude</option><option>OpenAI</option><option>Gemini</option><option>Groq</option>
              </select>
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">Category</label>
              <select className="dev-form-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                <option>Code</option><option>Writing</option><option>Dev tools</option><option>Analysis</option>
              </select>
            </div>
          </div>
          <button className="dev-btn dev-btn-primary" onClick={submit}>Submit prompt</button>
        </div>
      )}

      {/* Prompt Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map(prompt => (
          <div key={prompt.id} className="dev-card dev-card-sm" style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", flexShrink: 0 }}>
              <button className="dev-btn dev-btn-ghost dev-btn-icon dev-btn-sm" onClick={() => upvote(prompt.id)}>▲</button>
              <span style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.8rem", color: "var(--dev-green)" }}>{prompt.votes}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--dev-font-head)", fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.25rem" }}>{prompt.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--dev-muted2)", marginBottom: "0.6rem", lineHeight: 1.55 }}>{prompt.text}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className={`dev-badge ${PROVIDER_BADGE[prompt.provider] || "dev-badge-muted"}`}>{prompt.provider}</span>
                <span className="dev-badge dev-badge-muted">{prompt.category}</span>
                {onLoadToPlayground && (
                  <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ marginLeft: "auto" }} onClick={() => onLoadToPlayground(prompt.text)}>
                    Load in Playground →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="dev-card" style={{ textAlign: "center", padding: "2rem", color: "var(--dev-muted)", fontSize: "0.85rem", fontFamily: "var(--dev-font-mono)" }}>
            No prompts match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
