import { Link } from 'react-router-dom';

export function ClosingSection() {
  return (
    <section className="wrap lp-reveal" style={{ paddingBottom: '4rem' }}>
      <div className="lp-close">
        <h2>Build something alive with us.</h2>
        <p>Contribute to open source, hire the collective, or just say hello. We ship in public.</p>
        <div className="lp-cta">
          <Link className="lp-btn primary" to="/contact">Start a conversation</Link>
          <Link className="lp-btn ghost" to="/agents">Explore Loragent skills</Link>
          <Link className="lp-btn ghost" to="/creator-works">Creator Works</Link>
        </div>
      </div>
    </section>
  );
}
