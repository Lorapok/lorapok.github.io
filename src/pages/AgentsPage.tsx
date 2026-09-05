import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  SearchX,
  Sparkles,
  Terminal,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import {
  agentsAndSkills,
  agentFormations,
  agentStats,
  type AgentItem,
} from "../data/agents";
import { SearchBar } from "../components/ui/SearchBar";
import { SEOHead } from "../components/SEOHead";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFormation, setActiveFormation] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(48);

  useEffect(() => {
    document.title = "Autonomous Agents & Skills — Lorapok Labs";
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return agentsAndSkills.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.layer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchesFormation =
        activeFormation === "all" ||
        item.formation === activeFormation ||
        (activeFormation === "skill" && item.type === "skill");

      return matchesSearch && matchesFormation;
    });
  }, [searchQuery, activeFormation]);

  useEffect(() => {
    setDisplayLimit(48);
  }, [searchQuery, activeFormation]);

  const formationCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: agentsAndSkills.length,
    };
    for (const item of agentsAndSkills) {
      if (item.type === "skill") {
        counts["skill"] = (counts["skill"] || 0) + 1;
      }
      counts[item.formation] = (counts[item.formation] || 0) + 1;
    }
    return counts;
  }, []);

  const handleCopy = (cmd: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedSlug(id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const visibleItems = filteredItems.slice(0, displayLimit);

  const getFormationBadge = (formation: string, type: string) => {
    if (type === "skill") {
      return {
        label: "Skill Module",
        className: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
      };
    }
    switch (formation) {
      case "orchestrator":
        return {
          label: "Orchestrator",
          className: "bg-purple-400/10 text-purple-400 border-purple-400/30",
        };
      case "freelance":
        return {
          label: "Freelance Specialist",
          className: "bg-amber-400/10 text-amber-400 border-amber-400/30",
        };
      case "observer":
        return {
          label: "Observer",
          className: "bg-rose-400/10 text-rose-400 border-rose-400/30",
        };
      default:
        return {
          label: "Auto Formation",
          className: "bg-[#67ff8f]/10 text-[#67ff8f] border-[#67ff8f]/30",
        };
    }
  };

  return (
    <>
      <SEOHead
        title="Autonomous Agents & Skills"
        description="Explore 240+ specialized intelligence units, autonomous formations, and deterministic skill modules powering the Loragent ecosystem."
        path="/agents"
      />

      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#67ff8f]/10 border border-[#67ff8f]/20 text-[#67ff8f] text-xs font-mono uppercase tracking-widest mb-4">
            <Bot size={14} /> Loragent Intelligence Network
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Autonomous <span className="text-[#67ff8f]">Agents & Skills</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            A comprehensive catalog of {agentStats.total}+ modular AI agents, domain specialists, and deterministic skill routines engineered for enterprise multi-agent orchestration.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-2xl font-bold text-white mb-1 font-mono">
              {agentStats.total}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Total Units
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-2xl font-bold text-[#67ff8f] mb-1 font-mono">
              {agentStats.agents}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Auto Agents
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1 font-mono">
              {agentStats.skills}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Skill Modules
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1 font-mono">
              5
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              Formations
            </div>
          </div>
        </div>

        {/* Search & Formation Filter */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto mb-10">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search agents by name, slug, capability, layer, or tech stack..."
          />

          {/* Formation Filter Pills */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 pb-2 px-1 min-w-max">
              {agentFormations.map((formation) => {
                const isActive = activeFormation === formation.id;
                const count = formationCounts[formation.id] ?? 0;
                return (
                  <button
                    key={formation.id}
                    onClick={() => setActiveFormation(formation.id)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-2
                      ${
                        isActive
                          ? "bg-[#67ff8f] text-[#0a0a0f] shadow-[0_0_15px_rgba(103,255,143,0.3)] font-bold"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"
                      }
                    `}
                  >
                    <span>{formation.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? "bg-black/20 text-[#0a0a0f]"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result Counter */}
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-gray-500 mb-6 px-1">
          <span>
            SHOWING {visibleItems.length} OF {filteredItems.length} MATCHING UNITS
          </span>
          {activeFormation !== "all" && (
            <button
              onClick={() => setActiveFormation("all")}
              className="text-[#67ff8f] hover:underline"
            >
              Reset Formation Filter
            </button>
          )}
        </div>

        {/* Agents Grid */}
        {visibleItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {visibleItems.map((item) => {
                const badge = getFormationBadge(item.formation, item.type);
                const isCopied = copiedSlug === item.id;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setSelectedAgent(item)}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl flex flex-col justify-between h-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#67ff8f]/40 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                          {item.layer}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-[#67ff8f] transition-colors mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 mb-3">
                        {item.slug}
                      </p>

                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <code className="text-[11px] font-mono text-gray-400 truncate max-w-[180px]">
                        {item.command}
                      </code>
                      <button
                        onClick={(e) => handleCopy(item.command, item.id, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Copy summon command"
                      >
                        {isCopied ? (
                          <Check size={14} className="text-[#67ff8f]" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {visibleItems.length < filteredItems.length && (
              <div className="text-center mb-20">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 48)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors"
                >
                  Load More ({filteredItems.length - visibleItems.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.01] border border-white/5 rounded-2xl mb-20">
            <div className="p-4 rounded-full bg-white/5 text-gray-400 mb-4">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No agents or skills match your search
            </h3>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              Try adjusting your query or resetting filters to browse all 240+ autonomous units.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFormation("all");
              }}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Integration Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-white/[0.02] via-[#67ff8f]/[0.04] to-white/[0.02] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono mb-4">
            <Sparkles size={14} className="text-[#67ff8f]" /> Loragent CLI & MCP
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Deploy Multi-Agent Systems in Your Terminal
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            All 240+ agents and skills can be summoned dynamically using the Loragent CLI, Claude Plugin, Cursor rules, or MCP server integration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://loragent.lorapok.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#67ff8f] text-black font-semibold text-sm hover:bg-[#8affab] transition-all shadow-[0_0_25px_rgba(103,255,143,0.3)] flex items-center gap-2"
            >
              <ExternalLink size={16} /> Open Loragent Cloud
            </a>
            <a
              href="https://github.com/Maijied/Loragent"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors flex items-center gap-2"
            >
              <Terminal size={16} /> GitHub Framework
            </a>
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full border ${
                      getFormationBadge(
                        selectedAgent.formation,
                        selectedAgent.type
                      ).className
                    }`}
                  >
                    {
                      getFormationBadge(
                        selectedAgent.formation,
                        selectedAgent.type
                      ).label
                    }
                  </span>
                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded">
                    Layer: {selectedAgent.layer}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                  {selectedAgent.name}
                </h3>
                <code className="text-xs font-mono text-[#67ff8f] mb-4">
                  {selectedAgent.slug}
                </code>

                <div className="overflow-y-auto pr-2 space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Capability & Scope
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      {selectedAgent.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Invocation Command
                    </h4>
                    <div className="flex items-center justify-between p-3 bg-black/60 rounded-xl border border-white/10">
                      <code className="text-xs font-mono text-[#67ff8f]">
                        {selectedAgent.command}
                      </code>
                      <button
                        onClick={() =>
                          handleCopy(selectedAgent.command, selectedAgent.id)
                        }
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedSlug === selectedAgent.id ? (
                          <Check size={16} className="text-[#67ff8f]" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Tags & Architecture
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-gray-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
