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
  ChevronRight,
  ShieldCheck,
  Search,
  MessageSquare,
  X,
  User as UserIcon,
  Clock
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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: any;
}

interface ChatSession {
  id: string;
  provider: string;
  model: string;
  messages: ChatMessage[];
  timestamp: any;
}

function AdminContent() {
  const { signOut } = useDevAuth();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ users: 0, events: 0, readmes: 0, commits: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<{id: string, key: string, value: string}[]>([]);
  const [userChats, setUserChats] = useState<ChatSession[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'data' | 'chats'>('info');

  useEffect(() => {
    const qEvents = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(20));
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

  const handleOpenUser = async (u: UserProfile) => {
    setSelectedUser(u);
    setLoadingDetails(true);
    setActiveTab('info');
    try {
      // Parallel fetch for speed
      const [dataSnap, chatSnap] = await Promise.all([
        getDocs(collection(db, `users/${u.uid}/data`)),
        getDocs(query(collection(db, `users/${u.uid}/chats`), orderBy("timestamp", "desc"), limit(10)))
      ]);
      
      setUserData(dataSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      setUserChats(chatSnap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession)));
    } catch (e) {
      setUserData([]);
      setUserChats([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dev-panel-content" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ─── Header ─── */}
      <div className="dev-panel-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="dev-panel-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>System <span>Command</span></div>
          <div className="dev-panel-sub" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Scalable infrastructure & User Insights.</div>
        </div>
        <button className="dev-btn-outline" onClick={signOut} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Sign out</button>
      </div>

      {/* ─── Global Stats ─── */}
      <div className="dev-g4" style={{ marginBottom: '2.5rem', gap: '1.5rem' }}>
        {[
          { label: 'Total Users', val: stats.users, icon: <Users size={18} />, color: '#3b82f6' },
          { label: 'Events', val: stats.events, icon: <Activity size={18} />, color: '#ef4444' },
          { label: 'Readmes', val: stats.readmes, icon: <FileText size={18} />, color: '#10b981' },
          { label: 'AI Chats', val: stats.commits, icon: <MessageSquare size={18} />, color: '#eab308' }
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
        
        {/* 1. SCALABLE USER DIRECTORY */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="dev-stitle" style={{ margin: 0, letterSpacing: '0.05em' }}>
              <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} /> MAINTAINER DIRECTORY
            </div>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input 
                type="text" 
                placeholder="Search 10k+ users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '20px', 
                  padding: '8px 12px 8px 34px', 
                  color: '#fff', 
                  fontSize: '0.85rem' 
                }}
              />
            </div>
          </div>
          
          <div className="dev-card" style={{ padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {filteredUsers.map(u => (
                <div 
                  key={u.uid} 
                  onClick={() => handleOpenUser(u)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '10px', 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'transform 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={u.photoURL} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.displayName}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                  </div>
                  <div className={`dev-badge ${u.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`} style={{ fontSize: '0.6rem' }}>{u.role}</div>
                </div>
              ))}
              {filteredUsers.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', opacity: 0.3 }}>No maintainers found.</div>}
            </div>
          </div>
        </section>

        {/* 2. SYSTEM OPERATIONS */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <Database size={16} style={{ marginRight: '0.5rem' }} /> SYSTEM OPERATIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <button className="dev-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ color: 'var(--dev-accent)' }}><Zap size={20} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Broadcast Signals</div>
            </button>
            <button className="dev-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ color: '#eab308' }}><Database size={20} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Snapshot Vault</div>
            </button>
            <button className="dev-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <div><FileText size={20} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Export Logs</div>
            </button>
          </div>
        </section>

        {/* 3. LIVE ANALYTICS FEED */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <Activity size={16} style={{ marginRight: '0.5rem' }} /> LIVE ANALYTICS FEED
          </div>
          <div className="dev-card" style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
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
        </section>
      </div>

      {/* ─── MODAL SYSTEM ─── */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} 
            onClick={() => setSelectedUser(null)}
          />
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '800px', 
              background: '#0a0a0a', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img src={selectedUser.photoURL} alt="" style={{ width: 56, height: 56, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedUser.displayName}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.5 }}>{selectedUser.email}</p>
                </div>
                <div className={`dev-badge ${selectedUser.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`}>{selectedUser.role}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { id: 'info', label: 'Identity', icon: <UserIcon size={14} /> },
                { id: 'data', label: 'Cloud Vault', icon: <Database size={14} /> },
                { id: 'chats', label: 'AI History', icon: <MessageSquare size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    background: 'none', 
                    border: 'none', 
                    color: activeTab === tab.id ? 'var(--dev-accent)' : 'var(--dev-muted)', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    borderBottom: `2px solid ${activeTab === tab.id ? 'var(--dev-accent)' : 'transparent'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
              {loadingDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem', opacity: 0.4 }}>
                  <div className="dev-auth-spinner" />
                  <span>Fetching encrypted signals...</span>
                </div>
              ) : (
                <>
                  {activeTab === 'info' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, marginBottom: '1rem', letterSpacing: '0.1em' }}>CREDENTIALS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {Object.entries(selectedUser.apiKeys || {}).map(([p, k]) => (
                            <div key={p} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{p}</span>
                              <span style={{ color: k ? '#10b981' : 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>{k ? '● ACTIVE' : 'NO KEY'}</span>
                            </div>
                          ))}
                          {Object.keys(selectedUser.apiKeys || {}).length === 0 && <div style={{ opacity: 0.3, fontSize: '0.85rem' }}>No API keys configured.</div>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, marginBottom: '1rem', letterSpacing: '0.1em' }}>METADATA</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Provider</div>
                              <div style={{ textTransform: 'capitalize' }}>{selectedUser.activeProvider || 'Not set'}</div>
                           </div>
                           <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>User ID</div>
                              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--dev-font-mono)', opacity: 0.7 }}>{selectedUser.uid}</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'data' && (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, marginBottom: '1rem', letterSpacing: '0.1em' }}>STORED OBJECTS ({userData.length})</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {userData.map(d => (
                          <div key={d.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{d.key}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.4, fontFamily: 'var(--dev-font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.value}</div>
                          </div>
                        ))}
                        {userData.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', opacity: 0.2 }}>User storage is empty.</div>}
                      </div>
                    </div>
                  )}

                  {activeTab === 'chats' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.4, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>RECENT CONVERSATIONS</div>
                      {userChats.map(session => (
                        <div key={session.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dev-accent)' }}>{session.provider.toUpperCase()}</span>
                              <span style={{ opacity: 0.3 }}>/</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{session.model}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Clock size={12} /> {session.timestamp?.toDate ? session.timestamp.toDate().toLocaleString() : 'Recently'}
                            </div>
                          </div>
                          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {session.messages.slice(0, 4).map((msg, midx) => (
                              <div key={midx} style={{ display: 'flex', gap: '1rem', opacity: msg.role === 'assistant' ? 0.9 : 1 }}>
                                <div style={{ 
                                  width: '24px', height: '24px', borderRadius: '6px', 
                                  background: msg.role === 'assistant' ? 'var(--dev-accent)' : 'rgba(255,255,255,0.1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0
                                }}>
                                  {msg.role === 'assistant' ? 'AI' : 'U'}
                                </div>
                                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, opacity: msg.role === 'assistant' ? 0.8 : 1 }}>{msg.content}</div>
                              </div>
                            ))}
                            {session.messages.length > 4 && <div style={{ fontSize: '0.7rem', opacity: 0.3, textAlign: 'center', padding: '0.5rem 0', borderTop: '1px dashed rgba(255,255,255,0.05)' }}>+ {session.messages.length - 4} more messages</div>}
                          </div>
                        </div>
                      ))}
                      {userChats.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.2 }}>No chat telemetry found for this maintainer.</div>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
