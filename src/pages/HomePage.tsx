import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Users, ExternalLink, Activity } from 'lucide-react';
import { brand, philosophy, projects } from '../data/lorapok';
import { ecosystemStats } from '../data/ecosystem-stats';
import { teamMembers } from '../data/team';
import { StatsCounter } from '../components/ui/StatsCounter';
import { Card } from '../components/ui/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  useEffect(() => {
    document.title = `${brand.name} | ${brand.tagline}`;
  }, []);

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-24 py-16"
    >
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        <motion.span variants={itemVariants} className="text-lp-accent tracking-widest text-sm font-bold uppercase mb-4">
          LORAPOK LABS
        </motion.span>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          Open-source products that <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#67ff8f] to-cyan-400">feel alive.</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
          {brand.description}
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          <Link
            to="/projects"
            className="flex items-center gap-2 bg-[#67ff8f] text-[#0a0a0f] px-6 py-3 rounded-lg font-semibold hover:bg-[#52cc72] transition-colors"
          >
            Explore Products
            <ArrowRight size={20} />
          </Link>
          <a
            href="https://github.com/lorapok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Code2 size={20} />
            View on GitHub
          </a>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          <StatsCounter label="Products" value={ecosystemStats.totalProducts} />
          <StatsCounter label="Marketplaces" value={ecosystemStats.marketplaces} />
          <StatsCounter label="APIs" value={ecosystemStats.apisCatalogued} prefix="+" />
          <StatsCounter label="Repos" value={ecosystemStats.githubRepos} />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {philosophy.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/[0.07] transition-colors"
            >
              <div className="text-[#67ff8f] text-sm font-mono mb-3">{item.label}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-gray-400">Our most popular and impactful creations.</p>
          </div>
          <Link to="/projects" className="text-[#67ff8f] hover:underline flex items-center gap-1 mt-4 md:mt-0">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredProjects.map(project => (
            <motion.div key={project.name} variants={itemVariants}>
              <Card project={project} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Live Cloud Subdomains */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-white/[0.03] to-[#67ff8f]/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
                <Activity size={14} className="animate-pulse" /> Edge & Cloud Services
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Live lorapok.tech Subdomains</h2>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              Global CDN • Zero Latency
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Atlas Console", sub: "atlas.lorapok.tech", url: "https://atlas.lorapok.tech/", tag: "2.1k APIs" },
              { name: "Cursor Monitor", sub: "cursor.lorapok.tech", url: "https://cursor.lorapok.tech/", tag: "Live Limits" },
              { name: "Loragent AI", sub: "loragent.lorapok.tech", url: "https://loragent.lorapok.tech/", tag: "Multi-Agent" },
              { name: "Media Engine", sub: "media.lorapok.tech", url: "https://media.lorapok.tech/", tag: "Sensory UI" },
              { name: "AI Coding Agent", sub: "ai.lorapok.tech", url: "https://ai.lorapok.tech/", tag: "Autonomous" },
            ].map((sub) => (
              <a
                key={sub.sub}
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#67ff8f]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#67ff8f]">
                      <span className="w-2 h-2 rounded-full bg-[#67ff8f] animate-ping" />
                      ONLINE
                    </span>
                    <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#67ff8f] transition-colors">{sub.name}</h3>
                  <p className="text-xs font-mono text-gray-400">{sub.sub}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>{sub.tag}</span>
                  <span className="text-[#67ff8f] group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Collective & Team Spotlight */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
              <Users size={14} /> Open-Source Collective
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Minds Behind Lorapok</h2>
            <p className="text-gray-400 max-w-xl">
              Systems architects, AI researchers, clinical specialists, speech pathologists, and creative storytellers collaborating on open technology.
            </p>
          </div>
          <Link
            to="/team"
            className="text-[#67ff8f] hover:underline flex items-center gap-1.5 mt-4 md:mt-0 text-sm font-mono"
          >
            Meet Full Collective & View CVs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {teamMembers.map((member) => (
            <Link
              key={member.id}
              to="/team"
              className="group p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#67ff8f]/40 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 mb-3 bg-white/5 group-hover:border-[#67ff8f]/50 transition-colors">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0a0a0f&color=67ff8f&size=128`;
                  }}
                />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#67ff8f] transition-colors truncate w-full">
                {member.name.split(' ')[0]} {member.name.split(' ').slice(-1)[0]}
              </h4>
              <p className="text-[10px] font-mono text-gray-400 truncate w-full mt-0.5">
                {member.department.split('&')[0]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="px-4 text-center max-w-4xl mx-auto pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Available Everywhere</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {ecosystemStats.platforms.map((platform, idx) => (
              <a 
                key={idx} 
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:border-[#67ff8f]/50 transition-colors"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
