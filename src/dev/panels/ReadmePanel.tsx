import { useState } from "react";
import { useDevAuth } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReadmePanel() {
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { activeProvider, apiKeys } = useDevAuth();
  const [result, setResult] = useState("");

  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];

  const saveToFirestore = async () => {
    if (!result || !auth.currentUser) {
      alert("You must be signed in to save to the cloud.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "readme_templates"), {
        content: result,
        description,
        author: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      alert("Saved to cloud workspace! 🚀");
    } catch (e) {
      alert("Error saving: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setSaving(false);
    }
  };

  const generateReadme = async () => {
    if (!description) return;
    const key = apiKeys[activeProvider];
    if (!key) {
      alert(`Please save an API key for ${activeP.label} in AI Labs first.`);
      return;
    }
    setGenerating(true);
    
    const prompt = `Generate a professional README.md for this project:
Description: ${description}
Key Features: ${features}

Include:
1. Title and Badge section
2. Catchy description
3. Features list
4. Quick Start / Installation
5. Usage example
6. License (MIT)

Output only the Markdown content.`;

    try {
      let endpoint = "";
      let body = {};
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      
      if (activeProvider === "claude") {
        endpoint = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = key;
        headers["anthropic-version"] = "2023-06-01";
        headers["anthropic-dangerous-direct-browser-access"] = "true";
        body = {
          model: activeP.model,
          max_tokens: 2000,
          system: "You are a professional open-source documentation expert. You write clear, beautiful, and informative README files.",
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
            { role: "system", content: "You are a professional open-source documentation expert. You write clear, beautiful, and informative README files." },
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
      if (activeProvider === "claude") reply = data.content?.[0]?.text || "Failed to generate.";
      else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(activeProvider)) reply = data.choices?.[0]?.message?.content || "Failed to generate.";
      
      setResult(reply);
    } catch (e) {
      setResult("⚠ Error: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">README <span>Generator</span></div>
        <div className="dev-panel-sub">Schema-to-README. Generate professional project documentation in seconds.</div>
      </div>

      <div className="dev-g2">
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Project Context</div>
          <div className="dev-form-group">
            <label className="dev-form-label">Project Description</label>
            <textarea 
              className="dev-form-textarea" 
              placeholder="What does this project do? Who is it for?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ height: "120px" }}
            />
          </div>
          <div className="dev-form-group">
            <label className="dev-form-label">Key Features (comma-separated)</label>
            <textarea 
              className="dev-form-textarea" 
              placeholder="e.g. Real-time sync, AI-powered, Zero-dependency..."
              value={features}
              onChange={e => setFeatures(e.target.value)}
              style={{ height: "80px" }}
            />
          </div>
          <button className="dev-btn dev-btn-primary" onClick={generateReadme} disabled={generating || !description}>
            {generating ? "✦ Generating…" : "✦ Generate Documentation"}
          </button>
        </div>

        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Output Preview</div>
          {result ? (
            <div className="dev-readme-preview">
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => navigator.clipboard.writeText(result)}>Copy Markdown</button>
                <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={saveToFirestore} disabled={saving}>{saving ? "Saving..." : "Save to Workspace"}</button>
                <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ marginLeft: "auto" }} onClick={() => setResult("")}>Clear</button>
              </div>
              <pre className="dev-code-block" style={{ maxHeight: "400px", overflow: "auto" }}>{result}</pre>
            </div>
          ) : (
            <div className="dev-empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📄</div>
              <p>Generated README will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
