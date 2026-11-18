import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { AppWindow, Check, Clock3, History, KeyRound, MailPlus, Plus, RefreshCw, Search, ShieldCheck, UserCheck, UserCog, UserX, Users } from "lucide-react";
import { db } from "../../lib/firebase";
import { AdminGate, useDevAuth } from "../DevAuth";
import {
  BOOTSTRAP_OWNER_EMAILS, OFFICE_ROLES, normalizeOfficeRole,
  type OfficeAccessStatus, type OfficeRole,
} from "../rbac";

interface OfficeMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: OfficeRole;
  status: OfficeAccessStatus;
  department?: string;
  title?: string;
  lastLogin?: { toDate?: () => Date };
}

interface OfficeInvitation {
  id: string;
  email: string;
  displayName?: string;
  role: OfficeRole;
  status: "invited" | "accepted" | "revoked";
  department?: string;
  title?: string;
  invitedAt?: { toDate?: () => Date };
}

interface AccessAuditEvent {
  id: string;
  action: string;
  target: string;
  actorEmail: string;
  changes?: Record<string, unknown>;
  createdAt?: { toDate?: () => Date };
}

interface SsoApplication {
  appId: string;
  name: string;
  description: string;
  status: "active" | "disabled";
  origins: string[];
  createdAt?: { toDate?: () => Date };
}

interface SsoAccessGrant {
  id: string;
  uid: string;
  appId: string;
  status: "active" | "revoked";
  scopes: string[];
  updatedAt?: { toDate?: () => Date };
}

const ASSIGNABLE_BY_ADMIN: OfficeRole[] = ["editor", "researcher", "teammate", "viewer"];
const ASSIGNABLE_BY_OWNER: OfficeRole[] = ["admin", ...ASSIGNABLE_BY_ADMIN];

function timestampLabel(value?: { toDate?: () => Date }) {
  return value?.toDate ? value.toDate().toLocaleString() : "Not recorded";
}

function isProtectedOwner(member: Pick<OfficeMember, "email" | "role">) {
  return member.role === "owner" || BOOTSTRAP_OWNER_EMAILS.includes(member.email.toLowerCase() as typeof BOOTSTRAP_OWNER_EMAILS[number]);
}

function MemberEditor({
  member, actorRole, busy, onSave,
}: {
  member: OfficeMember;
  actorRole: OfficeRole;
  busy: boolean;
  onSave: (member: OfficeMember, changes: Partial<OfficeMember>) => Promise<void>;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [role, setRole] = useState(member.role);
  const [status, setStatus] = useState(member.status);
  const [department, setDepartment] = useState(member.department || "");
  const [title, setTitle] = useState(member.title || "");
  const protectedOwner = isProtectedOwner(member);
  const actorCanEdit = actorRole === "owner" || (!protectedOwner && member.role !== "admin");
  const roleOptions = actorRole === "owner" ? ASSIGNABLE_BY_OWNER : ASSIGNABLE_BY_ADMIN;

  return (
    <article className="rbac-member-card">
      <div className="rbac-member-identity">
        {member.photoURL && !imageFailed
          ? <img src={member.photoURL} alt="" onError={() => setImageFailed(true)} />
          : <span>{member.displayName?.slice(0, 1) || member.email.slice(0, 1)}</span>}
        <div><strong>{member.displayName || member.email.split("@")[0]}</strong><small>{member.email}</small></div>
        <i className={`rbac-status status-${member.status}`}>{member.status}</i>
      </div>
      <div className="rbac-member-fields">
        <label><span>Role</span><select value={role} disabled={!actorCanEdit || protectedOwner} onChange={(event) => setRole(event.target.value as OfficeRole)}>
          {protectedOwner && <option value="owner">Owner</option>}
          {!protectedOwner && member.role === "admin" && actorRole !== "owner" && <option value="admin">Administrator</option>}
          {roleOptions.map((item) => <option value={item} key={item}>{OFFICE_ROLES[item].label}</option>)}
        </select></label>
        <label><span>Access</span><select value={status} disabled={!actorCanEdit || protectedOwner} onChange={(event) => setStatus(event.target.value as OfficeAccessStatus)}>
          <option value="pending">Pending</option><option value="active">Active</option><option value="suspended">Suspended</option>
        </select></label>
        <label><span>Department</span><input value={department} disabled={!actorCanEdit} onChange={(event) => setDepartment(event.target.value)} placeholder="Engineering" /></label>
        <label><span>Team title</span><input value={title} disabled={!actorCanEdit} onChange={(event) => setTitle(event.target.value)} placeholder="Research engineer" /></label>
      </div>
      <div className="rbac-member-footer">
        <small><Clock3 size={12} /> Last sign-in: {timestampLabel(member.lastLogin)}</small>
        {protectedOwner ? <span className="rbac-owner-lock"><ShieldCheck size={13} /> Protected owner</span> : (
          <button className="dev-btn dev-btn-primary dev-btn-sm" disabled={!actorCanEdit || busy} onClick={() => onSave(member, { role, status, department: department.trim(), title: title.trim() })}>
            {busy ? <RefreshCw className="dev-auth-spinner" size={13} /> : <Check size={13} />} Save access
          </button>
        )}
      </div>
    </article>
  );
}

function AdminContent() {
  const { user, role: actorRole } = useDevAuth();
  const [members, setMembers] = useState<OfficeMember[]>([]);
  const [invitations, setInvitations] = useState<OfficeInvitation[]>([]);
  const [auditEvents, setAuditEvents] = useState<AccessAuditEvent[]>([]);
  const [ssoApps, setSsoApps] = useState<SsoApplication[]>([]);
  const [ssoGrants, setSsoGrants] = useState<SsoAccessGrant[]>([]);
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<OfficeRole>("teammate");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [appId, setAppId] = useState("");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appOrigins, setAppOrigins] = useState("");
  const [selectedMemberByApp, setSelectedMemberByApp] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribeMembers = onSnapshot(query(collection(db, "users"), orderBy("email")), (snapshot) => {
      setMembers(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          uid: entry.id,
          email: String(data.email || ""),
          displayName: String(data.displayName || ""),
          photoURL: data.photoURL,
          role: normalizeOfficeRole(data.role),
          status: (["pending", "active", "suspended"].includes(data.status) ? data.status : "pending") as OfficeAccessStatus,
          department: data.department,
          title: data.title,
          lastLogin: data.lastLogin,
        };
      }));
    }, (reason) => setError(reason.message));
    const unsubscribeInvites = onSnapshot(query(collection(db, "office_invites"), orderBy("email")), (snapshot) => {
      setInvitations(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          email: String(data.email || entry.id),
          displayName: data.displayName,
          role: normalizeOfficeRole(data.role),
          status: data.status === "revoked" ? "revoked" : data.status === "accepted" ? "accepted" : "invited",
          department: data.department,
          title: data.title,
          invitedAt: data.invitedAt,
        };
      }));
    }, (reason) => setError(reason.message));
    const unsubscribeAudit = onSnapshot(query(collection(db, "rbac_audit"), orderBy("createdAt", "desc"), limit(20)), (snapshot) => {
      setAuditEvents(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          action: String(data.action || "access_updated"),
          target: String(data.target || "Unknown target"),
          actorEmail: String(data.actorEmail || "Unknown actor"),
          changes: data.changes,
          createdAt: data.createdAt,
        };
      }));
    }, (reason) => setError(reason.message));
    const unsubscribeSsoApps = onSnapshot(query(collection(db, "sso_apps"), orderBy("name")), (snapshot) => {
      setSsoApps(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          appId: entry.id,
          name: String(data.name || entry.id),
          description: String(data.description || ""),
          status: data.status === "disabled" ? "disabled" : "active",
          origins: Array.isArray(data.origins) ? data.origins.map(String) : [],
          createdAt: data.createdAt,
        };
      }));
    }, (reason) => setError(reason.message));
    const unsubscribeSsoGrants = onSnapshot(collection(db, "sso_access"), (snapshot) => {
      setSsoGrants(snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          uid: String(data.uid || ""),
          appId: String(data.appId || ""),
          status: data.status === "active" ? "active" : "revoked",
          scopes: Array.isArray(data.scopes) ? data.scopes.map(String) : [],
          updatedAt: data.updatedAt,
        };
      }));
    }, (reason) => setError(reason.message));
    return () => { unsubscribeMembers(); unsubscribeInvites(); unsubscribeAudit(); unsubscribeSsoApps(); unsubscribeSsoGrants(); };
  }, []);

  const stats = useMemo(() => ({
    active: members.filter((member) => member.status === "active").length,
    pending: members.filter((member) => member.status === "pending").length,
    suspended: members.filter((member) => member.status === "suspended").length,
    invited: invitations.filter((invite) => invite.status === "invited").length,
  }), [invitations, members]);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) => [member.email, member.displayName, member.department, member.title, member.role]
      .some((value) => String(value || "").toLowerCase().includes(term)));
  }, [members, search]);

  const audit = async (action: string, target: string, changes: Record<string, unknown>) => {
    if (!user) return;
    await addDoc(collection(db, "rbac_audit"), {
      action, target, changes, actorUid: user.uid, actorEmail: user.email, createdAt: serverTimestamp(),
    });
  };

  const saveMember = async (member: OfficeMember, changes: Partial<OfficeMember>) => {
    setBusyId(member.uid); setNotice(""); setError("");
    try {
      await setDoc(doc(db, "users", member.uid), {
        role: changes.role,
        status: changes.status,
        department: changes.department || "",
        title: changes.title || "",
        accessUpdatedAt: serverTimestamp(),
        accessUpdatedBy: user?.email || "office-admin",
      }, { merge: true });
      await audit("member_access_updated", member.email, changes as Record<string, unknown>);
      setNotice(`${member.displayName || member.email} now has ${OFFICE_ROLES[changes.role || member.role].label} access.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Member access could not be updated.");
    } finally { setBusyId(""); }
  };

  const invite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid Google account email address."); return; }
    const allowedRoles = actorRole === "owner" ? ASSIGNABLE_BY_OWNER : ASSIGNABLE_BY_ADMIN;
    if (!allowedRoles.includes(inviteRole)) { setError("Your role cannot grant the selected level of access."); return; }
    setBusyId(`invite:${email}`); setNotice(""); setError("");
    try {
      const existing = members.find((member) => member.email.toLowerCase() === email);
      const access = { role: inviteRole, status: "active" as const, department: inviteDepartment.trim(), title: inviteTitle.trim() };
      if (existing) {
        await saveMember(existing, access);
      } else {
        await setDoc(doc(db, "office_invites", email), {
          email, displayName: inviteName.trim(), ...access, status: "invited",
          invitedBy: user?.email || "office-admin", invitedAt: serverTimestamp(),
        });
        await audit("member_invited", email, access);
        setNotice(`Invitation prepared for ${email}. Their Google sign-in will activate the assigned role.`);
      }
      setInviteEmail(""); setInviteName(""); setInviteDepartment(""); setInviteTitle("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The invitation could not be saved.");
    } finally { setBusyId(""); }
  };

  const setInvitationStatus = async (invitation: OfficeInvitation, status: "invited" | "revoked") => {
    setBusyId(`invite:${invitation.id}`); setNotice(""); setError("");
    try {
      await setDoc(doc(db, "office_invites", invitation.id), {
        status, updatedAt: serverTimestamp(), updatedBy: user?.email || "office-admin",
      }, { merge: true });
      await audit(status === "revoked" ? "invitation_revoked" : "invitation_restored", invitation.email, { status });
      setNotice(`${invitation.email} invitation ${status === "revoked" ? "revoked" : "restored"}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The invitation could not be updated.");
    } finally { setBusyId(""); }
  };

  const saveSsoApplication = async () => {
    const normalizedId = appId.trim().toLowerCase();
    const origins = [...new Set(appOrigins.split(/[\n,]+/).map((value) => value.trim().replace(/\/$/, "")).filter(Boolean))];
    if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(normalizedId)) { setError("Use a 2–63 character app ID containing lowercase letters, numbers, or hyphens."); return; }
    if (!appName.trim()) { setError("Enter the application name."); return; }
    if (ssoApps.some((app) => app.appId === normalizedId)) { setError("That application ID is already registered. Disable the existing entry before replacing it."); return; }
    if (origins.length === 0 || origins.some((origin) => {
      try { const url = new URL(origin); return url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname); } catch { return true; }
    })) { setError("Add at least one complete HTTPS application origin. Localhost is allowed for development."); return; }
    setBusyId(`app:${normalizedId}`); setNotice(""); setError("");
    try {
      await setDoc(doc(db, "sso_apps", normalizedId), {
        appId: normalizedId,
        name: appName.trim(),
        description: appDescription.trim(),
        status: "active",
        origins,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await audit("sso_app_registered", normalizedId, { name: appName.trim(), origins });
      const registeredName = appName.trim();
      setAppId(""); setAppName(""); setAppDescription(""); setAppOrigins("");
      setNotice(`${registeredName} is registered for Lorapok SSO.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The SSO application could not be registered.");
    } finally { setBusyId(""); }
  };

  const setSsoApplicationStatus = async (app: SsoApplication, status: "active" | "disabled") => {
    setBusyId(`app:${app.appId}`); setNotice(""); setError("");
    try {
      await setDoc(doc(db, "sso_apps", app.appId), {
        status, updatedAt: serverTimestamp(),
      }, { merge: true });
      await audit("sso_app_status_updated", app.appId, { status });
      setNotice(`${app.name} is now ${status}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The SSO application could not be updated.");
    } finally { setBusyId(""); }
  };

  const setSsoAccess = async (app: SsoApplication, member: OfficeMember, status: "active" | "revoked") => {
    const accessId = `${member.uid}__${app.appId}`;
    const existing = ssoGrants.find((grant) => grant.id === accessId);
    setBusyId(`grant:${accessId}`); setNotice(""); setError("");
    try {
      await setDoc(doc(db, "sso_access", accessId), {
        uid: member.uid,
        appId: app.appId,
        status,
        scopes: existing?.scopes || [],
        ...(!existing ? { grantedAt: serverTimestamp(), grantedBy: user?.email || "office-admin" } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || "office-admin",
      }, { merge: true });
      await audit(status === "active" ? "sso_access_granted" : "sso_access_revoked", member.email, { appId: app.appId, status });
      setNotice(`${app.name} access ${status === "active" ? "granted to" : "revoked for"} ${member.displayName || member.email}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Application access could not be updated.");
    } finally { setBusyId(""); }
  };

  const assignableRoles = actorRole === "owner" ? ASSIGNABLE_BY_OWNER : ASSIGNABLE_BY_ADMIN;

  return (
    <div className="dev-panel-content rbac-office">
      <div className="dev-panel-header"><div>
        <div className="dev-kicker"><ShieldCheck size={13} /> ROLE-BASED ACCESS CONTROL</div>
        <div className="dev-panel-title">People <span>& Access</span></div>
        <div className="dev-panel-sub">Invite teammates, approve identities, assign operational roles, suspend access, and keep an immutable permission trail.</div>
      </div></div>
      {(notice || error) && <div className={`office-projects__notice${error ? " is-error" : ""}`} role="status">{error || notice}</div>}
      <div className="dev-g4 rbac-stats">
        {[[stats.active, "active teammates"], [stats.pending, "pending approval"], [stats.invited, "open invitations"], [stats.suspended, "suspended"]].map(([value, label]) => (
          <div className="dev-card dev-card-sm" key={label}><div className="dev-stat-num">{value}</div><div className="dev-stat-label">{label}</div></div>
        ))}
      </div>

      <section className="dev-card rbac-invite-card">
        <div className="rbac-section-heading"><MailPlus size={18} /><div><strong>Invite or activate a teammate</strong><span>If the account already signed in, this approves it immediately. Otherwise the role activates at first Google sign-in.</span></div></div>
        <div className="rbac-invite-grid">
          <label><span>Google account email</span><input type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="teammate@example.com" /></label>
          <label><span>Name</span><input value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Teammate name" /></label>
          <label><span>Role</span><select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as OfficeRole)}>{assignableRoles.map((item) => <option value={item} key={item}>{OFFICE_ROLES[item].label}</option>)}</select></label>
          <label><span>Department</span><input value={inviteDepartment} onChange={(event) => setInviteDepartment(event.target.value)} placeholder="Engineering" /></label>
          <label><span>Team title</span><input value={inviteTitle} onChange={(event) => setInviteTitle(event.target.value)} placeholder="Software engineer" /></label>
          <button className="dev-btn dev-btn-primary" onClick={invite} disabled={busyId.startsWith("invite:")}><UserCheck size={15} /> Grant access</button>
        </div>
        <div className="rbac-role-guide">{assignableRoles.map((item) => <div key={item}><strong>{OFFICE_ROLES[item].label}</strong><span>{OFFICE_ROLES[item].description}</span></div>)}</div>
      </section>

      <section className="dev-card sso-admin-card">
        <div className="rbac-section-heading"><KeyRound size={18} /><div><strong>Connected applications</strong><span>One Google identity, one authenticator, and independent access for every Lorapok Labs product.</span></div></div>
        <div className="sso-register-grid">
          <label><span>Application ID</span><input value={appId} onChange={(event) => setAppId(event.target.value.toLowerCase())} placeholder="reportkit" /></label>
          <label><span>Application name</span><input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="ReportKit" /></label>
          <label className="sso-wide-field"><span>Description</span><input value={appDescription} onChange={(event) => setAppDescription(event.target.value)} placeholder="What this application does" /></label>
          <label className="sso-wide-field"><span>Approved origins</span><textarea value={appOrigins} onChange={(event) => setAppOrigins(event.target.value)} placeholder={"https://reportkit.lorapok.tech\nhttp://localhost:5173"} rows={3} /></label>
          <button className="dev-btn dev-btn-primary" onClick={saveSsoApplication} disabled={busyId.startsWith("app:")}><Plus size={15} /> Register application</button>
        </div>
        <div className="sso-app-list">
          {ssoApps.map((app) => {
            const activeGrants = ssoGrants.filter((grant) => grant.appId === app.appId && grant.status === "active");
            const selectedUid = selectedMemberByApp[app.appId] || members.find((member) => member.status === "active" && !isProtectedOwner(member))?.uid || "";
            const selectedMember = members.find((member) => member.uid === selectedUid);
            return <article className={`sso-app-card is-${app.status}`} key={app.appId}>
              <header><span className="sso-app-icon"><AppWindow size={18} /></span><div><strong>{app.name}</strong><small>{app.appId}</small></div><i>{app.status}</i></header>
              <p>{app.description || "No application description has been added."}</p>
              <div className="sso-origin-list">{app.origins.map((origin) => <code key={origin}>{origin}</code>)}</div>
              <div className="sso-grant-controls">
                <select value={selectedUid} onChange={(event) => setSelectedMemberByApp((current) => ({ ...current, [app.appId]: event.target.value }))}>
                  <option value="">Select an active teammate</option>
                  {members.filter((member) => member.status === "active" && !isProtectedOwner(member)).map((member) => <option value={member.uid} key={member.uid}>{member.displayName || member.email} · {OFFICE_ROLES[member.role].label}</option>)}
                </select>
                <button className="dev-btn dev-btn-primary dev-btn-sm" disabled={!selectedMember || busyId.startsWith("grant:")} onClick={() => selectedMember && setSsoAccess(app, selectedMember, "active")}><UserCheck size={13} /> Grant</button>
                <button className="dev-btn dev-btn-ghost dev-btn-sm" disabled={busyId === `app:${app.appId}`} onClick={() => setSsoApplicationStatus(app, app.status === "active" ? "disabled" : "active")}>{app.status === "active" ? "Disable app" : "Enable app"}</button>
              </div>
              <div className="sso-grant-list">
                {activeGrants.map((grant) => {
                  const member = members.find((item) => item.uid === grant.uid);
                  if (!member) return null;
                  return <span key={grant.id}>{member.displayName || member.email}<button aria-label={`Revoke ${app.name} access for ${member.displayName || member.email}`} disabled={busyId === `grant:${grant.id}`} onClick={() => setSsoAccess(app, member, "revoked")}><UserX size={12} /></button></span>;
                })}
                {activeGrants.length === 0 && <small>No teammate-specific grants. Owners and administrators retain emergency access.</small>}
              </div>
            </article>;
          })}
          {ssoApps.length === 0 && <div className="rbac-empty">No connected applications are registered yet.</div>}
        </div>
      </section>

      <section className="rbac-directory">
        <div className="rbac-directory-heading">
          <div className="rbac-section-heading"><Users size={18} /><div><strong>Office members</strong><span>Changes take effect in the open session through live access subscriptions.</span></div></div>
          <label className="office-projects__search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members" /></label>
        </div>
        <div className="rbac-member-grid">
          {filteredMembers.map((member) => <MemberEditor key={`${member.uid}:${member.role}:${member.status}:${member.department || ""}:${member.title || ""}`} member={member} actorRole={actorRole} busy={busyId === member.uid} onSave={saveMember} />)}
          {filteredMembers.length === 0 && <div className="rbac-empty">No Office members match this search.</div>}
        </div>
      </section>

      <section className="dev-card rbac-invitations">
        <div className="rbac-section-heading"><UserCog size={18} /><div><strong>Invitation registry</strong><span>Invitations can be revoked or restored without deleting their audit history.</span></div></div>
        <div className="rbac-invite-list">
          {invitations.map((invitation) => <div key={invitation.id}>
            <span className={`rbac-invite-icon ${invitation.status}`}><MailPlus size={15} /></span>
            <p><strong>{invitation.displayName || invitation.email}</strong><small>{invitation.email} · {OFFICE_ROLES[invitation.role].label} · {invitation.department || "No department"}</small></p>
            <time>{timestampLabel(invitation.invitedAt)}</time>
            {invitation.status === "accepted" ? <span className="rbac-owner-lock"><UserCheck size={13} /> Accepted</span> : (
              <button className="dev-btn dev-btn-ghost dev-btn-sm" disabled={busyId === `invite:${invitation.id}`} onClick={() => setInvitationStatus(invitation, invitation.status === "invited" ? "revoked" : "invited")}>
                {invitation.status === "invited" ? <><UserX size={13} /> Revoke</> : <><UserCheck size={13} /> Restore</>}
              </button>
            )}
          </div>)}
          {invitations.length === 0 && <div className="rbac-empty">No teammate invitations have been created.</div>}
        </div>
      </section>

      <section className="dev-card rbac-audit">
        <div className="rbac-section-heading"><History size={18} /><div><strong>Access audit trail</strong><span>The latest immutable role, invitation, and access changes recorded by the Office.</span></div></div>
        <div className="rbac-audit-list">
          {auditEvents.map((event) => <article key={event.id}>
            <span className="rbac-audit-icon"><History size={14} /></span>
            <p><strong>{event.action.replaceAll("_", " ")}</strong><small>{event.target} · by {event.actorEmail}</small></p>
            <time>{timestampLabel(event.createdAt)}</time>
          </article>)}
          {auditEvents.length === 0 && <div className="rbac-empty">No access changes have been recorded yet.</div>}
        </div>
      </section>
    </div>
  );
}

export default function AdminPanel() {
  return <AdminGate><AdminContent /></AdminGate>;
}
