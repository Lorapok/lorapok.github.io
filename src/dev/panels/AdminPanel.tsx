// src/dev/panels/AdminPanel.tsx
import { AdminGate, useDevAuth } from "../DevAuth";

function AdminContent() {
  const { user, signOut } = useDevAuth();

  const BLOG_POSTS = [
    { title: "Why open-source AI tooling is eating the stack", status: "Published", date: "May 2025", reads: 1240 },
    { title: "Building Lorapok UI with zero runtime dependencies", status: "Draft", date: "May 2025", reads: 0 },
    { title: "relay-db: SQLite at the edge", status: "Scheduled", date: "Jun 2025", reads: 0 },
  ];
  const STATUS_BADGE: Record<string, string> = { Published: "dev-badge-green", Draft: "dev-badge-amber", Scheduled: "dev-badge-muted" };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="dev-panel-title">Admin <span>Panel</span></div>
            <div className="dev-panel-sub">Lorapok Labs control centre. Manage content, subscribers, and deployments.</div>
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.75rem", color: "var(--dev-green)" }}>● Authenticated</div>
                <div style={{ fontSize: "0.72rem", color: "var(--dev-muted)" }}>{user.email}</div>
              </div>
              {user.photoURL && <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--dev-green)" }} />}
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>

      <div className="dev-g3" style={{ marginBottom: "1.5rem" }}>
        {[{ num: "3", label: "blog posts", change: "↑ 1 this month" }, { num: "—", label: "subscribers", change: "Configure Firestore" }, { num: "—", label: "AI tool uses", change: "Configure analytics" }].map(s => (
          <div key={s.label} className="dev-card dev-card-sm">
            <div className="dev-stat-num">{s.num}</div>
            <div className="dev-stat-label">{s.label}</div>
            <div className="dev-stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="dev-g2" style={{ marginBottom: "1.5rem" }}>
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />System status</div>
          <div className="dev-card dev-card-sm">
            <div className="dev-terminal">
              <div className="dev-term-bar">
                <div className="dev-term-dot" style={{ background: "#f87171" }} />
                <div className="dev-term-dot" style={{ background: "#fbbf24" }} />
                <div className="dev-term-dot" style={{ background: "#4ade80" }} />
                <span style={{ fontSize: "0.7rem", color: "var(--dev-muted)", marginLeft: "0.5rem" }}>lorapok console</span>
              </div>
              <div className="dev-term-body">
                <div><span className="dev-term-prompt">$ </span><span style={{ color: "var(--dev-cyan)" }}>lorapok</span> status</div>
                <div style={{ color: "var(--dev-green)" }}>✓ Mail Proxy · connected (Cloudflare/Resend)</div>
                <div style={{ color: "var(--dev-green)" }}>✓ GitHub Pages · deployed</div>
                <div style={{ color: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "var(--dev-green)" : "var(--dev-amber)" }}>
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✓ Firebase · configured" : "⚠ Firebase · add VITE_FIREBASE_* vars"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {["✦ Create new blog post", "✉ Send newsletter", "⊞ Regenerate sitemap", "⊜ View analytics"].map(a => (
              <button key={a} className="dev-btn dev-btn-secondary" style={{ width: "100%", justifyContent: "flex-start", gap: "0.75rem" }}>{a}</button>
            ))}
            <button className="dev-btn dev-btn-ghost" style={{ width: "100%", justifyContent: "flex-start", color: "var(--dev-red)", borderColor: "rgba(248,113,113,.2)" }}>✕ Clear all caches</button>
          </div>
        </div>
      </div>

      <div className="dev-stitle"><span className="dev-stitle-dot" />Blog management</div>
      <div className="dev-card" style={{ overflowX: "auto" }}>
        <table className="dev-cmp-table" style={{ width: "100%" }}>
          <thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {BLOG_POSTS.map(p => (
              <tr key={p.title}>
                <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</td>
                <td><span className={`dev-badge ${STATUS_BADGE[p.status]}`}>{p.status}</span></td>
                <td>{p.date}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm">Edit</button>
                    {p.status !== "Published" && <button className="dev-btn dev-btn-primary dev-btn-sm">Publish</button>}
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ color: "var(--dev-red)" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return <AdminGate><AdminContent /></AdminGate>;
}
