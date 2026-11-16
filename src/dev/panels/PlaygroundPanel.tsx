// src/dev/panels/PlaygroundPanel.tsx
import { useState } from "react";
import { useDevAuth, type AIProviderId } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";

export default function PlaygroundPanel() {
  const { apiKeys, logEvent, logChat } = useDevAuth();
  const [providerId, setProviderId] = useState<AIProviderId>("claude");
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState("You are Lorapok AI, an expert in open-source development.");
  const [userMessage, setUserMessage] = useState(() => {
    const pending = localStorage.getItem("lpk_playground_prompt") || "";
    localStorage.removeItem("lpk_playground_prompt");
    return pending;
  });
  const [rawOutput, setRawOutput] = useState("// Response JSON will appear here…");
  const [formattedOutput, setFormattedOutput] = useState("Run a prompt to see the formatted response.");
  const [latency, setLatency] = useState("");
  const [running, setRunning] = useState(false);

  const activeProvider = AI_PROVIDERS.find(p => p.id === providerId)!;

  const copyCurl = () => {
    const endpoint = providerId === "claude" ? "https://api.anthropic.com/v1/messages" : activeProvider.endpoint;
    const header = providerId === "claude" ? '-H "x-api-key: $AI_PROVIDER_KEY"' : '-H "Authorization: Bearer $AI_PROVIDER_KEY"';
    const snippet = `curl ${JSON.stringify(endpoint)} \\\n+  -H "Content-Type: application/json" \\\n+  ${header} \\\n+  -d ${JSON.stringify(JSON.stringify({ model: activeProvider.model, max_tokens: maxTokens, messages: [{ role: "user", content: userMessage || "Your prompt" }] }))}`;
    navigator.clipboard.writeText(snippet);
  };

  const copyJavaScript = () => {
    const endpoint = providerId === "claude" ? "https://api.anthropic.com/v1/messages" : activeProvider.endpoint;
    const snippet = `const response = await fetch(${JSON.stringify(endpoint)}, {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "Authorization": "Bearer " + process.env.AI_PROVIDER_KEY\n  },\n  body: JSON.stringify(${JSON.stringify({ model: activeProvider.model, max_tokens: maxTokens, messages: [{ role: "user", content: userMessage || "Your prompt" }] }, null, 2)})\n});\nconst data = await response.json();`;
    navigator.clipboard.writeText(snippet);
  };

  const run = async () => {
    if (!userMessage.trim()) return;
    const key = apiKeys[providerId];
    if (!key) {
      setRawOutput(`⚠ Key missing for ${activeProvider.label}. Please add it in AI Labs.`);
      return;
    }
    
    setRunning(true);
    setRawOutput("Requesting...");
    logEvent("ai", "playground_run", { provider: providerId });
    const start = Date.now();

    try {
      let endpoint = "";
      let body = {};
      const headers: Record<string, string> = { "Content-Type": "application/json" };

      if (providerId === "claude") {
        endpoint = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        body = {
          model: "claude-sonnet-4-20250514",
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }]
        };
      } else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(providerId)) {
        if (providerId === "openai") endpoint = "https://api.openai.com/v1/chat/completions";
        else if (providerId === "groq") endpoint = "https://api.groq.com/openai/v1/chat/completions";
        else if (providerId === "mistral") endpoint = "https://api.mistral.ai/v1/chat/completions";
        else if (providerId === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";
        else if (providerId === "perplexity") endpoint = "https://api.perplexity.ai/chat/completions";
        else if (providerId === "xai") endpoint = "https://api.x.ai/v1/chat/completions";
        else if (providerId === "together") endpoint = "https://api.together.xyz/v1/chat/completions";
        else if (providerId === "openrouter") endpoint = "https://openrouter.ai/api/v1/chat/completions";
        else if (providerId === "anyscale") endpoint = "https://api.endpoints.anyscale.com/v1/chat/completions";

        headers["Authorization"] = `Bearer ${key}`;
        body = {
          model: activeProvider.model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        };
      } else {
        await new Promise(r => setTimeout(r, 1000));
        setRawOutput(`Integration for ${activeProvider.label} is currently in Beta.`);
        setFormattedOutput("Simulated response.");
        setRunning(false);
        return;
      }

      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
      const data = await res.json();
      const ms = Date.now() - start;
      
      setLatency(`${ms}ms`);
      setRawOutput(JSON.stringify(data, null, 2));
      
      if (data.error) throw new Error(data.error.message);

      let reply = "";
      if (providerId === "claude") reply = data.content?.[0]?.text || "Error";
      else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(providerId)) reply = data.choices?.[0]?.message?.content || "Error";
      
      setFormattedOutput(reply);

      // SAVE CHAT DATA
      logChat(providerId, activeProvider.model, [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: reply }
      ]);
    } catch (e) {
      setRawOutput("Error: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">API <span>Playground</span></div>
        <div className="dev-panel-sub">Low-level API access. Test system prompts, model parameters, and inspect raw JSON.</div>
      </div>

      <div className="dev-g21">
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Configuration</div>
          <div className="dev-g2">
            <div className="dev-form-group">
              <label className="dev-form-label">Model Provider</label>
              <select className="dev-form-select" value={providerId} onChange={e => setProviderId(e.target.value as AIProviderId)}>
                {AI_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">Max Tokens</label>
              <input className="dev-form-input" type="number" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} />
            </div>
          </div>
          <div className="dev-form-group">
            <label className="dev-form-label">System Instruction</label>
            <textarea className="dev-form-textarea" style={{ height: "60px" }} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} />
          </div>
          <div className="dev-form-group">
            <label className="dev-form-label">User Prompt</label>
            <textarea className="dev-form-textarea" style={{ height: "150px" }} value={userMessage} onChange={e => setUserMessage(e.target.value)} placeholder="Type your prompt here..." />
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button className="dev-btn dev-btn-primary" style={{ padding: "0 2.5rem" }} onClick={run} disabled={running}>
              {running ? "Executing…" : "▶ Run Request"}
            </button>
            <span style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.75rem", color: "var(--dev-muted)" }}>{latency}</span>
            <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={copyCurl}>Copy cURL</button>
            <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={copyJavaScript}>Copy JS</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="dev-code-editor">
            <div className="dev-code-bar">
              <span className="dev-code-lang">RAW RESPONSE</span>
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => navigator.clipboard.writeText(rawOutput)}>Copy JSON</button>
            </div>
            <pre className="dev-code-output" style={{ maxHeight: "300px" }}>{rawOutput}</pre>
          </div>
          
          <div className="dev-card" style={{ flex: 1 }}>
            <div className="dev-stitle"><span className="dev-stitle-dot" />Output Preview</div>
            <div style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--dev-muted2)" }}>
              {formattedOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
