// src/dev/panels/AnalyticsPanel.tsx

const TOP_PAGES = [
  { page: "/", views: 5420, pct: 100 },
  { page: "/blog", views: 3210, pct: 59 },
  { page: "/dev", views: 2870, pct: 53 },
  { page: "/projects", views: 1640, pct: 30 },
  { page: "/contribute", views: 1060, pct: 20 },
];

const TOOL_USAGE = [
  { label: "AI Chat", count: 1240, pct: 100 },
  { label: "README Gen", count: 820, pct: 66 },
  { label: "Commit Explainer", count: 640, pct: 52 },
  { label: "Playground", count: 380, pct: 31 },
  { label: "Blog Writer", count: 120, pct: 10 },
];

export default function AnalyticsPanel() {
  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Analytics <span>Dashboard</span></div>
        <div className="dev-panel-sub">Self-hosted. No external tracking. All data in your Firestore.</div>
      </div>

      <div className="dev-card dev-card-sm" style={{ marginBottom: "1.5rem", background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
        <span style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.8rem", color: "var(--dev-amber)" }}>
          ⚠ Analytics requires Firebase Firestore. Configure VITE_FIREBASE_* environment variables and add the Firestore event logger to App.tsx to enable real data. Demo data shown below.
        </span>
      </div>

      <div className="dev-g4" style={{ marginBottom: "1.5rem" }}>
        {[
          { num: "14.2k", label: "page views", change: "↑ 22% this month" },
          { num: "3.8k", label: "unique visitors", change: "↑ 11% this month" },
          { num: "2m 14s", label: "avg session", change: "↑ 8s vs last month" },
          { num: "64%", label: "return rate", change: "↑ 4% this month" },
        ].map(s => (
          <div key={s.label} className="dev-card dev-card-sm">
            <div className="dev-stat-num">{s.num}</div>
            <div className="dev-stat-label">{s.label}</div>
            <div className="dev-stat-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="dev-g2">
        {/* Top Pages */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Top pages</div>
          <div className="dev-card">
            <table className="dev-cmp-table" style={{ width: "100%" }}>
              <thead>
                <tr><th>Page</th><th>Views</th><th>%</th></tr>
              </thead>
              <tbody>
                {TOP_PAGES.map(p => (
                  <tr key={p.page}>
                    <td>{p.page}</td>
                    <td style={{ fontFamily: "var(--dev-font-mono)" }}>{p.views.toLocaleString()}</td>
                    <td style={{ minWidth: 100 }}>
                      <div className="dev-progress-bar">
                        <div className="dev-progress-fill" style={{ width: `${p.pct}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Tool Usage */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />AI tool usage</div>
          <div className="dev-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {TOOL_USAGE.map(t => (
                <div key={t.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                    <span>{t.label}</span>
                    <span style={{ fontFamily: "var(--dev-font-mono)", color: "var(--dev-green)" }}>{t.count.toLocaleString()}</span>
                  </div>
                  <div className="dev-progress-bar">
                    <div className="dev-progress-fill" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
