import { useEffect, useState } from "react";
import { Activity, BarChart3, Clock, FileCheck2, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { blogService, DEFAULT_AGENT_CONFIG, type AgentConfig } from "../../lib/blogService";

type BlogStats = Awaited<ReturnType<typeof blogService.getBlogStats>>;

export default function LoLaBoPanel() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_AGENT_CONFIG);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void Promise.all([blogService.getAgentConfig(), blogService.getBlogStats()])
      .then(([nextConfig, nextStats]) => {
        setConfig({ ...DEFAULT_AGENT_CONFIG, ...nextConfig });
        setStats(nextStats);
      })
      .catch(() => setNotice("LoLaBo data is temporarily unavailable. No settings were changed."))
      .finally(() => setLoading(false));
  }, []);

  const save = async (updates: Partial<AgentConfig>) => {
    const previous = config;
    setConfig((current) => ({ ...current, ...updates }));
    setSaving(true);
    setNotice("");
    try {
      await blogService.updateAgentConfig(updates);
      setNotice("LoLaBo configuration saved.");
    } catch {
      setConfig(previous);
      setNotice("The configuration could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const queueRun = async () => {
    setSaving(true);
    setNotice("");
    try {
      await blogService.triggerAgentRun();
      setConfig((current) => ({ ...current, triggerRequested: true }));
      setNotice("The next scheduled LoLaBo cycle is queued. Content remains a draft until it passes the quality gate.");
    } catch {
      setNotice("The run could not be queued.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="dev-auth-loading"><div className="dev-auth-spinner" /><span>Loading LoLaBo operations…</span></div>;

  const lastRun = config.lastRunAt?.toDate ? config.lastRunAt.toDate().toLocaleString() : "No recorded run";
  const queueState = config.triggerRequested ? "Queued" : "Clear";

  return (
    <div className="dev-panel-content lolabo-office">
      <div className="dev-panel-header lolabo-office__header">
        <div><div className="dev-panel-title">LoLaBo <span>Operations</span></div><div className="dev-panel-sub">Review-first research automation, publishing controls, and honest operational signals.</div></div>
        <button className="dev-btn dev-btn-primary" onClick={queueRun} disabled={saving || config.triggerRequested}>{saving ? <RefreshCw className="dev-auth-spinner" size={15} /> : <Zap size={15} />} {config.triggerRequested ? "Run queued" : "Queue next run"}</button>
      </div>

      {notice && <div className="office-projects__notice" role="status">{notice}</div>}

      <div className="dev-g4 lolabo-office__stats">
        {[[stats?.totalPosts ?? 0, "catalog posts"], [stats?.totalViews ?? 0, "recorded views"], ["85 / 100", "quality threshold"], [queueState, "run queue"]].map(([value, label]) => <div className="dev-card dev-card-sm" key={label}><div className="dev-stat-num">{value}</div><div className="dev-stat-label">{label}</div></div>)}
      </div>

      <div className="lolabo-office__grid">
        <section className="dev-card lolabo-office__card">
          <div className="lolabo-office__card-title"><Activity size={18} /><div><strong>Engine control</strong><span>{config.isEnabled ? "Active" : "Paused"} · last run {lastRun}</span></div></div>
          <div className="lolabo-office__form">
            <label><span>Automation state</span><select value={config.isEnabled ? "enabled" : "disabled"} onChange={(event) => void save({ isEnabled: event.target.value === "enabled" })}><option value="enabled">Enabled</option><option value="disabled">Paused</option></select></label>
            <label><span>Review cadence</span><select value={config.intervalHours} onChange={(event) => void save({ intervalHours: Number(event.target.value) })}><option value={6}>Every 6 hours</option><option value={12}>Every 12 hours</option><option value={24}>Daily</option><option value={168}>Weekly</option></select></label>
            <label><span>Writing route</span><select value={config.writingProvider} onChange={(event) => void save({ writingProvider: event.target.value })}><option value="gemini">Gemini standard</option><option value="gemini-pro">Gemini research</option><option value="groq">Groq</option><option value="openai">OpenAI</option><option value="claude">Claude</option></select></label>
            <label><span>Audience</span><select value={config.targetAudience} onChange={(event) => void save({ targetAudience: event.target.value })}><option>Developers & Engineers</option><option>Engineers & Architects</option><option>Startup Founders</option><option>General Audience</option></select></label>
            <label className="lolabo-office__wide"><span>Editorial tone</span><select value={config.tone} onChange={(event) => void save({ tone: event.target.value })}><option>Technical & precise</option><option>Professional & informative</option><option>Educational & step-by-step</option><option>Opinionated & bold</option></select></label>
          </div>
          <p className="lolabo-office__secret-note"><ShieldCheck size={14} /> Provider keys and distribution webhooks stay in protected deployment secrets and are never readable from this browser.</p>
        </section>

        <section className="dev-card lolabo-office__card">
          <div className="lolabo-office__card-title"><FileCheck2 size={18} /><div><strong>Publication safety</strong><span>Deterministic checks before public release</span></div></div>
          <div className="lolabo-office__checks"><div><strong>85 / 100</strong><span>minimum review score</span></div><div><strong>1,200+</strong><span>minimum article words</span></div><div><strong>3+</strong><span>required citations</span></div><div><strong>Draft first</strong><span>failed candidates stay private</span></div></div>
          <div className="lolabo-office__flow"><Clock size={15} /><span>Collect</span><i /><span>Synthesize</span><i /><span>Review</span><i /><span>Publish or archive</span></div>
        </section>

        <section className="dev-card lolabo-office__card lolabo-office__wide-card">
          <div className="lolabo-office__card-title"><BarChart3 size={18} /><div><strong>Recorded catalog activity</strong><span>Counts come from stored blog records; no estimated capacity claims.</span></div></div>
          <div className="lolabo-office__distribution">{stats?.categoryDistribution && Object.keys(stats.categoryDistribution).length > 0 ? Object.entries(stats.categoryDistribution).map(([category, count]) => <div key={category}><span>{category}</span><strong>{count} post{count === 1 ? "" : "s"}</strong></div>) : <p>No categorized activity has been recorded yet.</p>}</div>
        </section>
      </div>
    </div>
  );
}
