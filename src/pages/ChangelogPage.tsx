import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  Flag,
  GitBranch,
  PackageCheck,
  Rocket,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { changelog } from '../data/changelog';
import {
  packageReleases,
  registrySnapshotDate,
  type PackageRegistry,
  type PackageRelease,
} from '../data/packageReleases';
import { SEOHead } from '../components/SEOHead';
import PageIntro from '../components/layout/PageIntro';
import PageMascotFeature from '../components/layout/PageMascotFeature';

const typeConfig = {
  launch: { icon: Rocket, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  feature: { icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  fix: { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  milestone: { icon: Flag, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
};

const registryOrder: PackageRegistry[] = ['npm', 'Packagist'];
const uniqueProducts = new Set(packageReleases.map((release) => release.product)).size;

const releaseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://lorapok.tech/changelog/#page',
  name: 'Lorapok Labs Releases & Package Registry',
  url: 'https://lorapok.tech/changelog/',
  description: 'Verified npm and Packagist packages plus the public Lorapok Labs release history.',
  dateModified: registrySnapshotDate,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: packageReleases.length,
    itemListElement: packageReleases.map((release, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: release.name,
        version: release.version,
        description: release.description,
        ...(release.repositoryUrl ? { codeRepository: release.repositoryUrl } : {}),
        downloadUrl: release.registryUrl,
        license: 'https://opensource.org/license/mit',
        datePublished: release.publishedAt,
      },
    })),
  },
};

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
}).format(new Date(value));

function PackageReleaseCard({ release, copied, onCopy }: {
  release: PackageRelease;
  copied: boolean;
  onCopy: (release: PackageRelease) => void;
}) {
  return (
    <article className="registry-package-card">
      <div className="registry-package-card__head">
        <span className={`registry-mark registry-mark--${release.registry.toLowerCase()}`} aria-hidden="true">
          {release.registry === 'npm' ? 'npm' : 'P'}
        </span>
        <div>
          <span className="registry-package-card__product">{release.product}</span>
          <h3>{release.name}</h3>
        </div>
        <span className={`registry-status registry-status--${release.status.toLowerCase()}`}>
          <BadgeCheck size={13} /> {release.status}
        </span>
      </div>

      <p>{release.description}</p>

      <dl className="registry-package-facts">
        <div><dt>Version</dt><dd>{release.version}</dd></div>
        <div><dt>Published</dt><dd>{formatDate(release.publishedAt)}</dd></div>
        <div><dt>License</dt><dd>{release.license}</dd></div>
      </dl>

      <div className="registry-install">
        <code>{release.install}</code>
        <button type="button" onClick={() => onCopy(release)} aria-label={`Copy install command for ${release.name}`}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="registry-package-links">
        <a href={release.registryUrl} target="_blank" rel="noopener noreferrer">
          {release.registry} <ExternalLink size={14} />
        </a>
        {release.repositoryUrl && (
          <a href={release.repositoryUrl} target="_blank" rel="noopener noreferrer">
            Source <GitBranch size={14} />
          </a>
        )}
        {release.productUrl && (
          <a href={release.productUrl} target="_blank" rel="noopener noreferrer">
            Product <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ChangelogPage() {
  const [copiedPackage, setCopiedPackage] = useState('');
  const sortedChangelog = [...changelog].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const copyInstall = async (release: PackageRelease) => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(release.install);
      copied = true;
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = release.install;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.appendChild(fallback);
      fallback.select();
      try {
        copied = document.execCommand('copy');
      } finally {
        fallback.remove();
      }
    }

    if (copied) {
      setCopiedPackage(`${release.registry}:${release.name}`);
      window.setTimeout(() => setCopiedPackage(''), 1800);
    } else {
      setCopiedPackage('');
    }
  };

  return (
    <>
      <SEOHead
        title="Releases & Package Registry"
        description="Verified Lorapok Labs packages on npm and Packagist, with install commands, current versions, source links, release dates, and the studio changelog."
        path="/changelog/"
        keywords="Lorapok npm packages, Lorapok Packagist, Loragent npm, ReportKit Laravel, Lorapok releases, package registry"
        jsonLd={releaseJsonLd}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="v4-inner-page release-newsroom"
      >
        <div className="release-newsroom__intro">
          <PageIntro
            align="center"
            tone="gold"
            eyebrow="RELEASE NEWSROOM / VERIFIED REGISTRIES"
            title={<>Published in public.<br /><em>Verified at the source.</em></>}
            description="Every active Lorapok package currently verified through the npm and Packagist registry APIs, followed by the wider studio release record."
          />

          <PageMascotFeature
            image="/assets/ribo/inner-pages/release-historian.webp"
            alt="Release Historian, Lorapok's 3D changelog archivist"
            eyebrow="ARCHIVE SIGNAL / PACKAGE INTELLIGENCE"
            title="One source of truth for every public package"
            body="The Release Historian records exact package names, versions, maturity, install commands and every available public source link—so announcements stay useful long after launch day."
            tone="gold"
            referenceImage="/assets/projects/reportkit-laravel.svg"
            referenceAlt="ReportKit Laravel package registry artwork"
            referenceLabel="VERIFIED PACKAGE ROUTE"
          />
        </div>

        <section className="registry-overview" aria-labelledby="registry-title">
          <div className="registry-overview__copy">
            <span className="registry-overline"><PackageCheck size={15} /> LIVE REGISTRY SNAPSHOT</span>
            <h2 id="registry-title">The Lorapok package shelf</h2>
            <p>Only packages that resolve through the active public registry API are listed. Versions and publication dates reflect the registry record, not an estimated project launch date.</p>
            <span className="registry-checked">Last verified {formatDate(registrySnapshotDate)}</span>
          </div>
          <div className="registry-stats" aria-label="Package registry totals">
            <div><strong>{packageReleases.filter((item) => item.registry === 'npm').length}</strong><span>npm packages</span></div>
            <div><strong>{packageReleases.filter((item) => item.registry === 'Packagist').length}</strong><span>Packagist packages</span></div>
            <div><strong>{uniqueProducts}</strong><span>Product families</span></div>
          </div>
        </section>

        {registryOrder.map((registry) => {
          const releases = packageReleases.filter((release) => release.registry === registry);
          return (
            <section className="registry-group" key={registry} aria-labelledby={`${registry.toLowerCase()}-packages`}>
              <div className="registry-group__heading">
                <div>
                  <span>{registry === 'npm' ? 'JAVASCRIPT / NODE.JS' : 'PHP / COMPOSER'}</span>
                  <h2 id={`${registry.toLowerCase()}-packages`}>{registry}</h2>
                </div>
                <p>{releases.length} active {releases.length === 1 ? 'package' : 'packages'} · canonical registry links · verified public destinations</p>
              </div>
              <div className="registry-package-grid">
                {releases.map((release) => {
                  const releaseKey = `${release.registry}:${release.name}`;
                  return (
                    <PackageReleaseCard
                      key={releaseKey}
                      release={release}
                      copied={copiedPackage === releaseKey}
                      onCopy={copyInstall}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="release-timeline" aria-labelledby="release-history-title">
          <div className="release-timeline__heading">
            <span>PRODUCTS / PEOPLE / INFRASTRUCTURE</span>
            <h2 id="release-history-title">The wider ship log</h2>
            <p>Package releases sit inside a larger record of launches, improvements, infrastructure milestones, and collective work.</p>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
            {sortedChangelog.map((entry) => {
              const config = typeConfig[entry.type as keyof typeof typeConfig] || typeConfig.feature;
              const Icon = config.icon;

              return (
                <motion.article
                  key={`${entry.date}-${entry.product}-${entry.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="relative pl-8 md:pl-12 release-timeline__entry"
                >
                  <div className={`absolute -left-3.5 top-1 p-1.5 rounded-full border bg-[#0a0a0f] ${config.border} ${config.color}`}>
                    <Icon size={14} />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <time dateTime={entry.date} className="text-sm font-mono text-gray-500">
                      {formatDate(entry.date)}
                    </time>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border} w-max`}>
                      {entry.product}{entry.version ? ` · ${entry.version}` : ''}
                    </span>
                  </div>

                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>

                  {entry.links && entry.links.length > 0 && (
                    <div className="release-timeline__links">
                      {entry.links.map((link) => (
                        <a key={`${entry.title}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}<ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </section>
      </motion.div>
    </>
  );
}
