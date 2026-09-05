import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Rocket, Sparkles, Wrench, Flag } from 'lucide-react';
import { changelog } from '../data/changelog';
import { brand } from '../data/lorapok';

const typeConfig = {
  launch: { icon: Rocket, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  feature: { icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  fix: { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  milestone: { icon: Flag, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
};

export default function ChangelogPage() {
  useEffect(() => {
    document.title = `Changelog | ${brand.name}`;
  }, []);

  const sortedChangelog = [...changelog].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-16 px-4 max-w-4xl mx-auto w-full"
    >
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Changelog</h1>
        <p className="text-lg text-gray-400">Keep track of our latest releases, features, and improvements.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
        {sortedChangelog.map((entry, idx) => {
          const config = typeConfig[entry.type as keyof typeof typeConfig] || typeConfig.feature;
          const Icon = config.icon;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-3.5 top-1 p-1.5 rounded-full border bg-[#0a0a0f] ${config.border} ${config.color}`}>
                <Icon size={14} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <span className="text-sm font-mono text-gray-500">
                  {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border} w-max`}>
                  {entry.product}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
              <p className="text-gray-300 mb-4 whitespace-pre-line">{entry.description}</p>
              
              {entry.links && entry.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {entry.links.map((link, lIdx) => (
                    <a 
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#67ff8f] hover:text-white transition-colors"
                    >
                      {link.label}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
