// src/dev/panels/AdminPanel.tsx
import { useState, useEffect } from "react";
import { AdminGate, useDevAuth } from "../DevAuth";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { 
  Users, 
  Activity, 
  FileText, 
  Database, 
  Zap
} from "lucide-react";

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
      try {
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
      } catch (e) {
        console.warn("Failed to load global stats:", e);
      }
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
      const dataSnap = await getDocs(collection(db, `users/${u.uid}/data`));
      setUserData(dataSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    } catch (e) {
      setUserData([]);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  return (
    <div className="dev-panel-content">
      {/* ─── Header ─── */}
      <div className="dev-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="dev-panel-title">System <span>Command</span></div>
          <div className="dev-panel-sub">Global Lorapok Labs surveillance and infrastructure management.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="dev-msg" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>Authenticated</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--dev-muted)' }}>{user?.email}</span>
            </div>
            <img src={user?.photoURL || ""} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          </div>
          <button className="dev-btn-outline" onClick={signOut} style={{ fontSize: '0.7rem' }}>Sign out</button>
        </div>
      </div>

      {/* ─── Global Stats ─── */}
      <div className="dev-g4" style={{ marginBottom: '2rem' }}>
        <div className="dev-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}><Users color="#3b82f6" /></div>
          <div>
            <div className="dev-stitle" style={{ fontSize: '1.2rem' }}>{stats.users}</div>
            <div className="dev-auth-sub">active maintainers</div>
          </div>
        </div>
        <div className="dev-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}><Activity color="#ef4444" /></div>
          <div>
            <div className="dev-stitle" style={{ fontSize: '1.2rem' }}>{stats.events}</div>
            <div className="dev-auth-sub">total events</div>
          </div>
        </div>
        <div className="dev-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}><FileText color="#fff" /></div>
          <div>
            <div className="dev-stitle" style={{ fontSize: '1.2rem' }}>{stats.readmes}</div>
            <div className="dev-auth-sub">saved readmes</div>
          </div>
        </div>
        <div className="dev-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}><Zap color="#eab308" /></div>
          <div>
            <div className="dev-stitle" style={{ fontSize: '1.2rem' }}>{stats.commits}</div>
            <div className="dev-auth-sub">commit explanations</div>
          </div>
        </div>
      </div>

      <div className="dev-g2" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        {/* Activity Feed */}
        <div className="dev-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="dev-stitle" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
            LIVE ANALYTICS FEED
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '500px' }}>
            {events.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--dev-muted)' }}>Awaiting signals...</div>
            ) : (
              events.map(event => (
                <div key={event.id} className="dev-msg" style={{ padding: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--dev-accent)', fontWeight: 'bold', fontSize: '0.75rem' }}>{event.email || 'anonymous'}</span>
                    <span style={{ color: 'var(--dev-muted)', fontSize: '0.65rem' }}>{event.timestamp?.toDate ? event.timestamp.toDate().toLocaleTimeString() : 'Recent'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--dev-muted2)' }}>{event.category}:</span> {event.action}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="dev-card">
            <div className="dev-stitle" style={{ marginBottom: '1.5rem' }}>MAINTAINER DIRECTORY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map(u => (
                <div 
                  key={u.uid} 
                  className={`dev-msg ${selectedUser?.uid === u.uid ? 'active' : ''}`} 
                  onClick={() => handleSelectUser(u)}
                  style={{ cursor: 'pointer', padding: '0.75rem', transition: 'all 0.2s', border: selectedUser?.uid === u.uid ? '1px solid var(--dev-accent)' : '1px solid transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={u.photoURL} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{u.displayName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--dev-muted)' }}>{u.email}</div>
                    </div>
                    <div className={`dev-badge ${u.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`} style={{ fontSize: '0.6rem' }}>{u.role}</div>
                  </div>

                  {selectedUser?.uid === u.uid && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      {loadingUserDetails ? <div style={{ color: 'var(--dev-muted)', fontSize: '0.8rem' }}>Loading data...</div> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                          <div>
                            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>STORED DATA ({userData.length})</div>
                            {userData.length === 0 ? <div style={{ color: "var(--dev-muted)", fontSize: "0.8rem" }}>No data stored.</div> : (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {userData.map(d => (
                                  <div key={d.id} className="dev-badge dev-badge-muted" style={{ fontSize: "0.7rem" }}>{d.key}</div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>API KEYS</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {Object.entries(selectedUser.apiKeys || {}).map(([p, k]) => (
                                <div key={p} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", background: "rgba(255,255,255,0.05)", padding: "0.4rem 0.6rem", borderRadius: "4px" }}>
                                  <span style={{ color: "var(--dev-fg)", fontWeight: "bold" }}>{p}:</span>
                                  <span style={{ color: k ? "#10b981" : "var(--dev-muted)" }}>{k ? "Set" : "Empty"}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="dev-card">
            <div className="dev-stitle" style={{ marginBottom: "1.5rem" }}>SYSTEM OPERATIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button className="dev-btn dev-btn-ghost" style={{ justifyContent: "flex-start", fontSize: "0.8rem" }}><FileText size={14} /> Broadcast to Maintainers</button>
              <button className="dev-btn dev-btn-ghost" style={{ justifyContent: "flex-start", fontSize: "0.8rem" }}><Database size={14} /> Backup Firestore Data</button>
              <button className="dev-btn dev-btn-ghost" style={{ justifyContent: "flex-start", fontSize: "0.8rem", color: "var(--dev-red)" }}>× Flush System Cache</button>
            </div>
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
