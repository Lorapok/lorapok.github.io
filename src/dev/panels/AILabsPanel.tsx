// src/dev/panels/AILabsPanel.tsx
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useDevAuth } from "../DevAuth";

import { AI_PROVIDERS } from "../constants/providers";

const AI_TOOLS = [
  { icon: "💬", title: "Lorapok AI Chat", desc: "Chat with full Lorapok context. Switch providers mid-conversation.", badge: "Live", badgeCls: "dev-badge-green", panel: "ai-labs" },
  { icon: "✍️", title: "AI Blog Writer", desc: "Give context → auto-generates post + cover image via Firestore.", badge: "New", badgeCls: "dev-badge-amber", panel: "blog" },
  { icon: "📄", title: "README Generator", desc: "Schema-to-README. Professional markdown in seconds.", badge: "Live", badgeCls: "dev-badge-green", panel: "readme" },
  { icon: "⚡", title: "Commit Explainer", desc: "Plain-English explanations of git commits for stakeholders.", badge: "Live", badgeCls: "dev-badge-green", panel: "commits" },
  { icon: "⚖️", title: "Provider Compare", desc: "Same prompt → 3 providers. Side-by-side latency + cost.", badge: "Beta", badgeCls: "dev-badge-purple", panel: "compare" },
  { icon: "🧪", title: "API Playground", desc: "Live code editor with raw JSON output and copy-as-curl.", badge: "Dev", badgeCls: "dev-badge-cyan", panel: "playground" },
];

const PROVIDER_URLS: Record<string, string> = {
  claude: "https://console.anthropic.com/settings/keys",
  openai: "https://platform.openai.com/api-keys",
  gemini: "https://aistudio.google.com/app/apikey",
  mistral: "https://console.mistral.ai/api-keys/",
  groq: "https://console.groq.com/keys",
  cohere: "https://dashboard.cohere.com/api-keys",
  deepseek: "https://platform.deepseek.com/api_keys",
  perplexity: "https://www.perplexity.ai/settings/api",
  xai: "https://console.x.ai/",
  together: "https://api.together.xyz/settings/api-keys",
  openrouter: "https://openrouter.ai/keys",
  anyscale: "https://app.endpoints.anyscale.com/credentials",
};

const AILarva = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%", ...style }} className="ai-larva">
    <defs>
      <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--dev-green)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--dev-green)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="aiCore" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="var(--dev-green)" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="16" fill="url(#aiGlow)" className="larva-pulse" />
    <rect x="13" y="13" width="14" height="14" rx="4" fill="url(#aiCore)" className="larva-spin" />
    <circle cx="20" cy="20" r="3" fill="#000" />
    <path d="M 20 6 L 20 9 M 20 31 L 20 34 M 6 20 L 9 20 M 31 20 L 34 20" stroke="var(--dev-green)" strokeWidth="2" strokeLinecap="round" className="larva-blink" />
  </svg>
);

const UserLarva = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%", ...style }} className="user-larva">
    <defs>
      <radialGradient id="userGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--dev-cyan)" stopOpacity="0.4" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="14" fill="url(#userGlow)" className="larva-breathe" />
    <path d="M 12 26 Q 20 20 28 26" fill="none" stroke="var(--dev-cyan)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="20" cy="14" r="4" fill="none" stroke="var(--dev-cyan)" strokeWidth="2.5" />
    <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" className="larva-spin-slow" />
  </svg>
);

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
  const { apiKeys, setApiKey, activeProvider, setActiveProvider, activeModels, setActiveModel, logEvent } = useDevAuth();
  const [keyInput, setKeyInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey! I'm Lorapok AI — I know everything about this org, our open-source projects, and developer tooling. Ask me anything, or switch providers above and I'll use that instead." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);

  const activeP = AI_PROVIDERS.find(p => p.id === activeProvider) || AI_PROVIDERS[0];

  const handleSaveKey = () => {
    if (!keyInput.trim()) return;
    setApiKey(activeProvider, keyInput.trim());
    setKeyInput("");
  };

  const handleClearKey = () => {
    setApiKey(activeProvider, "");
  };

  const scrollToBottom = () => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const sendMessage = async (text?: string) => {
    const input = (text || chatInput).trim();
    if (!input || isStreaming) return;
    setChatInput("");

    const key = apiKeys[activeProvider];
    if (!key) {
      setMessages(prev => [...prev,
        { role: "user", text: input },
        { role: "ai", text: `⚠ Please save your ${activeP.label} API key in the provider section above to use AI features.` }
      ]);
      return;
    }

    chatHistory.current.push({ role: "user", content: input });
    setMessages(prev => [...prev, { role: "user", text: input }, { role: "ai", text: "…" }]);
    setIsStreaming(true);

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
          model: activeModels[activeProvider] || activeP.model,
          max_tokens: 600,
          system: LORAPOK_SYSTEM,
          messages: chatHistory.current,
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
          model: activeModels[activeProvider] || activeP.model,
          messages: [
            { role: "system", content: LORAPOK_SYSTEM },
            ...chatHistory.current.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
          ],
        };
      } else {
        throw new Error(`${activeP.label} integration is currently being optimized.`);
      }

      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
      const data = await res.json();
      
      let reply = "";
      if (activeProvider === "claude") reply = data.content?.[0]?.text || "No response.";
      else if (["openai", "groq", "mistral", "deepseek", "perplexity", "xai", "together", "openrouter", "anyscale"].includes(activeProvider)) reply = data.choices?.[0]?.message?.content || "No response.";

      if (data.error) throw new Error(data.error.message);

      chatHistory.current.push({ role: "assistant", content: reply });
      setMessages(prev => [...prev.slice(0, -1), { role: "ai", text: reply }]);
      logEvent("ai", "chat_message", { provider: activeProvider });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setMessages(prev => [...prev.slice(0, -1), { role: "ai", text: `⚠ ${msg}` }]);
    } finally {
      setIsStreaming(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">AI <span>Labs</span></div>
        <div className="dev-panel-sub">Universal AI Command Center. Manage keys, switch providers, and build the future of Lorapok.</div>
      </div>

      {/* Provider Selector */}
      <div className="dev-card dev-card-sm" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div className="dev-stitle" style={{ margin: 0 }}>
            <span className="dev-stitle-dot" />ACTIVE PROVIDER
          </div>
          <span className="dev-badge dev-badge-muted">Keys stored locally · never uploaded</span>
        </div>

        <div className="dev-provider-grid">
          {AI_PROVIDERS.map(p => (
            <button
              key={p.id}
              className={`dev-provider-chip ${activeProvider === p.id ? "active" : ""}`}
              onClick={() => setActiveProvider(p.id)}
            >
              <span className="dev-pdot" style={{ background: p.color }} />
              {p.label}
              {apiKeys[p.id] && <span style={{ fontSize: "0.6rem", marginLeft: "auto", color: "#4ade80" }}>●</span>}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "stretch" }}>
          <div className="dev-input-wrap" style={{ flex: 1, minWidth: "250px" }}>
            <span className="dev-input-icon">🔑</span>
            <input
              className="dev-form-input"
              type="password"
              placeholder={`Paste ${activeP.label} API key…`}
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="dev-btn dev-btn-primary" onClick={handleSaveKey}>Save Key</button>
            <button className="dev-btn dev-btn-ghost" onClick={handleClearKey}>Clear</button>
            <a 
              href={PROVIDER_URLS[activeProvider] || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-btn"
              style={{ 
                display: "flex", alignItems: "center", gap: "0.4rem", 
                background: "rgba(255,255,255,0.05)", border: "1px solid var(--dev-border)", 
                color: "var(--dev-muted)", fontSize: "0.8rem", textDecoration: "none",
                borderRadius: "8px", padding: "0 1rem", fontWeight: 600, transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = activeP.color; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--dev-muted)"; e.currentTarget.style.borderColor = "var(--dev-border)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              Get API Key ↗
            </a>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="dev-stitle"><span className="dev-stitle-dot" />Tools</div>
      <div className="dev-g3" style={{ marginBottom: "1.75rem" }}>
        {AI_TOOLS.map(tool => (
          <div key={tool.title} className="dev-api-card" onClick={() => {
            if (tool.panel === "ai-labs") {
              const input = document.querySelector('.dev-chat-input') as HTMLInputElement;
              if (input) {
                input.focus();
                input.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            } else {
              onSwitchPanel(tool.panel);
            }
            logEvent("nav", "tool_click", { tool: tool.title });
          }}>
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
      <div className="dev-stitle"><span className="dev-stitle-dot" />LORAPOK AI CHAT</div>
      <div className="dev-chat-wrap">
        <div className="dev-chat-header">
          <div className="dev-chat-avatar" style={{ background: "transparent", border: "1px solid var(--dev-green)" }}>
            <AILarva />
          </div>
          <div>
            <div className="dev-chat-name" style={{ fontWeight: 700, fontSize: "1rem" }}>Lorapok AI</div>
            <div className="dev-chat-status" style={{ color: "var(--dev-muted)", fontSize: "0.75rem" }}>
              Ask anything about the org, contributing, or open source
            </div>
          </div>
          <div style={{ position: "relative", marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            
            {/* Model Variant Dropdown */}
            {apiKeys[activeProvider] && activeP.availableModels?.length > 0 && (
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => { setShowVariantDropdown(!showVariantDropdown); setShowModelDropdown(false); }}
                  style={{ 
                    fontSize: "0.65rem", padding: "4px 8px", border: `1px solid var(--dev-border)`, 
                    borderRadius: "6px", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)", 
                    background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeModels[activeProvider] || activeP.model}
                  </span>
                  <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>▼</span>
                </button>
                {showVariantDropdown && (
                  <div style={{
                    position: "absolute", top: "100%", right: 0, marginTop: "0.5rem", 
                    background: "rgba(15, 15, 19, 0.95)", border: "1px solid var(--dev-border)", 
                    borderRadius: "8px", padding: "0.5rem", zIndex: 101, width: "220px",
                    backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    display: "flex", flexDirection: "column", gap: "2px", maxHeight: "250px", overflowY: "auto"
                  }}>
                    <div style={{ padding: "0.2rem 0.5rem", fontSize: "0.6rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)" }}>SELECT MODEL VARIANT</div>
                    {activeP.availableModels.map(modelId => {
                      const isActive = (activeModels[activeProvider] || activeP.model) === modelId;
                      return (
                        <div 
                          key={modelId}
                          onClick={() => { setActiveModel(activeProvider, modelId); setShowVariantDropdown(false); }}
                          style={{
                            padding: "0.6rem 0.8rem", borderRadius: "6px", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            background: isActive ? `${activeP.color}15` : "transparent",
                            color: isActive ? "#fff" : "var(--dev-muted)", fontSize: "0.75rem", fontFamily: "var(--dev-font-mono)",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                          {isActive && <span style={{ color: activeP.color }}>✓</span>}
                          {modelId}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => { setShowModelDropdown(!showModelDropdown); setShowVariantDropdown(false); }}
              style={{ 
                fontSize: "0.7rem", padding: "4px 8px", border: `1px solid ${activeP.color}40`, 
                borderRadius: "6px", color: activeP.color, fontFamily: "var(--dev-font-mono)", 
                background: `${activeP.color}10`, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              {activeP.label} · {isStreaming ? "Streaming" : "Ready"} <span style={{ fontSize: "0.5rem", opacity: 0.6 }}>▼</span>
            </button>
            
            {showModelDropdown && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: "0.5rem", 
                background: "rgba(15, 15, 19, 0.95)", border: "1px solid var(--dev-border)", 
                borderRadius: "8px", padding: "0.5rem", zIndex: 100, width: "200px",
                backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                display: "flex", flexDirection: "column", gap: "2px"
              }}>
                {AI_PROVIDERS.map(p => {
                  const hasKey = !!apiKeys[p.id];
                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        if (hasKey) {
                          setActiveProvider(p.id);
                          setShowModelDropdown(false);
                        }
                      }}
                      style={{
                        padding: "0.6rem 0.8rem", borderRadius: "6px", cursor: hasKey ? "pointer" : "not-allowed",
                        opacity: hasKey ? 1 : 0.5, display: "flex", alignItems: "center", gap: "0.5rem",
                        background: activeProvider === p.id ? `${p.color}15` : "transparent",
                        color: hasKey ? "#fff" : "var(--dev-muted)", fontSize: "0.8rem",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={e => { if (hasKey && activeProvider !== p.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { if (activeProvider !== p.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ background: p.color, width: "6px", height: "6px", borderRadius: "50%" }} />
                      {p.label}
                      {!hasKey && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>🔒</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {Object.values(apiKeys).every(k => !k) ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", opacity: 0.5 }}><AILarva /></div>
            <div style={{ color: "var(--dev-amber)", fontFamily: "var(--dev-font-mono)", fontSize: "0.85rem", maxWidth: "300px", lineHeight: 1.6 }}>
              <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.5rem" }}>⚠</span>
              API KEY REQUIRED<br/>
              <span style={{ color: "var(--dev-muted2)", fontSize: "0.75rem" }}>Please add at least 1 API key in the provider section above to talk with Lorapok AI.</span>
            </div>
          </div>
        ) : (
          <>
            <div className="dev-chat-messages" ref={messagesRef}>
              {messages.map((m, i) => (
                <div key={i} className={`dev-msg ${m.role === "user" ? "user" : "ai"}`}>
                  <div className="dev-msg-av" style={{ background: "transparent", border: `1px solid ${m.role === "ai" ? "var(--dev-green)" : "var(--dev-cyan)"}` }}>
                    {m.role === "ai" ? <AILarva /> : <UserLarva />}
                  </div>
                  <div className="dev-msg-bubble" style={m.role === "ai" ? {} : { whiteSpace: "pre-wrap" }}>
                    {m.role === "ai" ? (
                      <ReactMarkdown
                        components={{
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <div style={{ background: "rgba(0,0,0,0.5)", padding: "0.5rem", borderRadius: "6px", overflowX: "auto", margin: "0.5rem 0", border: "1px solid var(--dev-border)" }}>
                                <code className={className} {...props}>{children}</code>
                              </div>
                            ) : (
                              <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 4px", borderRadius: "4px" }} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="dev-msg ai">
                  <div className="dev-msg-av" style={{ background: "transparent", border: "1px solid var(--dev-green)" }}><AILarva /></div>
                  <div className="dev-msg-bubble"><span className="dev-typing-dot" /><span className="dev-typing-dot" /><span className="dev-typing-dot" /></div>
                </div>
              )}
            </div>
            <div className="dev-chat-chips">
              {["What is Lorapok?", "Help me with Laravel", "Scaffold a new project"].map(chip => (
                <button key={chip} className="dev-chip" onClick={() => sendMessage(chip)}>{chip}</button>
              ))}
            </div>
            <div className="dev-chat-input-row">
              <input
                className="dev-chat-input"
                placeholder="Ask anything..."
                maxLength={500}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button className="dev-chat-send" onClick={() => sendMessage()} disabled={isStreaming}>
                {isStreaming ? "…" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
