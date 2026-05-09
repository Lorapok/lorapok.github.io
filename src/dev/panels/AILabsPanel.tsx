// src/dev/panels/AILabsPanel.tsx
import { useState, useRef, useEffect } from "react";

const PROVIDERS = [
  { id: "claude", label: "Claude", color: "#4ade80", model: "claude-sonnet-4-20250514" },
  { id: "openai", label: "OpenAI", color: "#60a5fa", model: "gpt-4o" },
  { id: "gemini", label: "Gemini", color: "#34d399", model: "gemini-1.5-pro" },
  { id: "mistral", label: "Mistral", color: "#f97316", model: "mistral-large" },
  { id: "groq", label: "Groq", color: "#a78bfa", model: "llama-3.1-70b" },
  { id: "cohere", label: "Cohere", color: "#fbbf24", model: "command-r-plus" },
];

const AI_TOOLS = [
  { icon: "💬", title: "Lorapok AI Chat", desc: "Chat with full Lorapok context. Switch providers mid-conversation.", badge: "Live", badgeCls: "dev-badge-green", panel: "ai-labs" },
  { icon: "✍️", title: "AI Blog Writer", desc: "Give context → auto-generates post + cover image via Firestore.", badge: "New", badgeCls: "dev-badge-amber", panel: "blog" },
  { icon: "📄", title: "README Generator", desc: "Schema-to-README. Professional markdown in seconds.", badge: "Live", badgeCls: "dev-badge-green", panel: "readme" },
  { icon: "⚡", title: "Commit Explainer", desc: "Plain-English explanations of git commits for stakeholders.", badge: "Live", badgeCls: "dev-badge-green", panel: "commits" },
  { icon: "⚖️", title: "Provider Compare", desc: "Same prompt → 3 providers. Side-by-side latency + cost.", badge: "Beta", badgeCls: "dev-badge-purple", panel: "compare" },
  { icon: "🧪", title: "API Playground", desc: "Live code editor with raw JSON output and copy-as-curl.", badge: "Dev", badgeCls: "dev-badge-cyan", panel: "playground" },
];

const LORAPOK_SYSTEM = `You are Lorapok AI — the intelligent assistant for Lorapok Labs, a nonprofit open-source software collective founded by Mohammad Maizied Hasan Majumder (@Maijied on GitHub).

About Lorapok Labs:
- Nonprofit, community-driven open-source organization
- Mission: build tools the world can freely own — no VC, no paywalls, no strings
- Focus: developer tooling, CLI tools, UI libraries, backend utilities, AI-powered tools
- Founder: Maizied — full-stack engineer, specializes in Laravel, React, mobile, AI
- GitHub: https://github.com/lorapok | Website: https://lorapok.github.io
- All projects MIT licensed, always welcoming contributors especially beginners
- Based in Dhaka, Bangladesh
- Contact: lorapokdev@gmail.com

Respond concisely and in a warm, developer-friendly tone. Keep answers under 3 sentences unless more detail is needed.`;

interface Message { role: "user" | "ai"; text: string; }

interface AILabsPanelProps {
  onSwitchPanel: (panel: string) => void;
}

export default function AILabsPanel({ onSwitchPanel }: AILabsPanelProps) {
  const [activeProvider, setActiveProvider] = useState("claude");
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey! I'm Lorapok AI — I know everything about this org, our open-source projects, and developer tooling. Ask me anything, or switch providers above and I'll use that instead." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [keySaved, setKeySaved] = useState<Record<string, boolean>>({});
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    // Check which providers have saved keys
    const saved: Record<string, boolean> = {};
    PROVIDERS.forEach(p => {
      saved[p.id] = Boolean(localStorage.getItem(`lpk_key_${p.id}`));
    });
    setKeySaved(saved);
  }, []);

  const saveKey = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem(`lpk_key_${activeProvider}`, apiKey.trim());
    setApiKey("");
    setKeySaved(prev => ({ ...prev, [activeProvider]: true }));
  };

  const clearKey = () => {
    localStorage.removeItem(`lpk_key_${activeProvider}`);
    setKeySaved(prev => ({ ...prev, [activeProvider]: false }));
  };

  const getKey = () => localStorage.getItem(`lpk_key_${activeProvider}`) || localStorage.getItem("lpk_key_claude") || "";

  const scrollToBottom = () => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const sendMessage = async (text?: string) => {
    const input = (text || chatInput).trim();
    if (!input || isStreaming) return;
    setChatInput("");

    const key = getKey();
    if (!key) {
      setMessages(prev => [...prev,
        { role: "user", text: input },
        { role: "ai", text: "⚠ Please save your Claude API key in the provider section above to use AI features." }
      ]);
      return;
    }

    chatHistory.current.push({ role: "user", content: input });
    setMessages(prev => [...prev, { role: "user", text: input }, { role: "ai", text: "…" }]);
    setIsStreaming(true);

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
          max_tokens: 600,
          system: LORAPOK_SYSTEM,
          messages: chatHistory.current,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || (data.error ? `⚠ ${data.error.message}` : "No response.");
      chatHistory.current.push({ role: "assistant", content: reply });
      setMessages(prev => [...prev.slice(0, -1), { role: "ai", text: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setMessages(prev => [...prev.slice(0, -1), { role: "ai", text: `⚠ ${msg}` }]);
    } finally {
      setIsStreaming(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const activeP = PROVIDERS.find(p => p.id === activeProvider)!;

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">AI <span>Labs</span></div>
        <div className="dev-panel-sub">Multi-provider AI tools for the Lorapok ecosystem. Switch providers on the fly.</div>
      </div>

      {/* Provider Selector */}
      <div className="dev-card dev-card-sm" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div className="dev-stitle" style={{ margin: 0 }}>
            <span className="dev-stitle-dot" />Active provider
          </div>
          <span className="dev-badge dev-badge-muted">Keys stored locally · never uploaded</span>
        </div>

        <div className="dev-provider-grid">
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`dev-provider-chip ${activeProvider === p.id ? "active" : ""}`}
              onClick={() => setActiveProvider(p.id)}
              style={activeProvider === p.id ? { borderColor: `${p.color}55`, color: p.color, background: `${p.color}0f` } : {}}
            >
              <span className="dev-pdot" style={{ background: p.color }} />
              {p.label}
              {keySaved[p.id] && <span style={{ fontSize: "0.6rem", marginLeft: "auto", color: "#4ade80" }}>●</span>}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <div className="dev-input-wrap" style={{ flex: 1, minWidth: "200px" }}>
            <span className="dev-input-icon">🔑</span>
            <input
              className="dev-form-input"
              type="password"
              placeholder={`Paste ${activeP.label} API key…`}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveKey()}
            />
          </div>
          <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={saveKey}>Save Key</button>
          <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={clearKey}>Clear</button>
        </div>
      </div>

      {/* AI Tool Cards */}
      <div className="dev-stitle"><span className="dev-stitle-dot" />Tools</div>
      <div className="dev-g3" style={{ marginBottom: "1.75rem" }}>
        {AI_TOOLS.map(tool => (
          <div key={tool.title} className="dev-api-card" onClick={() => onSwitchPanel(tool.panel)}>
            <div className="dev-api-card-icon">{tool.icon}</div>
            <div className="dev-api-card-title">{tool.title}</div>
            <div className="dev-api-card-desc">{tool.desc}</div>
            <div className="dev-api-card-footer">
              <span className={`dev-badge ${tool.badgeCls}`}>{tool.badge}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)" }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="dev-stitle"><span className="dev-stitle-dot" />Lorapok AI Chat</div>
      <div className="dev-chat-wrap">
        <div className="dev-chat-header">
          <div className="dev-chat-avatar">L</div>
          <div>
            <div className="dev-chat-htitle">Lorapok AI</div>
            <div className="dev-chat-hsub">via {activeP.model} · full org context</div>
          </div>
          <span className="dev-badge dev-badge-green" style={{ marginLeft: "auto" }}>● Online</span>
        </div>

        <div className="dev-chat-messages" ref={messagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`dev-msg ${msg.role}`}>
              <div className="dev-msg-av">{msg.role === "ai" ? "L" : "U"}</div>
              <div className={`dev-msg-bubble ${msg.text === "…" ? "dev-typing" : ""}`}>
                {msg.text === "…" ? (
                  <><span className="dev-typing-dot" /><span className="dev-typing-dot" /><span className="dev-typing-dot" /></>
                ) : msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="dev-chat-chips">
          {["What is Lorapok Labs?", "How do I contribute?", "Best project for a beginner?", "How is Lorapok funded?"].map(chip => (
            <button key={chip} className="dev-chip" onClick={() => sendMessage(chip)}>{chip}</button>
          ))}
        </div>

        <div className="dev-chat-input-row">
          <input
            className="dev-chat-input"
            type="text"
            placeholder="Ask anything about Lorapok or open-source…"
            maxLength={500}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button className="dev-chat-send" onClick={() => sendMessage()} disabled={isStreaming}>
            {isStreaming ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
