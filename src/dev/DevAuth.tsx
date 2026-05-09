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

  const handleSignIn = async () => {
    if (!isFirebaseConfigured) return;
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  // Handle Redirect Result
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getRedirectResult(auth).then(async (res) => {
      if (res?.user) {
        const { uid, email, displayName, photoURL } = res.user;
        await setDoc(doc(db, "users", uid), {
          uid, email, displayName, photoURL,
          lastLogin: serverTimestamp(),
          role: ADMIN_EMAILS.includes(email || "") ? "admin" : "user"
        }, { merge: true });
        
        logEvent("auth", "login_success", { email });
      }
    }).catch(err => {
      console.error("Redirect sign-in error:", err);
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
      setDoc(doc(db, "users", docId), docData, { merge: true }).catch(console.error);
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
      console.error("Analytics failed:", e);
    }
  };

  const isAdmin = Boolean(user && ADMIN_EMAILS.includes(user.email ?? ""));

  return (
    <DevContext.Provider
      value={{ 
        user, loading, signIn: handleSignIn, signOut: handleSignOut, isAdmin,
        apiKeys, setApiKey: updateApiKey,
        activeProvider, setActiveProvider: updateActiveProvider,
        activeModels, setActiveModel: updateActiveModel,
        logEvent
      }}
    >
      {children}
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
          <button className="dev-btn dev-btn-primary dev-auth-signin" onClick={signIn}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

