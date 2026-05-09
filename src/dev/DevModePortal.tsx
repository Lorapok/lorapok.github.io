// src/dev/DevModePortal.tsx
// The full Lorapok Labs Developer Mode workspace
import { useState, useEffect } from "react";
import { DevAuthProvider, useDevAuth } from "./DevAuth";
import AILabsPanel from "./panels/AILabsPanel";
import BlogPanel from "./panels/BlogPanel";
import PlaygroundPanel from "./panels/PlaygroundPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import AdminPanel from "./panels/AdminPanel";
import AnalyticsPanel from "./panels/AnalyticsPanel";
import PromptLibraryPanel from "./panels/PromptLibraryPanel";
import ComparePanel from "./panels/ComparePanel";
import DashboardPanel from "./panels/DashboardPanel";
import "./DevMode.css";


type PanelId = "dashboard" | "ai-labs" | "blog" | "playground" | "projects" | "readme" | "commits" | "compare" | "prompts" | "admin" | "analytics";


const devBadgeImage = "/assets/lorapok-dev-logo.png";

interface NavItem {
  id: PanelId;
  icon: string;
  label: string;
  badge?: string;
  count?: number;
}

const WORKSPACE_ITEMS: NavItem[] = [
  { id: "dashboard", icon: "⌂", label: "Dashboard" },
  { id: "ai-labs", icon: "⬡", label: "AI Labs" },
  { id: "blog", icon: "✦", label: "Blog System", badge: "NEW" },
  { id: "playground", icon: "⌥", label: "Playground" },
  { id: "projects", icon: "◈", label: "Projects", count: 6 },
];

const TOOL_ITEMS: NavItem[] = [
  { id: "compare", icon: "⊟", label: "AI Compare", badge: "β" },
  { id: "prompts", icon: "⊕", label: "Prompt Library" },
];

const ADMIN_ITEMS: NavItem[] = [
  { id: "admin", icon: "⊛", label: "Admin Panel" },
  { id: "analytics", icon: "⊜", label: "Analytics" },
];

function NavItem({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button className={`dev-sidebar-item ${active ? "active" : ""}`} onClick={onClick}>
      <span className="dev-sidebar-icon">{item.icon}</span>
      {item.label}
      {item.badge && <span className="dev-sidebar-new">{item.badge}</span>}
      {item.count !== undefined && <span className="dev-sidebar-count">{item.count}</span>}
    </button>
  );
}

function DevPortalInner({ onClose }: { onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<PanelId>("dashboard");
  const { user, signIn } = useDevAuth();
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };
  void showToast;

  const switchPanel = (id: string) => {
    if (id === "dashboard" || id === "ai-labs" || id === "blog" || id === "playground" || id === "projects" ||
      id === "readme" || id === "commits" || id === "compare" || id === "prompts" ||
      id === "admin" || id === "analytics") {
      setActivePanel(id as PanelId);
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard": return <DashboardPanel />;
      case "ai-labs": return <AILabsPanel onSwitchPanel={switchPanel} />;
      case "blog": return <BlogPanel />;
      case "playground": return <PlaygroundPanel />;
      case "projects": return <ProjectsPanel />;
      case "compare": return <ComparePanel />;
      case "prompts": return <PromptLibraryPanel onLoadToPlayground={(_text) => { switchPanel("playground"); }} />;
      case "admin": return <AdminPanel />;
      case "analytics": return <AnalyticsPanel />;
      default: return <DashboardPanel />;
    }
  };

  const allProviders = ["claude", "openai", "gemini", "mistral", "groq", "cohere"];
  const configuredProviders = allProviders.filter(p => localStorage.getItem(`lpk_key_${p}`));

  return (
    <div className="dev-portal">
      {/* Top Nav */}
      <nav className="dev-nav">
        <div className="dev-nav-inner">
          <div className="dev-nav-logo">
            <img src={devBadgeImage} alt="Lorapok" className="dev-nav-larva" />
            <span style={{ fontFamily: "var(--dev-font-head)", fontWeight: 800 }}>Lorapok</span>
            <span className="dev-badge-pill">DEV MODE</span>
          </div>

          <div className="dev-nav-tabs">
            {[...WORKSPACE_ITEMS, ...TOOL_ITEMS, ...ADMIN_ITEMS].map(item => (
              <button
                key={item.id}
                className={`dev-nav-tab ${activePanel === item.id ? "active" : ""}`}
                onClick={() => setActivePanel(item.id)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div className="dev-nav-right">
            {configuredProviders.length > 0 && (
              <button className="dev-nav-provider" onClick={() => switchPanel("ai-labs")}>
                <span className="dev-provider-dot" />
                {configuredProviders[0]}
                <span style={{ color: "var(--dev-muted)", marginLeft: "2px" }}>▾</span>
              </button>
            )}
            {user ? (
              <img
                src={user.photoURL || ""}
                alt={user.displayName || ""}
                className="dev-nav-avatar"
                title={user.email || ""}
                style={{ cursor: "pointer" }}
                onClick={() => switchPanel("admin")}
              />
            ) : (
              <button className="dev-nav-avatar" onClick={signIn} title="Sign in to access admin panel">
                <span style={{ fontSize: "0.75rem" }}>🔑</span>
              </button>
            )}
            <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={onClose} title="Back to standard mode" style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.72rem" }}>
              ← Exit Dev
            </button>
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="dev-layout">
        {/* Sidebar */}
        <aside className="dev-sidebar">
          <span className="dev-sidebar-section">workspace</span>
          {WORKSPACE_ITEMS.map(item => (
            <NavItem key={item.id} item={item} active={activePanel === item.id} onClick={() => setActivePanel(item.id)} />
          ))}

          <span className="dev-sidebar-section">tools</span>
          {TOOL_ITEMS.map(item => (
            <NavItem key={item.id} item={item} active={activePanel === item.id} onClick={() => setActivePanel(item.id)} />
          ))}

          <span className="dev-sidebar-section">admin</span>
          {ADMIN_ITEMS.map(item => (
            <NavItem key={item.id} item={item} active={activePanel === item.id} onClick={() => setActivePanel(item.id)} />
          ))}

          {/* System Status */}
          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <div className="dev-system-status">
              <div style={{ color: "var(--dev-green)", marginBottom: "0.3rem" }}>◉ All systems nominal</div>
              <div>Mail Proxy · active</div>
              <div>GitHub Pages · deployed</div>
              <div>{configuredProviders.length} provider{configuredProviders.length !== 1 ? "s" : ""} ready</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dev-main">
          <div className="dev-panel active">
            {renderPanel()}
          </div>
        </main>
      </div>

      <footer className="dev-fixed-footer">
        <div className="dev-footer-left">
          <div className="dev-footer-status">
            <span className="dev-status-pulse"></span>
            ALL SYSTEMS NOMINAL
          </div>
          <div className="dev-footer-meta">
            <span>LORAPOK V1.8.4</span>
            <span>OS: {navigator.platform}</span>
            <span>SESSION: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="dev-footer-right">
          <div className="dev-footer-links">
            <a href="https://github.com/lorapok" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:lorapokdev@gmail.com">Contact</a>
            <a href="#license">License</a>
          </div>
          <div className="dev-footer-clock">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div className={`dev-toast ${toastVisible ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}

interface DevModePortalProps {
  onClose: () => void;
}

export default function DevModePortal({ onClose }: DevModePortalProps) {
  return (
    <DevAuthProvider>
      <DevPortalInner onClose={onClose} />
    </DevAuthProvider>
  );
}
