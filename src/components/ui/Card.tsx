import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Globe, ExternalLink, Code2, Terminal, Layers, BookOpen, Box, Cpu } from 'lucide-react';
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
  imageType?: 'cover' | 'icon';
  badge?: string;
  links?: ProjectLink[];
  onClick?: () => void;
}

const getIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'github': return <Code2 size={16} />;
    case 'web': return <Globe size={16} />;
    case 'terminal': return <Terminal size={16} />;
    case 'book':
    case 'docs': return <BookOpen size={16} />;
    case 'packagist':
    case 'npm':
    case 'box': return <Box size={16} />;
    case 'vscode':
    case 'openvsx': return <Code2 size={16} />;
    case 'layers': return <Layers size={16} />;
    default: return <ExternalLink size={16} />;
  }
};

export const Card = (props: CardProps) => {
  const [imgError, setImgError] = useState(false);
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

  // Determine whether this asset is an emblem icon or panoramic cover banner
  const imageType = props.imageType || props.project?.imageType || (
    image && (
      image.includes('-icon') ||
      image.includes('-logo') ||
      image.includes('-mark') ||
      image.includes('larva.gif') ||
      image.includes('dbreplacer')
    ) ? 'icon' : 'cover'
  );

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className={`relative p-6 rounded-2xl flex flex-col h-full bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.06)] hover:border-[#67ff8f]/50 hover:shadow-[0_0_24px_rgba(103,255,143,0.12)] transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      {image && !imgError ? (
        imageType === 'icon' ? (
          /* Centered App Icon / Emblem with Ambient Bioluminescent Aura */
          <div className="relative -mx-6 -mt-6 mb-5 h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#04060a] border-b border-white/5 flex items-center justify-center group">
            {/* Subtle background tech grid & radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,255,143,0.14)_0,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#67ff8f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* Emblem Glass Pedestal */}
            <div className="relative z-0 p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md group-hover:border-[#67ff8f]/40 group-hover:shadow-[0_0_25px_rgba(103,255,143,0.25)] transition-all duration-500">
              <img 
                src={image} 
                alt={name} 
                className="w-20 h-20 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-500 ease-out" 
                loading="lazy"
                onError={() => setImgError(true)}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-transparent pointer-events-none" />
            
            {/* Badges on Top */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <Badge variant="accent">{category}</Badge>
              {badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-black/75 text-[#67ff8f] border border-[#67ff8f]/40 backdrop-blur-md shadow-sm">
                  {badge}
                </span>
              )}
            </div>
            {featured && (
              <div className="absolute top-3 right-3 flex items-center text-amber-300 text-xs font-medium bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 shadow-sm z-10">
                <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Featured
              </div>
            )}
          </div>
        ) : (
          /* Panoramic Banner / UI Screenshot */
          <div className="relative -mx-6 -mt-6 mb-5 h-48 overflow-hidden rounded-t-2xl bg-black/50 border-b border-white/5 group">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-[#0d121c]/40 to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <Badge variant="accent">{category}</Badge>
              {badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-black/75 text-[#67ff8f] border border-[#67ff8f]/40 backdrop-blur-md shadow-sm">
                  {badge}
                </span>
              )}
            </div>
            {featured && (
              <div className="absolute top-3 right-3 flex items-center text-amber-300 text-xs font-medium bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 shadow-sm z-10">
                <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Featured
              </div>
            )}
          </div>
        )
      ) : (
        /* Biological Fallback Header */
        <div className="relative -mx-6 -mt-6 mb-5 h-28 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#04060a] border-b border-white/5 flex items-center justify-between px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(103,255,143,0.08)_0,transparent_70%)] pointer-events-none" />
          <div className="flex items-center gap-2 z-10">
            <Badge variant="accent">{category}</Badge>
            {badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-[#67ff8f]/10 text-[#67ff8f] border border-[#67ff8f]/30">
                {badge}
              </span>
            )}
          </div>
          {featured ? (
            <div className="flex items-center text-amber-400 text-xs font-medium bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 z-10">
              <Star size={12} className="mr-1 fill-amber-400" /> Featured
            </div>
          ) : (
            <Cpu className="w-5 h-5 text-gray-600" />
          )}
        </div>
      )}
      
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#67ff8f] transition-colors">{name}</h3>
        <p className="text-[#67ff8f] text-sm font-medium">{tagline}</p>
      </div>
      
      <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#67ff8f]/70 animate-pulse"></span>
          <span className="text-xs text-gray-400 font-medium">{language}</span>
        </div>
        
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {links.map((link, idx) => (
            <Button key={idx} variant="ghost" size="sm" href={link.url} className="px-2 hover:text-[#67ff8f]" title={link.label}>
              {getIcon(link.icon)}
              <span className="sr-only">{link.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
