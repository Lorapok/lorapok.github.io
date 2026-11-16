/* eslint-disable react-refresh/only-export-components */
// src/dev/DevAuth.tsx
// Global Context for Lorapok Labs Developer Mode: Auth, API Keys, and Workspace State
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { AI_PROVIDERS, type AIProviderId } from "./constants/providers";
import {
  BOOTSTRAP_OWNER_EMAILS,
  hasOfficePermission,
  normalizeOfficeRole,
  type OfficeAccessStatus,
  type OfficePermission,
  type OfficeRole,
} from "./rbac";

export type { AIProviderId };
export type LogCategory = 'auth' | 'ai' | 'nav' | 'config' | 'system' | 'profile';

interface DevContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  canAccessOffice: boolean;
  role: OfficeRole;
  accessStatus: OfficeAccessStatus;
  accessProfile: OfficeAccessProfile | null;
  can: (permission: OfficePermission) => boolean;
  
  // API Key Management
  apiKeys: Record<string, string>;
  setApiKey: (provider: AIProviderId, key: string) => void;
  activeProvider: AIProviderId;
  setActiveProvider: (id: AIProviderId) => void;
  activeModels: Record<string, string>;
  setActiveModel: (provider: AIProviderId, model: string) => void;
  
  // Analytics & Logging
  logEvent: (category: LogCategory, action: string, metadata?: Record<string, unknown>) => Promise<void>;
  logChat: (provider: AIProviderId, model: string, messages: { role: 'user' | 'assistant', content: string }[]) => Promise<void>;
}

export interface OfficeAccessProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: OfficeRole;
  status: OfficeAccessStatus;
  department?: string;
  title?: string;
  lastLogin?: unknown;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

function authError(error: unknown) {
  const record = error && typeof error === "object" ? error as { code?: string; message?: string } : {};
  return { code: record.code || "auth/unknown", message: record.message || "Authentication could not be completed." };
}

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [accessLoading, setAccessLoading] = useState(isFirebaseConfigured);
  const [accessProfile, setAccessProfile] = useState<OfficeAccessProfile | null>(null);
  const [activeProvider, setActiveProvider] = useState<AIProviderId>(() => {
    return (localStorage.getItem("lpk_active_provider") as AIProviderId) || "claude";
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    const saved: Record<string, string> = {};
    AI_PROVIDERS.forEach(p => {
      const storageKey = `lpk_key_${p.id}`;
      localStorage.removeItem(storageKey);
      saved[p.id] = sessionStorage.getItem(storageKey) || "";
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

  // Provision the signed-in identity, then subscribe to its server-controlled access record.
  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      return;
    }

    let disposed = false;
    let unsubscribe = () => undefined;
    const userRef = doc(db, "users", user.uid);

    const provisionAndSubscribe = async () => {
      setAccessLoading(true);
      try {
        const email = (user.email || "").trim().toLowerCase();
        const current = await getDoc(userRef);
        const isBootstrapOwner = BOOTSTRAP_OWNER_EMAILS.includes(email as typeof BOOTSTRAP_OWNER_EMAILS[number]);
        let initialAccess: Pick<OfficeAccessProfile, "role" | "status"> | null = null;
        let shouldAcceptInvitation = false;

        if (!current.exists()) {
          const invitation = email ? await getDoc(doc(db, "office_invites", email)) : null;
          const inviteData = invitation?.exists() ? invitation.data() : null;
          shouldAcceptInvitation = inviteData?.status === "invited";
          initialAccess = isBootstrapOwner
            ? { role: "owner", status: "active" }
            : inviteData?.status === "invited"
              ? { role: normalizeOfficeRole(inviteData.role), status: "active" }
              : { role: "viewer", status: "pending" };
        } else if (isBootstrapOwner) {
          initialAccess = { role: "owner", status: "active" };
        }

        await setDoc(userRef, {
          uid: user.uid,
          email,
          displayName: user.displayName || email.split("@")[0] || "Office user",
          photoURL: user.photoURL || "",
          lastLogin: serverTimestamp(),
          ...(initialAccess || {}),
        }, { merge: true });

        if (shouldAcceptInvitation) {
          await setDoc(doc(db, "office_invites", email), {
            status: "accepted",
            acceptedAt: serverTimestamp(),
            acceptedUid: user.uid,
          }, { merge: true }).catch(() => undefined);
        }

        if (disposed) return;
        unsubscribe = onSnapshot(userRef, (snapshot) => {
          const data = snapshot.data();
          if (!data) {
            setAccessProfile(null);
            setAccessLoading(false);
            return;
          }
          const profile: OfficeAccessProfile = {
            uid: user.uid,
            email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            role: normalizeOfficeRole(data.role),
            status: (["pending", "active", "suspended"] as const).includes(data.status) ? data.status : "pending",
            department: data.department,
            title: data.title,
            lastLogin: data.lastLogin,
          };
          setAccessProfile(profile);
          setAccessLoading(false);

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
        }, () => {
          setAccessProfile(null);
          setAccessLoading(false);
        });
      } catch (err) {
        console.error("Failed to initialize Office access:", err);
        setAccessProfile(null);
        setAccessLoading(false);
      }
    };

    void provisionAndSubscribe();
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    void setPersistence(auth, browserLocalPersistence);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) {
        setAccessProfile(null);
        setAccessLoading(false);
      }
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
    
    try {
      // Try Popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const err = authError(error);
      console.warn("Auth Attempt Failed:", err.code);
      if (err.code === "auth/popup-blocked" || err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: unknown) {
          setLoginError(authError(redirectError).message);
        }
      } else {
        setLoginError(`${err.code}: ${err.message}`);
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Handle Redirect Result (Fallback)
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getRedirectResult(auth).catch(err => {
      if (err.code !== 'auth/web-storage-unsupported') {
        setLoginError(err.message);
      }
    });
  }, []);

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) return;
    
    // Clear session credentials and persisted non-secret preferences.
    const keysToClear = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('lpk_key_') || key.startsWith('lpk_model_') || key === 'lpk_active_provider')) {
        keysToClear.push(key);
      }
    }
    keysToClear.forEach(k => localStorage.removeItem(k));
    AI_PROVIDERS.forEach((provider) => sessionStorage.removeItem(`lpk_key_${provider.id}`));

    // Reset local state to defaults
    const emptyKeys: Record<string, string> = {};
    const defaultModels: Record<string, string> = {};
    AI_PROVIDERS.forEach(p => {
      emptyKeys[p.id] = "";
      defaultModels[p.id] = p.availableModels[0];
    });
    setApiKeys(emptyKeys);
    setActiveModels(defaultModels);
    setActiveProvider("claude");

    await signOut(auth);
    logEvent("auth", "logout");
  };

  const updateApiKey = (provider: AIProviderId, key: string) => {
    const storageKey = `lpk_key_${provider}`;
    if (key) sessionStorage.setItem(storageKey, key);
    else sessionStorage.removeItem(storageKey);
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    logEvent("config", "key_updated", { provider, hasKey: !!key });
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

  const logEvent = async (category: LogCategory, action: string, metadata: Record<string, unknown> = {}) => {
    if (!isFirebaseConfigured || !user) return;
    try {
      // Use a timeout for analytics so they don't block anything
      await addDoc(collection(db, "analytics"), {
        category,
        action,
        metadata,
        uid: user.uid,
        email: user.email,
        isAnonymous: false,
        timestamp: serverTimestamp(),
        platform: navigator.platform,
        userAgent: navigator.userAgent
      });
    } catch {
      // Analytics should NEVER cause a visible console error for the user
    }
  };

  const logChat = async (provider: AIProviderId, model: string, messages: { role: 'user' | 'assistant', content: string }[]) => {
    if (!isFirebaseConfigured || !user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/chats`), {
        provider,
        model,
        messages,
        timestamp: serverTimestamp(),
        email: user.email
      });
      // Also log as a general event
      logEvent('ai', 'chat_saved', { provider, model });
    } catch {
      // Silent fail
    }
  };

  const role = accessProfile?.role || "viewer";
  const accessStatus = accessProfile?.status || "pending";
  const canAccessOffice = Boolean(user && accessProfile && accessStatus === "active" && hasOfficePermission(role, "view_office"));
  const can = (permission: OfficePermission) => canAccessOffice && hasOfficePermission(role, permission);
  const isAdmin = can("manage_users");

  return (
    <DevContext.Provider
      value={{ 
        user, loading: loading || signingIn || accessLoading, signIn: handleSignIn, signOut: handleSignOut, isAdmin,
        canAccessOffice, role, accessStatus, accessProfile, can,
        apiKeys, setApiKey: updateApiKey,
        activeProvider, setActiveProvider: updateActiveProvider,
        activeModels, setActiveModel: updateActiveModel,
        logEvent, logChat
      }}
    >
      {children}
      {loginError && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
          background: "rgba(220, 38, 38, 0.95)", color: "#fff", padding: "1.25rem",
          borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(20px)",
          maxWidth: "350px", fontSize: "0.85rem", animation: "dev-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <div style={{ fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚠</span> Authentication Failed
          </div>
          <div style={{ opacity: 0.9, lineHeight: 1.5, marginBottom: "1rem", fontFamily: "var(--dev-font-mono)", fontSize: "0.75rem" }}>
            {loginError}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={async () => {
                setLoginError(null);
                setSigningIn(true);
                try {
                  await signInWithRedirect(auth, googleProvider);
                } catch (error: unknown) { setLoginError(authError(error).message); setSigningIn(false); }
              }}
              style={{ background: "#fff", border: "none", color: "#000", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
            >
              Try Redirect Flow
            </button>
            <button 
              onClick={() => setLoginError(null)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", cursor: "pointer" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </DevContext.Provider>
  );
}

export function useDevAuth() {
  const context = useContext(DevContext);
  if (context === undefined) {
    throw new Error("useDevAuth must be used within a DevAuthProvider");
  }
  return context;
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { loading, can } = useDevAuth();

  if (loading) return <div className="dev-auth-loading"><div className="dev-auth-spinner" /><span>Authenticating…</span></div>;

  if (!can("manage_users")) {
    return (
      <div className="dev-auth-gate compact">
        <div className="dev-auth-gate-inner">
          <div className="dev-auth-badge">Restricted workspace</div>
          <h2 className="dev-auth-title"><span>Owner</span> permission required</h2>
          <p className="dev-auth-sub">Your account can use its assigned Office tools, but it cannot manage teammate roles or access states.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function OfficeGate({ children }: { children: ReactNode }) {
  const { user, loading, signIn, signOut: leaveOffice, canAccessOffice, accessStatus } = useDevAuth();

  if (loading) return <div className="dev-auth-loading"><div className="dev-auth-spinner" /><span>Authenticating…</span></div>;

  if (!user || !canAccessOffice) {
    const statusMessage = accessStatus === "suspended"
      ? "This Office account is suspended. Contact an owner if access should be restored."
      : "Your Google identity is recorded as pending. An Office owner must approve it or send an invitation before workspace access is granted.";
    return (
      <div className="dev-auth-gate">
        <div className="dev-auth-gate-inner">
          <div className="dev-auth-badge">Lorapok Labs Office</div>
          <h2 className="dev-auth-title"><span>Office</span> Sign-in</h2>
          <p className="dev-auth-sub">Sign in with an invited Google account to enter the role-controlled studio, project control plane, and LoLaBo operations center.</p>
          
          {!user ? (
            <button
              className="dev-btn dev-btn-primary dev-auth-signin"
              onClick={signIn}
              disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", width: "100%" }}
            >
              {loading ? <div className="dev-auth-spinner" style={{ width: "16px", height: "16px" }} /> : "Sign in with Google"}
            </button>
          ) : (
            <div className="dev-access-state">
              <strong>{accessStatus === "suspended" ? "Access suspended" : "Approval pending"}</strong>
              <p>{statusMessage}</p>
              <small>{user.email}</small>
              <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={leaveOffice}>Use another account</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

