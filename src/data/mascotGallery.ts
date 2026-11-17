export const sanctuarySpecies = [
  { id: 'vaultie', name: 'Vaultie', role: 'Scavenger / code keeper', signal: 'Charcoal armor · cyan bio-streams' },
  { id: 'apex-sovereign', name: 'Instar-6 Apex', role: 'Sovereign / release guardian', signal: 'Golden shell · amber crown energy' },
  { id: 'neon-scout', name: 'Neon Scout', role: 'Explorer / low-latency runner', signal: 'Lime armor · cyan speed channels' },
  { id: 'deep-diver', name: 'Deep Diver', role: 'Research wizard / AI navigator', signal: 'Cyber purple · orbiting MCP nodes' },
  { id: 'robo-worker', name: 'Robo-Worker', role: 'Infrastructure / resilient scaler', signal: 'Titanium slate · modular utility claws' },
] as const;

export const characterCollection = [
  { id: 'labs-research-director', family: 'Labs', name: 'Research Director', role: 'Biology · AI research' },
  { id: 'labs-open-source-builder', family: 'Labs', name: 'Open Source Builder', role: 'Engineering · modular systems' },
  { id: 'labs-community-orchestrator', family: 'Labs', name: 'Community Orchestrator', role: 'Collaboration · connected signals' },
  { id: 'automate-care-coordinator', family: 'Automate', name: 'Care Coordinator', role: 'Safe clinical workflows' },
  { id: 'automate-recovery-guide', family: 'Automate', name: 'Recovery Guide', role: 'Resilience · responsible recovery' },
  { id: 'lorahost-cloud-navigator', family: 'LoraHost', name: 'Cloud Navigator', role: 'Hosting · global delivery' },
  { id: 'lorahost-server-guardian', family: 'LoraHost', name: 'Server Guardian', role: 'Infrastructure · protection' },
  { id: 'lolabo-research-engine', family: 'LoLaBo', name: 'Research Engine', role: 'Evidence · citation synthesis' },
  { id: 'system-guide', family: 'System', name: 'System Guide', role: 'AI assistant · product navigation' },
  { id: 'release-conductor', family: 'Labs', name: 'Release Conductor', role: 'Publishing · launch orchestration' },
] as const;

export const archiveArtwork = [
  {
    id: 'larry-character-study',
    title: 'Larry character study',
    era: 'Original character language',
    path: '/assets/ribo/archive/larry-character-study.webp',
    alt: 'Original Larry the Larvae character study showing front, side, back and expressive poses',
    note: 'The friendly green larvae silhouette, glasses and expressive pose language that shaped the earliest mascot direction.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/Mascot Character Design.png',
  },
  {
    id: 'larry-turnaround-moods',
    title: 'Turnaround & moods',
    era: 'Expression system',
    path: '/assets/ribo/archive/larry-turnaround-moods.webp',
    alt: 'Larry the Larvae turnaround and mood board with working, happy, alert, confused, excited and sleeping poses',
    note: 'A wider expression sheet that established the mascot as a useful guide rather than a decorative logo.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/gMascot Character Design_angles.png',
  },
  {
    id: 'leaf-panel-mascot',
    title: 'Leaf-panel Ribo',
    era: 'Living interface era',
    path: '/assets/ribo/archive/leaf-panel-mascot.webp',
    alt: 'Polished Lorapok Ribo mascot with translucent green leaf panels and bioluminescent cyan details',
    note: 'The production-ready biological interface form: segmented body, leaf antennae and glowing sensory panels.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/Master_Brand_Pack_v3/lorapok-mascot-transparent-4096.png',
  },
  {
    id: 'instar-biological-poster',
    title: 'Instar biological poster',
    era: 'Cyber-biological product world',
    path: '/assets/ribo/archive/instar-biological-poster.webp',
    alt: 'Dark cyber-biological Lorapok Instar poster featuring a luminous armored larva',
    note: 'A darker armored interpretation built for the Instar media-player universe and high-energy product storytelling.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/lorapok-instar-poster_transparent.png',
  },
  {
    id: 'metamorphosis-stages',
    title: 'Biological metamorphosis',
    era: 'Six-stage evolution',
    path: '/assets/ribo/archive/metamorphosis-stages.webp',
    alt: 'Lorapok biological metamorphosis storyboard showing six increasingly complex larva stages',
    note: 'The visual origin of the evolving-species idea: products and characters mature through visible operational stages.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/storyboard-03-instar-growth.png',
  },
  {
    id: 'electric-larva',
    title: 'Electric larva',
    era: 'Experimental signal',
    path: '/assets/ribo/archive/electric-larva.webp',
    alt: 'Electric Lorapok larva mascot with green and cyan luminous accents on a dark background',
    note: 'An experimental signal-forward form that connects the playful mascot archive with Lorapok’s neon systems language.',
    source: '/mnt/NewVolume/Personal_Projects/Lorapok Labs Asset/Electric_lorapok.png',
  },
] as const;

export type ArchiveArtwork = (typeof archiveArtwork)[number];
