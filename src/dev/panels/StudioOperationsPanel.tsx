import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight, BadgePercent, CalendarDays, Check, Circle, Clipboard, Copy,
  Download, FileText, GalleryHorizontalEnd, ListChecks, Mail, MessageSquareText,
  Palette, Plus, Search, Send, Users, Video,
} from "lucide-react";
import { teamMembers } from "../../data/team";

export type StudioTool =
  | "content" | "team-studio" | "offers" | "feedback" | "mail"
  | "chat" | "meetings" | "tasks" | "social" | "brand";

type ContentItem = { id: string; title: string; universe: "Open Source" | "Business"; status: "Draft" | "Review" | "Ready" };
type Offer = { id: string; title: string; detail: string; active: boolean };
type FeedbackItem = { id: string; author: string; message: string; status: "New" | "Reviewed" | "Archived" };
type Draft = { id: string; subject: string; body: string };
type ChatMessage = { id: string; author: string; body: string; time: string };
type Meeting = { id: string; title: string; date: string; url: string };
type Task = { id: string; title: string; status: "Backlog" | "In progress" | "Done" };

type StudioState = {
  content: ContentItem[];
  offers: Offer[];
  feedback: FeedbackItem[];
  drafts: Draft[];
  chat: ChatMessage[];
  meetings: Meeting[];
  tasks: Task[];
};

const STORAGE_KEY = "lorapok-studio-v5";
const initialState: StudioState = {
  content: [
    { id: "release", title: "Living Universe 5.0 release story", universe: "Open Source", status: "Ready" },
    { id: "cloud", title: "Cloud services capability brief", universe: "Business", status: "Draft" },
    { id: "ribo", title: "Meet Ribo: the studio guide", universe: "Open Source", status: "Draft" },
  ],
  offers: [
    { id: "audit", title: "Open-source architecture audit", detail: "Discovery and evidence review · pricing pending", active: false },
    { id: "studio", title: "Product studio consultation", detail: "Design, engineering and launch planning", active: true },
  ],
  feedback: [
    { id: "f1", author: "Community visitor", message: "The two universes are much easier to understand now.", status: "New" },
    { id: "f2", author: "Project maintainer", message: "Please add a clearer route to contribution guides.", status: "Reviewed" },
    { id: "f3", author: "Potential client", message: "Interested in a technical discovery session.", status: "New" },
  ],
  drafts: [
    { id: "d1", subject: "Partnership inquiry — response draft", body: "Thank you for reaching out to Lorapok Labs…" },
  ],
  chat: [
    { id: "c1", author: "Ribo", body: "Studio is ready. Remember: evidence before assertion.", time: "09:12" },
    { id: "c2", author: "Editorial", body: "Release story is in review.", time: "09:18" },
  ],
  meetings: [],
  tasks: [
    { id: "t1", title: "Review Living Universe release copy", status: "In progress" },
    { id: "t2", title: "Confirm LoraHost pricing source", status: "Backlog" },
    { id: "t3", title: "Verify official founding year", status: "Backlog" },
    { id: "t4", title: "Complete mobile Studio QA", status: "Done" },
  ],
};

const toolMeta: Record<StudioTool, { label: string; eyebrow: string; description: string; icon: typeof FileText; mode: "Connected" | "Browser demo" }> = {
  content: { label: "Content desk", eyebrow: "Publishing", description: "Plan public stories and business updates without mixing their audiences.", icon: FileText, mode: "Browser demo" },
  "team-studio": { label: "Team portfolios", eyebrow: "People", description: "Review the real team directory, specialties and public portfolio paths.", icon: Users, mode: "Connected" },
  offers: { label: "Offers", eyebrow: "Business universe", description: "Draft commercial offers while unresolved pricing stays visibly unpublished.", icon: BadgePercent, mode: "Browser demo" },
  feedback: { label: "Feedback inbox", eyebrow: "Community signals", description: "Moderate ideas, questions and public product feedback.", icon: MessageSquareText, mode: "Browser demo" },
  mail: { label: "Mail drafts", eyebrow: "Communications", description: "Prepare responses locally. This module never sends email.", icon: Mail, mode: "Browser demo" },
  chat: { label: "Team chat", eyebrow: "Collaboration", description: "A local simulation for planning product and editorial work.", icon: MessageSquareText, mode: "Browser demo" },
  meetings: { label: "Meeting links", eyebrow: "Collaboration", description: "Generate shareable room links without creating accounts or invitations.", icon: Video, mode: "Browser demo" },
  tasks: { label: "Task board", eyebrow: "Operations", description: "Move launch tasks through a lightweight local workflow.", icon: ListChecks, mode: "Browser demo" },
  social: { label: "Social cards", eyebrow: "Publishing", description: "Compose and export 1200×630 release artwork in the browser.", icon: GalleryHorizontalEnd, mode: "Browser demo" },
  brand: { label: "Brand gallery", eyebrow: "Identity system", description: "Explore Ribo moods, sanctuary species, operational characters, authentic mascot references and the approved color language.", icon: Palette, mode: "Connected" },
};

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function readState(): StudioState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;
    const parsed = { ...initialState, ...JSON.parse(stored) } as StudioState;
    parsed.content = parsed.content.map((item) => ({ ...item, status: (item.status as string) === "Published" ? "Ready" : item.status }));
    return parsed;
  } catch {
    return initialState;
  }
}

export default function StudioOperationsPanel({ tool }: { tool: StudioTool }) {
  const [state, setState] = useState<StudioState>(readState);
  const meta = toolMeta[tool];
  const Icon = meta.icon;

  const update = (next: StudioState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="studio-tool-page">
      <header className="studio-tool-header">
        <div className="studio-tool-icon"><Icon size={24} /></div>
        <div>
          <span className="studio-overline">{meta.eyebrow}</span>
          <h1>{meta.label}</h1>
          <p>{meta.description}</p>
        </div>
        <span className={`studio-mode-badge ${meta.mode === "Connected" ? "connected" : "demo"}`}>{meta.mode}</span>
      </header>
      <div className="studio-tool-notice"><Circle size={8} fill="currentColor" /> Changes in demo modules are stored only in this browser. No message, meeting or publication is sent externally.</div>
      {tool === "content" && <ContentDesk state={state} update={update} />}
      {tool === "team-studio" && <TeamStudio />}
      {tool === "offers" && <OffersDesk state={state} update={update} />}
      {tool === "feedback" && <FeedbackDesk state={state} update={update} />}
      {tool === "mail" && <MailDesk state={state} update={update} />}
      {tool === "chat" && <ChatDesk state={state} update={update} />}
      {tool === "meetings" && <MeetingDesk state={state} update={update} />}
      {tool === "tasks" && <TaskDesk state={state} update={update} />}
      {tool === "social" && <SocialCardStudio />}
      {tool === "brand" && <BrandGallery />}
    </div>
  );
}

function ContentDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [title, setTitle] = useState("");
  const [universe, setUniverse] = useState<ContentItem["universe"]>("Open Source");
  const add = () => {
    if (!title.trim()) return;
    update({ ...state, content: [{ id: createId("content"), title: title.trim(), universe, status: "Draft" }, ...state.content] });
    setTitle("");
  };
  return <div className="studio-workspace-grid">
    <section className="studio-workspace-card studio-form-card">
      <span className="studio-overline">New story</span><h2>Create a draft</h2>
      <label>Working title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What are we publishing?" /></label>
      <label>Universe<select value={universe} onChange={(event) => setUniverse(event.target.value as ContentItem["universe"])}><option>Open Source</option><option>Business</option></select></label>
      <button className="studio-primary-button" onClick={add}><Plus size={16} /> Add draft</button>
    </section>
    <section className="studio-workspace-card studio-list-card">
      <div className="workspace-card-heading"><div><span className="studio-overline">Queue</span><h2>Editorial pipeline</h2></div><strong>{state.content.length}</strong></div>
      {state.content.map((item) => <article className="studio-row" key={item.id}>
        <div><span className="studio-row-tag">{item.universe}</span><h3>{item.title}</h3></div>
        <select className={`studio-status-button ${item.status.toLowerCase()}`} aria-label={`Status for ${item.title}`} value={item.status} onChange={(event) => update({ ...state, content: state.content.map((entry) => entry.id === item.id ? { ...entry, status: event.target.value as ContentItem["status"] } : entry) })}><option>Draft</option><option>Review</option><option>Ready</option></select>
      </article>)}
    </section>
  </div>;
}

function TeamStudio() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => teamMembers.filter((member) => `${member.name} ${member.role} ${member.department}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <section className="studio-workspace-card">
    <div className="workspace-card-heading"><div><span className="studio-overline">Connected directory</span><h2>{visible.length} portfolio profiles</h2></div><label className="studio-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people or roles" /></label></div>
    <div className="studio-team-grid">{visible.map((member) => <article key={member.id} className="studio-person-card">
      <img src={member.avatar} alt="" /><div><span>{member.department}</span><h3>{member.name}</h3><p>{member.role}</p><small>{member.location}</small></div>
      {member.social.portfolio && <a href={member.social.portfolio} target="_blank" rel="noreferrer">Portfolio <ArrowRight size={14} /></a>}
    </article>)}</div>
  </section>;
}

function OffersDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const add = () => {
    if (!title.trim()) return;
    update({ ...state, offers: [{ id: createId("offer"), title: title.trim(), detail: detail.trim() || "Details pending review", active: false }, ...state.offers] });
    setTitle(""); setDetail("");
  };
  return <div className="studio-workspace-grid">
    <section className="studio-workspace-card studio-form-card"><span className="studio-overline">Offer builder</span><h2>Draft an offer</h2>
      <label>Offer name<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Service or campaign" /></label>
      <label>Public detail<textarea value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Scope, audience or verified price" /></label>
      <button className="studio-primary-button" onClick={add}><Plus size={16} /> Save offer</button>
    </section>
    <section className="studio-workspace-card studio-list-card"><span className="studio-overline">Business universe</span><h2>Offer status</h2>
      {state.offers.map((offer) => <article className="studio-offer-card" key={offer.id}><div><span>{offer.active ? "Ready for review" : "Private draft"}</span><h3>{offer.title}</h3><p>{offer.detail}</p></div><button onClick={() => update({ ...state, offers: state.offers.map((item) => item.id === offer.id ? { ...item, active: !item.active } : item) })}>{offer.active ? "Return to draft" : "Mark reviewed"}</button></article>)}
    </section>
  </div>;
}

function FeedbackDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const add = () => {
    if (!message.trim()) return;
    update({ ...state, feedback: [{ id: createId("feedback"), author: author.trim() || "Local tester", message: message.trim(), status: "New" }, ...state.feedback] });
    setAuthor(""); setMessage("");
  };
  return <div className="studio-workspace-grid"><section className="studio-workspace-card studio-form-card"><span className="studio-overline">Local intake test</span><h2>Add feedback</h2><label>Name<input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Optional" /></label><label>Feedback<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Test the moderation workflow" /></label><button className="studio-primary-button" onClick={add}><Plus size={16} /> Add to inbox</button></section><section className="studio-workspace-card"><div className="workspace-card-heading"><div><span className="studio-overline">Moderation queue</span><h2>Community feedback</h2></div><strong>{state.feedback.filter((item) => item.status === "New").length} new</strong></div>
    <div className="studio-feedback-list">{state.feedback.map((item) => <article key={item.id}><div className="feedback-avatar">{item.author[0]}</div><div><span>{item.author}</span><p>{item.message}</p></div><select value={item.status} onChange={(event) => update({ ...state, feedback: state.feedback.map((entry) => entry.id === item.id ? { ...entry, status: event.target.value as FeedbackItem["status"] } : entry) })}><option>New</option><option>Reviewed</option><option>Archived</option></select></article>)}</div>
  </section></div>;
}

function MailDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [subject, setSubject] = useState(""); const [body, setBody] = useState("");
  const save = () => { if (!subject.trim()) return; update({ ...state, drafts: [{ id: createId("draft"), subject: subject.trim(), body: body.trim() }, ...state.drafts] }); setSubject(""); setBody(""); };
  return <div className="studio-workspace-grid"><section className="studio-workspace-card studio-form-card"><span className="studio-overline">Local composer</span><h2>Prepare a response</h2>
    <label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><label>Message<textarea rows={8} value={body} onChange={(event) => setBody(event.target.value)} /></label><button className="studio-primary-button" onClick={save}><Clipboard size={16} /> Save draft</button><small className="studio-safety-copy">Sending is intentionally unavailable in this prototype.</small>
  </section><section className="studio-workspace-card studio-list-card"><span className="studio-overline">Saved locally</span><h2>Drafts</h2>{state.drafts.map((draft) => <article className="studio-draft" key={draft.id}><Mail size={17} /><div><h3>{draft.subject}</h3><p>{draft.body || "Empty draft"}</p></div></article>)}</section></div>;
}

function ChatDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [message, setMessage] = useState("");
  const send = () => { if (!message.trim()) return; const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); update({ ...state, chat: [...state.chat, { id: createId("chat"), author: "You", body: message.trim(), time }] }); setMessage(""); };
  return <section className="studio-workspace-card studio-chat-shell"><div className="workspace-card-heading"><div><span className="studio-overline">Studio room</span><h2># living-universe</h2></div><span className="studio-online"><i /> 3 simulated members</span></div>
    <div className="studio-chat-log">{state.chat.map((item) => <article key={item.id}><div className="feedback-avatar">{item.author[0]}</div><div><span>{item.author}<small>{item.time}</small></span><p>{item.body}</p></div></article>)}</div>
    <div className="studio-compose-row"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Write a local message" /><button onClick={send} aria-label="Add message"><Send size={17} /></button></div>
  </section>;
}

function MeetingDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState("");
  const create = () => { if (!title.trim()) return; const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); const url = `https://meet.jit.si/lorapok-${slug}-${Date.now().toString(36)}`; update({ ...state, meetings: [{ id: createId("meeting"), title: title.trim(), date: date || "Unscheduled", url }, ...state.meetings] }); setTitle(""); setDate(""); };
  return <div className="studio-workspace-grid"><section className="studio-workspace-card studio-form-card"><span className="studio-overline">Room generator</span><h2>Plan a meeting</h2><label>Meeting title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Date and time<input type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} /></label><button className="studio-primary-button" onClick={create}><Video size={16} /> Generate link</button></section>
    <section className="studio-workspace-card studio-list-card"><span className="studio-overline">Generated rooms</span><h2>Meeting links</h2>{state.meetings.length === 0 && <EmptyState text="No meeting links generated yet." />}{state.meetings.map((meeting) => <article className="studio-meeting" key={meeting.id}><CalendarDays size={18} /><div><h3>{meeting.title}</h3><p>{meeting.date}</p></div><button onClick={() => navigator.clipboard.writeText(meeting.url)}><Copy size={15} /> Copy</button></article>)}</section></div>;
}

function TaskDesk({ state, update }: { state: StudioState; update: (next: StudioState) => void }) {
  const [title, setTitle] = useState("");
  const add = () => { if (!title.trim()) return; update({ ...state, tasks: [...state.tasks, { id: createId("task"), title: title.trim(), status: "Backlog" }] }); setTitle(""); };
  const next: Record<Task["status"], Task["status"]> = { Backlog: "In progress", "In progress": "Done", Done: "Backlog" };
  return <section className="studio-workspace-card"><div className="studio-compose-row task-compose"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add an operational task" /><button onClick={add}><Plus size={17} /></button></div>
    <div className="studio-task-columns">{(["Backlog", "In progress", "Done"] as Task["status"][]).map((status) => <div key={status}><div className="task-column-title"><span>{status}</span><strong>{state.tasks.filter((item) => item.status === status).length}</strong></div>{state.tasks.filter((item) => item.status === status).map((task) => <button key={task.id} onClick={() => update({ ...state, tasks: state.tasks.map((item) => item.id === task.id ? { ...item, status: next[item.status] } : item) })}><span className="task-check">{status === "Done" && <Check size={12} />}</span>{task.title}<ArrowRight size={13} /></button>)}</div>)}</div>
  </section>;
}

function SocialCardStudio() {
  const [title, setTitle] = useState("Living Universe 5.0"); const [subtitle, setSubtitle] = useState("One living system. Two clear universes."); const [accent, setAccent] = useState("#67f5bb");
  const exportCard = () => {
    const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 630; const context = canvas.getContext("2d"); if (!context) return;
    const gradient = context.createLinearGradient(0, 0, 1200, 630); gradient.addColorStop(0, "#061c17"); gradient.addColorStop(1, "#13243b"); context.fillStyle = gradient; context.fillRect(0, 0, 1200, 630);
    context.fillStyle = accent; context.beginPath(); context.arc(1020, 95, 190, 0, Math.PI * 2); context.globalAlpha = .18; context.fill(); context.globalAlpha = 1;
    context.fillStyle = accent; context.font = "700 25px sans-serif"; context.fillText("LORAPOK LABS · LIVING UNIVERSE", 80, 100);
    context.fillStyle = "#effff8"; context.font = "700 72px sans-serif"; wrapCanvasText(context, title, 80, 245, 980, 82);
    context.fillStyle = "#abc9be"; context.font = "32px sans-serif"; wrapCanvasText(context, subtitle, 80, 455, 920, 42);
    context.fillStyle = accent; context.fillRect(80, 550, 180, 8);
    const link = document.createElement("a"); link.download = "lorapok-social-card.png"; link.href = canvas.toDataURL("image/png"); link.click();
  };
  return <div className="studio-workspace-grid social-grid"><section className="studio-workspace-card studio-form-card"><span className="studio-overline">Card composer</span><h2>Build a release card</h2><label>Headline<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Supporting line<textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label><label>Accent<input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label><button className="studio-primary-button" onClick={exportCard}><Download size={16} /> Export PNG</button></section>
    <section className="studio-social-preview" style={{ "--social-accent": accent } as CSSProperties}><span>Lorapok Labs · Living Universe</span><h2>{title}</h2><p>{subtitle}</p><i /></section></div>;
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" "); let line = ""; let lineY = y;
  words.forEach((word) => { const test = `${line}${word} `; if (context.measureText(test).width > maxWidth && line) { context.fillText(line, x, lineY); line = `${word} `; lineY += lineHeight; } else line = test; });
  context.fillText(line, x, lineY);
}

function BrandGallery() {
  const moods = [
    { id: "curious", label: "Curious", description: "Discovery and open questions" },
    { id: "focused", label: "Focused", description: "Engineering and deep work" },
    { id: "celebrating", label: "Celebrating", description: "Releases and community wins" },
    { id: "thinking", label: "Thinking", description: "Research and reflection" },
    { id: "presenting", label: "Presenting", description: "Demos and product stories" },
    { id: "exploring", label: "Exploring", description: "Discovery and active investigation" },
  ];
  const species = [
    { id: "vaultie", label: "Vaultie", description: "Scavenger and code keeper", signal: "Charcoal · cyan" },
    { id: "apex-sovereign", label: "Instar-6 Apex", description: "Sovereign release guardian", signal: "Gold · amber" },
    { id: "neon-scout", label: "Neon Scout", description: "Low-latency explorer", signal: "Lime · cyan" },
    { id: "deep-diver", label: "Deep Diver", description: "AI research navigator", signal: "Violet · indigo" },
    { id: "robo-worker", label: "Robo-Worker", description: "Resilient infrastructure scaler", signal: "Titanium · mint" },
  ];
  const roles = [
    { id: "bio-researcher", label: "Bio-Researcher", description: "LoLaBo and research surfaces" },
    { id: "release-publisher", label: "Release Publisher", description: "Editorial and launch surfaces" },
    { id: "network-guardian", label: "Network Guardian", description: "Access, RBAC and security" },
    { id: "systems-engineer", label: "Systems Engineer", description: "Projects and deployment" },
    { id: "community-host", label: "Community Host", description: "Team, feedback and welcome" },
  ];
  const referenceCollection = [
    { id: "labs-research-director", family: "Labs", label: "Research Director", description: "Biology and AI research" },
    { id: "labs-open-source-builder", family: "Labs", label: "Open Source Builder", description: "Engineering and modular systems" },
    { id: "labs-community-orchestrator", family: "Labs", label: "Community Orchestrator", description: "Collaboration and connected signals" },
    { id: "automate-care-coordinator", family: "Automate", label: "Care Coordinator", description: "Safe clinical workflows" },
    { id: "automate-recovery-guide", family: "Automate", label: "Recovery Guide", description: "Responsible recovery states" },
    { id: "lorahost-cloud-navigator", family: "LoraHost", label: "Cloud Navigator", description: "Hosting and global delivery" },
    { id: "lorahost-server-guardian", family: "LoraHost", label: "Server Guardian", description: "Infrastructure protection" },
    { id: "lolabo-research-engine", family: "LoLaBo", label: "Research Engine", description: "Evidence and citation synthesis" },
    { id: "system-guide", family: "System", label: "System Guide", description: "Assistant and product navigation" },
    { id: "release-conductor", family: "Labs", label: "Release Conductor", description: "Publishing and launches" },
  ];
  const innerPageRoles = [
    { id: "ecosystem-cartographer", family: "Labs", label: "Ecosystem Cartographer", description: "Projects and product discovery" },
    { id: "formation-commander", family: "Loragent", label: "Formation Commander", description: "Agent orchestration and skills" },
    { id: "collective-facilitator", family: "Labs", label: "Collective Facilitator", description: "About and team surfaces" },
    { id: "release-historian", family: "Labs", label: "Release Historian", description: "Changelog and milestones" },
    { id: "documentation-librarian", family: "LoLaBo", label: "Documentation Librarian", description: "Research and technical documentation" },
    { id: "communications-concierge", family: "Labs", label: "Communications Concierge", description: "Contact and support routing" },
  ];
  const brandAssets = [
    { id: "labs-lockup", family: "Labs", label: "Master lockup", path: "/assets/brand-library/labs/master-lockup.svg", type: "SVG", use: "Headers and documentation" },
    { id: "labs-glass", family: "Labs", label: "Sensory glass icon", path: "/assets/brand-library/labs/sensory-glass.webp", type: "WebP", use: "App and product surfaces" },
    { id: "labs-og", family: "Labs", label: "Open Graph card", path: "/assets/brand-library/labs/opengraph.webp", type: "WebP", use: "Social and link previews" },
    { id: "host-lockup", family: "LoraHost", label: "Master lockup", path: "/assets/brand-library/lorahost/master-lockup.svg", type: "SVG", use: "Hosting product headers" },
    { id: "host-glass", family: "LoraHost", label: "Sensory glass icon", path: "/assets/brand-library/lorahost/sensory-glass.webp", type: "WebP", use: "Hosting app surfaces" },
    { id: "host-launch", family: "LoraHost", label: "Launch campaign card", path: "/assets/brand-library/lorahost/launch-card.webp", type: "WebP", use: "Campaign reference" },
    { id: "automate-lockup", family: "Automate", label: "Horizontal lockup", path: "/assets/brand-library/automate/lockup.svg", type: "SVG", use: "Automation product headers" },
    { id: "automate-mark", family: "Automate", label: "Product mark", path: "/assets/brand-library/automate/mark.svg", type: "SVG", use: "Compact automation UI" },
    { id: "automate-success", family: "Automate", label: "Success state", path: "/assets/brand-library/automate/mascot-success.webp", type: "WebP", use: "Completed workflows" },
    { id: "automate-recovery", family: "Automate", label: "Recovery state", path: "/assets/brand-library/automate/mascot-recovery.webp", type: "WebP", use: "Recovery workflows" },
    { id: "ecosystem-strip", family: "Ecosystem", label: "Co-branded strip", path: "/assets/brand-library/ecosystem/co-branded-strip.webp", type: "WebP", use: "Labs and LoraHost bridges" },
  ];
  const [activeMood, setActiveMood] = useState(() => localStorage.getItem("lorapok-ribo-mood") || "curious");
  const [assetFamily, setAssetFamily] = useState("All");
  const [copiedAsset, setCopiedAsset] = useState("");
  const visibleBrandAssets = brandAssets.filter((asset) => assetFamily === "All" || asset.family === assetFamily);
  const copyAssetPath = async (path: string) => {
    await navigator.clipboard.writeText(path);
    setCopiedAsset(path);
    window.setTimeout(() => setCopiedAsset(""), 1600);
  };
  useEffect(() => {
    localStorage.setItem("lorapok-ribo-mood", activeMood);
    document.documentElement.dataset.riboMood = activeMood;
  }, [activeMood]);
  return <><section className="studio-brand-tokens"><div><span>Forest</span><strong>#061C17</strong></div><div><span>Mint signal</span><strong>#67F5BB</strong></div><div><span>Lavender mind</span><strong>#D4CCFF</strong></div><div><span>Solar note</span><strong>#EBFA87</strong></div></section>
    <section className="studio-workspace-card"><div className="workspace-card-heading"><div><span className="studio-overline">Ribo moods</span><h2>One guide, many signals</h2></div><Palette size={22} /></div><div className="studio-ribo-gallery">{moods.map((mood) => <button type="button" aria-pressed={activeMood === mood.id} className={activeMood === mood.id ? "active" : ""} onClick={() => setActiveMood(mood.id)} key={mood.id}><img className="mini-ribo" src={`/assets/ribo/ribo-${mood.id}.webp`} alt={`${mood.label} Ribo pose`} /><h3>{mood.label}</h3><p>{mood.description}</p></button>)}</div></section>
    <section className="studio-workspace-card studio-brand-library"><div className="workspace-card-heading"><div><span className="studio-overline">Larva sanctuary</span><h2>Five restored species</h2></div><span className="studio-library-count">05 species</span></div><div className="studio-character-gallery">{species.map((item) => <article key={item.id}><span className="studio-character-signal">{item.signal}</span><img className="mini-ribo" src={`/assets/ribo/species/${item.id}.webp`} alt={`${item.label} 3D larva species`} loading="lazy" /><h3>{item.label}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="studio-workspace-card studio-brand-library"><div className="workspace-card-heading"><div><span className="studio-overline">Operational character set</span><h2>Ribo at work</h2></div><span className="studio-library-count">05 roles</span></div><div className="studio-character-gallery studio-role-gallery">{roles.map((item) => <article key={item.id}><img className="mini-ribo" src={`/assets/ribo/roles/${item.id}.webp`} alt={`${item.label} Ribo character`} loading="lazy" /><h3>{item.label}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="studio-workspace-card studio-brand-library"><div className="workspace-card-heading"><div><span className="studio-overline">Authentic reference expansion</span><h2>Product worlds, one mascot family</h2></div><span className="studio-library-count">10 new roles</span></div><div className="studio-character-gallery studio-reference-gallery">{referenceCollection.map((item) => <article key={item.id} data-family={item.family}><span className="studio-character-signal">{item.family}</span><img className="mini-ribo" src={`/assets/ribo/collections/${item.id}.webp`} alt={`${item.label} ${item.family} mascot`} loading="lazy" /><h3>{item.label}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="studio-workspace-card studio-brand-library"><div className="workspace-card-heading"><div><span className="studio-overline">Inner-page companions</span><h2>Context-aware guides</h2></div><span className="studio-library-count">06 roles</span></div><div className="studio-character-gallery studio-reference-gallery">{innerPageRoles.map((item) => <article key={item.id} data-family={item.family}><span className="studio-character-signal">{item.family}</span><img className="mini-ribo" src={`/assets/ribo/inner-pages/${item.id}.webp`} alt={`${item.label} ${item.family} mascot`} loading="lazy" /><h3>{item.label}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="studio-workspace-card studio-brand-library studio-asset-library"><div className="workspace-card-heading"><div><span className="studio-overline">Approved source library</span><h2>Browse, select and reuse</h2></div><span className="studio-library-count">{brandAssets.length.toString().padStart(2, "0")} originals</span></div>
      <div className="studio-asset-filters" role="group" aria-label="Filter brand assets">{["All", "Labs", "LoraHost", "Automate", "Ecosystem"].map((family) => <button type="button" key={family} className={assetFamily === family ? "active" : ""} aria-pressed={assetFamily === family} onClick={() => setAssetFamily(family)}>{family}</button>)}</div>
      <div className="studio-asset-grid">{visibleBrandAssets.map((asset) => <article key={asset.id} data-family={asset.family}><div className="studio-asset-preview"><img src={asset.path} alt={`${asset.family} ${asset.label}`} loading="lazy" /></div><span>{asset.family} · {asset.type}</span><h3>{asset.label}</h3><p>{asset.use}</p><div className="studio-asset-actions"><button type="button" onClick={() => copyAssetPath(asset.path)}>{copiedAsset === asset.path ? <Check size={13} /> : <Copy size={13} />}{copiedAsset === asset.path ? "Copied" : "Copy path"}</button><a href={asset.path} download><Download size={13} /> Download</a></div></article>)}</div>
    </section>
  </>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="studio-empty"><Circle size={10} /> {text}</div>;
}
