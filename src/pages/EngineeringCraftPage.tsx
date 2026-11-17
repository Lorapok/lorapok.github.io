import { motion } from 'framer-motion';
import { ArrowUpRight, Database, GitMerge, Layers3, PackageCheck } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import PageIntro from '../components/layout/PageIntro';
import { Card } from '../components/ui/Card';
import { getEngineeringCraft } from '../data/lorapok';

const craft = getEngineeringCraft();
const flagship = craft.find((project) => project.name === 'ReportKit') ?? craft[0];
const suite = craft.filter((project) => project !== flagship);

const reportKitJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ReportKit',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'PHP 5.6–8.5; Laravel 4.1–13',
  url: 'https://reportkit.lorapok.tech/',
  image: 'https://lorapok.tech/assets/projects/reportkit-engineering-craft.webp',
  description: 'A multi-database reporting engine for fast reusable DataTables, spreadsheet, CSV, PDF, and email output.',
  author: {
    '@type': 'Organization',
    name: 'Lorapok Labs',
    url: 'https://lorapok.tech/',
  },
  license: 'https://opensource.org/license/mit',
  isAccessibleForFree: true,
};

const signals = [
  { value: '2', label: 'live + archive databases' },
  { value: '7', label: 'clear pipeline stages' },
  { value: '5.6 → 8.5', label: 'PHP compatibility' },
  { value: '4.1 → 13', label: 'Laravel compatibility' },
];

export default function EngineeringCraftPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="v4-inner-page py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
    >
      <SEOHead
        title="Engineering Craft — Systems Shaped With Intention"
        description="Explore ReportKit and selected Lorapok systems where architecture, performance, interaction, and visual clarity become one crafted engineering artifact."
        path="/engineering-craft/"
        image="/assets/projects/reportkit-engineering-craft.webp"
        keywords="Engineering Craft, ReportKit, multi-database reporting, Laravel reports, PHP reporting engine, Lorapok Labs"
        jsonLd={reportKitJsonLd}
      />

      <PageIntro
        eyebrow="ENGINEERING CRAFT · FEATURED SYSTEM"
        title={<>Where systems become <em>craft.</em></>}
        description={<>A collection for software shaped with equal attention to architecture, performance, interaction and visual clarity.</>}
      />

      {flagship && (
        <section className="mb-16 overflow-hidden rounded-[2rem] border border-[#67f5bb]/20 bg-[#071a15] shadow-[0_32px_90px_rgba(0,0,0,.32)]" aria-labelledby="reportkit-title">
          <div className="relative aspect-[16/9] overflow-hidden border-b border-[#67f5bb]/15 lg:aspect-[2.35/1]">
            <img
              src={flagship.image}
              alt="ReportKit multi-database report pipeline visualized as a crafted glass and metal system"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061c17]/75 via-transparent to-transparent" aria-hidden="true" />
            <span className="absolute left-5 top-5 rounded-full border border-[#67f5bb]/35 bg-[#061c17]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#67f5bb] backdrop-blur-md">
              Flagship engineering work
            </span>
          </div>

          <div className="grid gap-10 p-7 lg:grid-cols-[1.15fr_.85fr] lg:p-12">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#67f5bb]">ReportKit · Open source · MIT</p>
              <h2 id="reportkit-title" className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">Multi-DB reports that stay fast.</h2>
              <p className="max-w-3xl text-lg leading-8 text-[#b7d2c8]">
                ReportKit keeps SQL ownership in the host application while it handles validation, week-based planning, parallel fetching, merge and deduplication, reusable composition, and delivery. One prepared result can power DataTables, XLS, CSV, PDF, and email without another database pass.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="button" href="https://reportkit.lorapok.tech/" target="_blank" rel="noreferrer">Explore ReportKit <ArrowUpRight size={18} /></a>
                <a className="button outline" href="https://reportkit.lorapok.tech/demo" target="_blank" rel="noreferrer">Open live demo</a>
                <a className="button outline" href="https://github.com/Maijied/Reportkit-Core" target="_blank" rel="noreferrer">View source</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start">
              {signals.map((signal) => (
                <div key={signal.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <strong className="block text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">{signal.value}</strong>
                  <span className="mt-1 block text-sm leading-5 text-[#8faf9f]">{signal.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid border-t border-white/10 md:grid-cols-4">
            {[
              [Database, 'Host-owned SQL'],
              [Layers3, 'Week-sized planning'],
              [GitMerge, 'Merge + dedupe'],
              [PackageCheck, 'Compose once, deliver many'],
            ].map(([Icon, label]) => {
              const SignalIcon = Icon as typeof Database;
              return (
                <div key={label as string} className="flex items-center gap-3 border-b border-white/10 px-6 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <SignalIcon size={20} className="text-[#67f5bb]" />
                  <span className="text-sm font-medium text-[#cce0d8]">{label as string}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="suite-title">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#67f5bb]">THE COMPLETE SUITE</p>
          <h2 id="suite-title" className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">One system, built in public layers.</h2>
          <p className="mt-4 text-lg leading-8 text-[#9ab8ac]">Core engine, modern and legacy Laravel adapters, and the browser UI—each layer is independently useful and designed to work as one reporting surface.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {suite.map((project) => <Card key={project.name} project={project} />)}
        </div>
      </section>
    </motion.main>
  );
}
