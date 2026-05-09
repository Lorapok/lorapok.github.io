// src/dev/panels/PlaygroundPanel.tsx
import { useState } from "react";

export default function PlaygroundPanel() {
  const [provider, setProvider] = useState("Claude (claude-sonnet-4)");
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [rawOutput, setRawOutput] = useState("// Response will appear here…");
  const [formattedOutput, setFormattedOutput] = useState("Run a prompt to see formatted output.");
  const [latency, setLatency] = useState("");
  const [tokensUsed, setTokensUsed] = useState("— tokens");
  const [running, setRunning] = useState(false);

  const getKey = () =>
    localStorage.getItem("lpk_key_claude") ||
    localStorage.getItem("lpk_key_openai") ||
    "";

  const run = async () => {
    if (!userMessage.trim()) return;
    const key = getKey();
    if (!key) {
      setRawOutput("⚠ Please save your Claude API key in the AI Labs panel first.");
      return;
    }
    setRunning(true);
    setRawOutput("Running…");
    setFormattedOutput("…");
    const start = Date.now();

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
          max_tokens: maxTokens,
          system: systemPrompt || "You are a helpful assistant.",
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const ms = Date.now() - start;
      const data = await res.json();
      const reply = data.content?.[0]?.text || "";
      const tokens = data.usage?.output_tokens || Math.round(reply.split(/\s+/).length * 1.3);

      setLatency(`${ms}ms`);
      setTokensUsed(`~${tokens} tokens`);
      setRawOutput(JSON.stringify(data, null, 2));
      setFormattedOutput(reply);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setRawOutput(`Error: ${msg}`);
      setFormattedOutput("Request failed.");
    } finally {
      setRunning(false);
    }
  };

  const copyAsCurl = () => {
    const curl = `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":${maxTokens},"system":"${(systemPrompt || "You are a helpful assistant.").replace(/'/g, "\\'")}","messages":[{"role":"user","content":"${userMessage.replace(/'/g, "\\'")}"}]}'`;
    navigator.clipboard.writeText(curl);
  };

  const copyAsJS = () => {
    const js = `const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: ${maxTokens},
    system: "${(systemPrompt || "You are a helpful assistant.").replace(/"/g, '\\"')}",
    messages: [{ role: "user", content: "${userMessage.replace(/"/g, '\\"')}" }]
  })
});
const data = await response.json();
console.log(data.content[0].text);`;
    navigator.clipboard.writeText(js);
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">API <span>Playground</span></div>
        <div className="dev-panel-sub">Write prompts, run against any provider, inspect raw responses.</div>
      </div>

      <div className="dev-g21">
        {/* Request */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Request</div>
          <div className="dev-card" style={{ marginBottom: "1rem" }}>
            <div className="dev-g2" style={{ marginBottom: "0.85rem" }}>
              <div className="dev-form-group" style={{ margin: 0 }}>
                <label className="dev-form-label">Provider</label>
                <select className="dev-form-select" value={provider} onChange={e => setProvider(e.target.value)}>
                  <option>Claude (claude-sonnet-4)</option>
                  <option>OpenAI (gpt-4o)</option>
                  <option>Gemini (gemini-1.5-pro)</option>
                  <option>Mistral (mistral-large)</option>
                  <option>Groq (llama-3.1-70b)</option>
                </select>
              </div>
              <div className="dev-form-group" style={{ margin: 0 }}>
                <label className="dev-form-label">Max tokens</label>
                <input className="dev-form-input" type="number" value={maxTokens} min={50} max={8000} onChange={e => setMaxTokens(Number(e.target.value))} />
              </div>
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">System prompt</label>
              <textarea className="dev-form-textarea" style={{ minHeight: "60px" }} placeholder="You are a helpful assistant…" value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} />
            </div>
            <div className="dev-form-group">
              <label className="dev-form-label">User message</label>
              <textarea className="dev-form-textarea" style={{ minHeight: "110px" }} placeholder="Enter your prompt here…" value={userMessage} onChange={e => setUserMessage(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
              <button className="dev-btn dev-btn-primary" onClick={run} disabled={running}>
                {running ? "Running…" : "▶ Run"}
              </button>
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={copyAsCurl}>Copy as cURL</button>
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={copyAsJS}>Copy as JS</button>
              <span style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.72rem", color: "var(--dev-muted)", marginLeft: "auto" }}>{latency}</span>
            </div>
          </div>
        </div>

        {/* Response */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Response</div>
          <div className="dev-code-editor">
            <div className="dev-code-bar">
              <div className="dev-code-bar-left">
                <span className="dev-code-lang">JSON</span>
                <span style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.68rem", color: "var(--dev-muted)" }}>{tokensUsed}</span>
              </div>
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => navigator.clipboard.writeText(rawOutput)}>Copy</button>
            </div>
            <pre className="dev-code-output">{rawOutput}</pre>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <div className="dev-stitle"><span className="dev-stitle-dot" />Formatted output</div>
            <div className="dev-card" style={{ fontSize: "0.85rem", color: "var(--dev-muted2)", minHeight: "80px", lineHeight: 1.7 }}>
              {formattedOutput}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
