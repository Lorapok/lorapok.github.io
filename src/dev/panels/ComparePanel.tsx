// src/dev/panels/ComparePanel.tsx
import { useState } from "react";
import { useDevAuth, type AIProviderId } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";

interface ProviderResult {
  id: AIProviderId;
  label: string;
  color: string;
  text: string;
  latency: string;
  tokens: string;
  loading: boolean;
}

export default function ComparePanel() {
  const { apiKeys, logEvent } = useDevAuth();
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<AIProviderId[]>(["claude", "openai"]);
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [running, setRunning] = useState(false);

  const toggleProvider = (id: AIProviderId) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(p => p !== id) : prev
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const runCompare = async () => {
    if (!prompt.trim()) return;
    
    const activeProviders = AI_PROVIDERS.filter(p => selected.includes(p.id));
    setResults(activeProviders.map(p => ({ ...p, text: "Running…", latency: "—", tokens: "—", loading: true })));
    setRunning(true);
    logEvent("ai", "compare_run", { providers: selected });

    const runProvider = async (p: typeof AI_PROVIDERS[0]): Promise<Partial<ProviderResult>> => {
      const key = apiKeys[p.id];
      const start = Date.now();
      
      if (!key) {
        return { text: `⚠ Key missing for ${p.label}. Set it in AI Labs.`, latency: "—", tokens: "—", loading: false };
      }

      try {
        let endpoint = "";
        let body = {};
        let headers: Record<string, string> = { "Content-Type": "application/json" };

        if (p.id === "claude") {
          endpoint = "https://api.anthropic.com/v1/messages";
          headers["x-api-key"] = key;
          headers["anthropic-version"] = "2023-06-01";
          headers["anthropic-dangerous-direct-browser-access"] = "true";
          body = {
            model: p.model,
            max_tokens: 400,
            messages: [{ role: "user", content: prompt }]
          };
        } else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(p.id)) {
          if (p.id === "openai") endpoint = "https://api.openai.com/v1/chat/completions";
          else if (p.id === "groq") endpoint = "https://api.groq.com/openai/v1/chat/completions";
          else if (p.id === "mistral") endpoint = "https://api.mistral.ai/v1/chat/completions";
          else if (p.id === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";
          else if (p.id === "perplexity") endpoint = "https://api.perplexity.ai/chat/completions";
          else if (p.id === "xai") endpoint = "https://api.x.ai/v1/chat/completions";
          else if (p.id === "together") endpoint = "https://api.together.xyz/v1/chat/completions";
          else if (p.id === "openrouter") endpoint = "https://openrouter.ai/api/v1/chat/completions";
          else if (p.id === "anyscale") endpoint = "https://api.endpoints.anyscale.com/v1/chat/completions";

          headers["Authorization"] = `Bearer ${key}`;
          body = {
            model: p.model,
            max_tokens: 400,
            messages: [{ role: "user", content: prompt }]
          };
        } else {
          await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
          return { text: `[${p.label}] Integration optimized for Claude/OpenAI. Live ${p.label} coming soon.`, latency: "Simulated", tokens: "—", loading: false };
        }

        const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
        const data = await res.json();
        const ms = Date.now() - start;
        
        let text = "";
        if (p.id === "claude") text = data.content?.[0]?.text || "No response.";
        else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(p.id)) text = data.choices?.[0]?.message?.content || "No response.";
        
        if (data.error) throw new Error(data.error.message);

        return { text, latency: `${ms}ms`, tokens: "—", loading: false };
      } catch (e) {
        return { text: `⚠ Error: ${e instanceof Error ? e.message : "Network"}`, latency: "—", tokens: "—", loading: false };
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
        <div className="dev-panel-sub">Simultaneous multi-provider testing. Evaluate quality and latency side-by-side.</div>
      </div>

      <div className="dev-card" style={{ marginBottom: "1.5rem" }}>
        <div className="dev-form-group">
          <label className="dev-form-label">Comparison Prompt</label>
          <textarea className="dev-form-textarea" style={{ minHeight: "100px" }} placeholder="e.g. Write a technical summary of Lorapok's mission..." value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div className="dev-provider-grid">
          {AI_PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`dev-provider-chip ${selected.includes(p.id) ? "active" : ""}`}
              onClick={() => toggleProvider(p.id)}
            >
              <span className="dev-pdot" style={{ background: p.color }} />
              {p.label}
            </button>
          ))}
          <button className="dev-btn dev-btn-primary" style={{ marginLeft: "auto", padding: "0 2rem" }} onClick={runCompare} disabled={running || !prompt}>
            {running ? "Comparing…" : "⚖ Run Comparison"}
          </button>
        </div>
      </div>

      <div className="dev-g3" style={{ gridTemplateColumns: `repeat(${results.length || 1}, 1fr)` }}>
        {results.map(r => (
          <div key={r.id} className="dev-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "var(--dev-font-head)", fontWeight: 800, color: r.color }}>{r.label.toUpperCase()}</div>
              <div className="dev-badge dev-badge-muted">{r.latency}</div>
            </div>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "var(--dev-muted2)", flex: 1 }}>
              {r.loading ? (
                <div style={{ display: "flex", gap: "4px" }}>
                  <span className="dev-typing-dot" /><span className="dev-typing-dot" /><span className="dev-typing-dot" />
                </div>
              ) : r.text}
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="dev-empty-state" style={{ gridColumn: "1 / -1", padding: "4rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚖</div>
            <p>Select providers and run a prompt to compare results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
