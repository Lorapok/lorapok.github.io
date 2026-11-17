import { ArrowUpRight, Code2, Globe2, MessageSquare, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const productLinks = [
  ['Product universe', '/projects'],
  ['Engineering Craft', '/engineering-craft'],
  ['Creator Works', '/creator-works'],
  ['Living mascots', '/mascots'],
  ['Partners & benefits', '/partners'],
  ['Loragent network', '/agents'],
  ['LoLaBo journal', '/blog'],
];

const studioLinks = [
  ['Our collective', '/team'],
  ['Founder & mission', '/about'],
  ['Release log', '/changelog'],
  ['Start a conversation', '/contact'],
];

const externalLinks = [
  ['GitHub organization', 'https://github.com/Lorapok'],
  ['VS Code Marketplace', 'https://marketplace.visualstudio.com/publishers/LorapokLabs'],
  ['Open VSX Registry', 'https://open-vsx.org/namespace/LorapokLabs'],
  ['Firefox Add-ons', 'https://addons.mozilla.org/firefox/user/lorapok/'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap4">
        <div className="footer-callout">
          <div>
            <span className="footer-kicker">OPEN SOURCE · OPEN CONVERSATION</span>
            <h2>Have an idea<br /><em>with a pulse?</em></h2>
          </div>
          <Link className="button footer-callout__button" to="/contact/">
            Build with us <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="footer-logo" to="/" aria-label="Lorapok Labs home">
              <img src="/assets/ribo/ribo-presenting.webp" alt="" aria-hidden="true" /> lorapok <em>labs.</em>
            </Link>
            <p>Open-source products that feel alive — biological interfaces, practical engineering, and curious experiments from Dhaka to the world.</p>
            <div className="footer-socials" aria-label="Lorapok social links">
              <a href="https://github.com/Lorapok" target="_blank" rel="noreferrer" aria-label="Lorapok on GitHub"><Code2 /></a>
              <a href="https://github.com/Maijied" target="_blank" rel="noreferrer" aria-label="Founder on GitHub"><Terminal /></a>
              <a href="https://www.linkedin.com/showcase/lorapok/" target="_blank" rel="noreferrer" aria-label="Lorapok on LinkedIn"><Globe2 /></a>
              <a href="https://x.com/LorapokLabs" target="_blank" rel="noreferrer" aria-label="Lorapok on X"><MessageSquare /></a>
            </div>
          </div>

          <FooterColumn title="Explore" links={productLinks} />
          <FooterColumn title="Studio" links={studioLinks} />
          <div className="footer-column">
            <h3>Elsewhere</h3>
            {externalLinks.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">{label} <span>↗</span></a>
            ))}
          </div>
        </div>

        <div className="footer-partner">
          <span>Transparent partner directory</span>
          Verified benefits, approved affiliates, and independent references are labeled separately.
          <Link to="/partners/">Explore partners & benefits ↗</Link>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Lorapok Labs · MIT licensed</span>
          <div>
            <Link to="/privacy/">Privacy</Link>
            <Link to="/terms/">Terms</Link>
            <Link to="/security/">Security</Link>
            <Link to="/dev">Developer portal</Link>
          </div>
          <span>Made in Dhaka · Built for everywhere</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      {links.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
    </div>
  );
}
