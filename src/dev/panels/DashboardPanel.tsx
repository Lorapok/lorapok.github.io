import { useState, useEffect, useRef } from 'react';
import { Code2, BookOpen, Zap, Activity, Shield, Cpu, Network } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface DashboardPanelProps {
  onSwitchPanel?: (panel: string) => void;
}

interface GitHubStats {
  repos: number;
  stars: number;
  forks: number;
  languages: string[];
  latestUpdate: string;
  loading: boolean;
}

interface LogEntry {
  id: string;
  category: string;
  action: string;
  email: string;
  timestamp: any;
}

interface Maintainer {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function DashboardPanel({ onSwitchPanel }: DashboardPanelProps) {
  const [github, setGithub] = useState<GitHubStats>({ 
    repos: 0, 
    stars: 0, 
    forks: 0, 
    languages: [], 
    latestUpdate: '...', 
    loading: true 
  });
  const [maintainers, setMaintainers] = useState<Maintainer[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Fetch GitHub Stats & Contributors
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const repoRes = await fetch('https://api.github.com/users/lorapok/repos?sort=updated');
        const repos = await repoRes.json();
        
        if (Array.isArray(repos) && repos.length > 0) {
          const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
          const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
          
          // Get all languages and count them
          const langMap: Record<string, number> = {};
          repos.forEach(r => {
            if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          });
          const sortedLangs = Object.keys(langMap).sort((a, b) => langMap[b] - langMap[a]);

          // Get latest update time
          const latestRepo = repos[0]; // Already sorted by updated
          const lastUpdateDate = new Date(latestRepo.pushed_at);
          const diffMs = new Date().getTime() - lastUpdateDate.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const timeAgo = diffHrs < 1 ? 'just now' : `${diffHrs}h ago`;
          
          setGithub({
            repos: repos.length,
            stars: totalStars,
            forks: totalForks,
            languages: sortedLangs,
            latestUpdate: timeAgo,
            loading: false
          });

          // Fetch contributors from the most active repo
          const topRepo = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
          if (topRepo) {
            const contRes = await fetch(`https://api.github.com/repos/lorapok/${topRepo.name}/contributors`);
            const contributors = await contRes.json();
            if (Array.isArray(contributors)) {
              setMaintainers(contributors.slice(0, 3));
            }
          }
        } else {
          setGithub(prev => ({ ...prev, loading: false, latestUpdate: 'No public repos' }));
        }
      } catch (e) {
        console.error('GitHub fetch failed', e);
        setGithub(prev => ({ ...prev, loading: false }));
      }
    };
    fetchGithubData();
  }, []);

  // Real-time Logs (CMD Board)
  useEffect(() => {
    const q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(30));
    const unsub = onSnapshot(q, 
      (snap) => {
        const newLogs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setLogs(newLogs.reverse());
        setTimeout(() => {
          if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }, 100);
      },
      (err) => console.warn("Dashboard analytics access restricted:", err.message)
    );
    return () => unsub();
  }, []);

  return (
    <div className="dev-dashboard">
      {/* ─── Hero Section ─── */}
      <section className="dev-dash-hero">
        <div className="hero-technical-bg">
          <div className="scan-line" />
          <div className="corner-bracket top-left" />
          <div className="corner-bracket top-right" />
          <div className="corner-bracket bottom-left" />
          <div className="corner-bracket bottom-right" />
        </div>

        <div className="dev-dash-eyebrow">
          <span className="eyebrow-node"><Activity size={10} /> NONPROFIT</span>
          <span className="eyebrow-sep">/</span>
          <span className="eyebrow-node"><Cpu size={10} /> OPEN-SOURCE</span>
          <span className="eyebrow-sep">/</span>
          <span className="eyebrow-node"><Network size={10} /> AI-POWERED</span>
        </div>
        
        <h1 className="mission-title">
          <span className="title-sub">SYSTEM_INIT_0.84</span><br />
          Build tools the world can freely <span className="dev-text-outline">own.</span>
        </h1>

        <p className="dev-dash-subtext">
          Lorapok Labs is a decentralized collective building public-good software.<br />
          Zero venture capital. 100% transparency. AI-augmented core.
        </p>
        
        <div className="dev-dash-actions">
          <button className="dev-btn-primary main-action" onClick={() => window.open('https://github.com/lorapok', '_blank')}>
            <Code2 size={20} />
            View on GitHub
            <div className="btn-glitch" />
          </button>
          <button className="dev-btn-outline" onClick={() => onSwitchPanel?.('blog')}>
            <BookOpen size={18} />
            Read the Blog
          </button>
          <button className="dev-btn-outline" onClick={() => onSwitchPanel?.('ai-labs')}>
            <Zap size={18} />
            AI Tools
          </button>
        </div>

        {/* ─── Scientific Console (Upgraded) ─── */}
        <div className="dev-research-board mission-console">
          <div className="console-header">
            <span className="console-title">GLOBAL_LORAPOK_NETWORK_STATUS</span>
            <div className="console-uptime">
              <div className="pulse-dot green" />
              SYSTEM_READY // 99.9% UPTIME
            </div>
          </div>
          <div className="research-grid">
            <div className="research-item">
              <div className="research-label"><Activity size={12} /> CORE_REPOS</div>
              <div className="research-value">{github.loading ? '...' : github.repos}</div>
              <div className="research-bar"><div style={{ width: `${Math.min((github.repos / 10) * 100, 100)}%` }} /></div>
              <div className="research-meta">LATEST_COMMIT: {github.latestUpdate}</div>
            </div>
            <div className="research-item">
              <div className="research-label"><Shield size={12} /> TRUST_STARS</div>
              <div className="research-value">{github.loading ? '...' : github.stars}</div>
              <div className="research-bar"><div style={{ width: `${Math.min((github.stars / 100) * 100, 100)}%` }} /></div>
              <div className="research-meta">GROWTH: +12.4%</div>
            </div>
            <div className="research-item">
              <div className="research-label"><Cpu size={12} /> FORK_NODES</div>
              <div className="research-value">{github.loading ? '...' : github.forks}</div>
              <div className="research-bar"><div style={{ width: `${Math.min((github.forks / 50) * 100, 100)}%` }} /></div>
              <div className="research-meta">DISTRIBUTION_OK</div>
            </div>
            <div className="research-item">
              <div className="research-label"><Network size={12} /> LANG_STACK</div>
              <div className="research-value" style={{ fontSize: '0.8rem' }}>{github.loading ? '...' : github.languages.slice(0, 3).join(', ') || 'N/A'}</div>
              <div className="research-bar"><div style={{ width: '80%' }} /></div>
              <div className="research-meta">KERNEL: TS_REACT</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CMD TYPE BOARD (System Logs) ─── */}
      <section className="dev-dash-section">
        <div className="dev-section-tag">// SYSTEM_RUNTIME_LOGS</div>
        <div className="dev-cmd-board">
          <div className="cmd-header">
            <div className="cmd-dot red" />
            <div className="cmd-dot amber" />
            <div className="cmd-dot green" />
            <span className="cmd-title">lorapok_sys_monitor.sh — 128.0.0.1</span>
          </div>
          <div className="cmd-terminal" ref={terminalRef}>
            <div className="cmd-line system">Initializing Lorapok Labs Kernel v1.8.4...</div>
            <div className="cmd-line system">Establishing secure Firebase tunnel... OK</div>
            <div className="cmd-line system">Syncing with GitHub API... OK</div>
            {logs.map((log) => (
              <div key={log.id} className="cmd-line">
                <span className="cmd-time">[{log.timestamp?.toDate().toLocaleTimeString() || 'LIVE'}]</span>
                <span className="cmd-user"> {log.email.split('@')[0]}</span>
                <span className="cmd-action">::{log.category.toUpperCase()}::{log.action}</span>
              </div>
            ))}
            <div className="cmd-line cursor">_</div>
          </div>
        </div>
      </section>

      {/* ─── Values Section (Preserved) ─── */}
      <section className="dev-dash-section">
        <div className="dev-section-tag">// WHY WE EXIST</div>
        <h2 className="dev-section-title">Software should be<br />a public good</h2>
        <p className="dev-section-desc">
          We believe the best tools belong to everyone — not locked<br />
          behind a subscription or controlled by investors.
        </p>

        <div className="dev-values-grid">
          <div className="dev-value-card">
            <div className="dev-value-icon">🔓</div>
            <h3>Radically open</h3>
            <p>Every line of code is public. Fork it, audit it, ship it. No premium tiers, no dark patterns.</p>
          </div>
          <div className="dev-value-card">
            <div className="dev-value-icon">🌍</div>
            <h3>Built for everyone</h3>
            <p>We design for developers in Dhaka as much as in Berlin. Bandwidth-aware, dependency-light.</p>
          </div>
          <div className="dev-value-card">
            <div className="dev-value-icon">🤝</div>
            <h3>Community-owned</h3>
            <p>No single company controls the roadmap. Decisions happen in the open — PRs, issues, discussions.</p>
          </div>
          <div className="dev-value-card">
            <div className="dev-value-icon">✨</div>
            <h3>AI-augmented</h3>
            <p>We use AI to lower the barrier to contribution — docs, onboarding, and tooling, all AI-assisted.</p>
          </div>
        </div>
      </section>

      {/* ─── PR Section (Preserved) ─── */}
      <section className="dev-dash-section dev-pr-section">
        <div className="dev-pr-content">
          <div className="dev-section-tag">// GET INVOLVED</div>
          <h2 className="dev-section-title">Your first PR is<br />one step away</h2>
          <p className="dev-section-desc">
            Whether you're writing code, fixing docs, or filing bugs — every contribution moves us forward.
          </p>
          <ul className="dev-pr-steps">
            <li>
              <span>01</span> 
              <div>
                <strong>Fork any repo</strong>
                <p>Browse our projects and pick one that interests you.</p>
              </div>
            </li>
            <li>
              <span>02</span> 
              <div>
                <strong>Pick a good-first-issue</strong>
                <p>Filter by the label on GitHub and find a task you like.</p>
              </div>
            </li>
            <li>
              <span>03</span> 
              <div>
                <strong>Open a PR</strong>
                <p>We review fast and leave thoughtful technical feedback.</p>
              </div>
            </li>
            <li>
              <span>04</span> 
              <div>
                <strong>Join the community</strong>
                <p>Hop in our Discord or Discussions and say hi!</p>
              </div>
            </li>
          </ul>
          <button className="dev-btn-primary dev-pr-btn" onClick={() => window.open('https://github.com/lorapok', '_blank')}>
            Browse good-first-issues →
          </button>
        </div>

        <div className="dev-terminal-mock">
          <div className="dev-term-header">
            <span className="term-dot"></span>
            <span className="term-dot"></span>
            <span className="term-dot"></span>
          </div>
          <div className="dev-term-body">
            <div className="term-line"><span className="term-prompt">$</span> git clone https://github.com/lorapok/&lt;project&gt;</div>
            <div className="term-line"><span className="term-prompt">$</span> cd &lt;project&gt; && npm install</div>
            <div className="term-line term-comment"># find an issue you like</div>
            <div className="term-line"><span className="term-prompt">$</span> git checkout -b fix/your-idea</div>
            <div className="term-line term-comment"># make your changes</div>
            <div className="term-line"><span className="term-prompt">$</span> git push && gh pr create</div>
            <div className="term-line term-success">✓ Pull request opened — nice work!</div>
          </div>
        </div>
      </section>

      {/* ─── Maintainers Section (Dynamic) ─── */}
      <section className="dev-dash-section">
        <div className="dev-section-tag">// THE HUMANS</div>
        <h2 className="dev-section-title">Maintainers</h2>
        <p className="dev-section-desc">Real people. Real commits. Building in public.</p>
        
        <div className="dev-maintainers-grid">
          {maintainers.map((m) => (
            <div key={m.login} className="dev-maintainer-card" onClick={() => window.open(m.html_url, '_blank')} style={{ cursor: 'pointer' }}>
              <div className="dev-avatar" style={{ overflow: 'hidden' }}>
                <img src={m.avatar_url} alt={m.login} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3>{m.login}</h3>
              <span className="dev-role">{m.login === 'maizied' ? 'founder • full-stack' : 'active contributor'}</span>
              <span className="dev-handle">@{m.login}</span>
            </div>
          ))}
          
          <div className="dev-maintainer-card dev-card-hollow" onClick={() => window.open('https://github.com/orgs/Lorapok/discussions/4', '_blank')} style={{ cursor: 'pointer' }}>
            <div className="dev-avatar dev-avatar-placeholder">?</div>
            <h3>You?</h3>
            <span className="dev-role">contributor</span>
            <span className="dev-handle">Join Us With New Ideas →</span>
          </div>
        </div>
      </section>
    </div>
  );
}

