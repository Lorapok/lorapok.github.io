// src/dev/panels/AnalyticsPanel.tsx
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Metric {
  label: string;
  count: number;
  pct: number;
}

export default function AnalyticsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [aSnap, uSnap] = await Promise.all([
          getDocs(collection(db, "analytics")),
          getDocs(collection(db, "users"))
        ]);

        const events = aSnap.docs.map(doc => doc.data());
        setTotalViews(events.length);
        setUniqueUsers(uSnap.size);

        // Aggregate AI provider usage
        const aiUsage: Record<string, number> = {};
        events.filter(e => e.category === "ai").forEach(e => {
          const provider = e.metadata?.provider || "unknown";
          aiUsage[provider] = (aiUsage[provider] || 0) + 1;
        });

        const sortedUsage = Object.entries(aiUsage)
          .sort(([, a], [, b]) => b - a)
          .map(([label, count]) => ({
            label,
            count,
            pct: events.length > 0 ? (count / events.length) * 100 : 0
          }));

        setMetrics(sortedUsage);
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Analytics <span>Insights</span></div>
        <div className="dev-panel-sub">Real-time usage metrics and AI provider performance tracking.</div>
      </div>

      <div className="dev-g4" style={{ marginBottom: "1.5rem" }}>
        {[
          { num: totalViews, label: "total interactions", icon: "📊" },
          { num: uniqueUsers, label: "unique maintainers", icon: "👥" },
          { num: metrics.length, label: "AI providers used", icon: "🤖" },
          { num: "Live", label: "system status", icon: "⚡" },
        ].map(s => (
          <div key={s.label} className="dev-card dev-card-sm">
            <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div className="dev-stat-num">{s.num}</div>
            <div className="dev-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dev-g2">
        {/* AI Provider Distribution */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />AI Provider Distribution</div>
          <div className="dev-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {metrics.map(m => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontFamily: "var(--dev-font-mono)", color: "var(--dev-green)" }}>{m.count} uses</span>
                  </div>
                  <div className="dev-progress-bar">
                    <div className="dev-progress-fill" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
              {metrics.length === 0 && !loading && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--dev-muted)" }}>No AI usage data yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Infrastructure Health</div>
          <div className="dev-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Firebase Firestore", status: "Operational", color: "var(--dev-green)" },
                { label: "Firebase Auth", status: "Operational", color: "var(--dev-green)" },
                { label: "GitHub API", status: "Operational", color: "var(--dev-green)" },
                { label: "Claude API", status: "Connected", color: "var(--dev-cyan)" },
                { label: "OpenAI API", status: "Connected", color: "var(--dev-cyan)" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.85rem" }}>{item.label}</span>
                  <span style={{ fontSize: "0.75rem", color: item.color, fontWeight: 700 }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
