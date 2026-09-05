import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Mail,
  Code2,
  BriefcaseBusiness,
  Globe,
  MessageSquare,
  GraduationCap,
  Sparkles,
  Layers,
  Download,
  Phone,
} from "lucide-react";
import type { TeammateProfile } from "../../data/team";
import { Badge } from "../ui/Badge";
import { Link } from "react-router-dom";

interface TeammateModalProps {
  member: TeammateProfile | null;
  onClose: () => void;
}

export function TeammateModal({ member, onClose }: TeammateModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (member) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0f0f16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Bar / Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#67ff8f]" />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                Teammate Profile & CV
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Profile"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Header Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#67ff8f]/30 p-1 bg-white/5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=0a0a0f&color=67ff8f&size=180`;
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{member.name}</h2>
                  <Badge variant="accent">{member.department}</Badge>
                </div>
                <p className="text-sm font-mono text-[#67ff8f] mb-3">{member.role}</p>
                <p className="text-sm text-gray-300 leading-relaxed max-w-xl mb-4">
                  {member.cvSummary || member.bio}
                </p>

                {/* Location & Contact Meta */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#67ff8f]" />
                    {member.location}
                  </span>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 hover:text-[#67ff8f] transition-colors"
                    >
                      <Mail size={13} className="text-[#67ff8f]" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-1.5 hover:text-[#67ff8f] transition-colors"
                    >
                      <Phone size={13} className="text-[#67ff8f]" />
                      {member.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Social & Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2 pb-1 border-b border-white/5">
              {member.social.github && (
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 border border-white/10 transition-colors"
                >
                  <Code2 size={14} /> GitHub Profile
                </a>
              )}
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 border border-white/10 transition-colors"
                >
                  <BriefcaseBusiness size={14} /> LinkedIn
                </a>
              )}
              {member.social.portfolio && (
                <a
                  href={member.social.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 border border-white/10 transition-colors"
                >
                  <Globe size={14} /> Portfolio
                </a>
              )}
              {member.social.twitter && (
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-200 border border-white/10 transition-colors"
                >
                  <MessageSquare size={14} /> X / Twitter
                </a>
              )}
              {member.resumeUrl && (
                <a
                  href={member.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#67ff8f] text-black text-xs font-mono font-bold hover:bg-[#8affab] transition-colors ml-auto"
                >
                  <Download size={14} /> Download CV
                </a>
              )}
            </div>

            {/* Skills Matrix */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#67ff8f] mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Core Competencies & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience / Career Highlights */}
            {member.experience && member.experience.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#67ff8f] mb-4 flex items-center gap-2">
                  <BriefcaseBusiness size={14} /> Career & Professional History
                </h3>
                <div className="space-y-4 border-l border-white/10 pl-4 ml-1">
                  {member.experience.map((exp, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#67ff8f]" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                        <span className="text-xs font-mono text-gray-500">{exp.period}</span>
                      </div>
                      <p className="text-xs font-mono text-[#67ff8f]/90 mb-1">{exp.organization}</p>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        {exp.description}
                      </p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-1">
                          {exp.highlights.map((hl, hIdx) => (
                            <li key={hIdx}>{hl}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {member.education && member.education.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#67ff8f] mb-3 flex items-center gap-2">
                  <GraduationCap size={14} /> Education & Credentials
                </h3>
                <div className="space-y-2">
                  {member.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{edu.degree}</p>
                        <p className="text-xs text-gray-400">{edu.institution}</p>
                      </div>
                      <span className="text-xs font-mono text-[#67ff8f]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lorapok Ecosystem Contributions */}
            {member.featuredProjects && member.featuredProjects.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#67ff8f] mb-3 flex items-center gap-2">
                  <Layers size={14} /> Lorapok Ecosystem Contributions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.featuredProjects.map((proj) => (
                    <Link
                      key={proj}
                      to="/projects"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#67ff8f]/40 transition-colors flex items-center justify-between group"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-[#67ff8f] transition-colors">
                        {proj}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">View Product &rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
