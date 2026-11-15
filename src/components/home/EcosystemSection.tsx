import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/lorapok';

const TABS = ['Featured', 'All', 'AI', 'Developer Tools', 'Laravel/PHP', 'Browser Extensions', 'Desktop/Linux', 'Media', 'Sensory & Hardware', 'Mobile Apps', 'Games/Utilities', '3D Art & Design'];

export function EcosystemSection() {
  const [tab, setTab] = useState('Featured');
  const shown = useMemo(() => {
    if (tab === 'All') return projects;
    if (tab === 'Featured') return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === tab);
  }, [tab]);
  const tabs = TABS.filter((t) => t === 'Featured' || t === 'All' || projects.some((p) => p.category === t));

  const glow = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="wrap lp-reveal" id="ecosystem">
      <div className="section-head">
        <div><span className="eyebrow">The ecosystem</span><h2>One lab. Many living products.</h2></div>
        <p>Every product below is built, maintained, and shipped by the Lorapok collective.</p>
      </div>
      <div className="lp-tabs" role="tablist">
        {tabs.map((t) => (<button key={t} className="lp-tab" aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>))}
      </div>
      <div className="lp-grid">
        {shown.map((p) => {
          const link = p.links[0];
          return (
            <a key={p.name} className="lp-card" href={link?.url} target="_blank" rel="noopener noreferrer" onPointerMove={glow}>
              <span className="tag">{p.isNew ? 'New · ' : ''}{p.category}</span>
              <h3>{p.name}</h3>
              <p>{p.tagline}</p>
              <span className="go">{link?.label || 'Open'} ↗</span>
            </a>
          );
        })}
      </div>
      <p className="lp-note">Showing {shown.length} of {projects.length}. <Link to="/projects" style={{ color: 'var(--mint)' }}>Browse the full catalog →</Link></p>
    </section>
  );
}
