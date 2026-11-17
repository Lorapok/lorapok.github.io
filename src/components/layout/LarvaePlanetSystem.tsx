import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

type PlanetVariant = 'intro' | 'scene' | 'feature' | 'creator' | 'editorial';

type PlanetConfig = {
  id: string;
  label: string;
  accent: string;
  center: string;
  orbiters: [string, string, string];
};

const PLANETS: Array<[string, PlanetConfig]> = [
  ['/creator-works', {
    id: 'creator', label: 'Creator studio planet', accent: '#f5b8c9',
    center: '/assets/ribo/generated/20261117/media-composer.webp',
    orbiters: ['/assets/ribo/generated/20261117/language-gardener.webp', '/assets/ribo/species/robo-worker.webp', '/assets/ribo/species/apex-sovereign.webp'],
  }],
  ['/projects', {
    id: 'products', label: 'Product ecosystem planet', accent: '#67f5bb',
    center: '/assets/ribo/inner-pages/ecosystem-cartographer.webp',
    orbiters: ['/assets/ribo/generated/20261117/signal-cartographer.webp', '/assets/ribo/collections/labs-open-source-builder.webp', '/assets/ribo/species/neon-scout.webp'],
  }],
  ['/partners', {
    id: 'partners', label: 'Partner constellation planet', accent: '#efcb74',
    center: '/assets/ribo/generated/20261117/founder-navigator.webp',
    orbiters: ['/assets/ribo/collections/labs-community-orchestrator.webp', '/assets/ribo/collections/lorahost-cloud-navigator.webp', '/assets/ribo/generated/20261117/language-gardener.webp'],
  }],
  ['/agents', {
    id: 'agents', label: 'Agent command planet', accent: '#c5adff',
    center: '/assets/ribo/inner-pages/formation-commander.webp',
    orbiters: ['/assets/ribo/generated/20261117/ai-orchestrator.webp', '/assets/ribo/collections/lolabo-research-engine.webp', '/assets/ribo/collections/system-guide.webp'],
  }],
  ['/blog', {
    id: 'lolabo', label: 'LoLaBo research planet', accent: '#8de7ff',
    center: '/assets/ribo/collections/lolabo-research-engine.webp',
    orbiters: ['/assets/ribo/inner-pages/documentation-librarian.webp', '/assets/ribo/generated/20261117/ai-orchestrator.webp', '/assets/ribo/generated/20261117/signal-cartographer.webp'],
  }],
  ['/team', {
    id: 'team', label: 'Collective studio planet', accent: '#efcb74',
    center: '/assets/ribo/inner-pages/collective-facilitator.webp',
    orbiters: ['/assets/ribo/collections/labs-research-director.webp', '/assets/ribo/collections/labs-open-source-builder.webp', '/assets/ribo/collections/labs-community-orchestrator.webp'],
  }],
  ['/about', {
    id: 'about', label: 'Lorapok origin planet', accent: '#67f5bb',
    center: '/assets/ribo/generated/20261117/founder-navigator.webp',
    orbiters: ['/assets/ribo/collections/labs-research-director.webp', '/assets/ribo/collections/labs-open-source-builder.webp', '/assets/ribo/collections/labs-community-orchestrator.webp'],
  }],
  ['/changelog', {
    id: 'releases', label: 'Release history planet', accent: '#8de7ff',
    center: '/assets/ribo/inner-pages/release-historian.webp',
    orbiters: ['/assets/ribo/collections/release-conductor.webp', '/assets/ribo/generated/20261117/media-composer.webp', '/assets/ribo/species/vaultie.webp'],
  }],
  ['/contact', {
    id: 'contact', label: 'Communications planet', accent: '#f5b8c9',
    center: '/assets/ribo/inner-pages/communications-concierge.webp',
    orbiters: ['/assets/ribo/collections/labs-community-orchestrator.webp', '/assets/ribo/generated/20261117/founder-navigator.webp', '/assets/ribo/generated/20261117/signal-cartographer.webp'],
  }],
  ['/privacy', {
    id: 'privacy', label: 'Privacy guardian planet', accent: '#8de7ff',
    center: '/assets/ribo/generated/20261117/vault-guardian.webp',
    orbiters: ['/assets/ribo/roles/network-guardian.webp', '/assets/ribo/species/vaultie.webp', '/assets/ribo/collections/system-guide.webp'],
  }],
  ['/terms', {
    id: 'terms', label: 'Trust and terms planet', accent: '#d4ccff',
    center: '/assets/ribo/roles/network-guardian.webp',
    orbiters: ['/assets/ribo/generated/20261117/vault-guardian.webp', '/assets/ribo/species/vaultie.webp', '/assets/ribo/collections/system-guide.webp'],
  }],
];

function getPlanet(pathname: string) {
  return PLANETS.find(([route]) => pathname.startsWith(route))?.[1] ?? PLANETS[1][1];
}

export default function LarvaePlanetSystem({ variant = 'intro' }: { variant?: PlanetVariant }) {
  const { pathname } = useLocation();
  const planet = getPlanet(pathname);
  const style = { '--planet-accent': planet.accent } as CSSProperties;

  return (
    <div
      key={`${planet.id}-${variant}`}
      className={`larvae-planet-system larvae-planet-system--${variant} larvae-planet-system--${planet.id}`}
      style={style}
      data-planet={planet.id}
      aria-hidden="true"
    >
      <div className="larvae-planet-system__stage">
        <span className="larvae-planet-system__atmosphere" />
        <span className="larvae-planet-system__signal" />
        {planet.orbiters.map((image, index) => (
          <span key={image} className={`larvae-planet-system__ring larvae-planet-system__ring--${['outer', 'middle', 'inner'][index]}`}>
            <span className="larvae-planet-system__satellite"><img src={image} alt="" decoding="async" /></span>
          </span>
        ))}
        <span className="larvae-planet-system__core">
          <span className="larvae-planet-system__core-glow" />
          <img src={planet.center} alt="" decoding="async" />
        </span>
        <span className="larvae-planet-system__caption"><i /> {planet.label}</span>
      </div>
    </div>
  );
}
