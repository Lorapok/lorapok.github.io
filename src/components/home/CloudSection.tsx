const OFFERS = [
  { name: 'Business Hosting', badge: 'Popular', featured: true, points: ['3 websites', '15 GB NVMe', 'Staging'] },
  { name: 'Pro Hosting', badge: 'For agencies', points: ['10 websites', '30 GB NVMe', 'Migrations'] },
  { name: 'GPU workspaces', badge: 'Early access', points: ['Prepaid credits', 'LLM-ready environments', 'Billed in BDT'] },
];

export function CloudSection() {
  return (
    <section className="wrap lp-reveal">
      <div className="section-head">
        <div><span className="eyebrow">LoraHost</span><h2>Hosting, domains, and GPU workspaces.</h2></div>
        <p>The Lorapok cloud storefront — see current plans and prices on LoraHost.</p>
      </div>
      <div className="lp-cloud">
        {OFFERS.map((o) => (
          <article key={o.name} className={`lp-offer${o.featured ? ' featured' : ''}`}>
            <span className="eyebrow">{o.badge}</span>
            <h3>{o.name}</h3>
            <ul>{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <a className="lp-btn ghost" href="https://lorahost.lorapok.tech/plans" target="_blank" rel="noopener noreferrer">View plan ↗</a>
          </article>
        ))}
      </div>
      <p className="lp-note">Live pricing and availability are shown at checkout on lorahost.lorapok.tech.</p>
    </section>
  );
}
