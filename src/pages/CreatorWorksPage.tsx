import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Frame, Palette } from "lucide-react";
import { getCreatorWorks, CREATOR_WORKS_CATEGORY } from "../data/lorapok";
import { getTeammateById } from "../data/team";
import { SEOHead } from "../components/SEOHead";
import { Card } from "../components/ui/Card";

const borshon = getTeammateById("borshon-mondol");

export default function CreatorWorksPage() {
  const works = useMemo(() => getCreatorWorks(), []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Creator Works — Lorapok Labs",
      description:
        "Studio sculpture, mixed-media installation, and folk craft by Lorapok collective creators. Selected works from Borshon Mondol, 3D Artist & Designer.",
      url: "https://lorapok.tech/creator-works",
      isPartOf: {
        "@type": "WebSite",
        name: "Lorapok Labs",
        url: "https://lorapok.tech",
      },
      about: works.map((work) => ({
        "@type": "CreativeWork",
        name: work.name,
        description: work.description,
        url: work.links[0]?.url,
        image: work.image ? `https://lorapok.tech${work.image}` : undefined,
        creator: borshon
          ? {
              "@type": "Person",
              name: borshon.name,
              url: "https://lorapok.tech/team",
            }
          : undefined,
      })),
    }),
    [works]
  );

  return (
    <>
      <SEOHead
        title="Creator Works — Studio Sculpture & 3D Art"
        description="Selected studio works in 3D art and design from Lorapok collective creators — figurative sculpture, kinetic installations, clay life studies, and Bengali folk craft."
        path="/creator-works"
        image="/assets/projects/borshon-frozen-liquidity.jpg"
        keywords="Creator Works, 3D art and design, sculpture, Borshon Mondol, Lorapok Labs, mixed media, figurative art, Dhaka"
        jsonLd={jsonLd}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
      >
        <header className="relative mb-14 md:mb-20 overflow-hidden rounded-3xl border border-[#f5d0c5]/20 bg-gradient-to-br from-[#1a1210]/90 via-[#0f0f16] to-[#0a0a0f] p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,208,197,0.12),transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,transparent_0%,#f5d0c5_50%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5d0c5]/10 border border-[#f5d0c5]/25 text-[#f5d0c5] text-xs font-mono uppercase tracking-[0.2em] mb-5">
                <Palette size={14} /> Creator Works · {CREATOR_WORKS_CATEGORY}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-4">
                Studio archive for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d0c5] via-[#fda4af] to-[#c084fc]">
                  physical craft
                </span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Open-source software lives beside material practice on Lorapok. This gallery highlights
                sculpture, installation, and heritage craft from collective creators — separate from our
                GitHub product catalog.
              </p>
            </div>

            {borshon && (
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 p-5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={borshon.avatar}
                    alt={borshon.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#f5d0c5]/30"
                  />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#f5d0c5]/80">Featured creator</p>
                    <p className="text-lg font-bold text-white">{borshon.name}</p>
                    <p className="text-sm text-gray-400">{borshon.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/team"
                    className="text-xs font-mono px-4 py-2 rounded-full border border-white/15 text-white hover:border-[#f5d0c5]/50 transition-colors"
                  >
                    Team profile
                  </Link>
                  <a
                    href="https://borshon.lorapok.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono px-4 py-2 rounded-full bg-[#f5d0c5]/15 text-[#f5d0c5] border border-[#f5d0c5]/30 hover:bg-[#f5d0c5]/25 transition-colors inline-flex items-center gap-1.5"
                  >
                    Studio site <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#fda4af] uppercase tracking-wider mb-1">
              <Frame size={14} /> {works.length} selected works
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Material studies & installations</h2>
          </div>
          <Link
            to="/projects?category=3d-art-design"
            className="text-[#f5d0c5] hover:underline flex items-center gap-1.5 font-mono text-sm"
          >
            Filter in product catalog <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <Card project={project} />
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          Images and descriptions are sourced from each creator&apos;s public studio site. Works remain the
          property of the artist unless otherwise noted.
        </p>
      </motion.div>
    </>
  );
}
