// src/dev/panels/ProjectsPanel.tsx
import { useState, useEffect } from "react";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  PHP: "#4F5D95", HTML: "#e34c26", CSS: "#563d7c", Go: "#00ADD8",
  Rust: "#dea584", Java: "#b07219", Vue: "#41b883", Svelte: "#ff3e00",
};

const DEMO_REPOS = [
  { name: "lorapok-ui", description: "Headless component library for accessible UIs. Zero runtime, full control.", language: "TypeScript", stargazers_count: 47, forks_count: 12, html_url: "https://github.com/lorapok" },
  { name: "blade-cli", description: "Lightweight CLI toolkit for scaffolding projects with opinionated defaults.", language: "Go", stargazers_count: 31, forks_count: 8, html_url: "https://github.com/lorapok" },
  { name: "formkraft", description: "Schema-driven form engine. Define forms in JSON, ship anywhere.", language: "JavaScript", stargazers_count: 88, forks_count: 22, html_url: "https://github.com/lorapok" },
  { name: "relay-db", description: "Tiny SQLite-backed key-value store for edge environments.", language: "Rust", stargazers_count: 19, forks_count: 4, html_url: "https://github.com/lorapok" },
  { name: "devpulse", description: "GitHub activity dashboard — self-hostable, no auth required.", language: "Vue", stargazers_count: 62, forks_count: 17, html_url: "https://github.com/lorapok" },
  { name: "maildrop", description: "Minimal transactional email sender. SMTP-compatible, under 2 kB.", language: "Python", stargazers_count: 24, forks_count: 6, html_url: "https://github.com/lorapok" },
];

interface Repo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export default function ProjectsPanel() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ repos: 0, stars: 0, forks: 0, langs: 0 });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://api.github.com/orgs/lorapok/repos?per_page=30&sort=updated");
        if (!res.ok) throw new Error("rate limited");
        const data: Repo[] = await res.json();
        const filtered = data.filter((r: any) => !r.fork && !r.archived);
        setRepos(filtered.slice(0, 9));
        setStats({
          repos: filtered.length,
          stars: filtered.reduce((a: number, r: any) => a + r.stargazers_count, 0),
          forks: filtered.reduce((a: number, r: any) => a + r.forks_count, 0),
          langs: new Set(filtered.map((r: any) => r.language).filter(Boolean)).size,
        });
      } catch {
        setRepos(DEMO_REPOS);
        setStats({
          repos: DEMO_REPOS.length,
          stars: DEMO_REPOS.reduce((a, r) => a + r.stargazers_count, 0),
          forks: DEMO_REPOS.reduce((a, r) => a + r.forks_count, 0),
          langs: new Set(DEMO_REPOS.map(r => r.language)).size,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">Open-source <span>Projects</span></div>
        <div className="dev-panel-sub">All Lorapok repos — live from GitHub API.</div>
      </div>

      <div className="dev-g4" style={{ marginBottom: "1.5rem" }}>
        {[
          { num: stats.repos || "—", label: "repositories" },
          { num: stats.stars || "—", label: "total stars" },
          { num: stats.forks || "—", label: "total forks" },
          { num: stats.langs || "—", label: "languages" },
        ].map(s => (
          <div key={s.label} className="dev-card dev-card-sm">
            <div className="dev-stat-num">{s.num}</div>
            <div className="dev-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="dev-g3">
          {[1, 2, 3].map(i => <div key={i} className="dev-card dev-shimmer" style={{ height: "140px" }} />)}
        </div>
      ) : (
        <div className="dev-g3">
          {repos.map(repo => (
            <a key={repo.name} className="dev-repo-card" href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "var(--dev-font-head)", fontSize: "0.9rem", fontWeight: 700 }}>{repo.name}</div>
                <span>📦</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--dev-muted2)", lineHeight: 1.55, flex: 1 }}>{repo.description || "No description."}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
                {repo.language && (
                  <>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: LANG_COLORS[repo.language] || "#6b6b7a", flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)" }}>{repo.language}</span>
                  </>
                )}
                <span style={{ fontSize: "0.72rem", color: "var(--dev-amber)", fontFamily: "var(--dev-font-mono)", marginLeft: "auto" }}>★ {repo.stargazers_count}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--dev-muted)", fontFamily: "var(--dev-font-mono)" }}>⑂ {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
