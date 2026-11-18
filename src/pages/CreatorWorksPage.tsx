import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Frame, Palette } from "lucide-react";
import { getCreatorWorks, type Project } from "../data/lorapok";
import { getTeammateById, type TeammateProfile } from "../data/team";
import { SEOHead } from "../components/SEOHead";
import { Card } from "../components/ui/Card";
import LarvaePlanetSystem from "../components/layout/LarvaePlanetSystem";

const borshon = getTeammateById("borshon-mondol");
const joy = getTeammateById("ashraf-joy");

type CreatorProfile = {
  profile: TeammateProfile;
  discipline: string;
  workUrl: string;
  workLabel: string;
};

const creators: CreatorProfile[] = [
  borshon
    ? {
        profile: borshon,
        discipline: "Sculpture · installation · heritage craft",
        workUrl: "https://borshon.lorapok.tech/",
        workLabel: "Open studio",
      }
    : null,
  joy
    ? {
        profile: joy,
        discipline: "Film · cinematography · visual direction",
        workUrl: "https://www.youtube.com/@Joy-rx8lo",
        workLabel: "Watch work",
      }
    : null,
].filter((creator): creator is CreatorProfile => creator !== null);

function getWorkCreator(work: Project) {
  return work.ownerAvatar === joy?.avatar ? joy : borshon;
}

export default function CreatorWorksPage() {
  const works = useMemo(() => getCreatorWorks(), []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Creator Works — Lorapok Labs",
      description:
        "Sculpture, installation, cinematography, documentary film, and visual direction by Lorapok collective creators Borshon Mondol and Ashraf Uddin Ahmed (Joy).",
      url: "https://lorapok.tech/creator-works/",
      isPartOf: {
        "@type": "WebSite",
        name: "Lorapok Labs",
        url: "https://lorapok.tech",
      },
      about: works.map((work) => {
        const creator = getWorkCreator(work);
        return {
          "@type": "CreativeWork",
          name: work.name,
          description: work.description,
          url: work.links[0]?.url,
          image: work.image ? `https://lorapok.tech${work.image}` : undefined,
          creator: creator
            ? {
                "@type": "Person",
                name: creator.name,
                url: "https://lorapok.tech/team/",
              }
            : undefined,
        };
      }),
    }),
    [works]
  );

  return (
    <>
      <SEOHead
        title="Creator Works — Physical Craft & Visual Stories"
        description="Selected work by Lorapok creators Borshon Mondol and Ashraf Uddin Ahmed (Joy), spanning sculpture, installations, Bengali folk craft, cinematography, documentary film, and AI-assisted visual direction."
        path="/creator-works/"
        image="/assets/projects/borshon-frozen-liquidity.jpg"
        keywords="Creator Works, Borshon Mondol, Ashraf Uddin Ahmed Joy, sculpture, cinematography, documentary film, visual direction, 3D art, Lorapok Labs, Dhaka"
        jsonLd={jsonLd}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="v4-inner-page py-12 px-4 max-w-7xl mx-auto w-full min-h-screen"
      >
        <header className="v4-creator-hero relative mb-14 md:mb-20 overflow-hidden rounded-3xl border border-[#f5d0c5]/20 bg-gradient-to-br from-[#1a1210]/90 via-[#0f0f16] to-[#0a0a0f]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,208,197,0.12),transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,transparent_0%,#f5d0c5_50%,transparent_100%)] pointer-events-none" />

          <div className="v4-creator-hero__layout">
            <div className="v4-creator-hero__copy">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5d0c5]/10 border border-[#f5d0c5]/25 text-[#f5d0c5] text-xs font-mono uppercase tracking-[0.2em] mb-5">
                <Palette size={14} /> Creator Works · Art, craft & moving image
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-4">
                Studio archive for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d0c5] via-[#fda4af] to-[#c084fc]">
                  crafted stories
                </span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Open-source software lives beside material and moving-image practice on Lorapok. This
                gallery brings sculpture, installation, heritage craft, documentary, and cinematic visual
                direction into one creator-led archive.
              </p>
            </div>

            <div className="v4-creator-hero__visual" aria-label="Animated Lorapok creator planet">
              <LarvaePlanetSystem variant="creator" />
              <span className="v4-creator-hero__signal">Two disciplines · one studio constellation</span>
            </div>
          </div>

          <div className="v4-creator-roster" aria-label="Featured creators">
            {creators.map(({ profile, discipline, workUrl, workLabel }) => (
              <div className="v4-creator-profile" key={profile.id}>
                <img src={profile.avatar} alt="" />
                <div className="v4-creator-profile__identity">
                  <span>{profile.status === "core" ? "Core creator" : "Creator"}</span>
                  <strong>{profile.name}</strong>
                  <p>{discipline}</p>
                </div>
                <div className="v4-creator-profile__actions">
                  <Link to="/team/">Team profile</Link>
                  <a href={workUrl} target="_blank" rel="noopener noreferrer">
                    {workLabel} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#fda4af] uppercase tracking-wider mb-1">
              <Frame size={14} /> {works.length} selected works
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Material studies & visual stories</h2>
          </div>
          <Link
            to="/projects/"
            className="text-[#f5d0c5] hover:underline flex items-center gap-1.5 font-mono text-sm"
          >
            Explore the full catalog <ArrowRight size={16} />
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
          Images and descriptions are sourced from each creator&apos;s public studio, portfolio, or published
          production. Works remain the property of their creators unless otherwise noted.
        </p>
      </motion.div>
    </>
  );
}
