import { Code2, BookOpen, Zap } from 'lucide-react';



export default function DashboardPanel() {
  return (
    <div className="dev-dashboard">
      {/* ─── Hero Section ─── */}
      <section className="dev-dash-hero">
        <div className="dev-dash-eyebrow">
          <span>• Nonprofit</span>
          <span>• Open-source</span>
          <span>• AI-powered</span>
        </div>
        <h1>Build tools the<br />world<br />can freely <span className="dev-text-outline">own.</span></h1>
        <p className="dev-dash-subtext">
          Lorapok Labs is an open-source collective creating software with no VC,<br />
          no paywalls, and no strings attached — now with AI built in.
        </p>
        
        <div className="dev-dash-actions">
          <button className="dev-btn-primary">
            <Code2 size={18} />
            View on GitHub
          </button>
          <button className="dev-btn-outline">
            <BookOpen size={18} />
            Read the Blog
          </button>
          <button className="dev-btn-outline">
            <Zap size={18} />
            AI Tools
          </button>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="dev-dash-stats">
          <div className="dev-stat-card">
            <strong>2</strong>
            <span>repositories</span>
          </div>
          <div className="dev-stat-card">
            <strong>0</strong>
            <span>total stars</span>
          </div>
          <div className="dev-stat-card">
            <strong>0</strong>
            <span>total forks</span>
          </div>
          <div className="dev-stat-card">
            <strong>1</strong>
            <span>languages</span>
          </div>
        </div>
      </section>

      {/* ─── Values Section ─── */}
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

      {/* ─── PR Section ─── */}
      <section className="dev-dash-section dev-pr-section">
        <div className="dev-pr-content">
          <div className="dev-section-tag">// GET INVOLVED</div>
          <h2 className="dev-section-title">Your first PR is<br />one step away</h2>
          <p className="dev-section-desc">
            Whether you're writing code, fixing docs, or filing bugs — every contribution moves us forward.
          </p>
          <ul className="dev-pr-steps">
            <li><span>01</span> <strong>Fork any repo</strong> — browse our projects and pick one that interests you.</li>
            <li><span>02</span> <strong>Pick a good-first-issue</strong> — filter by the label on GitHub.</li>
            <li><span>03</span> <strong>Open a PR</strong> — we review fast and leave thoughtful feedback.</li>
            <li><span>04</span> <strong>Join the community</strong> — hop in Discord and say hi.</li>
          </ul>
          <button className="dev-btn-primary dev-pr-btn">
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

      {/* ─── Maintainers Section ─── */}
      <section className="dev-dash-section">
        <div className="dev-section-tag">// THE HUMANS</div>
        <h2 className="dev-section-title">Maintainers</h2>
        <p className="dev-section-desc">Real people. Real commits. Building in public.</p>
        
        <div className="dev-maintainers-grid">
          <div className="dev-maintainer-card">
            <div className="dev-avatar">MZ</div>
            <h3>Maizied</h3>
            <span className="dev-role">founder • full-stack</span>
            <span className="dev-handle">@maizied</span>
          </div>
          <div className="dev-maintainer-card dev-card-hollow">
            <div className="dev-avatar dev-avatar-placeholder">?</div>
            <h3>You?</h3>
            <span className="dev-role">contributor</span>
            <span className="dev-handle">join us →</span>
          </div>
        </div>
      </section>
    </div>
  );
}
