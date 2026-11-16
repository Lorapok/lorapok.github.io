import { useEffect, useState } from "react";
import {
  Activity, BarChart3, BookOpenCheck, Bot, BrainCircuit, Clock, FileCheck2,
  Image, Radio, RefreshCw, Rss, ShieldCheck, Sparkles, Zap,
} from "lucide-react";
import { blogService, DEFAULT_AGENT_CONFIG, type AgentConfig } from "../../lib/blogService";

type BlogStats = Awaited<ReturnType<typeof blogService.getBlogStats>>;

const RESEARCH_CATEGORIES = [
  "Auto-select", "Backend & Infrastructure", "AI & Machine Learning", "Security",
  "Frontend Engineering", "Open Source", "Mobile & UX", "General Tech",
];

const PIPELINE = [
  [Rss, "Source intelligence", "Six engineering RSS feeds, novelty filtering, and research-focus ranking."],
  [BrainCircuit, "Multi-model synthesis", "Validated Gemini model ladder with multi-key failover and research-tier routing."],
  [BookOpenCheck, "Academic review", "100-point peer review, citation validation, and up to three guided refinement passes."],
  [Image, "Research visuals", "Topic-matched cover, architecture, and benchmark figures with resilient fallbacks."],
  [FileCheck2, "Publication gate", "Score, length, citation, duplicate, completeness, and placeholder barriers."],
  [Radio, "Live distribution", "Only quality-approved, deployed articles can enter the protected Discord broadcast stage."],
] as const;

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

  const save = async (updates: Partial<AgentConfig>, success = "Research configuration saved.") => {
    const previous = config;
    setConfig((current) => ({ ...current, ...updates }));
    setSaving(true);
    setNotice("");
    try {
      await blogService.updateAgentConfig(updates);
      setNotice(success);
    } catch {
      setConfig(previous);
      setNotice("The research configuration could not be saved.");
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
      setNotice("A research cycle is queued for the next hourly runner check.");
    } catch {
      setNotice("The research cycle could not be queued.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="dev-auth-loading"><div className="dev-auth-spinner" /><span>Loading LoLaBo research engine…</span></div>;

  const lastRun = config.lastRunAt?.toDate ? config.lastRunAt.toDate().toLocaleString() : "No recorded run";
  const aiRatio = Math.round((stats?.aiGeneratedRatio || 0) * 100);
  const enabledSocials = Array.isArray(config.enabledSocials) ? config.enabledSocials : [];

  return (
    <div className="dev-panel-content lolabo-office">
      <div className="dev-panel-header lolabo-office__header">
        <div>
          <div className="dev-kicker"><Sparkles size={13} /> AUTONOMOUS RESEARCH ENGINE</div>
          <div className="dev-panel-title">LoLaBo <span>Research Command</span></div>
          <div className="dev-panel-sub">Source discovery, long-form synthesis, peer review, technical visuals, publication gating, and live distribution.</div>
        </div>
        <button className="dev-btn dev-btn-primary" onClick={queueRun} disabled={saving || config.triggerRequested}>
          {saving ? <RefreshCw className="dev-auth-spinner" size={15} /> : <Zap size={15} />} {config.triggerRequested ? "Research queued" : "Queue research cycle"}
        </button>
      </div>

      {notice && <div className="office-projects__notice" role="status">{notice}</div>}

      <div className="dev-g4 lolabo-office__stats">
        {[
          [stats?.totalPosts ?? 0, "research records"],
          [`${aiRatio}%`, "AI research share"],
          ["85 / 100", "publication threshold"],
          [config.triggerRequested ? "Queued" : config.isEnabled ? "Watching" : "Paused", "engine state"],
        ].map(([value, label]) => <div className="dev-card dev-card-sm" key={label}><div className="dev-stat-num">{value}</div><div className="dev-stat-label">{label}</div></div>)}
      </div>

      <div className="lolabo-office__grid">
        <section className="dev-card lolabo-office__card lolabo-office__control-card">
          <div className="lolabo-office__card-title"><Bot size={18} /><div><strong>Research engine controls</strong><span>{config.isEnabled ? "Active" : "Paused"} · last completed cycle {lastRun}</span></div></div>

          <div className="lolabo-office__form">
            <label><span>Engine state</span><select value={config.isEnabled ? "enabled" : "disabled"} onChange={(event) => void save({ isEnabled: event.target.value === "enabled" })}><option value="enabled">Enabled</option><option value="disabled">Paused</option></select></label>
            <label><span>Research cadence</span><select value={config.intervalHours} onChange={(event) => void save({ intervalHours: Number(event.target.value) })}><option value={1}>Hourly</option><option value={3}>Every 3 hours</option><option value={6}>Every 6 hours</option><option value={12}>Every 12 hours</option><option value={24}>Daily</option><option value={168}>Weekly</option></select></label>
            <label><span>Editorial mode</span><select value={config.editorialMode} onChange={(event) => void save({ editorialMode: event.target.value as AgentConfig["editorialMode"] })}><option value="research">Flagship research</option><option value="auto">Adaptive research / dispatch</option><option value="technical">Technical dispatch</option></select></label>
            <label><span>Writing route</span><select value={config.writingProvider} onChange={(event) => void save({ writingProvider: event.target.value })}><option value="gemini-pro">Gemini research ladder</option><option value="gemini">Gemini standard ladder</option><option value="groq">Groq route</option><option value="openai">OpenAI route</option><option value="claude">Claude route</option></select></label>
            <label><span>Research domain</span><select value={config.categoryFocus} onChange={(event) => void save({ categoryFocus: event.target.value })}>{RESEARCH_CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
            <label><span>Refinement passes</span><select value={config.maxRefinementPasses} onChange={(event) => void save({ maxRefinementPasses: Number(event.target.value) })}><option value={0}>Review only</option><option value={1}>1 refinement</option><option value={2}>2 refinements</option><option value={3}>3 refinements</option></select></label>
            <label><span>Image strategy</span><select value={config.imageGenMode} onChange={(event) => void save({ imageGenMode: event.target.value as AgentConfig["imageGenMode"] })}><option value="auto">AI with resilient fallback</option><option value="ai">AI technical visuals</option><option value="stock">Curated stock fallback</option></select></label>
            <label><span>Audience</span><select value={config.targetAudience} onChange={(event) => void save({ targetAudience: event.target.value })}><option>Developers & Engineers</option><option>Engineers & Architects</option><option>Research Engineers</option><option>Startup Founders</option><option>General Audience</option></select></label>
            <label className="lolabo-office__wide"><span>Editorial tone</span><select value={config.tone} onChange={(event) => void save({ tone: event.target.value })}><option>Technical & precise</option><option>Rigorous academic systems engineering</option><option>Professional & informative</option><option>Educational & step-by-step</option><option>Opinionated & bold</option></select></label>
            <label className="lolabo-office__wide"><span>Research agenda</span><textarea rows={4} value={config.researchFocus} onChange={(event) => setConfig((current) => ({ ...current, researchFocus: event.target.value }))} onBlur={(event) => void save({ researchFocus: event.target.value })} placeholder="Topics and domains LoLaBo should prioritize…" /></label>
          </div>

          <div className="lolabo-office__toggles">
            <label><input type="checkbox" checked={config.autoPublishPassed} onChange={(event) => void save({ autoPublishPassed: event.target.checked })} /><span><strong>Auto-publish approved research</strong><small>Only after every deterministic gate passes.</small></span></label>
            <label><input type="checkbox" checked={config.autoDistributePassed} onChange={(event) => void save({ autoDistributePassed: event.target.checked })} /><span><strong>Distribute after live verification</strong><small>Never broadcasts a draft or a missing URL.</small></span></label>
            <label><input type="checkbox" checked={enabledSocials.includes("discord")} onChange={(event) => void save({ enabledSocials: event.target.checked ? Array.from(new Set([...enabledSocials, "discord"])) : enabledSocials.filter((channel) => channel !== "discord") })} /><span><strong>Discord research desk</strong><small>Webhook remains a protected deployment secret.</small></span></label>
          </div>
          <p className="lolabo-office__secret-note"><ShieldCheck size={14} /> Provider keys, service credentials, and distribution webhooks are never returned to this browser or stored in Office documents.</p>
        </section>

        <section className="dev-card lolabo-office__card">
          <div className="lolabo-office__card-title"><Activity size={18} /><div><strong>Restored research pipeline</strong><span>Every stage is implemented in the agent, not simulated in the dashboard.</span></div></div>
          <div className="lolabo-office__pipeline">
            {PIPELINE.map(([Icon, title, description], index) => <div key={title}><span className="lolabo-office__pipeline-index">{String(index + 1).padStart(2, "0")}</span><Icon size={17} /><p><strong>{title}</strong><small>{description}</small></p></div>)}
          </div>
        </section>

        <section className="dev-card lolabo-office__card">
          <div className="lolabo-office__card-title"><FileCheck2 size={18} /><div><strong>Academic publication contract</strong><span>Research is private unless all requirements are satisfied.</span></div></div>
          <div className="lolabo-office__checks"><div><strong>85 / 100</strong><span>minimum review score</span></div><div><strong>1,200+</strong><span>minimum article words</span></div><div><strong>3+</strong><span>formal citations</span></div><div><strong>Duplicate-safe</strong><span>topic similarity barrier</span></div><div><strong>Complete</strong><span>balanced code and conclusion</span></div><div><strong>Visual-ready</strong><span>cover asset required</span></div></div>
          <div className="lolabo-office__flow"><Clock size={15} /><span>Collect</span><i /><span>Synthesize</span><i /><span>Review</span><i /><span>Refine</span><i /><span>Gate</span><i /><span>Deploy</span></div>
        </section>

        <section className="dev-card lolabo-office__card lolabo-office__wide-card">
          <div className="lolabo-office__card-title"><BarChart3 size={18} /><div><strong>Recorded research catalog</strong><span>These counts come from stored records; no theoretical quota or throughput claims.</span></div></div>
          <div className="lolabo-office__distribution">{stats?.categoryDistribution && Object.keys(stats.categoryDistribution).length > 0 ? Object.entries(stats.categoryDistribution).map(([category, count]) => <div key={category}><span>{category}</span><strong>{count} record{count === 1 ? "" : "s"}</strong></div>) : <p>No categorized research has been recorded yet.</p>}</div>
        </section>
      </div>
    </div>
  );
}
