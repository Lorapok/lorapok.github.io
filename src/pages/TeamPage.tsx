import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, Users, Sparkles } from "lucide-react";
import {
  teamMembers,
  teamDepartments,
  type TeamDepartment,
  type TeammateProfile,
} from "../data/team";
import { TeammateCard } from "../components/team/TeammateCard";
import { TeammateModal } from "../components/team/TeammateModal";
import { DepartmentFilter } from "../components/team/DepartmentFilter";
import { SearchBar } from "../components/ui/SearchBar";
import { SEOHead } from "../components/SEOHead";
import { Link } from "react-router-dom";

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState<TeamDepartment>("All");
  const [selectedMember, setSelectedMember] = useState<TeammateProfile | null>(null);

  useEffect(() => {
    document.title = "Collective & Teammates — Lorapok Labs";
  }, []);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.tagline.toLowerCase().includes(q) ||
        member.skills.some((s) => s.toLowerCase().includes(q)) ||
        member.location.toLowerCase().includes(q);

      const matchesDept =
        activeDepartment === "All" || member.department === activeDepartment;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, activeDepartment]);

  return (
    <>
      <SEOHead
        title="Collective & Core Teammates"
        description="Meet the software engineers, autonomous AI researchers, and sensory UI designers driving the Lorapok Labs collective."
        path="/team"
      />

      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#67ff8f]/10 border border-[#67ff8f]/20 text-[#67ff8f] text-xs font-mono uppercase tracking-widest mb-4">
            <Users size={14} /> Lorapok Collective
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            The Minds Behind <span className="text-[#67ff8f]">Lorapok Labs</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            A distributed collective of full-stack engineers, autonomous agent architects, and sensory designers building open-source software that feels alive.
          </p>
        </div>

        {/* Search & Department Filters */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto mb-10">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search team by name, role, tech stack, or location..."
          />
          <DepartmentFilter
            departments={teamDepartments}
            activeDepartment={activeDepartment}
            onChange={setActiveDepartment}
          />
        </div>

        {/* Result Counter */}
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-gray-500 mb-6 px-1">
          <span>
            SHOWING {filteredMembers.length} OF {teamMembers.length} COLLECTIVE MEMBERS
          </span>
          {activeDepartment !== "All" && (
            <button
              onClick={() => setActiveDepartment("All")}
              className="text-[#67ff8f] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <TeammateCard
                  key={member.id}
                  member={member}
                  onSelect={(m) => setSelectedMember(m)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.01] border border-white/5 rounded-2xl mb-20">
            <div className="p-4 rounded-full bg-white/5 text-gray-400 mb-4">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No teammates match your search</h3>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              Try adjusting your query or resetting the department filter to view all members.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDepartment("All");
              }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Join the Collective Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-white/[0.02] via-[#67ff8f]/[0.04] to-white/[0.02] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono mb-4">
            <Sparkles size={14} className="text-[#67ff8f]" /> Open Engineering
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Build With Us at Lorapok Labs
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            We welcome open-source developers, interface artisans, and AI researchers who care deeply about craft, low latency, and sensory computing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-[#67ff8f] text-black font-semibold text-sm hover:bg-[#8affab] transition-all shadow-[0_0_25px_rgba(103,255,143,0.3)]"
            >
              Get in Touch & Join
            </Link>
            <a
              href="https://github.com/Lorapok"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors"
            >
              Explore GitHub Org
            </a>
          </div>
        </div>

        {/* Profile / CV Modal */}
        <TeammateModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      </div>
    </>
  );
}
