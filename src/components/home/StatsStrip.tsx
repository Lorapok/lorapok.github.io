import { ecosystemStats as s } from '../../data/ecosystem-stats';

export function StatsStrip({ productCount }: { productCount: number }) {
  const items = [
    { n: productCount, l: 'Products shipped' },
    { n: s.agentSkillDefinitions, l: 'Loragent skills' },
    { n: s.maijiedPublicRepos + s.lorapokPublicRepos, l: 'Public repositories' },
    { n: s.marketplaces, l: 'Marketplaces' },
  ];
  return (
    <section className="wrap lp-reveal" aria-label="Ecosystem at a glance">
      <div className="lp-stats">
        {items.map((i) => (<div className="lp-stat" key={i.l}><b>{i.n}+</b><span>{i.l}</span></div>))}
      </div>
      <p className="lp-note">Public GitHub snapshot, {s.snapshotDate}.</p>
    </section>
  );
}
