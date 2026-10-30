import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code2, 
  Users, 
  ExternalLink, 
  Activity, 
  Bot, 
  Sparkles, 
  BookOpen, 
  Clock, 
  BookmarkCheck, 
  Radio, 
  Zap, 
  Layers,
  Terminal,
  ShieldCheck,
  Cpu,
  Star,
  DownloadCloud,
  Mail,
  Palette,
  Frame,
  Box,
  Server,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { brand, philosophy, projects, getCreatorWorks } from '../data/lorapok';
import { SEOHead } from '../components/SEOHead';
import { ecosystemStats } from '../data/ecosystem-stats';
import { teamMembers } from '../data/team';
import { StatsCounter } from '../components/ui/StatsCounter';
import { Card } from '../components/ui/Card';
import { ArchitectureBriefsModule } from '../components/home/ArchitectureBriefsModule';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DEFAULT_DISPATCHES = [
  {
    slug: "lorapok-atlas-public-api-directory",
    title: "Lorapok Atlas is a public directory for browsing open APIs",
    excerpt: "The Lorapok-API_Atlas repository describes a dashboard for browsing and live-testing public APIs.",
    type: "Product note",
    category: "Developer Tools",
    readTime: 4,
    citations: [],
    coverImage: "/assets/projects/atlas-social.jpg",
    author: { name: "Mohammad Maizied Hasan Majumder", designation: "Founder, Lorapok Labs", avatar: "/assets/founder-avatar.jpg" }
  },
  {
    slug: "cursor-curse-monitor-usage-dashboard",
    title: "Cursor Curse Monitor tracks Cursor usage on your machine",
    excerpt: "The extension README describes a local dashboard for Cursor limits, quota, and billing-cycle reset.",
    type: "Product note",
    category: "Developer Tools",
    readTime: 4,
    citations: [],
    coverImage: "/assets/projects/cursor-monitor-preview.png",
    author: { name: "Mohammad Maizied Hasan Majumder", designation: "Founder, Lorapok Labs", avatar: "/assets/founder-avatar.jpg" }
  },
  {
    slug: "loragent-skill-catalog",
    title: "Loragent ships a catalog of agent skill definitions",
    excerpt: "The Loragent repository is a multi-agent orchestration framework. This site counts 224 skill definitions in that catalog.",
    type: "Product note",
    category: "AI",
    readTime: 4,
    citations: [],
    coverImage: "/assets/projects/loragent-social.png",
    author: { name: "Mohammad Maizied Hasan Majumder", designation: "Founder, Lorapok Labs", avatar: "/assets/founder-avatar.jpg" }
  }
];

export default function HomePage() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    document.title = `${brand.name} | ${brand.tagline}`;
    fetch('/blog/posts.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const notes = data.filter((p) => p?.source === "manual" && (p.status || "published") === "published");
          setLatestPosts(notes.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const newProjects = projects.filter(p => p.isNew);
  const featuredProjects = projects.filter(p => p.featured && !p.isNew);
  const creatorWorksPreview = getCreatorWorks().slice(0, 3);
  const displayDispatches = latestPosts.length > 0 ? latestPosts : DEFAULT_DISPATCHES;

  const [homeSelectedCategory, setHomeSelectedCategory] = useState<string>("featured");

  const homeCategoryTabs = useMemo(() => [
    { id: 'featured', label: 'Featured Flagships', count: featuredProjects.length },
    { id: 'all', label: `All Products (${projects.length})`, count: projects.length },
    { id: 'Developer Tools', label: 'Dev Tools', count: projects.filter(p => p.category === 'Developer Tools').length },
    { id: 'Laravel/PHP', label: 'Laravel/PHP', count: projects.filter(p => p.category === 'Laravel/PHP').length },
    { id: 'AI', label: 'AI', count: projects.filter(p => p.category === 'AI').length },
    { id: 'Browser Extensions', label: 'Browser Extensions', count: projects.filter(p => p.category === 'Browser Extensions').length },
    { id: 'Sensory & Hardware', label: 'Hardware', count: projects.filter(p => p.category === 'Sensory & Hardware').length },
    { id: 'Desktop/Linux', label: 'Desktop/Linux', count: projects.filter(p => p.category === 'Desktop/Linux').length },
    { id: 'Games/Utilities', label: 'Games/Utilities', count: projects.filter(p => p.category === 'Games/Utilities').length },
    { id: 'Mobile Apps', label: 'Mobile Apps', count: projects.filter(p => p.category === 'Mobile Apps').length },
    { id: 'Media', label: 'Media', count: projects.filter(p => p.category === 'Media').length },
    { id: '3D Art & Design', label: '3D Art & Design', count: projects.filter(p => p.category === '3D Art & Design').length },
  ], [featuredProjects.length]);

  const displayedProjects = useMemo(() => {
    if (homeSelectedCategory === 'featured') {
      return featuredProjects;
    }
    if (homeSelectedCategory === 'all') {
      return projects;
    }
    return projects.filter(
      (p) => p.category.toLowerCase() === homeSelectedCategory.toLowerCase()
    );
  }, [homeSelectedCategory, featuredProjects]);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Lorapok Labs',
        url: 'https://lorapok.tech',
        description:
          'Open-source products, AI agent skills, and Creator Works in 3D art and design from Lorapok collective.',
      },
      {
        '@type': 'Organization',
        name: 'Lorapok Labs',
        url: 'https://lorapok.tech',
        logo: 'https://lorapok.tech/assets/lorapok-labs-logo.png',
        sameAs: [
          'https://github.com/Lorapok',
          'https://github.com/Maijied',
          'https://x.com/LorapokLabs',
        ],
      },
    ],
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-24 py-12"
    >
      <SEOHead
        title="Open-source Products That Feel Alive"
        description="Lorapok Labs ships open-source software, 224 Loragent skills, and Creator Works in 3D art and design — biological UI, sensory computing, and practical engineering from Dhaka."
        path="/"
        image="/assets/lorapok-labs-logo.png"
        keywords="Lorapok Labs, open source, Creator Works, 3D art and design, Loragent, developer tools, sensory computing, biological UI, LoLaBo"
        jsonLd={homeJsonLd}
      />
      {/* ─── Hero Section ─── */}
      <section className="relative flex flex-col items-center text-center px-4 max-w-5xl mx-auto pt-6 pb-2">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-b from-[#67ff8f]/15 via-[#38bdf8]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Live Status Beacon Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#67ff8f] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#67ff8f]" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#67ff8f] uppercase">
            OPEN-SOURCE LAB · PUBLIC GITHUB SNAPSHOT 14 OCT 2026
          </span>
        </motion.div>

        {/* Master Headline */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-white leading-[1.06]">
          Open-source systems that <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#67ff8f] via-[#38bdf8] to-[#c084fc]">
            feel alive.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-base sm:text-xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed">
          Lorapok Labs builds open-source developer tools, media apps, and the Loragent catalog of {ecosystemStats.agentSkillDefinitions} agent skill definitions. Counts below are the public GitHub snapshot from {ecosystemStats.snapshotDate}.
        </motion.p>

        {/* Elevated Social Proof & Ecosystem Traction (Above the Fold) */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-gray-400 mb-8 py-2.5 px-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-inner"
        >
          <a 
            href="https://github.com/Maijied" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 text-gray-300 hover:text-[#67ff8f] transition-colors"
          >
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{ecosystemStats.maijiedPublicRepos}</span>
            <span>@Maijied public repos</span>
          </a>
          <span className="text-white/20 hidden sm:inline">•</span>
          <a
            href="https://github.com/Maijied"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-300 hover:text-[#67ff8f] transition-colors"
          >
            <Users size={14} className="text-purple-400" />
            <span className="font-bold text-white">{ecosystemStats.maijiedFollowers}</span>
            <span>@Maijied followers</span>
          </a>
          <span className="text-white/20 hidden sm:inline">•</span>
          <a
            href="https://github.com/Lorapok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-300 hover:text-[#67ff8f] transition-colors"
          >
            <DownloadCloud size={14} className="text-[#38bdf8]" />
            <span className="font-bold text-white">{ecosystemStats.lorapokPublicRepos}</span>
            <span>@Lorapok public repos</span>
          </a>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-[#67ff8f]">
            <ShieldCheck size={14} />
            <span>100% Open Source</span>
          </div>
        </motion.div>

        {/* Action Button Cluster with CRO Paired CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          <Link
            to="/projects"
            className="flex items-center gap-2 bg-[#67ff8f] text-[#0a0a0f] px-6 py-3.5 rounded-xl font-bold hover:bg-[#52cc72] transition-all shadow-[0_0_25px_rgba(103,255,143,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={18} />
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </Link>

          <a
            href="#architecture-briefs"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('architecture-briefs')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#67ff8f]/15 to-[#38bdf8]/15 border border-[#67ff8f]/40 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#67ff8f]/20 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(103,255,143,0.15)] group"
          >
            <Mail size={18} className="text-[#67ff8f] group-hover:scale-110 transition-transform" />
            <span>Get Weekly Engineering Digest</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#67ff8f]/20 text-[#67ff8f] font-bold">
              FREE
            </span>
          </a>
          
          <Link
            to="/blog"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/15 to-purple-600/10 border border-purple-500/30 text-purple-200 hover:text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-purple-500/20 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap size={18} className="text-purple-400" />
            <span>Product Notes</span>
          </Link>

          <Link
            to="/agents"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-md"
          >
            <Bot size={18} className="text-[#38bdf8]" />
            <span>{ecosystemStats.agentSkillDefinitions} Agent Skills</span>
          </Link>

          <a
            href="https://github.com/lorapok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-md"
          >
            <Code2 size={18} />
            <span>GitHub Collective</span>
          </a>
        </motion.div>
      </section>

      {/* ─── Developer Architecture Briefs Lead Magnet (Directly Below Hero) ─── */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <ArchitectureBriefsModule />
      </section>

      {/* ─── Ecosystem Telemetry Bar ─── */}
      <section className="px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto"
        >
          <StatsCounter label="@Maijied public repos" value={ecosystemStats.maijiedPublicRepos} />
          <StatsCounter label="@Maijied followers" value={ecosystemStats.maijiedFollowers} />
          <StatsCounter label="@Lorapok public repos" value={ecosystemStats.lorapokPublicRepos} />
          <StatsCounter label="Loragent skill definitions" value={ecosystemStats.agentSkillDefinitions} />
          <StatsCounter label="Distribution platforms" value={ecosystemStats.marketplaces} />
        </motion.div>
      </section>

      {/* ─── LoLaBo Autonomous Research Journal (Live Dispatches Showcase) ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-b from-[#0c0f1a] via-[#090b14] to-[#07080f] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient Cyber Light Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#67ff8f]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 relative z-10 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#67ff8f] animate-ping" />
                <BookOpen size={14} /> LoLaBo Product Notes
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Notes on real repositories
              </h2>
              <p className="text-gray-400 max-w-2xl text-sm sm:text-base mt-2 leading-relaxed">
                Short notes on public Lorapok and Maijied repositories: what each project is, the language GitHub reports, and the live or source link.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--lp-accent,#67ff8f)] text-black font-bold text-xs hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(103,255,143,0.25)]"
              >
                <span>Read the notes</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 border border-white/10 transition-colors"
                title="Syndication Feed"
              >
                <Radio size={14} className="text-[#f59e0b]" />
                <span>RSS Feed</span>
              </a>
            </div>
          </div>

          {/* 3-Column Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {displayDispatches.map((post: any) => {
              const citationsCount = Array.isArray(post.citations) ? post.citations.length : (post.citations ? 4 : 0);
              const formatType = post.type || "SYSTEMS RESEARCH";
              return (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-[#0d0f18] border border-white/5 hover:border-[var(--lp-accent,#67ff8f)]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(103,255,143,0.12)] flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-black/50">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">
                        {post.author?.avatar || "🧬"}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#67ff8f] border border-white/10">
                        {post.category || "Backend & Infrastructure"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-purple-300 border border-purple-500/30">
                        {formatType}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors mb-2.5 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-2">
                        {typeof post.author?.avatar === "string" && post.author.avatar.startsWith("/") ? (
                          <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-white/20" />
                        ) : (
                          <span className="text-base">🧬</span>
                        )}
                        <span className="text-gray-300 text-[11px] truncate max-w-[110px]">{post.author?.name || "Mohammad Maizied Hasan Majumder"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        {citationsCount > 0 && (
                          <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                            <BookmarkCheck size={11} className="text-purple-400" />
                            <span>{citationsCount} Cites</span>
                          </span>
                        )}
                        <span>{post.readTime || 8}m read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {newProjects.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
                <Sparkles size={14} /> Added from public repositories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">New products</h2>
              <p className="text-gray-400">Recent catalog additions with images taken from each project's own repo or site.</p>
            </div>
            <Link to="/projects" className="text-[#67ff8f] hover:underline flex items-center gap-1 mt-4 md:mt-0 font-mono text-sm">
              View all products <ArrowRight size={16} />
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {newProjects.map(project => (
              <motion.div key={project.name} variants={itemVariants}>
                <Card project={project} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ─── Featured Products & Category Explorer ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full" id="ecosystem-products">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
              <Layers size={14} /> Ecosystem Products ({projects.length} Active Catalog)
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {homeSelectedCategory === 'featured'
                ? 'Featured Products'
                : homeSelectedCategory === 'all'
                ? `All Products (${projects.length})`
                : `${homeSelectedCategory} (${displayedProjects.length})`}
            </h2>
            <p className="text-gray-400">
              {homeSelectedCategory === 'featured'
                ? 'Our most popular and impactful open-source creations.'
                : `Showing ${displayedProjects.length} products in ${homeSelectedCategory}.`}
            </p>
          </div>
          <Link to="/projects" className="text-[#67ff8f] hover:underline flex items-center gap-1 font-mono text-sm whitespace-nowrap">
            View full searchable catalog <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {homeCategoryTabs.map((tab) => {
            const isActive = homeSelectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHomeSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-[#67ff8f]/15 border-[#67ff8f] text-[#67ff8f] shadow-[0_0_15px_rgba(103,255,143,0.2)]'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#67ff8f]/20 text-[#67ff8f]' : 'bg-white/5 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div 
          key={homeSelectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedProjects.map(project => (
            <div key={project.name}>
              <Card project={project} />
            </div>
          ))}
        </motion.div>
        <div className="mt-10 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.04] hover:bg-[#67ff8f]/10 text-white hover:text-[#67ff8f] border border-white/10 hover:border-[#67ff8f]/40 font-mono text-sm transition-all duration-300 shadow-lg"
          >
            <span>Explore all {projects.length} products with live search & deep filters</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Creator Works (studio aesthetic) ─── */}
      {creatorWorksPreview.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl border border-[#f5d0c5]/15 bg-gradient-to-br from-[#1a1210]/80 via-[#0f0f16] to-[#0a0a0f] p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,208,197,0.14),transparent_50%)] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#fda4af] uppercase tracking-[0.18em] mb-1">
                    <Palette size={14} /> Creator Works
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">3D Art & Design</h2>
                  <p className="text-gray-400 max-w-xl">
                    Sculpture, installation, and heritage craft from Lorapok collective creators — curated apart from our software catalog.
                  </p>
                </div>
                <Link
                  to="/creator-works"
                  className="text-[#f5d0c5] hover:underline flex items-center gap-1 font-mono text-sm shrink-0"
                >
                  Open studio archive <ArrowRight size={16} />
                </Link>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {creatorWorksPreview.map((project, index) => (
                  <motion.div
                    key={project.name}
                    variants={itemVariants}
                    className={index === 0 ? 'md:col-span-2 md:row-span-1' : ''}
                  >
                    <Card project={project} />
                  </motion.div>
                ))}
              </motion.div>
              <p className="mt-8 text-center text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
                <Frame size={12} className="text-[#f5d0c5]/70" />
                Full gallery on{' '}
                <Link to="/creator-works" className="text-[#f5d0c5] hover:underline">
                  /creator-works
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── Live Cloud Subdomains ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-white/[0.03] to-[#67ff8f]/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
                <Activity size={14} className="animate-pulse" /> Edge & Cloud Services Network
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Live lorapok.tech Ecosystem Subdomains</h2>
            </div>
            <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              Cloudflare Anycast CDN • Zero Latency • Global Edge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
            {[
              { name: "SeeYou SEO", sub: "seeyou.lorapok.tech", url: "https://seeyou.lorapok.tech/", tag: "Agentic SEO & AEO" },
              { name: "Atlas Console", sub: "atlas.lorapok.tech", url: "https://atlas.lorapok.tech/", tag: "2,100+ Free APIs" },
              { name: "Cursor Monitor", sub: "cursor.lorapok.tech", url: "https://cursor.lorapok.tech/", tag: "Live AI Quota" },
              { name: "Loragent AI", sub: "loragent.lorapok.tech", url: "https://loragent.lorapok.tech/", tag: "Multi-Agent System" },
              { name: "Smilo Studio", sub: "smilo.lorapok.tech", url: "https://smilo.lorapok.tech/", tag: "Rust Camera Suite" },
              { name: "Linpad Editor", sub: "linpad.lorapok.tech", url: "https://linpad.lorapok.tech/", tag: "Minimalist Text" },
              { name: "Media Engine", sub: "media.lorapok.tech", url: "https://media.lorapok.tech/", tag: "Biological UI Player" },
              { name: "AI Coding Agent", sub: "ai.lorapok.tech", url: "https://ai.lorapok.tech/", tag: "Autonomous CLI" },
              { name: "AswitchI Launchpad", sub: "aswitchi.lorapok.tech", url: "https://aswitchi.lorapok.tech/", tag: "Ubuntu Switcher" },
              { name: "Bab.La Broadcast", sub: "babla.lorapok.tech", url: "https://babla.lorapok.tech/", tag: "Multi-Channel Post" },
              { name: "Bangla Keyboard", sub: "keyboard.lorapok.tech", url: "https://keyboard.lorapok.tech/", tag: "Bengali NLP Input" },
              { name: "LoraHost Cloud", sub: "lorahost.lorapok.tech", url: "https://lorahost.lorapok.tech/", tag: "Cloud Web Hosting" },
              { name: "HomeDyn OS", sub: "homedyn.lorapok.tech", url: "https://homedyn.lorapok.tech/", tag: "Hospitality Suite" },
              { name: "LoraCon Engine", sub: "loracon.lorapok.tech", url: "https://loracon.lorapok.tech/", tag: "Format & Unit Convert" },
              { name: "TabMan Manager", sub: "tabman.lorapok.tech", url: "https://tabman.lorapok.tech/", tag: "Memory Hibernation" },
              { name: "LocalSync Net", sub: "localsync.lorapok.tech", url: "https://localsync.lorapok.tech/", tag: "Local Router P2P" },
              { name: "Hazari Scoreboard", sub: "hazari.lorapok.tech", url: "https://hazari.lorapok.tech/", tag: "Glassmorphism Card" },
              { name: "Hadi Memoriam", sub: "hadi.lorapok.tech", url: "https://hadi.lorapok.tech/", tag: "Civic Memorial" },
              { name: "Lora Super-App", sub: "lora.lorapok.tech", url: "https://lora.lorapok.tech/", tag: "339+ Screen App" },
              { name: "NoCatch Harvester", sub: "nocatch.lorapok.tech", url: "https://nocatch.lorapok.tech/", tag: "NotebookLM Harvester" },
              { name: "Borshon 3D Studio", sub: "borshon.lorapok.tech", url: "https://borshon.lorapok.tech/", tag: "Fine Art & Sculpt" },
              { name: "Lorapok Red Bot", sub: "redbot.lorapok.tech", url: "https://redbot.lorapok.tech/", tag: "Reddit Moderator" },
              { name: "Git Geek Agent", sub: "gitgeek.lorapok.tech", url: "https://gitgeek.lorapok.tech/", tag: "Git Automation Hub" },
              { name: "Maizied Portfolio", sub: "maizied.lorapok.tech", url: "https://maizied.lorapok.tech/", tag: "Architect Portal" },
            ].map((sub) => (
              <a
                key={sub.sub}
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#67ff8f]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#67ff8f]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#67ff8f] animate-ping" />
                      LIVE
                    </span>
                    <ExternalLink size={12} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-[#67ff8f] transition-colors line-clamp-1">{sub.name}</h3>
                  <p className="text-[10px] font-mono text-gray-400 truncate">{sub.sub}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="truncate mr-1">{sub.tag}</span>
                  <span className="text-[#67ff8f] group-hover:translate-x-1 transition-transform shrink-0">&rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IDE Plugins, MCP Servers & Extensibility Matrix ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-b from-[#0c0f1a] via-[#090b14] to-[#07080f] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#67ff8f]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-6 border-b border-white/10 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-2">
                <Cpu size={14} /> Developer Toolchain & Protocols
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                IDE Plugins, MCP Servers & Agent Skills
              </h2>
              <p className="text-gray-400 max-w-2xl text-sm sm:text-base mt-2 leading-relaxed">
                Seamlessly augment your workflow across Cursor AI, VS Code, JetBrains, Windsurf, Claude Code, and Antigravity IDE with Lorapok's public MCP servers and autonomous skill protocols.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                Universal Model Context Protocol (MCP)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {/* Card 1: Cursor AI Tooling */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#38bdf8]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-cyan-400 bg-cyan-400/10 border-cyan-400/30">
                    IDE Plugin & Quotas
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors mb-2">
                  Cursor Curse Monitor
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Real-time usage, quota, and budget burn-rate monitor for Cursor AI accounts. Includes automated free-fallback model rollover and VS Code / Firefox AMO extensions.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Cursor AI</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">VS Code</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Firefox AMO</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://cursor.lorapok.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#38bdf8] hover:underline flex items-center gap-1">
                  Launch Monitor &rarr;
                </a>
                <a href="https://marketplace.visualstudio.com/items?itemName=LorapokLabs.cursor-curse-monitor" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  Marketplace
                </a>
              </div>
            </div>

            {/* Card 2: Lorapok API Atlas MCP */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#67ff8f]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-[#67ff8f] bg-[#67ff8f]/10 border-[#67ff8f]/30">
                    Remote MCP & Extension
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors mb-2">
                  Lorapok Atlas MCP Server
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Published on npm as <code className="text-[#67ff8f]">lorapok-atlas-mcp</code>. Gives any MCP-compliant AI assistant live tools to search and execute 2,100+ public and open APIs.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">npm</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Open VSX</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Claude Code</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Antigravity</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://atlas.lorapok.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#67ff8f] hover:underline flex items-center gap-1">
                  Open Atlas Console &rarr;
                </a>
                <a href="https://www.npmjs.com/package/lorapok-atlas-mcp" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  npm package
                </a>
              </div>
            </div>

            {/* Card 3: SeeYou Agentic SEO MCP */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-400/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-purple-400 bg-purple-400/10 border-purple-400/30">
                    Agentic SEO MCP
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                  SeeYou (iCanSeeYou) MCP
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Remote MCP + API + interactive dashboard auditing web pages from the crawler perspective. Analyzes render gaps, schema definitions, and returns prioritized ROI fix plans.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Cloudflare Workers</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Remote SSE</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">AEO Engine</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://seeyou.lorapok.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1">
                  Launch SeeYou &rarr;
                </a>
                <a href="https://github.com/Lorapok/SeeYou" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  GitHub
                </a>
              </div>
            </div>

            {/* Card 4: IntelliJ Lorapok */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/30">
                    JetBrains Marketplace
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                  IntelliJ Lorapok AI Agent
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  JetBrains IDE plugin with multi-provider model routing, local MCP integration, and autonomous sub-agent delegation across IntelliJ IDEA, PhpStorm, and PyCharm.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">PhpStorm</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">IntelliJ IDEA</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Sub-Agents</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://plugins.jetbrains.com/vendor/lorapok-labs" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1">
                  Vendor Portal &rarr;
                </a>
                <a href="https://github.com/Maijied/Intellij-Lorapok" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  GitHub
                </a>
              </div>
            </div>

            {/* Card 5: Loragent MCP Engine */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#67ff8f]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-[#67ff8f] bg-[#67ff8f]/10 border-[#67ff8f]/30">
                    Multi-Agent MCP Standard
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors mb-2">
                  Loragent MCP Protocol
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Native tool delegation primitives: <code className="text-[#67ff8f]">summon_agent</code>, <code className="text-[#67ff8f]">dismiss_agent</code>, <code className="text-[#67ff8f]">steer</code>, <code className="text-[#67ff8f]">watchman_save</code>, and lifecycle telemetry sync across IDE runtimes.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">224 Skills</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Spidernet</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Watchman Cache</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://loragent.lorapok.tech" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#67ff8f] hover:underline flex items-center gap-1">
                  Explore Loragent &rarr;
                </a>
                <Link to="/agents" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  Skill Catalog
                </Link>
              </div>
            </div>

            {/* Card 6: Firefox AMO Developer Addons */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-400/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-orange-400 bg-orange-400/10 border-orange-400/30">
                    Browser Extensions
                  </span>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2">
                  Firefox AMO Addon Suite
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Official published Mozilla extensions including Lorapok Atlas, Cursor Curse Monitor, SubtitleMaster, TabMan memory manager, and XSnap media downloader.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Firefox AMO</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Opera</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">Manifest V3</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <a href="https://addons.mozilla.org/firefox/user/lorapok/" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-orange-400 hover:underline flex items-center gap-1">
                  Mozilla AMO Portal &rarr;
                </a>
                <Link to="/projects?category=browser-extensions" className="text-[11px] font-mono text-gray-400 hover:text-white">
                  Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Autonomous Agents & Skills Spotlight ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
              <Bot size={14} /> Loragent Intelligence Network
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Autonomous Agents & Skills</h2>
            <p className="text-gray-400 max-w-xl">
              {ecosystemStats.agentSkillDefinitions} agent skill definitions shipped in the Loragent catalog, ready to summon from the CLI or an MCP client.
            </p>
          </div>
          <Link to="/agents" className="text-[#67ff8f] hover:underline flex items-center gap-1.5 mt-4 md:mt-0 font-mono text-sm">
            Explore the skill catalog <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Watchman Guardian",
              slug: "loragent-watchman",
              desc: "Session state guardian and crash recovery agent. Persists conversation snapshots and resumes crashed sessions automatically.",
              badge: "Observer",
              color: "text-rose-400 bg-rose-400/10 border-rose-400/30"
            },
            {
              name: "Deploy Maestro",
              slug: "loragent-deploy",
              desc: "Handles multi-platform deployment operations across Vercel, Railway, Docker, and Cloudflare Pages with zero-trust guardrails.",
              badge: "Skill Routine",
              color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
            },
            {
              name: "Backend Senior Engineer",
              slug: "loragent-backend-se",
              desc: "Implements high-throughput APIs, core streaming logic, database indexing, and low-latency IPC architecture.",
              badge: "Auto Unit",
              color: "text-[#67ff8f] bg-[#67ff8f]/10 border-[#67ff8f]/30"
            },
            {
              name: "Governance Guard",
              slug: "loragent-governance-guard",
              desc: "Audits AGENTS.md, Cursor rules, lifecycle hooks, MCP configs, and CI workflows for policy drift and unsafe automations.",
              badge: "Skill Routine",
              color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30"
            },
            {
              name: "Student Evolutionary AI",
              slug: "loragent-student",
              desc: "Continuous conversation learner. Listens to developer pairing, discovers novel workflows, and dynamic catalog expansions.",
              badge: "Evolutionary",
              color: "text-purple-400 bg-purple-400/10 border-purple-400/30"
            },
            {
              name: "Browser Automation",
              slug: "loragent-browser-automation-expert",
              desc: "Headless browser driver and visual regression verifier with DevTools protocol and live session interaction.",
              badge: "Auto Unit",
              color: "text-[#67ff8f] bg-[#67ff8f]/10 border-[#67ff8f]/30"
            }
          ].map((agent) => (
            <Link
              key={agent.slug}
              to="/agents"
              className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#67ff8f]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${agent.color}`}>
                    {agent.badge}
                  </span>
                  <code className="text-[11px] font-mono text-gray-500">{agent.slug}</code>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors mb-2">
                  {agent.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {agent.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#67ff8f]">
                <span>Summon Unit</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Philosophy Section ─── */}
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
              <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Collective & Team Spotlight ─── */}
      <section className="px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
              <Users size={14} /> Open-Source Collective
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The Minds Behind Lorapok</h2>
            <p className="text-gray-400 max-w-xl">
              Systems architects, AI researchers, clinical specialists, speech pathologists, 3D artists, and creative storytellers collaborating on open technology.
            </p>
          </div>
          <Link
            to="/team"
            className="text-[#67ff8f] hover:underline flex items-center gap-1.5 mt-4 md:mt-0 text-sm font-mono"
          >
            Meet Full Collective & View CVs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
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

      {/* ─── Ecosystem Availability Ribbon ─── */}
      <section className="px-4 text-center max-w-4xl mx-auto pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-2">
            <Radio size={14} className="text-[#67ff8f]" /> Multi-Platform Presence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Available Everywhere Developers Build</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {ecosystemStats.platforms.map((platform, idx) => (
              <a 
                key={idx} 
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:border-[#67ff8f]/50 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span>{platform.name}</span>
                <ExternalLink size={12} className="opacity-60" />
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

