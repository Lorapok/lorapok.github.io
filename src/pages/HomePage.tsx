import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2 } from 'lucide-react';
import { brand, philosophy, projects } from '../data/lorapok';
import { ecosystemStats } from '../data/ecosystem-stats';
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
          <StatsCounter label="Products" value={24} />
          <StatsCounter label="Marketplaces" value={7} />
          <StatsCounter label="APIs" value={2100} prefix="+" />
          <StatsCounter label="Repos" value={133} />
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
