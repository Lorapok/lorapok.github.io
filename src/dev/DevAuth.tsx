// src/dev/DevAuth.tsx
// Firebase Auth context for Lorapok Labs Developer Mode Admin access

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
});

// Authorized admin emails — add yours here
const ADMIN_EMAILS = ["mdshuvo40@gmail.com", "lorapokdev@gmail.com"];

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    if (!isFirebaseConfigured) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) return;
    await signOut(auth);
  };

  const isAdmin = Boolean(user && ADMIN_EMAILS.includes(user.email ?? ""));

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn: handleSignIn, signOut: handleSignOut, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useDevAuth() {
  return useContext(AuthContext);
}

/** Gate component — renders children only when authenticated admin */
export function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading, signIn, isAdmin } = useDevAuth();

  if (loading) {
    return (
      <div className="dev-auth-loading">
        <div className="dev-auth-spinner" />
        <span>Authenticating…</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="dev-auth-gate">
        <div className="dev-auth-gate-inner">
          <div className="dev-auth-badge">⚙ Admin Panel</div>
          <h2 className="dev-auth-title">
            <span>Restricted</span> Access
          </h2>
          <p className="dev-auth-sub">
            This panel requires Lorapok Labs administrator credentials.
          </p>
          {!isFirebaseConfigured && (
            <div className="dev-auth-warning">
              ⚠ Firebase is not configured. Add VITE_FIREBASE_* env vars to enable auth.
            </div>
          )}
          <button className="dev-btn dev-btn-primary dev-auth-signin" onClick={signIn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          {user && !isAdmin && (
            <p style={{ color: "var(--dev-red)", fontSize: "0.8rem", marginTop: "1rem", fontFamily: "var(--dev-font-mono)" }}>
              ⛔ {user.email} is not an authorized admin.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
