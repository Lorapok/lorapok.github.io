// src/dev/DevModePortal.tsx
// The full Lorapok Labs Developer Mode workspace
import React, { useState, useEffect, useRef } from "react";
import { DevAuthProvider, OfficeGate, useDevAuth } from "./DevAuth";
import AILabsPanel from "./panels/AILabsPanel";
import BlogPanel from "./panels/BlogPanel";
import PlaygroundPanel from "./panels/PlaygroundPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import PartnersPanel from "./panels/PartnersPanel";
import AdminPanel from "./panels/AdminPanel";
import AnalyticsPanel from "./panels/AnalyticsPanel";
import PromptLibraryPanel from "./panels/PromptLibraryPanel";
import ComparePanel from "./panels/ComparePanel";
import DashboardPanel from "./panels/DashboardPanel";
import ReadmePanel from "./panels/ReadmePanel";
import CommitsPanel from "./panels/CommitsPanel";
import LoLaBoPanel from "./panels/LoLaBoPanel";
import UserProfilePanel from "./panels/UserProfilePanel";
import StudioOperationsPanel, { type StudioTool } from "./panels/StudioOperationsPanel";
import { OFFICE_ROLES, PANEL_PERMISSIONS } from "./rbac";
import {
  Hexagon, 
  FileText, 
  Play, 
  Layout, 
  Terminal, 
  FileCode, 
  Zap, 
  Bot, 
  BarChart3,
  Menu,
  X,
  Boxes,
  Users,
  Orbit,
  BadgePercent,
  MessageSquareText,
  Mail,
  Video,
  ListChecks,
  GalleryHorizontalEnd,
  Palette,
  ShieldCheck,
  Handshake
} from "lucide-react";
import "./DevMode.css";


type PanelId = "dashboard" | "profile" | "ai-labs" | "blog" | "playground" | "projects" | "partners" | "readme" | "commits" | "compare" | "prompts" | "admin" | "analytics" | "lolabo" | StudioTool;


const devBadgeImage = "/assets/ribo/ribo-focused.webp";

interface NavItem {
  id: PanelId;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  count?: number;
}

const WORKSPACE_ITEMS: NavItem[] = [
  { id: "dashboard", icon: <Orbit size={18} />, label: "Living Studio", badge: "5.0" },
  { id: "content", icon: <FileText size={18} />, label: "Content Desk" },
  { id: "projects", icon: <Boxes size={18} />, label: "Projects" },
  { id: "partners", icon: <Handshake size={18} />, label: "Partners & Benefits" },
  { id: "team-studio", icon: <Users size={18} />, label: "Team Portfolios" },
  { id: "offers", icon: <BadgePercent size={18} />, label: "Offers" },
  { id: "feedback", icon: <MessageSquareText size={18} />, label: "Feedback" },
];

const TOOL_ITEMS: NavItem[] = [
  { id: "mail", icon: <Mail size={18} />, label: "Mail Drafts" },
  { id: "chat", icon: <MessageSquareText size={18} />, label: "Team Chat" },
  { id: "meetings", icon: <Video size={18} />, label: "Meeting Links" },
  { id: "tasks", icon: <ListChecks size={18} />, label: "Task Board" },
  { id: "social", icon: <GalleryHorizontalEnd size={18} />, label: "Social Cards" },
  { id: "brand", icon: <Palette size={18} />, label: "Brand Gallery" },
];

const SYSTEM_ITEMS: NavItem[] = [
  { id: "ai-labs", icon: <Hexagon size={18} />, label: "AI Laboratory" },
  { id: "prompts", icon: <Terminal size={18} />, label: "Prompt Library" },
  { id: "analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
  { id: "admin", icon: <ShieldCheck size={18} />, label: "Access & Admin" },
  { id: "lolabo", icon: <Bot size={18} />, label: "LoLaBo Agent", badge: "AI" },
];

const ADVANCED_ITEMS: NavItem[] = [
  { id: "blog", icon: <FileText size={18} />, label: "Blog System" },
  { id: "playground", icon: <Play size={18} />, label: "Playground" },
  { id: "compare", icon: <Layout size={18} />, label: "Model Compare" },
  { id: "readme", icon: <FileCode size={18} />, label: "README Studio" },
  { id: "commits", icon: <Zap size={18} />, label: "Commit Stories" },
];

const PANEL_IDS: PanelId[] = [
  "dashboard", "profile", "ai-labs", "blog", "playground", "projects", "readme", "commits",
  "compare", "prompts", "admin", "analytics", "lolabo", "content", "partners", "team-studio", "offers",
  "feedback", "mail", "chat", "meetings", "tasks", "social", "brand",
];

function NavItem({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button className={`dev-sidebar-item ${active ? "active" : ""}`} onClick={onClick}>
      <span className="dev-sidebar-icon" style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
      {item.label}
      {item.badge && (
        <span className="dev-sidebar-new" style={{ 
          background: item.badge === 'AI' ? '#f59e0b' : 'var(--dev-amber)',
          color: item.badge === 'AI' ? '#000' : '#000'
        }}>{item.badge}</span>
      )}
      {item.count !== undefined && <span className="dev-sidebar-count">{item.count}</span>}
    </button>
  );
}

function NavGroup({ label, items, activePanel, onSelect, primary = false }: {
  label: string;
  items: NavItem[];
  activePanel: PanelId;
  onSelect: (id: PanelId) => void;
  primary?: boolean;
}) {
  const containsActive = items.some((item) => item.id === activePanel);
  const [expanded, setExpanded] = useState(() => primary || containsActive || !window.matchMedia("(max-width: 1000px)").matches);

  const isExpanded = expanded || containsActive;

  return (
    <section className={`dev-sidebar-group${isExpanded ? " expanded" : ""}`}>
      <button className="dev-sidebar-section" type="button" aria-expanded={isExpanded} onClick={() => setExpanded((value) => !value)}>
        <span>{label}</span><span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
      </button>
      <div className="dev-sidebar-items" hidden={!isExpanded}>
        {items.map((item) => (
          <NavItem key={item.id} item={item} active={activePanel === item.id} onClick={() => onSelect(item.id)} />
        ))}
      </div>
    </section>
  );
}

function DevPortalInner({ onClose }: { onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<PanelId>("dashboard");
  const { user, signIn, signOut, role, can } = useDevAuth();
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };
  void showToast;

  const switchPanel = (id: string) => {
    const permission = PANEL_PERMISSIONS[id];
    if (PANEL_IDS.includes(id as PanelId) && (!permission || can(permission))) {
      setActivePanel(id as PanelId);
      setSidebarOpen(false);
    } else if (permission) {
      showToast("That workspace is not included in your current role.");
    }
  };

  const activePermission = PANEL_PERMISSIONS[activePanel];
  const permittedPanel: PanelId = activePermission && !can(activePermission) ? "dashboard" : activePanel;

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      && !document.documentElement.classList.contains("lp-motion-force");
    main.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [permittedPanel]);

  const renderPanel = () => {
    switch (permittedPanel) {
      case "dashboard": return <DashboardPanel onSwitchPanel={switchPanel} />;
      case "profile": return <UserProfilePanel />;
      case "ai-labs": return <AILabsPanel onSwitchPanel={switchPanel} />;
      case "blog": return <BlogPanel />;
      case "playground": return <PlaygroundPanel />;
      case "projects": return <ProjectsPanel />;
      case "partners": return <PartnersPanel />;
      case "compare": return <ComparePanel />;
      case "prompts": return <PromptLibraryPanel onLoadToPlayground={(text) => {
        localStorage.setItem("lpk_playground_prompt", text);
        switchPanel("playground");
      }} />;
      case "readme": return <ReadmePanel />;
      case "commits": return <CommitsPanel />;
      case "admin": return <AdminPanel />;
      case "lolabo": return <LoLaBoPanel />;
      case "analytics": return <AnalyticsPanel />;
      case "content":
      case "team-studio":
      case "offers":
      case "feedback":
      case "mail":
      case "chat":
      case "meetings":
      case "tasks":
      case "social":
      case "brand": return <StudioOperationsPanel tool={permittedPanel} />;
      default: return <DashboardPanel onSwitchPanel={switchPanel} />;
    }
  };

  const allProviders = ["claude", "openai", "gemini", "mistral", "groq", "cohere"];
  const configuredProviders = allProviders.filter(p => sessionStorage.getItem(`lpk_key_${p}`));
  const visibleWorkspaceItems = WORKSPACE_ITEMS.filter((item) => can(PANEL_PERMISSIONS[item.id]));
  const visibleToolItems = TOOL_ITEMS.filter((item) => can(PANEL_PERMISSIONS[item.id]));
  const visibleSystemItems = SYSTEM_ITEMS.filter((item) => can(PANEL_PERMISSIONS[item.id]));
  const visibleAdvancedItems = ADVANCED_ITEMS.filter((item) => can(PANEL_PERMISSIONS[item.id]));

  return (
    <div className="dev-portal">
      {/* Top Nav */}
      <nav className="dev-nav">
        <div className="dev-nav-inner">
          <button className="dev-mobile-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle Studio navigation" aria-expanded={sidebarOpen}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="dev-nav-logo">
            <img src={devBadgeImage} alt="Lorapok" className="dev-nav-larva" />
            <span className="dev-logo-wordmark">Lorapok <small>Studio</small></span>
            <span className="dev-badge-pill">LU 5.0</span>
            <span className="dev-role-pill">{OFFICE_ROLES[role].label}</span>
          </div>

          <div className="dev-breadcrumb">
            <span className="bc-root">LIVING UNIVERSE</span>
            <span className="bc-sep">/</span>
            <span className="bc-active">
              {(() => {
                const item = [...WORKSPACE_ITEMS, ...TOOL_ITEMS, ...SYSTEM_ITEMS, ...ADVANCED_ITEMS].find(i => i.id === permittedPanel);
                return item ? item.label.toUpperCase() : "DASHBOARD";
              })()}
            </span>
          </div>

          <div className="dev-nav-right">
            {configuredProviders.length > 0 && (
              <button className="dev-nav-provider" onClick={() => switchPanel("ai-labs")} style={{ padding: '0 10px', minWidth: 'auto' }}>
                <span className="dev-provider-dot" />
              </button>
            )}
            {user ? (
              <button 
                className="dev-nav-avatar" 
                onClick={() => switchPanel("profile")} 
                title={user.email || "User Profile"}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dev-green)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            ) : (
              <button className="dev-nav-avatar" onClick={signIn} title="Sign in to access user profile">
                <span style={{ fontSize: "0.75rem" }}>🔑</span>
              </button>
            )}
            {user && (
              <button 
                className="dev-btn dev-btn-ghost dev-btn-sm" 
                onClick={signOut} 
                style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.72rem", color: "var(--dev-red)" }}
              >
                Sign Out
              </button>
            )}
            <button className="dev-btn dev-btn-ghost dev-btn-sm dev-exit-button" onClick={onClose} title="Back to public site" style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.72rem" }}>
              ← Public site
            </button>
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="dev-layout">
        {/* Sidebar */}
        <button className={`dev-sidebar-backdrop ${sidebarOpen ? "visible" : ""}`} onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />
        <aside className={`dev-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="dev-sidebar-intro"><span>Studio navigation</span><p>Open source and business operations in one workspace.</p></div>
          {visibleWorkspaceItems.length > 0 && <NavGroup label="Publish" items={visibleWorkspaceItems} activePanel={permittedPanel} onSelect={switchPanel} primary />}
          {visibleToolItems.length > 0 && <NavGroup label="Collaborate & Create" items={visibleToolItems} activePanel={permittedPanel} onSelect={switchPanel} />}
          {visibleSystemItems.length > 0 && <NavGroup label="Signals & System" items={visibleSystemItems} activePanel={permittedPanel} onSelect={switchPanel} />}
          {visibleAdvancedItems.length > 0 && <NavGroup label="Advanced tools" items={visibleAdvancedItems} activePanel={permittedPanel} onSelect={switchPanel} />}

          {/* System Status */}
          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <div className="dev-system-status">
              <div className="status-heading"><span /> Workspace status</div>
              <div>Public catalog · live</div>
              <div>Role · {OFFICE_ROLES[role].label}</div>
              <div>{configuredProviders.length} AI provider{configuredProviders.length !== 1 ? "s" : ""} configured</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainRef} className="dev-main">
          <div className="dev-panel active">
            <div className="dev-panel-stage" key={permittedPanel}>
              {renderPanel()}
            </div>
          </div>
        </main>
      </div>

      <footer className="dev-fixed-footer">
        <div className="dev-footer-left">
          <div className="dev-footer-status">
            <span className="dev-status-pulse"></span>
            STUDIO ONLINE
          </div>
          <div className="dev-footer-meta">
            <span>LIVING UNIVERSE 5.0</span>
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
      <OfficeGate>
        <DevPortalInner onClose={onClose} />
      </OfficeGate>
    </DevAuthProvider>
  );
}
