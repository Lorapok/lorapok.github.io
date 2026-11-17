import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ExternalLink, Handshake, Plus, RefreshCw, Save, Search, ShieldCheck } from "lucide-react";
import { partnerRelationshipLabels } from "../../data/partners";
import { saveOfficePartner, subscribeOfficePartners } from "../../lib/partnerService";
import type { PartnerRecord, PartnerRelationship, PartnerStatus, PartnerVisibility } from "../../types/partners";
import { useDevAuth } from "../DevAuth";

function emptyPartner(): PartnerRecord {
  const stamp = Date.now();
  return {
    id: `partner-${stamp}`,
    name: "New partner",
    slug: `partner-${stamp}`,
    tagline: "",
    description: "",
    relationship: "affiliate-reference",
    status: "pending",
    visibility: "draft",
    websiteUrl: "",
    offerUrl: "",
    offerLabel: "",
    offerDetail: "",
    discountCode: "",
    termsUrl: "",
    adminUrl: "",
    logoUrl: "",
    accent: "#67f5bb",
    featured: false,
    verifiedAt: new Date().toISOString().slice(0, 10),
    sourceNote: "",
    sortOrder: 100,
  };
}

export default function PartnersPanel() {
  const { user } = useDevAuth();
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<PartnerRecord | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | PartnerStatus>("all");
  const [visibility, setVisibility] = useState<"all" | PartnerVisibility>("all");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => subscribeOfficePartners((next) => {
    setPartners(next);
    setSelectedId((current) => current || next[0]?.id || "");
    setDraft((current) => current || (next[0] ? { ...next[0] } : null));
  }, () => setNotice("Partner records are available from the built-in registry, but live Office changes could not be loaded.")), []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return partners.filter((partner) => {
      const matchesQuery = !query || [partner.name, partner.tagline, partner.description, partner.offerLabel].some((value) => value.toLowerCase().includes(query));
      return matchesQuery && (status === "all" || partner.status === status) && (visibility === "all" || partner.visibility === visibility);
    });
  }, [partners, search, status, visibility]);

  const stats = useMemo(() => ({
    records: partners.length,
    live: partners.filter((partner) => partner.visibility === "published" && partner.status === "active").length,
    pending: partners.filter((partner) => partner.status === "pending").length,
    paused: partners.filter((partner) => partner.status === "paused").length,
  }), [partners]);

  const updateDraft = <K extends keyof PartnerRecord>(key: K, value: PartnerRecord[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);

  const save = async () => {
    if (!draft || !user?.email) return;
    if (!draft.name.trim() || !draft.websiteUrl.trim()) {
      setNotice("Add the partner name and provider website before saving.");
      return;
    }
    if (draft.visibility === "published" && draft.status !== "active") {
      setNotice("Only active records can be published. Change the status to active or keep this record private.");
      return;
    }
    if (draft.visibility === "published" && !draft.offerUrl.trim()) {
      setNotice("Add the verified public offer or provider URL before publishing.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      await saveOfficePartner(draft, user.email);
      setNotice(draft.visibility === "published" ? "Partner saved and synchronized to the public directory." : "Partner saved privately in Lorapok Labs Office.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Partner record could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dev-panel-content office-projects office-partners">
      <div className="dev-panel-header office-projects__header">
        <div><div className="dev-panel-title">Partner <span>Office</span></div><div className="dev-panel-sub">Verified relationships, benefits, disclosures, and public publishing from one authenticated workspace.</div></div>
        <div className="office-projects__actions"><button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => window.location.reload()}><RefreshCw size={14} /> Refresh</button><button className="dev-btn dev-btn-primary dev-btn-sm" onClick={() => { const partner = emptyPartner(); setDraft(partner); setSelectedId(partner.id); setNotice("Complete the record, verify the public benefit, then save it privately or publish it."); }}><Plus size={14} /> New partner</button></div>
      </div>

      <div className="dev-g4 office-projects__stats">
        {[[stats.records, "partner records"], [stats.live, "live listings"], [stats.pending, "pending review"], [stats.paused, "paused"]].map(([value, label]) => <div key={label} className="dev-card dev-card-sm"><div className="dev-stat-num">{value}</div><div className="dev-stat-label">{label}</div></div>)}
      </div>

      <div className="office-projects__boundary"><ShieldCheck size={16} /><span><strong>Publishing boundary:</strong> internal notes and management links stay in Office. Only active, published records are copied to the public directory.</span></div>
      {notice && <div className="office-projects__notice" role="status">{notice}</div>}

      <div className="office-projects__workspace">
        <section className="office-projects__browser" aria-label="Partner inventory">
          <div className="office-projects__filters">
            <label className="office-projects__search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search partners" /></label>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Filter by relationship status"><option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="paused">Paused</option><option value="archived">Archived</option></select>
            <select value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)} aria-label="Filter by publishing state"><option value="all">All states</option><option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option></select>
          </div>
          <div className="office-projects__list">
            {filtered.map((partner) => <button key={partner.id} type="button" className={`office-project-row${selectedId === partner.id ? " active" : ""}`} onClick={() => { setSelectedId(partner.id); setDraft({ ...partner }); }}><span className="office-project-row__icon"><Handshake size={16} /></span><span><strong>{partner.name}</strong><small>{partnerRelationshipLabels[partner.relationship]} · {partner.offerLabel || "no public benefit"}</small></span><span className={`office-project-row__state state-${partner.visibility}`}>{partner.status}</span></button>)}
          </div>
        </section>

        <section className="office-projects__editor" aria-label="Partner editor">
          {draft ? <>
            <div className="office-projects__editor-heading"><div><span>Partner record</span><h2>{draft.name}</h2><p>{partnerRelationshipLabels[draft.relationship]} · {draft.status}</p></div>{draft.adminUrl ? <a href={draft.adminUrl} target="_blank" rel="noreferrer" className="dev-btn dev-btn-ghost dev-btn-sm">Manage program <ExternalLink size={13} /></a> : <BadgeCheck size={24} />}</div>
            <div className="office-projects__form-grid">
              <label><span>Partner name</span><input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} /></label>
              <label><span>Publishing state</span><select value={draft.visibility} onChange={(event) => updateDraft("visibility", event.target.value as PartnerVisibility)}><option value="published">Published</option><option value="draft">Draft</option><option value="hidden">Hidden</option></select></label>
              <label><span>Relationship</span><select value={draft.relationship} onChange={(event) => updateDraft("relationship", event.target.value as PartnerRelationship)}>{Object.entries(partnerRelationshipLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
              <label><span>Status</span><select value={draft.status} onChange={(event) => updateDraft("status", event.target.value as PartnerStatus)}><option value="active">Active</option><option value="pending">Pending</option><option value="paused">Paused</option><option value="archived">Archived</option></select></label>
              <label className="office-projects__wide"><span>Tagline</span><input value={draft.tagline} onChange={(event) => updateDraft("tagline", event.target.value)} /></label>
              <label className="office-projects__wide"><span>Public description</span><textarea rows={3} value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} /></label>
              <label><span>Provider website</span><input type="url" value={draft.websiteUrl} onChange={(event) => updateDraft("websiteUrl", event.target.value)} /></label>
              <label><span>Offer / tracked URL</span><input type="url" value={draft.offerUrl} onChange={(event) => updateDraft("offerUrl", event.target.value)} /></label>
              <label><span>Offer label</span><input value={draft.offerLabel} onChange={(event) => updateDraft("offerLabel", event.target.value)} placeholder="$5 account credit" /></label>
              <label><span>Discount or referral code</span><input value={draft.discountCode} onChange={(event) => updateDraft("discountCode", event.target.value)} /></label>
              <label className="office-projects__wide"><span>Exact public benefit and conditions</span><textarea rows={3} value={draft.offerDetail} onChange={(event) => updateDraft("offerDetail", event.target.value)} /></label>
              <label><span>Provider terms URL</span><input type="url" value={draft.termsUrl} onChange={(event) => updateDraft("termsUrl", event.target.value)} /></label>
              <label><span>Private management URL</span><input type="url" value={draft.adminUrl || ""} onChange={(event) => updateDraft("adminUrl", event.target.value)} /></label>
              <label><span>Last verified</span><input type="date" value={draft.verifiedAt} onChange={(event) => updateDraft("verifiedAt", event.target.value)} /></label>
              <label><span>Accent color</span><input type="color" value={draft.accent} onChange={(event) => updateDraft("accent", event.target.value)} /></label>
              <label className="office-projects__wide"><span>Private verification note</span><textarea rows={2} value={draft.sourceNote} onChange={(event) => updateDraft("sourceNote", event.target.value)} /></label>
            </div>
            <label className="office-projects__featured"><input type="checkbox" checked={draft.featured} onChange={(event) => updateDraft("featured", event.target.checked)} /><span><BadgeCheck size={14} /> Feature this verified benefit publicly</span></label>
            <div className="office-projects__savebar"><div>Only <strong>active + published</strong> records appear publicly.</div><button className="dev-btn dev-btn-primary" disabled={saving} onClick={save}>{saving ? <RefreshCw className="dev-auth-spinner" size={15} /> : <Save size={15} />} {saving ? "Saving" : "Save partner"}</button></div>
          </> : <div className="office-projects__empty">Select a partner to review its status and public benefit.</div>}
        </section>
      </div>
    </div>
  );
}
