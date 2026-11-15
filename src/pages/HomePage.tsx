import { useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';
import { brand, projects } from '../data/lorapok';
import { HeroSection } from '../components/home/HeroSection';
import { StatsStrip } from '../components/home/StatsStrip';
import { EcosystemSection } from '../components/home/EcosystemSection';
import { ResearchSection } from '../components/home/ResearchSection';
import { CloudSection } from '../components/home/CloudSection';
import { ClosingSection } from '../components/home/ClosingSection';
import { useReveal } from '../components/home/useReveal';
import '../styles/home.css';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Lorapok Labs',
      url: 'https://lorapok.tech',
      description: 'Open-source products, AI agent skills, and Creator Works in 3D art and design from the Lorapok collective.',
    },
    {
      '@type': 'Organization',
      name: 'Lorapok Labs',
      url: 'https://lorapok.tech',
      logo: 'https://lorapok.tech/assets/lorapok-labs-logo.png',
      sameAs: ['https://github.com/Lorapok', 'https://github.com/Maijied', 'https://x.com/LorapokLabs'],
    },
  ],
};

export default function HomePage() {
  useEffect(() => {
    document.title = `${brand.name} | ${brand.tagline}`;
  }, []);
  useReveal();

  return (
    <div className="lp-home flex flex-col gap-24">
      <SEOHead
        title="Open-source Products That Feel Alive"
        description="Lorapok Labs ships open-source software, 224 Loragent skills, and Creator Works in 3D art and design — biological UI, sensory computing, and practical engineering from Dhaka."
        path="/"
        image="/assets/lorapok-labs-logo.png"
        keywords="Lorapok Labs, open source, Creator Works, 3D art and design, Loragent, developer tools, sensory computing, biological UI, LoLaBo"
        jsonLd={homeJsonLd}
      />
      <HeroSection productCount={projects.length} />
      <StatsStrip productCount={projects.length} />
      <EcosystemSection />
      <ResearchSection />
      <CloudSection />
      <ClosingSection />
    </div>
  );
}
