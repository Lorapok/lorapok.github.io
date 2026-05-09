import { useState, useEffect } from "react";
import { useDevAuth } from "../DevAuth";
import { AI_PROVIDERS } from "../constants/providers";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

interface StoredData {
  id: string;
  key: string;
  value: string;
  createdAt: any;
}



export default function UserProfilePanel() {
  const { user, apiKeys, setApiKey } = useDevAuth();
  
  // Data State
  const [dataKey, setDataKey] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [userDataList, setUserDataList] = useState<StoredData[]>([]);
  const [savingData, setSavingData] = useState(false);

  const [savingData, setSavingData] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Listen to user's stored data
    const q = query(collection(db, `users/${user.uid}/data`), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, 
      (snapshot) => {
        setUserDataList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredData)));
      },
      (err) => {
        console.warn("Firestore access restricted:", err.message);
      }
    );

    return () => unsub();
  }, [user]);

  const handleSaveData = async () => {
    if (!user || !dataKey.trim() || !dataValue.trim()) return;
    setSavingData(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/data`), {
        key: dataKey.trim(),
        value: dataValue.trim(),
        createdAt: serverTimestamp(),
      });
      setDataKey("");
      setDataValue("");
    } catch (e) {
      alert("Error saving data");
    } finally {
      setSavingData(false);
    }
  };

  const handleDeleteData = async (id: string) => {
    if (!user) return;
    if (confirm("Delete this entry?")) {
      await deleteDoc(doc(db, `users/${user.uid}/data`, id));
    }
  };


  if (!user) {
    return (
      <div className="dev-panel-content">
        <div className="dev-empty-state">
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
          <p>Please log in via the Lorapok dev menu to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-panel-content">
      <div className="dev-panel-header">
        <div className="dev-panel-title">User <span>Profile</span></div>
        <div className="dev-panel-sub">Manage your personal data, API settings, and file uploads.</div>
      </div>

      <div className="dev-g2">
        {/* Data Storage Section */}
        <div className="dev-card">
          <div className="dev-stitle"><span className="dev-stitle-dot" />Cloud Storage Data</div>
          <p className="dev-auth-sub" style={{ marginBottom: "1rem" }}>Save configurations, keys, or JSON payloads.</p>
          
          <div className="dev-form-group">
            <input className="dev-form-input" placeholder="Key (e.g. settings_theme)" value={dataKey} onChange={e => setDataKey(e.target.value)} />
          </div>
          <div className="dev-form-group">
            <textarea className="dev-form-textarea" placeholder="Value..." value={dataValue} onChange={e => setDataValue(e.target.value)} style={{ height: "80px" }} />
          </div>
          <button className="dev-btn dev-btn-primary" onClick={handleSaveData} disabled={savingData || !dataKey || !dataValue}>
            {savingData ? "Saving..." : "Save Data"}
          </button>

          <div style={{ marginTop: "2rem" }}>
            <div className="dev-stitle" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>Stored Entries</div>
            {userDataList.length === 0 ? (
              <div className="dev-empty-state" style={{ padding: "1rem", minHeight: "auto" }}>No data found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {userDataList.map(item => (
                  <div key={item.id} className="dev-msg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "var(--dev-fg)" }}>{item.key}:</strong> <span style={{ color: "var(--dev-muted2)" }}>{item.value.length > 50 ? item.value.substring(0, 50) + "..." : item.value}</span>
                    </div>
                    <button className="dev-btn dev-btn-ghost dev-btn-sm" style={{ color: "var(--dev-red)", padding: "0 0.5rem" }} onClick={() => handleDeleteData(item.id)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        
        {/* API Keys Section */}
        <div className="dev-card" style={{ gridColumn: "1 / -1" }}>
          <div className="dev-stitle"><span className="dev-stitle-dot" />API Key Management</div>
          <p className="dev-auth-sub" style={{ marginBottom: "1rem" }}>Your keys are synced across your devices via Firebase.</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {AI_PROVIDERS.map(p => {
              const hasKey = !!apiKeys[p.id];
              return (
                <div key={p.id} className="dev-msg" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}></span>
                      <strong style={{ color: "var(--dev-fg)" }}>{p.label}</strong>
                    </div>
                    {hasKey ? <span className="dev-badge dev-badge-green" style={{ fontSize: "0.6rem" }}>Configured</span> : <span className="dev-badge dev-badge-muted" style={{ fontSize: "0.6rem" }}>Not Set</span>}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <input 
                      className="dev-form-input" 
                      type="password" 
                      placeholder={hasKey ? "••••••••••••" : `Enter ${p.label} key...`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          setApiKey(p.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.75rem" }}
                    />
                    {hasKey && (
                      <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={() => setApiKey(p.id, "")} style={{ color: "var(--dev-red)", padding: "0 0.5rem" }}>Clear</button>
                    )}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "var(--dev-muted)", marginTop: "0.25rem" }}>
                    Press Enter to save • {p.availableModels.length} models available
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
