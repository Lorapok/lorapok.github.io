// src/dev/panels/AdminPanel.tsx
import { useState, useEffect } from "react";
import { AdminGate, useDevAuth } from "../DevAuth";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs, startAfter } from "firebase/firestore";
import { 
  Users, 
  Activity, 
  FileText, 
  Database, 
  Zap,
  ChevronRight,
  ShieldCheck,
  Key,
  Search,
  MessageSquare,
  X,
  Clock,
  MoreVertical,
  ExternalLink,
  ArrowDown
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
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

    const loadInitialData = async () => {
      try {
        // Stats
        const [rSnap, cSnap, eSnap] = await Promise.all([
          getDocs(collection(db, "readme_templates")),
          getDocs(collection(db, "commit_explanations")),
          getDocs(collection(db, "analytics")),
        ]);
        
        // Users (Initial 50)
        const uQuery = query(collection(db, "users"), orderBy("email"), limit(50));
        const uSnap = await getDocs(uQuery);
        
        setUsers(uSnap.docs.map(doc => doc.data() as UserProfile));
        setLastDoc(uSnap.docs[uSnap.docs.length - 1]);
        setHasMore(uSnap.size === 50);
        
        setStats({
          users: uSnap.size, // This will be updated to total count if needed, but for now shows loaded
          readmes: rSnap.size,
          commits: cSnap.size,
          events: eSnap.size
        });
      } catch (e) {
        console.warn("Failed to load global stats:", e);
      }
    };

    loadInitialData();
    return () => unsubEvents();
  }, []);

  const loadMoreUsers = async () => {
    if (!lastDoc || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextQuery = query(collection(db, "users"), orderBy("email"), startAfter(lastDoc), limit(50));
      const nextSnap = await getDocs(nextQuery);
      
      const newUsers = nextSnap.docs.map(doc => doc.data() as UserProfile);
      setUsers(prev => [...prev, ...newUsers]);
      setLastDoc(nextSnap.docs[nextSnap.docs.length - 1]);
      setHasMore(nextSnap.size === 50);
    } catch (e) {
      console.error("Pagination error:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleOpenUser = async (u: UserProfile) => {
    setSelectedUser(u);
    setLoadingDetails(true);
    setActiveTab('info');
    try {
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
          <div className="dev-panel-sub" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Professional Infrastructure & User Analytics.</div>
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
        
        {/* 1. PROFESSIONAL SCROLLABLE TABLE */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="dev-stitle" style={{ margin: 0, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> MAINTAINER DIRECTORY
            </div>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input 
                type="text" 
                placeholder="Filter 10k+ maintainers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '10px', 
                  padding: '10px 12px 10px 38px', 
                  color: '#fff', 
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--dev-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>
          
          <div className="dev-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ overflowX: 'auto', maxHeight: '550px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <tr>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--dev-muted)', fontWeight: 600 }}>MAINTAINER</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--dev-muted)', fontWeight: 600 }}>ROLE</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--dev-muted)', fontWeight: 600 }}>PROVIDER</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--dev-muted)', fontWeight: 600 }}>API STATUS</th>
                    <th style={{ padding: '1rem 1.5rem', color: 'var(--dev-muted)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => {
                    const keysCount = Object.values(u.apiKeys || {}).filter(k => !!k).length;
                    return (
                      <tr 
                        key={u.uid} 
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.03)', 
                          background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                      >
                        <td style={{ padding: '0.85rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={u.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.5rem' }}>
                          <span className={`dev-badge ${u.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.5rem', textTransform: 'capitalize', opacity: 0.8 }}>
                          {u.activeProvider || '---'}
                        </td>
                        <td style={{ padding: '0.85rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: keysCount > 0 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
                            <span style={{ fontSize: '0.75rem', color: keysCount > 0 ? '#10b981' : 'var(--dev-muted)' }}>
                              {keysCount} Key{keysCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleOpenUser(u)}
                            style={{ 
                              background: 'rgba(59, 130, 246, 0.1)', 
                              color: '#3b82f6', 
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              borderRadius: '6px',
                              padding: '4px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.color = '#3b82f6'; }}
                          >
                            MANAGE <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {hasMore && (
                <div style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                  <button 
                    onClick={loadMoreUsers} 
                    disabled={loadingMore}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '8px', 
                      padding: '8px 20px', 
                      color: 'var(--dev-muted)', 
                      fontSize: '0.8rem', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--dev-muted)'; }}
                  >
                    {loadingMore ? 'SYNCING...' : <>LOAD MORE USERS <ArrowDown size={14} /></>}
                  </button>
                </div>
              )}
              {filteredUsers.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.3 }}>
                  <Users size={32} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <div>No maintainers match your search criteria.</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. SYSTEM OPERATIONS */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
            <Database size={18} style={{ marginRight: '0.5rem' }} /> SYSTEM OPERATIONS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'var(--dev-accent)' }}><Zap size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Broadcast Signals</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>Send notifications to all maintainers.</div>
            </button>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#eab308' }}><Database size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Snapshot Vault</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>Backup all encrypted user metadata.</div>
            </button>
            <button className="dev-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <div><FileText size={24} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Export System Logs</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>Generate JSON dump of session activity.</div>
            </button>
          </div>
        </section>

        {/* 3. LIVE ANALYTICS FEED */}
        <section>
          <div className="dev-stitle" style={{ marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
            <Activity size={18} style={{ marginRight: '0.5rem' }} /> LIVE ANALYTICS FEED
          </div>
          <div className="dev-card" style={{ padding: '0', maxHeight: '400px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ev.email || 'anonymous'}</span>
                  <ChevronRight size={12} opacity={0.2} />
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}><strong style={{ opacity: 0.4, marginRight: '0.4rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>{ev.category}:</strong> {ev.action}</span>
                </div>
                <MoreVertical size={14} style={{ opacity: 0.2 }} />
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
              maxWidth: '850px', 
              background: '#0a0a0a', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img src={selectedUser.photoURL} alt="" style={{ width: 60, height: 60, borderRadius: '16px', border: '2px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>{selectedUser.displayName}</h3>
                    <div className={`dev-badge ${selectedUser.role === 'admin' ? 'dev-badge-purple' : 'dev-badge-muted'}`}>{selectedUser.role.toUpperCase()}</div>
                  </div>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', opacity: 0.5 }}>{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
              {[
                { id: 'info', label: 'Credentials', icon: <Key size={14} /> },
                { id: 'data', label: 'Cloud Vault', icon: <Database size={14} /> },
                { id: 'chats', label: 'AI Telemetry', icon: <MessageSquare size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    background: 'none', 
                    border: 'none', 
                    color: activeTab === tab.id ? 'var(--dev-accent)' : 'var(--dev-muted)', 
                    fontSize: '0.9rem', 
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    borderBottom: `3px solid ${activeTab === tab.id ? 'var(--dev-accent)' : 'transparent'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
              {loadingDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1.5rem', opacity: 0.4 }}>
                  <div className="dev-auth-spinner" style={{ width: '40px', height: '40px' }} />
                  <span style={{ letterSpacing: '0.1em', fontSize: '0.8rem' }}>SYNCING USER TELEMETRY...</span>
                </div>
              ) : (
                <>
                  {activeTab === 'info' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, marginBottom: '1.25rem', letterSpacing: '0.15em' }}>ENCRYPTED CREDENTIALS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {Object.entries(selectedUser.apiKeys || {}).map(([p, k]) => (
                            <div key={p} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--dev-accent)', marginBottom: '0.2rem' }}>{p}</div>
                                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--dev-font-mono)', opacity: k ? 0.6 : 0.2 }}>
                                  {k ? (k.length > 25 ? `${k.substring(0, 15)}...${k.slice(-4)}` : k) : 'No key provided'}
                                </div>
                              </div>
                              {k && (
                                <button 
                                  onClick={(e) => {
                                    navigator.clipboard.writeText(k);
                                    const target = e.currentTarget as HTMLButtonElement;
                                    const oldText = target.innerText;
                                    target.innerText = "COPIED";
                                    target.style.color = "#10b981";
                                    setTimeout(() => {
                                      target.innerText = oldText;
                                      target.style.color = "";
                                    }, 1500);
                                  }}
                                  className="dev-btn dev-btn-ghost dev-btn-sm" 
                                  style={{ fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 700, padding: '4px 10px' }}
                                >
                                  COPY
                                </button>
                              )}
                            </div>
                          ))}
                          {Object.keys(selectedUser.apiKeys || {}).length === 0 && <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.2, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>No keys set.</div>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, marginBottom: '1.25rem', letterSpacing: '0.15em' }}>WORKSPACE CONFIG</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 700, marginBottom: '0.4rem' }}>ACTIVE PROVIDER</div>
                              <div style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '1rem' }}>{selectedUser.activeProvider || 'Not set'}</div>
                           </div>
                           <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 700, marginBottom: '0.4rem' }}>UID REFERENCE</div>
                              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--dev-font-mono)', opacity: 0.7, wordBreak: 'break-all' }}>{selectedUser.uid}</div>
                           </div>
                           <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.7rem', opacity: 0.4, fontWeight: 700, marginBottom: '0.4rem' }}>LAST SEEN</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selectedUser.lastLogin?.toDate ? selectedUser.lastLogin.toDate().toLocaleString() : 'Recently'}</div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'data' && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, marginBottom: '1.5rem', letterSpacing: '0.15em' }}>CLOUD DATA PERSISTENCE ({userData.length} OBJECTS)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {userData.map(d => (
                          <div key={d.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--dev-accent)' }}>{d.key}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5, fontFamily: 'var(--dev-font-mono)', lineHeight: 1.5, maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.value}</div>
                            <div style={{ position: 'absolute', right: '1rem', top: '1rem', opacity: 0.2 }}><ExternalLink size={14} /></div>
                          </div>
                        ))}
                        {userData.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', opacity: 0.2, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>Maintainer has no active cloud data.</div>}
                      </div>
                    </div>
                  )}

                  {activeTab === 'chats' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, marginBottom: '0.5rem', letterSpacing: '0.15em' }}>AI INTERACTION STREAM</div>
                      {userChats.map(session => (
                        <div key={session.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ background: 'var(--dev-accent)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{session.provider.toUpperCase()}</div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6 }}>{session.model}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.4, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Clock size={14} /> {session.timestamp?.toDate ? session.timestamp.toDate().toLocaleString() : 'Recently'}
                            </div>
                          </div>
                          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {session.messages.slice(0, 4).map((msg, midx) => (
                              <div key={midx} style={{ display: 'flex', gap: '1.25rem', opacity: msg.role === 'assistant' ? 0.9 : 1 }}>
                                <div style={{ 
                                  width: '32px', height: '32px', borderRadius: '10px', 
                                  background: msg.role === 'assistant' ? 'var(--dev-accent)' : 'rgba(255,255,255,0.1)',
                                  color: msg.role === 'assistant' ? '#000' : '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                                  boxShadow: msg.role === 'assistant' ? '0 0 15px var(--dev-accent-50)' : 'none'
                                }}>
                                  {msg.role === 'assistant' ? 'AI' : 'U'}
                                </div>
                                <div style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: msg.role === 'assistant' ? 0.8 : 1, paddingTop: '4px' }}>{msg.content}</div>
                              </div>
                            ))}
                            {session.messages.length > 4 && <div style={{ fontSize: '0.75rem', opacity: 0.3, textAlign: 'center', padding: '0.75rem 0', borderTop: '1px dashed rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>+ {session.messages.length - 4} MORE MESSAGES IN SESSION</div>}
                          </div>
                        </div>
                      ))}
                      {userChats.length === 0 && <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.2, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>No chat telemetry recorded.</div>}
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
