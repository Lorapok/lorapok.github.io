// src/dev/panels/AdminPanel.tsx
import { useState, useEffect } from "react";
import { AdminGate, useDevAuth } from "../DevAuth";
import { db, storage } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";

interface AnalyticsEvent {
  id: string;
  category: string;
  action: string;
  email: string;
  timestamp: any;
  metadata?: any;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  lastLogin: any;
  apiKeys?: Record<string, string>;
  activeProvider?: string;
  activeModels?: Record<string, string>;
}

function AdminContent() {
  const { user, signOut } = useDevAuth();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ users: 0, events: 0, readmes: 0, commits: 0 });
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userFiles, setUserFiles] = useState<{name: string, url: string}[]>([]);
  const [userData, setUserData] = useState<{id: string, key: string, value: string}[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    // Real-time Analytics Feed
    const qEvents = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(10));
    const unsubEvents = onSnapshot(qEvents, 
      (snap) => {
        setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalyticsEvent)));
      },
      (err) => console.warn("Admin logs access restricted:", err.message)
    );

    // Stats & User List
    const loadStats = async () => {
      const [uSnap, rSnap, cSnap, eSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "readme_templates")),
        getDocs(collection(db, "commit_explanations")),
        getDocs(collection(db, "analytics")),
      ]);
      
      setUsers(uSnap.docs.map(doc => doc.data() as UserProfile));
      setStats({
        users: uSnap.size,
        readmes: rSnap.size,
        commits: cSnap.size,
        events: eSnap.size
      });
    };

    loadStats();
    return () => unsubEvents();
  }, []);

  const handleSelectUser = async (u: UserProfile) => {
    if (selectedUser?.uid === u.uid) {
      setSelectedUser(null);
      return;
    }
    setSelectedUser(u);
    setLoadingUserDetails(true);
    try {
      // Fetch data
      const dataSnap = await getDocs(collection(db, `users/${u.uid}/data`));
      setUserData(dataSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    } catch (e) {
      // Ignore main user fetch error
    } finally {
      setLoadingUserDetails(false);
    }
  };

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="dev-panel-title">System <span>Command</span></div>
            <div className="dev-panel-sub">Global Lorapok Labs surveillance and infrastructure management.</div>
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--dev-font-mono)", fontSize: "0.75rem", color: "var(--dev-green)" }}>● Authenticated</div>
                <div style={{ fontSize: "0.72rem", color: "var(--dev-muted)" }}>{user.email}</div>
              </div>
              {user.photoURL && <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--dev-green)" }} />}
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>

      <div className="dev-g4" style={{ marginBottom: "1.5rem" }}>
        {[
          { num: stats.users, label: "active maintainers", icon: "👥" },
          { num: stats.events, label: "total events", icon: "📈" },
          { num: stats.readmes, label: "saved readmes", icon: "📄" },
          { num: stats.commits, label: "commit explanations", icon: "⚡" }
        ].map(s => (
          <div key={s.label} className="dev-card dev-card-sm">
            <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div className="dev-stat-num">{s.num}</div>
            <div className="dev-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dev-g21">
        {/* Activity Log */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Live Analytics Feed</div>
          <div className="dev-card" style={{ padding: "0" }}>
            <div className="dev-activity-feed">
              {events.map(ev => (
                <div key={ev.id} className="dev-feed-item">
                  <div className="dev-feed-dot" style={{ background: ev.category === "ai" ? "var(--dev-purple)" : "var(--dev-green)" }} />
                  <div className="dev-feed-content">
                    <div className="dev-feed-header">
                      <span className="dev-feed-user">{ev.email}</span>
                      <span className="dev-feed-time">{ev.timestamp?.toDate().toLocaleTimeString()}</span>
                    </div>
                    <div className="dev-feed-action">
                      <span style={{ color: "var(--dev-muted)" }}>{ev.category}:</span> {ev.action}
                      {ev.metadata?.provider && <span className="dev-badge dev-badge-muted" style={{ marginLeft: "0.5rem" }}>{ev.metadata.provider}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && <div style={{ padding: "2rem", textAlign: "center", color: "var(--dev-muted)" }}>No recent activity.</div>}
            </div>
          </div>
        </div>

        {/* Maintainer Directory */}
        <div>
          <div className="dev-stitle"><span className="dev-stitle-dot" />Maintainer Directory</div>
          <div className="dev-card" style={{ padding: "0" }}>
            <div className="dev-user-list">
              {users.map(u => (
                <div key={u.uid} style={{ borderBottom: "1px solid var(--dev-border)" }}>
                  <div 
                    className="dev-user-item" 
                    onClick={() => handleSelectUser(u)}
                    style={{ cursor: "pointer", background: selectedUser?.uid === u.uid ? "var(--dev-bg2)" : "transparent" }}
                  >
                    <img src={u.photoURL || "/assets/avatar-placeholder.png"} alt="" className="dev-user-avatar" />
                    <div className="dev-user-info">
                      <div className="dev-user-name">{u.displayName}</div>
                      <div className="dev-user-email">{u.email}</div>
                    </div>
                    <span className={`dev-badge ${u.role === "admin" ? "dev-badge-purple" : "dev-badge-muted"}`}>{u.role}</span>
                  </div>
                  
                  {selectedUser?.uid === u.uid && (
                    <div style={{ padding: "1rem", background: "var(--dev-bg)", fontSize: "0.85rem" }}>
                      {loadingUserDetails ? (
                        <div style={{ color: "var(--dev-muted)" }}>Loading user data...</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>Stored Data ({userData.length})</div>
                            {userData.length === 0 ? <div style={{ color: "var(--dev-muted)" }}>No data stored.</div> : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                {userData.map(d => (
                                  <div key={d.id} style={{ background: "var(--dev-bg2)", padding: "0.5rem", borderRadius: "4px" }}>
                                    <strong style={{ color: "var(--dev-fg)" }}>{d.key}:</strong> <span style={{ color: "var(--dev-muted2)" }}>{d.value.length > 50 ? d.value.substring(0, 50) + "..." : d.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>API Keys</div>
                            {!u.apiKeys || Object.keys(u.apiKeys).length === 0 ? <div style={{ color: "var(--dev-muted)" }}>No API keys configured.</div> : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                {Object.entries(u.apiKeys).map(([provider, key]) => (
                                  <div key={provider} style={{ background: "var(--dev-bg2)", padding: "0.5rem", borderRadius: "4px", display: "flex", justifyContent: "space-between" }}>
                                    <strong style={{ color: "var(--dev-fg)", textTransform: "capitalize" }}>{provider}:</strong> 
                                    <span style={{ color: "var(--dev-muted2)", fontFamily: "var(--dev-font-mono)" }}>
                                      {key.length > 8 ? `${key.substring(0, 4)}...${key.slice(-4)}` : "Set"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="dev-stitle" style={{ marginTop: "1.5rem" }}><span className="dev-stitle-dot" />System Operations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button className="dev-btn dev-btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }}>✉ Broadcast to Maintainers</button>
            <button className="dev-btn dev-btn-secondary" style={{ width: "100%", justifyContent: "flex-start" }}>📁 Backup Firestore Data</button>
            <button className="dev-btn dev-btn-ghost" style={{ width: "100%", justifyContent: "flex-start", color: "var(--dev-red)" }}>✕ Flush System Cache</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminGate>
      <AdminContent />
    </AdminGate>
  );
}
