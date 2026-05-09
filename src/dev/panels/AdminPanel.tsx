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
  Zap,
  Layout,
  ChevronRight,
  ShieldCheck,
  Key
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
  const [, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    const qEvents = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(15));
    const unsubEvents = onSnapshot(qEvents, 
      (snap) => {
        setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalyticsEvent)));
      },
      (err) => console.warn("Admin logs access restricted:", err.message)
    );

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
    <div className="dev-panel-content" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ─── Header ─── */}
      <div className="dev-panel-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="dev-panel-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>System <span>Command</span></div>
          <div className="dev-panel-sub" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Global surveillance & core infrastructure.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Authenticated
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{user?.email}</div>
          </div>
          <button className="dev-btn-outline" onClick={signOut} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Sign out</button>
        </div>
      </div>

      {/* ─── Global Stats ─── */}
      <div className="dev-g4" style={{ marginBottom: '2.5rem', gap: '1.5rem' }}>
        {[
          { label: 'Maintainers', val: stats.users, icon: <Users size={18} />, color: '#3b82f6' },
          { label: 'Total Events', val: stats.events, icon: <Activity size={18} />, color: '#ef4444' },
          { label: 'Readmes', val: stats.readmes, icon: <FileText size={18} />, color: '#10b981' },
          { label: 'Explanations', val: stats.commits, icon: <Zap size={18} />, color: '#eab308' }
        ].map(s => (
          <div key={s.label} className="dev-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '0.75rem', background: `${s.color}15`, color: s.color, borderRadius: '10px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* 1. MAINTAINER DIRECTORY (Full Width) */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} /> MAINTAINER DIRECTORY
          </div>
          <div className="dev-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {users.map(u => (
                <div 
                  key={u.uid} 
                  onClick={() => handleSelectUser(u)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '10px', 
                    background: selectedUser?.uid === u.uid ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedUser?.uid === u.uid ? 'var(--dev-accent)' : 'rgba(255,255,255,0.05)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={u.photoURL} alt="" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{u.displayName}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{u.email}</div>
                  </div>
                  <div className={`dev-badge ${u.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`} style={{ fontSize: '0.65rem' }}>{u.role}</div>
                </div>
              ))}
            </div>

            {selectedUser && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Layout size={16} /> User Context: {selectedUser.displayName}</h3>
                  <button style={{ color: 'var(--dev-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedUser(null)}>Close</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, marginBottom: '0.75rem', textTransform: 'uppercase' }}>API Configurations</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(selectedUser.apiKeys || {}).map(([p, k]) => (
                        <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={12} opacity={0.5} /> {p}</span>
                          <span style={{ color: k ? '#10b981' : 'rgba(255,255,255,0.2)' }}>{k ? 'Verified' : 'Unset'}</span>
                        </div>
                      ))}
                      {(!selectedUser.apiKeys || Object.keys(selectedUser.apiKeys).length === 0) && <div style={{ fontSize: '0.85rem', opacity: 0.3 }}>No keys defined.</div>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, marginBottom: '0.75rem', textTransform: 'uppercase' }}>Cloud Documents ({userData.length})</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {userData.map(d => (
                        <div key={d.id} style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>{d.key}</div>
                      ))}
                      {userData.length === 0 && <div style={{ fontSize: '0.85rem', opacity: 0.3 }}>Empty vault.</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. SYSTEM OPERATIONS (Full Width) */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <Database size={16} style={{ marginRight: '0.5rem' }} /> SYSTEM OPERATIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'var(--dev-accent)' }}><FileText size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Broadcast Signals</div>
            </button>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#eab308' }}><Database size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Snapshot Vault</div>
            </button>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <div><Zap size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Purge Local Cache</div>
            </button>
          </div>
        </section>

        {/* 3. LIVE ANALYTICS FEED (Full Width) */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <Activity size={16} style={{ marginRight: '0.5rem' }} /> LIVE ANALYTICS FEED
          </div>
          <div className="dev-card" style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
            {events.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.3 }}>Listening for incoming signals...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {events.map((ev, idx) => (
                  <div key={ev.id} style={{ 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem', 
                    borderBottom: idx === events.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ev.category === 'ai' ? '#a855f7' : '#10b981', boxShadow: `0 0 8px ${ev.category === 'ai' ? '#a855f7' : '#10b981'}` }} />
                    <div style={{ width: '80px', fontSize: '0.7rem', opacity: 0.4, fontFamily: 'var(--dev-font-mono)' }}>{ev.timestamp?.toDate().toLocaleTimeString()}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{ev.email || 'anonymous'}</span>
                      <ChevronRight size={12} opacity={0.2} />
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}><strong style={{ opacity: 0.5, marginRight: '0.4rem' }}>{ev.category}:</strong> {ev.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
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
