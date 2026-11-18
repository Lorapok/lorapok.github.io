export type PackageRegistry = 'npm' | 'Packagist';

export type PackageRelease = {
  name: string;
  product: string;
  registry: PackageRegistry;
  version: string;
  publishedAt: string;
  description: string;
  status: 'Stable' | 'Beta';
  license: string;
  install: string;
  registryUrl: string;
  repositoryUrl?: string;
  productUrl?: string;
};

// Verified against the public npm registry and Packagist APIs on 2026-11-18.
// Only packages that resolve through the active registry API belong in this list.
export const packageReleases: PackageRelease[] = [
  {
    name: 'lorapok-nocatch',
    product: 'NoCatch',
    registry: 'npm',
    version: '2.0.0',
    publishedAt: '2026-10-19T06:01:13.479Z',
    description: 'Universal Google NotebookLM media and artifact harvester by Lorapok Labs.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install lorapok-nocatch',
    registryUrl: 'https://www.npmjs.com/package/lorapok-nocatch',
    repositoryUrl: 'https://github.com/Lorapok/nocatch',
    productUrl: 'https://nocatch.lorapok.tech',
  },
  {
    name: 'lorapok/nocatch',
    product: 'NoCatch',
    registry: 'Packagist',
    version: '2.0.0',
    publishedAt: '2026-10-19T03:12:42+00:00',
    description: 'Composer distribution of the Lorapok Labs NotebookLM media and artifact harvester.',
    status: 'Stable',
    license: 'MIT',
    install: 'composer require lorapok/nocatch',
    registryUrl: 'https://packagist.org/packages/lorapok/nocatch',
    repositoryUrl: 'https://github.com/Lorapok/nocatch',
    productUrl: 'https://nocatch.lorapok.tech',
  },
  {
    name: 'loragent',
    product: 'Loragent',
    registry: 'npm',
    version: '2.0.1',
    publishedAt: '2026-10-11T00:06:31.154Z',
    description: 'A 224-agent virtual software firm with six formations, MCP integration, and autonomous multi-agent orchestration.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install loragent',
    registryUrl: 'https://www.npmjs.com/package/loragent',
    productUrl: 'https://loragent.lorapok.tech',
  },
  {
    name: '@lorapok-labs/reportkit-ui',
    product: 'ReportKit',
    registry: 'npm',
    version: '0.1.1-beta.11',
    publishedAt: '2026-08-09T21:12:24.906Z',
    description: 'ReportKit browser UI with CAS design tokens, sync and async loaders, and DataTables mount helpers.',
    status: 'Beta',
    license: 'MIT',
    install: 'npm install @lorapok-labs/reportkit-ui@beta',
    registryUrl: 'https://www.npmjs.com/package/@lorapok-labs/reportkit-ui',
    productUrl: 'https://reportkit.lorapok.tech',
  },
  {
    name: 'reportkit/laravel',
    product: 'ReportKit',
    registry: 'Packagist',
    version: '0.1.1-beta.1',
    publishedAt: '2026-08-09T20:01:28+00:00',
    description: 'Laravel 5.5–13 adapter for ReportKit with a service provider, Blade CAS pack, and report scaffolding command.',
    status: 'Beta',
    license: 'MIT',
    install: 'composer require reportkit/laravel:^0.1@beta',
    registryUrl: 'https://packagist.org/packages/reportkit/laravel',
    productUrl: 'https://reportkit.lorapok.tech',
  },
  {
    name: 'reportkit/laravel-legacy',
    product: 'ReportKit',
    registry: 'Packagist',
    version: '0.1.1-beta.1',
    publishedAt: '2026-08-09T20:01:28+00:00',
    description: 'Laravel 4.1–5.4 adapter for ReportKit, preserving a supported route for legacy applications.',
    status: 'Beta',
    license: 'MIT',
    install: 'composer require reportkit/laravel-legacy:^0.1@beta',
    registryUrl: 'https://packagist.org/packages/reportkit/laravel-legacy',
    productUrl: 'https://reportkit.lorapok.tech',
  },
  {
    name: 'lorapok-atlas-mcp',
    product: 'Lorapok Atlas',
    registry: 'npm',
    version: '1.0.0',
    publishedAt: '2026-05-03T18:17:52.017Z',
    description: 'MCP server that gives compatible AI assistants access to the Lorapok Atlas catalog of 2,100+ APIs.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install lorapok-atlas-mcp',
    registryUrl: 'https://www.npmjs.com/package/lorapok-atlas-mcp',
    productUrl: 'https://atlas.lorapok.tech',
  },
  {
    name: 'lorapok-atlas',
    product: 'Lorapok Atlas',
    registry: 'npm',
    version: '1.0.0',
    publishedAt: '2026-05-03T18:14:50.501Z',
    description: 'Programmatic access to a curated directory of more than 2,100 free and open-source APIs.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install lorapok-atlas',
    registryUrl: 'https://www.npmjs.com/package/lorapok-atlas',
    productUrl: 'https://atlas.lorapok.tech',
  },
  {
    name: 'roast-api',
    product: 'Roast as a Service',
    registry: 'npm',
    version: '1.5.0',
    publishedAt: '2026-02-17T23:43:32.197Z',
    description: 'JavaScript client for the CDN-backed developer roast API.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install roast-api',
    registryUrl: 'https://www.npmjs.com/package/roast-api',
  },
  {
    name: 'maizied/roast-api',
    product: 'Roast as a Service',
    registry: 'Packagist',
    version: '1.5.0',
    publishedAt: '2026-02-17T23:42:45+00:00',
    description: 'PHP client for the CDN-backed Roast as a Service API.',
    status: 'Stable',
    license: 'MIT',
    install: 'composer require maizied/roast-api',
    registryUrl: 'https://packagist.org/packages/maizied/roast-api',
  },
  {
    name: '@maizied/roast-as-a-service',
    product: 'Roast as a Service',
    registry: 'npm',
    version: '1.0.4',
    publishedAt: '2026-02-07T21:47:42.851Z',
    description: 'Scoped JavaScript distribution of the static developer roast API client.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install @maizied/roast-as-a-service',
    registryUrl: 'https://www.npmjs.com/package/@maizied/roast-as-a-service',
  },
  {
    name: 'lorapok-player',
    product: 'Lorapok Media Player',
    registry: 'npm',
    version: '1.4.0',
    publishedAt: '2026-01-20T13:00:21.056Z',
    description: 'React media engine with HLS, DASH, hardware acceleration, and Lorapok organic-interface styling.',
    status: 'Stable',
    license: 'MIT',
    install: 'npm install lorapok-player',
    registryUrl: 'https://www.npmjs.com/package/lorapok-player',
    productUrl: 'https://media.lorapok.tech',
  },
];

export const registrySnapshotDate = '2026-11-18';
