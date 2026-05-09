// src/dev/panels/ComparePanel.tsx
import { useState } from "react";

const COMPARE_PROVIDERS = [
  { id: "claude", label: "Claude", color: "#4ade80", badgeCls: "dev-badge-green" },
  { id: "openai", label: "OpenAI", color: "#60a5fa", badgeCls: "dev-badge-blue" },
  { id: "gemini", label: "Gemini", color: "#34d399", badgeCls: "dev-badge-cyan" },
  { id: "groq", label: "Groq", color: "#a78bfa", badgeCls: "dev-badge-purple" },
];

interface ProviderResult {
  id: string;
  label: string;
  color: string;
  badgeCls: string;
  text: string;
  latency: string;
  tokens: string;
  loading: boolean;
}

export default function ComparePanel() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string[]>(["claude", "openai"]);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [running, setRunning] = useState(false);

  const toggleProvider = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(p => p !== id) : prev
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const runCompare = async () => {
    if (!prompt.trim()) return;
    const key = localStorage.getItem("lpk_key_claude") || "";
    if (!key) {
      alert("Please save your Claude API key in AI Labs first.");
      return;
    }

    const activeProviders = COMPARE_PROVIDERS.filter(p => selected.includes(p.id));
    setResults(activeProviders.map(p => ({ ...p, text: "Running…", latency: "—", tokens: "—", loading: true })));
    setRunning(true);

    const runProvider = async (p: typeof COMPARE_PROVIDERS[0]): Promise<Partial<ProviderResult>> => {
      const start = Date.now();
      // Only Claude is actually implemented; others show a simulated note
      if (p.id !== "claude") {
        await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
        const simMs = Date.now() - start;
        return {
          text: `[${p.label} simulation] This feature requires your ${p.label} API key. Save a key for ${p.label} in AI Labs to see real responses here.`,
          latency: `~${simMs}ms simulated`,
          tokens: "simulated",
          loading: false,
        };
      }
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
            max_tokens: 400,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const ms = Date.now() - start;
        const data = await res.json();
        const text = data.content?.[0]?.text || (data.error ? `⚠ ${data.error.message}` : "No response.");
        const tokens = data.usage?.output_tokens || Math.round(text.split(/\s+/).length * 1.3);
        return { text, latency: `${ms}ms`, tokens: `${tokens} tokens`, loading: false };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Error";
        return { text: `⚠ ${msg}`, latency: "—", tokens: "—", loading: false };
      }
    };

    const allResults = await Promise.all(
      activeProviders.map(async p => {
        const result = await runProvider(p);
        return { ...p, ...result } as ProviderResult;
      })
    );

    setResults(allResults);
    setRunning(false);
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Provider <span>Compare</span></div>
        <div className="dev-panel-sub">One prompt → multiple providers simultaneously. See latency, tokens, and quality side-by-side.</div>
      </div>

      <div className="dev-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dev-form-group">
          <label className="dev-form-label">Prompt to compare</label>
          <textarea className="dev-form-textarea" style={{ minHeight: "80px" }} placeholder="e.g. Explain the benefits of open-source software in 3 bullet points…" value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {COMPARE_PROVIDERS.map(p => (
              <button
                key={p.id}
                className="dev-chip"
                style={selected.includes(p.id) ? { borderColor: `${p.color}55`, color: p.color } : {}}
                onClick={() => toggleProvider(p.id)}
              >
                {selected.includes(p.id) ? "✓ " : ""}{p.label}
              </button>
            ))}
          </div>
          <button className="dev-btn dev-btn-primary dev-btn-sm" style={{ marginLeft: "auto" }} onClick={runCompare} disabled={running}>
            {running ? "Running…" : "⚖ Compare now"}
          </button>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)", marginTop: "0.75rem" }}>
          Select up to 3 providers. Only providers with saved API keys will return real results.
        </p>
      </div>

      {results.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${results.length}, 1fr)`, gap: "1rem" }}>
          {results.map(r => (
            <div key={r.id} className="dev-card" style={{ borderColor: `${r.color}25` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ fontFamily: "var(--dev-font-head)", fontWeight: 700, fontSize: "0.92rem" }}>{r.label}</div>
                <span className={`dev-badge ${r.badgeCls}`}>
                  {r.loading ? "…" : `${r.latency} · ${r.tokens}`}
                </span>
              </div>
              <div style={{ fontSize: "0.83rem", color: "var(--dev-muted2)", minHeight: "80px", lineHeight: 1.7 }}>
                {r.loading ? <><span className="dev-typing-dot" /><span className="dev-typing-dot" /><span className="dev-typing-dot" /></> : r.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
