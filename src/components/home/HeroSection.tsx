import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brand } from '../../data/lorapok';

export function HeroSection({ productCount }: { productCount: number }) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--pointer-x', String(((e.clientX - r.left) / r.width - 0.5) * 2));
    e.currentTarget.style.setProperty('--pointer-y', String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  return (
    <header className="lp-hero" onPointerMove={onMove}>
      <div className="wrap lp-hero-grid">
        <div>
          <span className="eyebrow">Lorapok Labs · Dhaka → the world</span>
          <h1>Software that <em>feels alive.</em></h1>
          <p className="lede">
            {brand.name} is the home of {productCount}+ open-source products, 224 Loragent AI skills, and Creator Works
            in 3D art — built on biological UI, sensory computing, and practical engineering.
          </p>
          <div className="lp-cta">
            <a className="lp-btn primary" href="#ecosystem">Explore the ecosystem <ArrowRight size={18} /></a>
            <a className="lp-btn ghost" href={brand.githubOrg} target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link className="lp-btn ghost" to="/team">Meet the collective</Link>
          </div>
        </div>
        <div className="lp-specimen" aria-hidden="true">
          <div className="ring"><span className="sat" /></div>
          <div className="ring r2" />
          <div className="core" />
        </div>
      </div>
    </header>
  );
}
