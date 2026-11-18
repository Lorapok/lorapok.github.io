import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, GitBranch, PackageCheck, Plus, RefreshCw, Save, Search, ShieldCheck } from "lucide-react";
import { categories, type ProjectCategory } from "../../data/lorapok";
import { packageReleases, registrySnapshotDate } from "../../data/packageReleases";
import { createOfficeProject, saveOfficeProject, subscribeOfficeProjects } from "../../lib/projectOfficeService";
import type { GitHubProjectInventory, OfficeProject, ProjectModel, ProjectStage, ProjectVisibility } from "../../types/officeProjects";
import { useDevAuth } from "../DevAuth";

const EDITABLE_CATEGORIES = categories.filter((category): category is ProjectCategory => category !== "All");

function emptyOfficeProject(): OfficeProject {
  const now = new Date().toISOString();
  const id = `office-${Date.now()}`;
  return {
    id,
    owner: "Lorapok Office",
    name: "new-project",
    fullName: `Lorapok Office/${id}`,
    displayName: "New project",
    description: "",
    summary: "",
    url: "https://github.com/Lorapok",
    homepage: "",
    language: "Other",
    topics: [],
    stars: 0,
    forks: 0,
    archived: false,
    fork: false,
    visibility: "draft",
    category: "Developer Tools",
    featured: false,
    defaultBranch: "main",
    createdAt: now,
    updatedAt: now,
    pushedAt: now,
    source: "office",
    badge: "Office draft",
    projectModel: "unclassified",
    stage: "idea",
    origin: "office",
  };
}

export default function ProjectsPanel() {
  const { user } = useDevAuth();
  const [projects, setProjects] = useState<OfficeProject[]>([]);
  const [inventory, setInventory] = useState<GitHubProjectInventory | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<OfficeProject | null>(null);
  const [search, setSearch] = useState("");
  const [owner, setOwner] = useState("all");
  const [visibility, setVisibility] = useState<"all" | ProjectVisibility>("all");
  const [projectModel, setProjectModel] = useState<"all" | ProjectModel>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => subscribeOfficeProjects(
    (next, meta) => {
      setProjects(next);
      setInventory(meta);
      setLoading(false);
      const first = next[0];
      setSelectedId((current) => current || first?.id || "");
      setDraft((current) => current || (first ? { ...first, topics: [...first.topics] } : null));
    },
    () => {
      setLoading(false);
      setNotice("The static inventory is available, but live Office overrides could not be loaded.");
    },
  ), []);

  const owners = useMemo(() => Array.from(new Set(projects.map((project) => project.owner))).sort(), [projects]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery = !query || [project.displayName, project.name, project.fullName, project.summary, project.description, project.language]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
      const matchesOwner = owner === "all" || project.owner === owner;
      const matchesVisibility = visibility === "all" || project.visibility === visibility;
      const matchesModel = projectModel === "all" || (project.projectModel || "unclassified") === projectModel;
      return matchesQuery && matchesOwner && matchesVisibility && matchesModel;
    });
  }, [owner, projectModel, projects, search, visibility]);

  const stats = useMemo(() => ({
    repos: projects.length,
    published: projects.filter((project) => project.visibility === "published").length,
    commercial: projects.filter((project) => project.projectModel === "commercial").length,
    openSource: projects.filter((project) => project.projectModel === "open-source").length,
  }), [projects]);

  const updateDraft = <K extends keyof OfficeProject>(key: K, value: OfficeProject[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async () => {
    if (!draft || !user?.email) return;
    if (draft.visibility === "published" && !draft.url && !draft.homepage) {
      setNotice("Add a public repository, website, or documentation URL before publishing this local project.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      if (draft.source === "office" && !projects.some((project) => project.id === draft.id)) {
        await createOfficeProject(draft, user.email);
      } else {
        await saveOfficeProject(draft, user.email);
      }
      setNotice(draft.visibility === "published" ? "Project saved and published to the live catalog." : "Project saved privately in Lorapok Labs Office.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Project record could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    const project = emptyOfficeProject();
    setDraft(project);
    setSelectedId(project.id);
    setNotice("Complete the new Office project record, then save it as a draft or publish it.");
  };

  return (
    <div className="dev-panel-content office-projects">
      <div className="dev-panel-header office-projects__header">
        <div>
          <div className="dev-panel-title">Project <span>Office</span></div>
          <div className="dev-panel-sub">GitHub inventory, publishing metadata, and public catalog controls in one authenticated workspace.</div>
        </div>
        <div className="office-projects__actions">
          <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => window.location.reload()}><RefreshCw size={14} /> Refresh inventory</button>
          <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={addProject}><Plus size={14} /> New Office project</button>
        </div>
      </div>

      <div className="dev-g4 office-projects__stats">
        {[
          [stats.repos, "Office records"],
          [stats.published, "published records"],
          [stats.openSource, "open-source"],
          [stats.commercial, "commercial"],
        ].map(([value, label]) => (
          <div key={label} className="dev-card dev-card-sm"><div className="dev-stat-num">{value}</div><div className="dev-stat-label">{label}</div></div>
        ))}
      </div>

      <div className="office-projects__boundary">
        <ShieldCheck size={16} />
        <span><strong>Privacy boundary:</strong> the committed inventory contains public repositories only. Private repository names and metadata never enter the public website bundle.</span>
        {inventory && <small>GitHub snapshot: {new Date(inventory.generatedAt).toLocaleString()}</small>}
      </div>

      {notice && <div className="office-projects__notice" role="status">{notice}</div>}

      <div className="office-projects__workspace">
        <section className="office-projects__browser" aria-label="Repository inventory">
          <div className="office-projects__filters">
            <label className="office-projects__search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search repositories" /></label>
            <select value={owner} onChange={(event) => setOwner(event.target.value)} aria-label="Filter by owner">
              <option value="all">All owners</option>
              {owners.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)} aria-label="Filter by publishing state">
              <option value="all">All states</option><option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option>
            </select>
            <select value={projectModel} onChange={(event) => setProjectModel(event.target.value as typeof projectModel)} aria-label="Filter by business model">
              <option value="all">All models</option><option value="unclassified">Unclassified</option><option value="open-source">Open source</option><option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="office-projects__list">
            {loading ? <div className="dev-shimmer office-projects__loading" /> : filtered.map((project) => (
              <button key={project.id} type="button" className={`office-project-row${selectedId === project.id ? " active" : ""}`} onClick={() => { setSelectedId(project.id); setDraft({ ...project, topics: [...project.topics] }); }}>
                <span className="office-project-row__icon"><GitBranch size={16} /></span>
                <span><strong>{project.displayName || project.name}</strong><small>{project.fullName} · {project.projectModel === "open-source" ? "open source" : project.projectModel || "unclassified"}</small></span>
                <span className={`office-project-row__state state-${project.visibility}`}>{project.visibility}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="office-projects__editor" aria-label="Project editor">
          {draft ? (
            <>
              <div className="office-projects__editor-heading">
                <div><span>Project record</span><h2>{draft.displayName || draft.name}</h2><p>{draft.fullName}</p></div>
                {draft.url ? <a href={draft.url} target="_blank" rel="noreferrer" className="dev-btn dev-btn-ghost dev-btn-sm">Repository <ExternalLink size={13} /></a> : <span className="office-projects__local-badge">Local idea</span>}
              </div>

              <div className="office-projects__form-grid">
                <label><span>Display name</span><input value={draft.displayName || ""} onChange={(event) => updateDraft("displayName", event.target.value)} /></label>
                <label><span>Publishing state</span><select value={draft.visibility} onChange={(event) => updateDraft("visibility", event.target.value as ProjectVisibility)}><option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option></select></label>
                <label><span>Category</span><select value={draft.category} onChange={(event) => updateDraft("category", event.target.value as ProjectCategory)}>{EDITABLE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label><span>Language / stack</span><input value={draft.language} onChange={(event) => updateDraft("language", event.target.value)} /></label>
                <label><span>Business model</span><select value={draft.projectModel || "unclassified"} onChange={(event) => updateDraft("projectModel", event.target.value as ProjectModel)}><option value="unclassified">Unclassified — decide later</option><option value="open-source">Open source</option><option value="commercial">Commercial</option></select></label>
                <label><span>Lifecycle stage</span><select value={draft.stage || "active"} onChange={(event) => updateDraft("stage", event.target.value as ProjectStage)}><option value="idea">Idea</option><option value="prototype">Prototype</option><option value="active">Active</option><option value="paused">Paused</option><option value="archived">Archived</option></select></label>
                <label className="office-projects__wide"><span>Public summary</span><textarea rows={3} value={draft.summary || draft.description} onChange={(event) => updateDraft("summary", event.target.value)} /></label>
                <label className="office-projects__wide"><span>Live or documentation URL</span><input type="url" value={draft.homepage} onChange={(event) => updateDraft("homepage", event.target.value)} placeholder="https://project.lorapok.tech" /></label>
                <label><span>Badge</span><input value={draft.badge || ""} onChange={(event) => updateDraft("badge", event.target.value)} placeholder="Open source" /></label>
                <label><span>Topics</span><input value={draft.topics.join(", ")} onChange={(event) => updateDraft("topics", event.target.value.split(",").map((topic) => topic.trim()).filter(Boolean))} /></label>
                <label className="office-projects__wide"><span>Product image URL</span><input value={draft.image || ""} onChange={(event) => updateDraft("image", event.target.value)} placeholder="/assets/projects/generated/project-product-v2.webp" /></label>
                <label><span>Image presentation</span><select value={draft.imageType || "cover"} onChange={(event) => updateDraft("imageType", event.target.value as "cover" | "icon")}><option value="cover">Wide product cover</option><option value="icon">Centered product icon</option></select></label>
                {draft.localFolder && <label className="office-projects__wide"><span>Local source folder</span><input value={draft.localFolder} readOnly /></label>}
              </div>

              <label className="office-projects__featured"><input type="checkbox" checked={draft.featured} onChange={(event) => updateDraft("featured", event.target.checked)} /><span><Check size={14} /> Feature this project in Office-powered views</span></label>

              <div className="office-projects__savebar">
                <div><strong>{draft.stars}</strong> stars · <strong>{draft.forks}</strong> forks · pushed {draft.pushedAt ? new Date(draft.pushedAt).toLocaleDateString() : "not recorded"}</div>
                <button className="dev-btn dev-btn-primary" disabled={saving} onClick={save}>{saving ? <RefreshCw className="dev-auth-spinner" size={15} /> : <Save size={15} />} {saving ? "Saving" : "Save project"}</button>
              </div>
            </>
          ) : <div className="office-projects__empty">Select a repository to review its Office metadata.</div>}
        </section>
      </div>

      <section className="office-registry-snapshot" aria-labelledby="office-registry-title">
        <div className="office-registry-snapshot__heading">
          <div><span><PackageCheck size={14} /> Public distribution</span><h2 id="office-registry-title">Package registry snapshot</h2><p>Source-controlled publishing evidence from the public npm and Packagist APIs. Package metadata is changed at its registry, then verified before the public newsroom is updated.</p></div>
          <a className="dev-btn dev-btn-ghost dev-btn-sm" href="/changelog/" target="_blank" rel="noreferrer">Open public newsroom <ExternalLink size={13} /></a>
        </div>
        <div className="office-registry-snapshot__stats">
          <span><strong>{packageReleases.filter((item) => item.registry === "npm").length}</strong> npm</span>
          <span><strong>{packageReleases.filter((item) => item.registry === "Packagist").length}</strong> Packagist</span>
          <span><strong>{new Set(packageReleases.map((item) => item.product)).size}</strong> product families</span>
          <span><strong>{new Date(registrySnapshotDate).toLocaleDateString()}</strong> last verified</span>
        </div>
        <div className="office-registry-snapshot__list">
          {packageReleases.map((release) => (
            <a key={`${release.registry}:${release.name}`} href={release.registryUrl} target="_blank" rel="noreferrer" className="office-registry-row">
              <span className={`office-registry-row__mark is-${release.registry.toLowerCase()}`}>{release.registry === "npm" ? "npm" : "P"}</span>
              <span><strong>{release.name}</strong><small>{release.product} · {release.status}</small></span>
              <code>{release.version}</code>
              <time dateTime={release.publishedAt}>{new Date(release.publishedAt).toLocaleDateString()}</time>
              <ExternalLink size={13} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
