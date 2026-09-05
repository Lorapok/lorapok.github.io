import { motion } from "framer-motion";
import { Code2, BriefcaseBusiness, Globe, MessageSquare, ArrowUpRight, MapPin } from "lucide-react";
import type { TeammateProfile } from "../../data/team";
import { Badge } from "../ui/Badge";

interface TeammateCardProps {
  member: TeammateProfile;
  onSelect: (member: TeammateProfile) => void;
}

export function TeammateCard({ member, onSelect }: TeammateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(member)}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] hover:border-[#67ff8f]/40 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(103,255,143,0.12)]"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-0.5 group-hover:border-[#67ff8f]/50 transition-colors">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover rounded-[14px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&background=0a0a0f&color=67ff8f&size=128`;
                }}
              />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#67ff8f] border-2 border-[#0a0a0f]"
              title="Active Core Member"
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="accent" size="sm">
              {member.department}
            </Badge>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <MapPin size={11} className="text-[#67ff8f]" />
              {member.location.split(",")[0]}
            </span>
          </div>
        </div>

        {/* Member Titles */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors line-clamp-1">
              {member.name}
            </h3>
            <ArrowUpRight
              size={18}
              className="text-gray-500 group-hover:text-[#67ff8f] transition-colors shrink-0"
            />
          </div>
          <p className="text-xs font-mono text-[#67ff8f] mt-0.5">{member.role}</p>
        </div>

        {/* Tagline / Bio snippet */}
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed mb-4">
          {member.tagline || member.bio}
        </p>

        {/* Top skills pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 4 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md text-gray-500">
              +{member.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Social links */}
      <div
        className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-gray-400"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-gray-500">{member.handle}</span>

        <div className="flex items-center gap-3">
          {member.social.github && (
            <a
              href={member.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="GitHub"
            >
              <Code2 size={15} />
            </a>
          )}
          {member.social.linkedin && (
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="LinkedIn"
            >
              <BriefcaseBusiness size={15} />
            </a>
          )}
          {member.social.portfolio && (
            <a
              href={member.social.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Portfolio"
            >
              <Globe size={15} />
            </a>
          )}
          {member.social.twitter && (
            <a
              href={member.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="Twitter"
            >
              <MessageSquare size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
