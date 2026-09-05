import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, BriefcaseBusiness, Globe, Users, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { founder, philosophy, brand } from '../data/lorapok';
import { teamMembers, type TeammateProfile } from '../data/team';
import { TeammateCard } from '../components/team/TeammateCard';
import { TeammateModal } from '../components/team/TeammateModal';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<TeammateProfile | null>(null);

  useEffect(() => {
    document.title = `About & Collective | ${brand.name}`;
  }, []);

  return (
    <>
      <SEOHead
        title="About & Collective"
        description="Learn about the origin of Lorapok Labs, founder Mohammad Maizied Hasan Majumder, and the collective engineering principles."
        path="/about"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 px-4 max-w-5xl mx-auto w-full"
      >
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-24">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-white/5 relative">
            <img 
              src="/assets/founder-avatar.jpg" 
              alt={founder.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://ui-avatars.com/api/?name=Mohammad+Maizied&background=0a0a0f&color=67ff8f&size=256';
              }}
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{founder.name}</h1>
            <h2 className="text-xl text-[#67ff8f] font-medium mb-4">{founder.role} • {founder.location}</h2>
            
            <div className="prose prose-invert max-w-none text-gray-300 mb-8 space-y-4">
              <p>{founder.bio}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {founder.links.github && (
                <a href={founder.links.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <Code2 size={18} />
                  <span>GitHub</span>
                </a>
              )}
              {founder.links.linkedin && (
                <a href={founder.links.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <BriefcaseBusiness size={18} />
                  <span>LinkedIn</span>
                </a>
              )}
              {founder.links.portfolio && (
                <a href={founder.links.portfolio} target="_blank" rel="noopener noreferrer" title="Portfolio" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <Globe size={18} />
                  <span>Portfolio</span>
                </a>
              )}
              {founder.links.twitter && (
                <a href={founder.links.twitter} target="_blank" rel="noopener noreferrer" title="X / Twitter" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <MessageSquare size={18} />
                  <span>X / Twitter</span>
                </a>
              )}
              {founder.links.telegram && (
                <a href={founder.links.telegram} target="_blank" rel="noopener noreferrer" title="Telegram" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <MessageSquare size={18} />
                  <span>Telegram</span>
                </a>
              )}
              {founder.email && (
                <a href={`mailto:${founder.email}`} title="Email Founder" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white flex items-center gap-2 text-sm px-4">
                  <Mail size={18} />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* The Lorapok Way */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">The Lorapok Way</h2>
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Lorapok Labs was founded on the belief that open-source software shouldn't feel like dry utilities. We treat every application as a living digital organism — responsive, vibrant, and engineered with precision.
            </p>
            <p className="text-gray-400 leading-relaxed">
              From developer tools that streamline complex cloud workflows to sensory input systems for native desktop environments, our mission is to deliver fast, zero-bloat tools that put control and craft back into developers' hands.
            </p>
          </div>
        </section>

        {/* Core Collective Spotlight */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#67ff8f] uppercase tracking-wider mb-1">
                <Users size={14} /> Core Team & Specialists
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">The Collective</h2>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#67ff8f] hover:underline"
            >
              View Full Team & CV Directory <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.slice(1).map((member) => (
              <TeammateCard
                key={member.id}
                member={member}
                onSelect={(m) => setSelectedMember(m)}
              />
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophy.map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <span className="text-xs uppercase tracking-wider text-[#67ff8f] font-mono">{item.label}</span>
                <h3 className="text-xl font-semibold text-white mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Teammate CV Modal */}
        <TeammateModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      </motion.div>
    </>
  );
}
