import { motion } from 'framer-motion';
import { Star, Globe, ExternalLink, Code2, Terminal, Layers } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import type { Project } from '../../data/lorapok';

export interface ProjectLink {
  label: string;
  url: string;
  icon?: string;
}

export interface CardProps {
  project?: Project;
  name?: string;
  tagline?: string;
  description?: string;
  category?: string;
  language?: string;
  featured?: boolean;
  image?: string;
  badge?: string;
  links?: ProjectLink[];
  onClick?: () => void;
}

const getIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'github': return <Code2 size={16} />;
    case 'web': return <Globe size={16} />;
    case 'terminal': return <Terminal size={16} />;
    case 'vscode':
    case 'openvsx': return <Code2 size={16} />;
    case 'layers': return <Layers size={16} />;
    default: return <ExternalLink size={16} />;
  }
};

export const Card = (props: CardProps) => {
  const p = props.project || props;
  const name = p.name || '';
  const tagline = p.tagline || '';
  const description = p.description || '';
  const category = p.category || 'General';
  const language = p.language || 'Code';
  const featured = p.featured;
  const links = p.links || [];
  const image = props.image || props.project?.image;
  const badge = props.badge || props.project?.badge;
  const onClick = props.onClick;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className={`relative p-6 rounded-2xl flex flex-col h-full bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.06)] hover:border-[#67ff8f]/50 hover:shadow-[0_0_20px_rgba(103,255,143,0.1)] transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {image ? (
        <div className="relative -mx-6 -mt-6 mb-5 h-44 overflow-hidden rounded-t-2xl bg-black/40 border-b border-white/5 group">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-[#0d121c]/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="accent">{category}</Badge>
            {badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-black/70 text-[#67ff8f] border border-[#67ff8f]/40 backdrop-blur-md">
                {badge}
              </span>
            )}
          </div>
          {featured && (
            <div className="absolute top-3 right-3 flex items-center text-amber-300 text-xs font-medium bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
              <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Featured
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="accent">{category}</Badge>
            {badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-[#67ff8f]/10 text-[#67ff8f] border border-[#67ff8f]/30">
                {badge}
              </span>
            )}
          </div>
          {featured && (
            <div className="flex items-center text-amber-400 text-xs font-medium bg-amber-400/10 px-2 py-1 rounded-full">
              <Star size={12} className="mr-1 fill-amber-400" /> Featured
            </div>
          )}
        </div>
      )}
      
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-[#67ff8f] text-sm font-medium">{tagline}</p>
      </div>
      
      <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#67ff8f]/70"></span>
          <span className="text-xs text-gray-400 font-medium">{language}</span>
        </div>
        
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {links.map((link, idx) => (
            <Button key={idx} variant="ghost" size="sm" href={link.url} className="px-2" title={link.label}>
              {getIcon(link.icon)}
              <span className="sr-only">{link.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
