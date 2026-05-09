// src/dev/DevAuth.tsx
// Global Context for Lorapok Labs Developer Mode: Auth, API Keys, and Workspace State
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";
import { AI_PROVIDERS, type AIProviderId } from "./constants/providers";

export type { AIProviderId };

export type LogCategory = 'auth' | 'ai' | 'nav' | 'config' | 'system' | 'profile';

interface DevContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  
  // API Key Management
  apiKeys: Record<string, string>;
  setApiKey: (provider: AIProviderId, key: string) => void;
  activeProvider: AIProviderId;
  setActiveProvider: (id: AIProviderId) => void;
  activeModels: Record<string, string>;
  setActiveModel: (provider: AIProviderId, model: string) => void;
  
  // Analytics & Logging
  logEvent: (category: LogCategory, action: string, metadata?: any) => Promise<void>;
}

const DevContext = createContext<DevContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
  apiKeys: {},
  setApiKey: () => {},
  activeProvider: "claude",
  setActiveProvider: () => {},
  activeModels: {},
  setActiveModel: () => {},
  logEvent: async () => {},
});

const ADMIN_EMAILS = ["mdshuvo40@gmail.com", "lorapokdev@gmail.com"];

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [activeProvider, setActiveProvider] = useState<AIProviderId>(() => {
    return (localStorage.getItem("lpk_active_provider") as AIProviderId) || "claude";
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    AI_PROVIDERS.forEach(p => {
      saved[p.id] = localStorage.getItem(`lpk_key_${p.id}`) || "";
    });
    return saved;
  });
  const [activeModels, setActiveModels] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    AI_PROVIDERS.forEach(p => {
      saved[p.id] = localStorage.getItem(`lpk_model_${p.id}`) || p.availableModels[0];
    });
    return saved;
  });

  // Anonymous session ID for non-logged-in users
  const [anonId] = useState<string>(() => {
    let id = localStorage.getItem('lpk_anon_id');
    if (!id) {
      id = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('lpk_anon_id', id);
    }
    return id;
  });

  // Sync keys from Firestore when user logs in
  useEffect(() => {
    if (!isFirebaseConfigured || !user) return;
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.apiKeys) {
            setApiKeys(prev => {
              const newKeys = { ...prev, ...data.apiKeys };
              // Also sync to localStorage
              Object.entries(newKeys).forEach(([k, v]) => {
                if (typeof v === "string") localStorage.setItem(`lpk_key_${k}`, v);
              });
              return newKeys;
            });
          }
          if (data.activeProvider) {
            setActiveProvider(data.activeProvider as AIProviderId);
            localStorage.setItem("lpk_active_provider", data.activeProvider);
          }
          if (data.activeModels) {
            setActiveModels(prev => {
              const newModels = { ...prev, ...data.activeModels };
              Object.entries(newModels).forEach(([k, v]) => {
                if (typeof v === "string") localStorage.setItem(`lpk_model_${k}`, v);
              });
              return newModels;
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) logEvent("auth", "session_start", { email: u.email });
    });
    return unsub;
  }, []);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setLoginError("Firebase is not configured. Missing environment variables.");
      return;
    }
    setLoginError(null);
    setSigningIn(true);
    
    // Debug info (silently log for diagnostics)
    console.log("Initiating login for:", window.location.origin);

    try {
      // Try Popup first
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await handleUserDoc(res.user);
      }
    } catch (err: any) {
      console.warn("Auth Attempt Failed:", err.code);
      if (err.code === "auth/popup-blocked" || err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirErr: any) {
          setLoginError(redirErr.message);
        }
      } else {
        setLoginError(`${err.code}: ${err.message}`);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleUserDoc = async (u: User) => {
    const { uid, email, displayName, photoURL } = u;
    await setDoc(doc(db, "users", uid), {
      uid, email, displayName, photoURL,
      lastLogin: serverTimestamp(),
      role: ADMIN_EMAILS.includes(email || "") ? "admin" : "user"
    }, { merge: true }).catch(() => {});
    logEvent("auth", "login_success", { email });
  };

  // Handle Redirect Result (Fallback)
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getRedirectResult(auth).then(async (res) => {
      if (res?.user) {
        handleUserDoc(res.user);
      }
    }).catch(err => {
      if (err.code !== 'auth/web-storage-unsupported') {
        setLoginError(err.message);
      }
    });
  }, []);

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
    logEvent("auth", "logout");
  };

  const updateApiKey = (provider: AIProviderId, key: string) => {
    localStorage.setItem(`lpk_key_${provider}`, key);
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    logEvent("config", "key_updated", { provider, hasKey: !!key });
    
    // Sync to Firestore: logged-in user or anonymous
    if (isFirebaseConfigured) {
      const docId = user ? user.uid : anonId;
      const docData: any = { apiKeys: { [provider]: key ? '***' : '' } };
      if (!user) docData.isAnonymous = true;
      setDoc(doc(db, "users", docId), docData, { merge: true }).catch(() => {
        // Silently fail if firestore is blocked or unreachable
      });
    }
  };

  const updateActiveProvider = (id: AIProviderId) => {
    localStorage.setItem("lpk_active_provider", id);
    setActiveProvider(id);
    logEvent("config", "provider_switched", { provider: id });
    
    if (user && isFirebaseConfigured) {
      setDoc(doc(db, "users", user.uid), {
        activeProvider: id
      }, { merge: true }).catch(console.error);
    }
  };

  const updateActiveModel = (provider: AIProviderId, model: string) => {
    localStorage.setItem(`lpk_model_${provider}`, model);
    setActiveModels(prev => ({ ...prev, [provider]: model }));
    logEvent("config", "model_switched", { provider, model });

    if (user && isFirebaseConfigured) {
      setDoc(doc(db, "users", user.uid), {
        activeModels: { [provider]: model }
      }, { merge: true }).catch(console.error);
    }
  };

  const logEvent = async (category: LogCategory, action: string, metadata: any = {}) => {
    if (!isFirebaseConfigured) return;
    try {
      // Use a timeout for analytics so they don't block anything
      await addDoc(collection(db, "analytics"), {
        category,
        action,
        metadata,
        uid: user?.uid || anonId,
        email: user?.email || 'anonymous',
        isAnonymous: !user,
        timestamp: serverTimestamp(),
        platform: navigator.platform,
        userAgent: navigator.userAgent
      });
    } catch (e) {
      // Analytics should NEVER cause a visible console error for the user
    }
  };

  const isAdmin = Boolean(user && ADMIN_EMAILS.includes(user.email ?? ""));

  return (
    <DevContext.Provider
      value={{ 
        user, loading: loading || signingIn, signIn: handleSignIn, signOut: handleSignOut, isAdmin,
        apiKeys, setApiKey: updateApiKey,
        activeProvider, setActiveProvider: updateActiveProvider,
        activeModels, setActiveModel: updateActiveModel,
        logEvent
      }}
    >
      {children}
      {loginError && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
          background: "rgba(220, 38, 38, 0.95)", color: "#fff", padding: "1rem 1.5rem",
          borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          maxWidth: "350px", fontSize: "0.85rem", animation: "dev-slide-up 0.3s ease-out"
        }}>
          <div style={{ fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>⚠</span> Authentication Error
          </div>
          <div style={{ opacity: 0.9, lineHeight: 1.5, marginBottom: "0.8rem" }}>{loginError}</div>
          <button 
            onClick={() => setLoginError(null)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}
    </DevContext.Provider>
  );
}

export function useDevAuth() {
  return useContext(DevContext);
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, signIn, isAdmin } = useDevAuth();

  if (loading) return <div className="dev-auth-loading"><div className="dev-auth-spinner" /><span>Authenticating…</span></div>;

  if (!user || !isAdmin) {
    return (
      <div className="dev-auth-gate">
        <div className="dev-auth-gate-inner">
          <div className="dev-auth-badge">⚙ Admin Panel</div>
          <h2 className="dev-auth-title"><span>Restricted</span> Access</h2>
          <p className="dev-auth-sub">This panel requires Lorapok Labs administrator credentials.</p>
          
          <button 
            className="dev-btn dev-btn-primary dev-auth-signin" 
            onClick={signIn}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", width: "100%" }}
          >
            {loading ? <div className="dev-auth-spinner" style={{ width: "16px", height: "16px" }} /> : "Sign in with Google"}
          </button>

          {user && !isAdmin && (
            <div style={{ marginTop: "1rem", color: "var(--dev-red)", fontSize: "0.8rem", textAlign: "center" }}>
              ⚠ Access Denied: Your account ({user.email}) is not in the maintainer whitelist.
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

