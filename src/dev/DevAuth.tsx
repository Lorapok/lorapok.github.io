// src/dev/DevAuth.tsx
// Global Context for Lorapok Labs Developer Mode: Auth, API Keys, and Workspace State
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";
import { AI_PROVIDERS, type AIProviderId } from "./constants/providers";

export type { AIProviderId };

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
  
  // Analytics & Logging
  logEvent: (category: string, action: string, metadata?: any) => Promise<void>;
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
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const { uid, email, displayName, photoURL } = res.user;
        await setDoc(doc(db, "users", uid), {
          uid, email, displayName, photoURL,
          lastLogin: serverTimestamp(),
          role: ADMIN_EMAILS.includes(email || "") ? "admin" : "user"
        }, { merge: true });
        
        logEvent("auth", "login_success", { email });
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
    logEvent("auth", "logout");
  };

  const updateApiKey = (provider: AIProviderId, key: string) => {
    localStorage.setItem(`lpk_key_${provider}`, key);
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    logEvent("config", "key_updated", { provider });
    
    // Sync to Firestore if logged in
    if (user && isFirebaseConfigured) {
      setDoc(doc(db, "users", user.uid), {
        apiKeys: { [provider]: key }
      }, { merge: true }).catch(console.error);
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

  const logEvent = async (category: string, action: string, metadata: any = {}) => {
    if (!isFirebaseConfigured) return;
    try {
      await addDoc(collection(db, "analytics"), {
        category,
        action,
        metadata,
        uid: user?.uid || "anonymous",
        email: user?.email || "anonymous",
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

