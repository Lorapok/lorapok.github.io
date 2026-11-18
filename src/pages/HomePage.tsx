import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import SignalNewsletter from '../components/home/SignalNewsletter';
import CommerceShowcase from '../components/home/CommerceShowcase';
import { ProjectGlyph } from '../components/projects/ProjectGlyph';
import { projects, type Project } from '../data/lorapok';
import { packageReleases } from '../data/packageReleases';

type Post = { slug: string; title: string; excerpt: string; category?: string; source?: string; readTime?: string | number; status?: string };

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://lorapok.tech/#website', name: 'Lorapok Labs', url: 'https://lorapok.tech/', inLanguage: 'en', publisher: { '@id': 'https://lorapok.tech/#organization' }, description: 'Open-source products, AI agent skills, and Creator Works in 3D art and design from the Lorapok collective.' },
    { '@type': 'Organization', '@id': 'https://lorapok.tech/#organization', name: 'Lorapok Labs', url: 'https://lorapok.tech/', logo: { '@type': 'ImageObject', url: 'https://lorapok.tech/assets/lorapok-labs-logo.png', width: 2400, height: 640 }, sameAs: ['https://github.com/Lorapok', 'https://github.com/Maijied', 'https://www.linkedin.com/showcase/lorapok/', 'https://x.com/LorapokLabs'] },
    { '@type': 'WebPage', '@id': 'https://lorapok.tech/#webpage', url: 'https://lorapok.tech/', name: 'Lorapok Labs — Open-source Products That Feel Alive', isPartOf: { '@id': 'https://lorapok.tech/#website' }, about: { '@id': 'https://lorapok.tech/#organization' }, inLanguage: 'en' },
  ],
};

function Words({ text }: { text: string }) {
  return <>{text.split(' ').map((w, i) => (<span key={i} className="split-word" style={{ ['--wi' as string]: i, marginRight: '.24em' }}>{w}</span>))}</>;
}

function ProductCard({ p }: { p: Project }) {
  const link = p.links[0];
  return (
    <a className="product-card reveal" href={link?.url} target="_blank" rel="noopener noreferrer">
      <span className="product-tag">{p.isNew ? 'New · ' : ''}{p.category}</span>
      <div className="product-glyph"><ProjectGlyph project={p} size={118} strokeWidth={1.15} /></div>
      <h3>{p.name}</h3>
      <p>{p.tagline}</p>
      <span className="more">{link?.label || 'Open'} <b>↗</b></span>
    </a>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/blog/posts.json')
      .then((r) => r.json())
      .then((d: Post[]) => Array.isArray(d) && setPosts(d.filter((p) => (p.status || 'published') === 'published').slice(0, 3)))
      .catch(() => {});
  }, []);

  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const latestPackageNews = packageReleases.filter((release, index, all) =>
    all.findIndex((candidate) => candidate.product === release.product) === index
  ).slice(0, 3);

  return (
    <div className="v4-home">
      <SEOHead
        title="Open-source Products That Feel Alive"
        description="Lorapok Labs ships open-source software, 224 Loragent skills, and Creator Works in 3D art and design — biological UI, sensory computing, and practical engineering from Dhaka."
        path="/"
        image="/assets/lorapok-labs-logo.png"
        imageAlt="Lorapok Labs — open-source products that feel alive"
        imageWidth={2400}
        imageHeight={640}
        keywords="Lorapok Labs, open source, Creator Works, 3D art and design, Loragent, developer tools, sensory computing, biological UI, LoLaBo"
        jsonLd={homeJsonLd}
      />

      <header className="hero">
        <div className="orbit" /><div className="orb one" /><div className="orb two" /><div className="blob one" />
        <div className="bio-specimen" aria-hidden="true">
          {['curious', 'focused', 'celebrating', 'thinking', 'presenting', 'exploring'].map((mood) => (
            <img key={mood} className={`ribo-pose ribo-pose-${mood}`} src={`/assets/ribo/ribo-${mood}.webp`} alt="" />
          ))}
          <div className="signal">● RIBO SIGNAL · <span className="ribo-signal-mood">CURIOUS</span></div>
        </div>
        <div className="wrap4">
          <div className="eyebrow reveal">● OPEN SOURCE · DHAKA TO THE WORLD</div>
          <h1><Words text="Make" /><br /><Words text="technology" /><br /><em><Words text="feel alive." /></em></h1>
          <p className="lead reveal">From AI companions to systems software, we build tools with a pulse — useful, expressive and made for curious humans.</p>
          <div className="hero-actions reveal">
            <Link className="button" to="/projects/">Enter our universe</Link>
            <Link className="button outline" to="/team/">Get to know us</Link>
          </div>
        </div>
        <span className="scrolltag">↓ SCROLL TO EXPLORE</span>
      </header>

      <div className="marquee" aria-hidden="true"><div>{Array.from({ length: 8 }).map((_, i) => (<span key={i}>{['BUILT TO FEEL ALIVE ✳', 'OPEN BY DESIGN ✳', 'MADE FOR BUILDERS ✳'][i % 3]}</span>))}</div></div>

      <section className="section light"><div className="wrap4">
        <div className="eyebrow reveal">THIS IS LORAPOK</div>
        <h2 className="intro reveal">Not just software.<br />Little universes of possibility.</h2>
        <p className="intro reveal">A collective of engineers, researchers, designers and artists exploring what technology can feel like when imagination meets practical engineering.</p>
        <div className="stats">
          <div className="stat reveal"><strong>{projects.length}</strong><span>Items in the published catalog</span></div>
          <div className="stat reveal"><strong>224</strong><span>Published Loragent skill definitions</span></div>
          <div className="stat reveal"><strong>100%</strong><span>Open-source-focused approach</span></div>
        </div>
        <p className="note">Figures are published catalog snapshots, not real-time metrics.</p>
      </div></section>

      <section className="section soft"><div className="wrap4">
        <div className="eyebrow reveal">THE ECOSYSTEM</div>
        <h2 className="reveal">Big ideas.<br />Real things.</h2>
        <div className="product-grid">{featured.map((p) => <ProductCard key={p.name} p={p} />)}</div>
        <div style={{ marginTop: 44 }}><Link className="button" to="/projects/">See every product ({projects.length})</Link></div>
      </div></section>

      <section className="section loud"><div className="wrap4">
        <div className="eyebrow" style={{ color: '#46359e' }}>WHY IT FEELS DIFFERENT</div>
        <h2 className="reveal">The interface<br />is part of<br />the experience.</h2>
        <div className="feature-grid">
          {[['🌿', 'Biological UI', 'Depth, signal and organic rhythm. Interfaces that respond instead of merely appearing.'],
            ['⚡', 'Sensory computing', 'Fast feedback loops, clarity, and a direct relationship between action and response.'],
            ['⌘', 'Open engineering', 'Readable repositories, practical documentation and ways for builders to explore.']].map(([i, t, d]) => (
            <div key={t} className="feature-card reveal" style={{ background: '#fff7' }}><span className="icon">{i}</span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div></section>

      <section className="section home-mascot-doorway"><div className="wrap4 home-mascot-doorway__grid">
        <div className="home-mascot-doorway__copy reveal">
          <div className="eyebrow">THE LIVING CHARACTER ARCHIVE</div>
          <h2>A universe of<br /><em>useful companions.</em></h2>
          <p>Explore the original Larry studies, restored cyber-biological species, production Ribo roles and the evolving visual experiments preserved across the Lorapok drive.</p>
          <Link className="button" to="/mascots/">Enter the mascot gallery ↗</Link>
        </div>
        <div className="home-mascot-doorway__visual" aria-hidden="true">
          <span className="doorway-orbit" />
          <img className="doorway-mascot doorway-mascot-main" src="/assets/ribo/generated/20261117/founder-navigator.webp" alt="" />
          <img className="doorway-mascot doorway-mascot-one" src="/assets/ribo/species/neon-scout.webp" alt="" />
          <img className="doorway-mascot doorway-mascot-two" src="/assets/ribo/species/deep-diver.webp" alt="" />
        </div>
      </div></section>

      <section className="section home-partner-doorway"><div className="wrap4 home-partner-doorway__grid">
        <div className="home-partner-doorway__visual reveal" aria-hidden="true"><img src="/assets/ribo/generated/20261117/ai-orchestrator.webp" alt="" /></div>
        <div className="home-partner-doorway__copy reveal">
          <div className="eyebrow">PARTNER CONSTELLATION / VERIFIED BENEFITS</div>
          <h2>Useful connections.<br /><em>Honest labels.</em></h2>
          <p>Explore approved affiliates, independent references, and exact customer benefits—each with a relationship label, verification date, and provider-controlled terms.</p>
          <div className="partner-proof-row"><span>Verified offers</span><span>Clear disclosures</span><span>Office-managed</span></div>
          <Link className="button" to="/partners/">Explore partners & benefits ↗</Link>
        </div>
      </div></section>

      <section className="statement yellow"><div className="wrap4">
        <div className="eyebrow" style={{ color: '#455716' }}>A SMALL PLANET. INFINITE POSSIBILITIES.</div>
        <h2 className="reveal">Built in Dhaka.<br />Made for everywhere.</h2>
        <div style={{ marginTop: 40 }}><Link className="button" to="/team/">Meet our collective</Link></div>
      </div></section>

      <section className="section home-registry-signal"><div className="wrap4">
        <div className="home-registry-signal__heading">
          <div><div className="eyebrow">PACKAGE NEWSROOM / VERIFIED AT SOURCE</div><h2>Installable work.<br /><em>Documented clearly.</em></h2></div>
          <div className="home-registry-signal__totals" aria-label="Published package totals">
            <span><strong>{packageReleases.filter((item) => item.registry === 'npm').length}</strong> npm</span>
            <span><strong>{packageReleases.filter((item) => item.registry === 'Packagist').length}</strong> Packagist</span>
          </div>
        </div>
        <div className="home-registry-signal__grid">
          {latestPackageNews.map((release) => (
            <a key={`${release.registry}:${release.name}`} href={release.registryUrl} target="_blank" rel="noopener noreferrer" className="home-package-pulse reveal">
              <div className="home-package-pulse__glyph" aria-hidden="true">
                <i className="home-package-pulse__orbit orbit-a" />
                <i className="home-package-pulse__orbit orbit-b" />
                <ProjectGlyph project={{ name: release.product, category: 'Developer Tools' }} size={42} strokeWidth={1.45} />
              </div>
              <span>{release.registry} · {release.status}</span>
              <h3>{release.product}</h3>
              <code>{release.name}@{release.version}</code>
              <p>{release.description}</p>
              <b>Open package ↗</b>
            </a>
          ))}
        </div>
        <Link className="button" to="/changelog/">See all packages and release news ↗</Link>
      </div></section>

      <section className="v4-new section" id="new-releases"><div className="wrap4">
        <div className="v4-heading">
          <div><div className="eyebrow">DISCOVER / RECENTLY HIGHLIGHTED</div><h2>Fresh from<br /><em>the lab.</em></h2></div>
          <p>Recently highlighted on the public Lorapok product catalog. “New” reflects the published catalog label, not an unverified launch date.</p>
        </div>
        <div className="v4-new-grid">
          <a className="v4-release reveal" href="https://smilo.lorapok.tech/" target="_blank" rel="noopener noreferrer"><span className="v4-badge">NEW ON CATALOG</span><div className="v4-relic"><ProjectGlyph project={{ name: 'Smilo', category: 'Sensory & Hardware' }} size={112} strokeWidth={1.15} /></div><h3>Smilo</h3><p>A modular Rust camera engine and creative studio with real-time filters and smile-triggered capture.</p><span className="v4-release-foot">Explore Smilo <b>↗</b></span></a>
          <a className="v4-release v4-purple reveal" href="https://lorahost.lorapok.tech/" target="_blank" rel="noopener noreferrer"><span className="v4-badge">CLOUD / STOREFRONT</span><div className="v4-relic"><ProjectGlyph project={{ name: 'LoraHost', category: 'Developer Tools' }} size={112} strokeWidth={1.15} /></div><h3>LoraHost</h3><p>Hosting, domains and AI workspace options, with GPU workspaces explicitly described as early access.</p><span className="v4-release-foot">Explore LoraHost <b>↗</b></span></a>
          <a className="v4-release v4-yellow reveal" href="https://seeyou.lorapok.tech/" target="_blank" rel="noopener noreferrer"><span className="v4-badge">AGENTIC SEO</span><div className="v4-relic"><ProjectGlyph project={{ name: 'SeeYou', category: 'Developer Tools' }} size={112} strokeWidth={1.15} /></div><h3>SeeYou</h3><p>Audit crawler visibility, schema and answer-engine optimization with a technical-first workflow.</p><span className="v4-release-foot">Explore SeeYou <b>↗</b></span></a>
        </div>
      </div></section>

      {posts.length > 0 && (
        <section className="section soft"><div className="wrap4">
          <div className="v4-heading">
            <div><div className="eyebrow">LOLABO RESEARCH DESK</div><h2>Notes from<br /><em>the lab.</em></h2></div>
            <p>Engineering notes and deep dives. Generated posts are peer-reviewed and published only if they pass our quality gate.</p>
          </div>
          <div className="research-grid" style={{ marginTop: 0 }}>
            {posts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}/`} className="research-card reveal">
                <span className="product-tag">{p.source === 'ai-agent' ? 'LoLaBo · ' : ''}{p.category || 'Notes'}{p.readTime ? ` · ${p.readTime} min` : ''}</span>
                <h3>{p.title}</h3><p>{p.excerpt}</p><span className="more-link">Read ↗</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 44 }}><Link className="button" to="/blog/">Read the journal</Link></div>
        </div></section>
      )}

      <CommerceShowcase />

      <section className="v4-showcase" aria-label="Lorapok's creative product universe">
        <div className="v4-showcase-art" role="img" aria-label="Futuristic Lorapok products and mascot artwork" />
        <div className="v4-showcase-copy">
          <div className="eyebrow">ENGINEERING MEETS IMAGINATION</div>
          <h2>We don't just<br />ship software.<br /><em>We grow worlds.</em></h2>
          <p>Open infrastructure, sensory interfaces, agents and practical tools in one connected studio ecosystem.</p>
          <Link to="/projects/" className="button">Enter the ecosystem ↗</Link>
        </div>
      </section>

      <SignalNewsletter />

      <section className="section"><div className="wrap4"><div className="cta-band reveal">
        <h2>Build something<br />alive with us.</h2>
        <p style={{ fontSize: 21, maxWidth: 640 }}>Contribute to open source, hire the collective, or just say hello. We ship in public.</p>
        <div className="hero-actions"><Link className="button" style={{ background: '#061c17', color: '#67f5bb', boxShadow: '0 6px 0 #000' }} to="/contact/">Start a conversation</Link><Link className="button outline" to="/agents/">Explore Loragent skills</Link></div>
      </div></div></section>
    </div>
  );
}
