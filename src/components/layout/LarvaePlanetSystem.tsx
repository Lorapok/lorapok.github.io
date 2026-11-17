import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const routeCompanions: Record<string, string> = {
  '/projects': 'ecosystem-cartographer',
  '/agents': 'formation-commander',
  '/blog': 'documentation-librarian',
  '/team': 'collective-facilitator',
  '/about': 'collective-facilitator',
  '/changelog': 'release-historian',
  '/contact': 'communications-concierge',
};

const orbiters = [
  '/assets/ribo/species/neon-scout.webp',
  '/assets/ribo/species/deep-diver.webp',
  '/assets/ribo/species/robo-worker.webp',
];

export default function LarvaePlanetSystem() {
  const { pathname } = useLocation();
  const centerImage = useMemo(() => {
    if (pathname.startsWith('/mascots')) return '/assets/ribo/species/apex-sovereign.webp';
    if (pathname.startsWith('/partners')) return '/assets/ribo/generated/20261117/founder-navigator.webp';
    const match = Object.entries(routeCompanions).find(([route]) => pathname.startsWith(route));
    return match
      ? `/assets/ribo/inner-pages/${match[1]}.webp`
      : '/assets/ribo/ribo-exploring.webp';
  }, [pathname]);

  return (
    <div className="larvae-planet-system" aria-hidden="true">
      <span className="larvae-planet-system__signal" />
      <span className="larvae-planet-system__ring larvae-planet-system__ring--outer">
        <span className="larvae-planet-system__satellite satellite-a"><img src={orbiters[0]} alt="" decoding="async" /></span>
      </span>
      <span className="larvae-planet-system__ring larvae-planet-system__ring--middle">
        <span className="larvae-planet-system__satellite satellite-b"><img src={orbiters[1]} alt="" decoding="async" /></span>
      </span>
      <span className="larvae-planet-system__ring larvae-planet-system__ring--inner">
        <span className="larvae-planet-system__satellite satellite-c"><img src={orbiters[2]} alt="" decoding="async" /></span>
      </span>
      <span className="larvae-planet-system__core">
        <img key={centerImage} src={centerImage} alt="" decoding="async" />
      </span>
    </div>
  );
}
