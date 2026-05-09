import { useState } from "react";
import { useDevAuth } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CommitsPanel() {
  const [diff, setDiff] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [saving, setSaving] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { activeProvider, apiKeys } = useDevAuth();
  
  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];

  const saveToFirestore = async () => {
    if (!explanation || !auth.currentUser) {
      alert("You must be signed in to save to the cloud.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "commit_explanations"), {
        content: explanation,
        diff_snippet: diff.slice(0, 1000), // Only save snippet to avoid doc size limits
        author: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      alert("Explanation saved to cloud! ⚡");
    } catch (e) {
      alert("Error saving: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  const explainCommit = async () => {
    if (!diff) return;
    const key = apiKeys[activeProvider];
    if (!key) {
      alert(`Please save an API key for ${activeP.label} in AI Labs first.`);
      return;
    }
    setExplaining(true);
    
    const prompt = `Explain this git diff in plain English for a non-technical stakeholder.
What changed? Why does it matter?

Diff:
${diff}`;

    try {
      let endpoint = "";
      let body = {};
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      
      const systemInstruction = "You are a senior developer who is great at explaining technical changes to product managers and clients. You are concise and focus on impact.";
      
      if (activeProvider === "claude") {
        endpoint = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        body = {
          model: activeP.model,
          max_tokens: 1000,
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

      let reply = "";
      if (activeProvider === "claude") reply = data.content?.[0]?.text || "Failed to explain.";
      else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(activeProvider)) reply = data.choices?.[0]?.message?.content || "Failed to explain.";
      
      setExplanation(reply);
    } catch (e) {
      setExplanation("⚠ Error: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Commit <span>Explainer</span></div>
        <div className="dev-panel-sub">Convert complex git diffs into plain-English impact summaries.</div>
      </div>

      <div className="dev-g2">
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Git Diff</div>
          <div className="dev-form-group">
            <label className="dev-form-label">Paste Diff (or Commit Hash)</label>
            <textarea 
              className="dev-form-textarea" 
              placeholder="Paste your git diff here..."
              value={diff}
              onChange={e => setDiff(e.target.value)}
              style={{ height: "300px", fontFamily: "var(--dev-font-mono)", fontSize: "0.8rem" }}
            />
          </div>
          <button className="dev-btn dev-btn-primary" onClick={explainCommit} disabled={explaining || !diff}>
            {explaining ? "⚡ Analyzing…" : "⚡ Explain Impact"}
          </button>
        </div>

        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Plain-English Explanation</div>
          {explanation ? (
            <div className="dev-explanation">
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => navigator.clipboard.writeText(explanation)}>Copy</button>
                <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={saveToFirestore} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ marginLeft: "auto" }} onClick={() => setExplanation("")}>Clear</button>
              </div>
              <div className="dev-explanation-body" style={{ lineHeight: "1.6", color: "rgba(255,255,255,0.9)" }}>
                {explanation}
              </div>
            </div>
          ) : (
            <div className="dev-empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
              <p>Explanation will appear here after analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
