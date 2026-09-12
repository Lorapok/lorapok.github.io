// src/dev/panels/LoLaBoPanel.tsx
import { useState, useEffect } from "react";
import { 
  Activity, 
  Share2, 
  MessageSquare, 
  Heart, 
  Eye, 
  RefreshCw, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  ToggleRight,
  ToggleLeft,
  Clock,
  Globe,
  BarChart3,
  Terminal
} from "lucide-react";
import { blogService, DEFAULT_AGENT_CONFIG } from "../../lib/blogService";
import type { AgentConfig } from "../../lib/blogService";

export default function LoLaBoPanel() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_AGENT_CONFIG);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, s] = await Promise.all([
          blogService.getAgentConfig(),
          blogService.getBlogStats()
        ]);
        setConfig(c);
        setStats(s);
      } catch (e) {
        console.error("LoLaBo Panel load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleAgent = async () => {
    const nextValue = !config.isEnabled;
    setConfig(prev => ({ ...prev, isEnabled: nextValue }));
    await blogService.updateAgentConfig({ isEnabled: nextValue });
  };

  const handleUpdateConfig = async (updates: Partial<AgentConfig>) => {
    setIsSaving(true);
    setConfig(prev => ({ ...prev, ...updates }));
    try {
      await blogService.updateAgentConfig(updates);
    } catch (e) {
      console.error("Config save failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerNow = async () => {
    setIsTriggering(true);
    try {
      await blogService.triggerAgentRun();
      alert("LoLaBo Agent triggered! Deployment started in background.");
    } catch (e) {
      alert("Trigger failed.");
    } finally {
      setIsTriggering(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '5rem', textAlign: 'center', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div className="dev-auth-spinner" style={{ width: '30px', height: '30px' }} />
      <span style={{ fontSize: '0.85rem' }}>SYNCHRONIZING WITH LOLABO ENGINE...</span>
    </div>
  );

  return (
    <div className="dev-panel-content" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ─── Header ─── */}
      <div className="dev-panel-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="dev-panel-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>LoLaBo <span>Command Center</span></div>
          <div className="dev-panel-sub" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Autonomous AI Agent monitoring and lifecycle management.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', opacity: 0.6 }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Run</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{config.lastRunAt?.toDate ? config.lastRunAt.toDate().toLocaleString() : 'Never'}</div>
          </div>
          <button 
            onClick={handleTriggerNow} 
            disabled={isTriggering}
            style={{ 
              background: 'var(--dev-green)', 
              color: '#000', 
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {isTriggering ? <RefreshCw className="dev-auth-spinner" size={16} /> : <Zap size={16} />}
            TRIGGER NOW
          </button>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="dev-g4" style={{ marginBottom: '2.5rem', gap: '1.5rem' }}>
        {[
          { label: 'Total Views', val: stats?.totalViews || 0, icon: <Eye size={18} />, color: '#10b981' },
          { label: 'Engagement', val: stats?.totalLikes || 0, icon: <Heart size={18} />, color: '#ef4444' },
          { label: 'Social Reach', val: stats?.totalShares || 0, icon: <Share2 size={18} />, color: '#3b82f6' },
          { label: 'Comments', val: stats?.totalComments || 0, icon: <MessageSquare size={18} />, color: '#eab308' }
        ].map(s => (
          <div key={s.label} className="dev-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '0.75rem', background: `${s.color}15`, color: s.color, borderRadius: '10px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <div className="dev-stitle" style={{ marginBottom: '1.25rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> AGENT ARCHITECTURE
            </div>
            
            <div className="dev-card" style={{ padding: '0', border: '1px solid rgba(255,255,255,0.08)' }}>
              
              {/* Status Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Activity size={24} color={config.isEnabled ? '#10b981' : '#ef4444'} />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>ENGINE STATUS</div>
                    <div style={{ fontSize: '0.8rem', color: config.isEnabled ? '#10b981' : '#ef4444', fontWeight: 600 }}>{config.isEnabled ? 'ACTIVE' : 'DORMANT'}</div>
                  </div>
                </div>
                <button 
                  onClick={handleToggleAgent}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: config.isEnabled ? '#10b981' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s' }}
                >
                  {config.isEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              {/* Form Config */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="dev-form-group" style={{ margin: 0 }}>
                    <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={12} /> Publishing Interval
                    </label>
                    <select className="dev-form-select" value={config.intervalHours} onChange={e => handleUpdateConfig({ intervalHours: parseInt(e.target.value) })}>
                      <option value={1}>Every Hour</option>
                      <option value={6}>6 Hours</option>
                      <option value={12}>12 Hours</option>
                      <option value={24}>Daily</option>
                      <option value={168}>Weekly</option>
                    </select>
                  </div>

                  <div className="dev-form-group" style={{ margin: 0 }}>
                    <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Zap size={12} /> AI Writer Model
                    </label>
                    <select className="dev-form-select" value={config.writingProvider} onChange={e => handleUpdateConfig({ writingProvider: e.target.value })}>
                      <option value="gemini">Google Gemini 2.5 Flash (Fast Research • ~62/hr)</option>
                      <option value="gemini-pro">Google Gemini 2.5 Pro (Flagship Treatises • 2/hr free, 120/hr paid)</option>
                      <option value="groq">Groq (Llama 3.3 70B)</option>
                      <option value="openai">OpenAI GPT-4o</option>
                      <option value="claude">Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div className="dev-form-group" style={{ margin: 0 }}>
                    <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={12} /> Target Audience
                    </label>
                    <select className="dev-form-select" value={config.targetAudience} onChange={e => handleUpdateConfig({ targetAudience: e.target.value })}>
                      <option value="Developers">Developers</option>
                      <option value="Engineers & Architects">Engineers & Architects</option>
                      <option value="Tech Enthusiasts">Tech Enthusiasts</option>
                      <option value="Startup Founders">Startup Founders</option>
                      <option value="General Audience">General Audience</option>
                    </select>
                  </div>

                  <div className="dev-form-group" style={{ margin: 0 }}>
                    <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Editorial Tone
                    </label>
                    <select className="dev-form-select" value={config.tone} onChange={e => handleUpdateConfig({ tone: e.target.value })}>
                      <option value="Technical & precise">Technical & precise</option>
                      <option value="Professional & informative">Professional & informative</option>
                      <option value="Casual & engaging">Casual & engaging</option>
                      <option value="Educational & step-by-step">Educational & step-by-step</option>
                      <option value="Opinionated & bold">Opinionated & bold</option>
                    </select>
                  </div>
                </div>

                <div className="dev-form-group" style={{ margin: 0 }}>
                  <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Share2 size={12} /> Distribution Channels
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['discord', 'twitter', 'linkedin', 'reddit', 'facebook', 'instagram'].map(p => {
                      const isActive = config.enabledSocials.includes(p);
                      return (
                        <button
                          key={p}
                          className={isActive ? 'dev-btn dev-btn-primary dev-btn-sm' : 'dev-btn dev-btn-ghost dev-btn-sm'}
                          onClick={() => {
                            const enabledSocials = isActive
                              ? config.enabledSocials.filter(s => s !== p)
                              : [...config.enabledSocials, p];
                            handleUpdateConfig({ enabledSocials });
                          }}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="dev-form-group" style={{ margin: 0 }}>
                  <label className="dev-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MessageSquare size={12} /> Discord Webhook URL
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>CONNECTED</span>
                  </label>
                  <input
                    type="password"
                    className="dev-form-input"
                    value={config.discordWebhookUrl || ''}
                    placeholder="https://discord.com/api/webhooks/..."
                    onChange={e => setConfig(prev => ({ ...prev, discordWebhookUrl: e.target.value }))}
                    onBlur={e => handleUpdateConfig({ discordWebhookUrl: e.target.value })}
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', display: 'block' }}>
                    Broadcasts newly generated blog articles and announcements to Discord channel in real time.
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <div className="dev-stitle" style={{ marginBottom: '1.25rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} /> HOURLY AI CAPACITY & THROUGHPUT
            </div>
            <div className="dev-card" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
              
              {/* Active Model Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Optimal Cadence</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--dev-green)' }}>1 Post / Hour (24 Papers / Day)</div>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 'bold', border: '1px solid rgba(16,185,129,0.3)' }}>
                  100% FREE TIER
                </span>
              </div>

              {/* Model Capacity Comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ color: '#67ff8f' }}>Google Gemini 2.5 Flash</span>
                    <span>~62 posts/hr (Free)</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    15 RPM • 1,500 RPD • 1M TPM • ~12s generation latency
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ color: '#a78bfa' }}>Google Gemini 2.5 Pro</span>
                    <span>2/hr (Free) • 120/hr (Paid)</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    Flagship reasoning • 50 RPD free cap • ~28s deep treatise
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ color: '#38bdf8' }}>Pollinations Flux / Imagen 3</span>
                    <span>120+ visuals/hr</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                    Domain-specific isometric blueprints • 8k octane render
                  </div>
                </div>

                {/* Practical Constraints Note */}
                <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: 'rgba(234,179,8,0.05)', borderRadius: '6px', border: '1px solid rgba(234,179,8,0.2)', color: 'rgba(255,255,255,0.7)', fontSize: '0.68rem', lineHeight: '1.4' }}>
                  <span style={{ color: '#eab308', fontWeight: 'bold' }}>CI Constraint:</span> GitHub Actions free tier grants 2,000 mins/mo (~900 mins used at 1 post/hr = 45% quota). Running 1 post/hr maximizes depth without quota exhaustion.
                </div>
              </div>

            </div>
          </section>

          <section>
            <div className="dev-stitle" style={{ marginBottom: '1.25rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={18} /> AGENT LOGS
            </div>
            <div className="dev-card" style={{ padding: '0', border: '1px solid rgba(255,255,255,0.08)' }}>
               {stats?.categoryDistribution && Object.keys(stats.categoryDistribution).length > 0 ? (
                 Object.entries(stats.categoryDistribution).map(([cat, count]: [any, any], idx, arr) => (
                   <div key={cat} style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--dev-green)', fontWeight: 'bold' }}>{count} POSTS</div>
                   </div>
                 ))
               ) : (
                 <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem' }}>No activity logged yet.</div>
               )}
               <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                 <button style={{ background: 'none', border: 'none', color: 'var(--dev-muted)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                   VIEW ALL <ArrowUpRight size={14} />
                 </button>
               </div>
            </div>
          </section>

        </div>
      </div>

      {isSaving && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--dev-green)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 5px 20px rgba(0,0,0,0.3)', zIndex: 10000 }}>
          <RefreshCw size={14} className="dev-auth-spinner" />
          SAVING CONFIG...
        </div>
      )}
    </div>
  );
}
