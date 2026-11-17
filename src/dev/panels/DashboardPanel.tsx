import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BadgePercent, BarChart3, BookOpenText, Boxes, Check, ChevronRight,
  CircleAlert, Code2, FileText, FlaskConical, GalleryHorizontalEnd, ListChecks,
  Mail, MessageSquareText, Palette, Radio, ShieldCheck, Sparkles, Users, Video,
} from "lucide-react";
import { projects } from "../../data/lorapok";

interface DashboardPanelProps { onSwitchPanel?: (panel: string) => void; }
type ModuleState = "live" | "connected" | "demo" | "review";
type StudioModule = { title: string; description: string; state: ModuleState; icon: typeof Boxes; panel?: string; };

const modules: StudioModule[] = [
  { title: "Project catalog", description: "Publish products, releases and engineering stories.", state: "live", icon: Boxes, panel: "projects" },
  { title: "Editorial desk", description: "Research notes, changelogs and long-form articles.", state: "demo", icon: BookOpenText, panel: "content" },
  { title: "Team portfolios", description: "Contributor profiles, roles, work and public links.", state: "connected", icon: Users, panel: "team-studio" },
  { title: "Offers", description: "Campaigns, discounts and commercial announcements.", state: "demo", icon: BadgePercent, panel: "offers" },
  { title: "Feedback inbox", description: "Triage public ideas, reports and community signals.", state: "demo", icon: MessageSquareText, panel: "feedback" },
  { title: "Mail drafts", description: "Prepare customer and partner replies before sending.", state: "demo", icon: Mail, panel: "mail" },
  { title: "Team chat", description: "A browser-only collaboration simulation for the prototype.", state: "demo", icon: Radio, panel: "chat" },
  { title: "Meeting links", description: "Draft meeting rooms and copy invitations.", state: "demo", icon: Video, panel: "meetings" },
  { title: "Task board", description: "Track launch, editorial and product work.", state: "demo", icon: ListChecks, panel: "tasks" },
  { title: "Social cards", description: "Compose export-ready project and release artwork.", state: "demo", icon: GalleryHorizontalEnd, panel: "social" },
  { title: "Brand gallery", description: "Ribo poses, emblems and approved visual assets.", state: "connected", icon: Palette, panel: "brand" },
  { title: "AI laboratory", description: "Compare providers and run prompt experiments.", state: "connected", icon: FlaskConical, panel: "ai-labs" },
  { title: "Prompt library", description: "Reusable workflows for the Lorapok toolchain.", state: "connected", icon: Sparkles, panel: "prompts" },
  { title: "Analytics", description: "Review audience and product signals with clear provenance.", state: "connected", icon: BarChart3, panel: "analytics" },
  { title: "People & access", description: "Invite teammates, assign roles, and suspend workspace access.", state: "connected", icon: ShieldCheck, panel: "admin" },
];

const statusCopy: Record<ModuleState, string> = {
  live: "Live data", connected: "Connected", demo: "Browser demo", review: "Needs review",
};

export default function DashboardPanel({ onSwitchPanel }: DashboardPanelProps) {
  const [repos, setRepos] = useState<number | null>(null);
  const [activeUniverse, setActiveUniverse] = useState<"open" | "business">("open");
  const [completedTasks, setCompletedTasks] = useState<string[]>(["release"]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/users/lorapok/repos?per_page=100&type=public", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("GitHub unavailable")))
      .then((data) => setRepos(Array.isArray(data) ? data.length : null))
      .catch((error) => { if (error instanceof Error && error.name !== "AbortError") setRepos(null); });
    return () => controller.abort();
  }, []);

  const universe = useMemo(() => activeUniverse === "open" ? {
    eyebrow: "Open Source Universe", title: "Build in public. Make the work useful.",
    body: "Projects, research, releases and contributor stories live together as a transparent record of the lab.",
    action: "Open project catalog", panel: "projects",
  } : {
    eyebrow: "Business Universe", title: "Turn capability into clear offers.",
    body: "Commercial products, cloud services, partnerships and customer inquiries stay distinct from community work.",
    action: "Open offers", panel: "offers",
  }, [activeUniverse]);

  const toggleTask = (id: string) => {
    setCompletedTasks((current) => current.includes(id) ? current.filter((task) => task !== id) : [...current, id]);
  };

  return (
    <div className="studio-home">
      <section className="studio-hero">
        <div className="studio-hero-copy">
          <div className="studio-kicker"><span /> Living Universe 5.0 · Studio</div>
          <h1>One living system.<br /><em>Two clear universes.</em></h1>
          <p>The operating surface for Lorapok Labs—bringing open engineering and commercial work into one coherent biological interface without blurring what is public, private or simulated.</p>
          <div className="studio-hero-actions">
            <button className="studio-action primary" onClick={() => onSwitchPanel?.("projects")}>Explore projects <ArrowUpRight size={17} /></button>
            <button className="studio-action secondary" onClick={() => onSwitchPanel?.("content")}>Manage studio <ChevronRight size={17} /></button>
          </div>
          <div className="studio-trust-row" aria-label="Data status legend">
            <span><i className="live" /> Live data</span><span><i className="connected" /> Connected surface</span><span><i className="demo" /> Browser demo</span>
          </div>
        </div>

        <div className="studio-ribo-stage" aria-label="Ribo, the Lorapok studio guide">
          <div className="studio-orbit orbit-one" /><div className="studio-orbit orbit-two" />
          <div className="studio-ribo">
            {['curious', 'focused', 'celebrating', 'thinking', 'presenting', 'exploring'].map((mood) => (
              <img key={mood} className={`studio-ribo-pose studio-ribo-pose-${mood}`} src={`/assets/ribo/ribo-${mood}.webp`} alt="" />
            ))}
          </div>
          <div className="studio-ribo-note"><Sparkles size={14} /><span><strong>Ribo is awake</strong>Guiding the studio, one honest signal at a time.</span></div>
        </div>
      </section>

      <section className="studio-signal-strip" aria-label="Verified Lorapok signals">
        <div><strong>{projects.length}</strong><span>catalog projects</span></div>
        <div><strong>{repos ?? "—"}</strong><span>public GitHub repos</span></div>
        <div><strong>224</strong><span>published agent definitions</span></div>
        <div><strong>25</strong><span>production subdomains</span></div>
      </section>

      <section className="studio-universes">
        <div className="studio-section-heading">
          <div><span className="studio-overline">Universe switcher</span><h2>Same identity, different intent.</h2></div>
          <div className="studio-segmented" role="tablist" aria-label="Choose a universe">
            <button className={activeUniverse === "open" ? "active" : ""} onClick={() => setActiveUniverse("open")} role="tab">Open source</button>
            <button className={activeUniverse === "business" ? "active" : ""} onClick={() => setActiveUniverse("business")} role="tab">Business</button>
          </div>
        </div>
        <article className={`studio-universe-card ${activeUniverse}`}>
          <div className="universe-number">{activeUniverse === "open" ? "01" : "02"}</div>
          <div><span className="studio-overline">{universe.eyebrow}</span><h3>{universe.title}</h3><p>{universe.body}</p></div>
          <button onClick={() => onSwitchPanel?.(universe.panel)}>{universe.action} <ArrowUpRight size={16} /></button>
        </article>
      </section>

      <section className="studio-modules-section">
        <div className="studio-section-heading">
          <div><span className="studio-overline">Studio modules</span><h2>Fifteen surfaces, one operating rhythm.</h2></div>
          <p>Every module declares its maturity so a prototype can never be mistaken for production infrastructure.</p>
        </div>
        <div className="studio-modules-grid">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <button key={module.title} className={`studio-module-card state-${module.state}`} onClick={() => module.panel && onSwitchPanel?.(module.panel)} disabled={!module.panel}>
                <div className="module-top"><Icon size={20} /><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{module.title}</h3><p>{module.description}</p>
                <div className="module-status"><i />{statusCopy[module.state]}{module.panel && <ArrowUpRight size={13} />}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="studio-workbench">
        <div className="studio-task-card">
          <div className="studio-card-heading"><div><span className="studio-overline">Today in Studio</span><h2>Launch workbench</h2></div><ListChecks size={22} /></div>
          {[["release", "Review current release story", "Editorial"], ["pricing", "Reconcile LoraHost pricing references", "Publishing check"], ["founding", "Confirm the official founding year", "Brand check"]].map(([id, label, meta]) => (
            <button key={id} className={`studio-task ${completedTasks.includes(id) ? "done" : ""}`} onClick={() => toggleTask(id)}>
              <span className="task-check">{completedTasks.includes(id) && <Check size={13} />}</span><span><strong>{label}</strong><small>{meta}</small></span>
            </button>
          ))}
          <p className="studio-local-note"><Radio size={13} /> Task changes stay in this browser demo.</p>
        </div>
        <div className="studio-review-card">
          <div className="studio-card-heading"><div><span className="studio-overline">Publication confidence</span><h2>Resolve before claiming.</h2></div><CircleAlert size={22} /></div>
          <div className="review-item warning"><span>Pricing</span><p>LoraHost references contain different price points. Reconcile the source before publishing an offer.</p></div>
          <div className="review-item warning"><span>Brand history</span><p>The founding year differs across source material. Keep it out of headline claims until confirmed.</p></div>
          <div className="review-item clear"><span>Partnership language</span><p>Higgsfield and Binance remain integrations or ecosystem references—not confirmed partners.</p></div>
        </div>
      </section>

      <section className="studio-open-call">
        <div><span className="studio-overline">Open source universe</span><h2>The next useful thing can start with you.</h2><p>Explore the work, find an issue and help shape a product people can actually own.</p></div>
        <a href="https://github.com/lorapok" target="_blank" rel="noreferrer">Visit GitHub <Code2 size={18} /></a>
        <button onClick={() => onSwitchPanel?.("blog")}>Read engineering stories <FileText size={18} /></button>
      </section>
    </div>
  );
}
