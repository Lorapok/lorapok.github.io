/* eslint-disable react-refresh/only-export-components */
// src/dev/DevAuth.tsx
// Global Context for Lorapok Labs Developer Mode: Auth, API Keys, and Workspace State
import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  browserLocalPersistence,
  getMultiFactorResolver,
  onAuthStateChanged,
  multiFactor,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  setPersistence,
  TotpMultiFactorGenerator,
  type MultiFactorError,
  type MultiFactorResolver,
  type TotpSecret,
  type User,
} from "firebase/auth";
import QRCode from "qrcode";
import { auth, googleProvider, isFirebaseConfigured, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { AI_PROVIDERS, type AIProviderId } from "./constants/providers";
import {
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
  secondFactorState: SecondFactorState;
  secondFactorBusy: boolean;
  secondFactorError: string | null;
  secondFactorEnrollment: SecondFactorEnrollment | null;
  beginSecondFactorEnrollment: () => Promise<void>;
  confirmSecondFactorEnrollment: (pin: string) => Promise<void>;
  verifySecondFactorPin: (pin: string) => Promise<void>;
  setupDevicePin: (pin: string, confirmation: string) => Promise<void>;
  verifyDevicePin: (pin: string) => Promise<void>;
  resetDevicePin: () => Promise<void>;
  restartSecureSignIn: () => Promise<void>;
  cancelSecondFactor: () => void;
  isAdmin: boolean;
  hasOfficeRoleAccess: boolean;
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

type SecondFactorState = "idle" | "checking" | "enroll" | "challenge" | "reauthenticate" | "setup-device-pin" | "device-pin" | "verified";

interface SecondFactorEnrollment {
  qrDataUrl: string;
  secretKey: string;
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

const DEVICE_PIN_PREFIX = "lpk_device_pin_v1_";
const DEVICE_PIN_UNLOCKED_KEY = "lpk_device_pin_unlocked_uid";
const DEVICE_PIN_ATTEMPTS_PREFIX = "lpk_device_pin_attempts_";

function currentEpochMs() {
  return Date.now();
}

interface DevicePinEnvelope {
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

function bytesToBase64(bytes: Uint8Array) {
  let value = "";
  bytes.forEach((byte) => { value += String.fromCharCode(byte); });
  return btoa(value);
}

function base64ToBytes(value: string) {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function deriveDevicePinKey(pin: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: 310_000 },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function createDevicePinEnvelope(uid: string, pin: string): Promise<DevicePinEnvelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveDevicePinKey(pin, salt);
  const plaintext = new TextEncoder().encode(`lorapok-office:${uid}:trusted-device`);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    version: 1,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  };
}

async function openDevicePinEnvelope(uid: string, pin: string, envelope: DevicePinEnvelope) {
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const key = await deriveDevicePinKey(pin, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    base64ToBytes(envelope.ciphertext),
  );
  return new TextDecoder().decode(plaintext) === `lorapok-office:${uid}:trusted-device`;
}

function getDevicePinEnvelope(uid: string): DevicePinEnvelope | null {
  try {
    const value = localStorage.getItem(`${DEVICE_PIN_PREFIX}${uid}`);
    if (!value) return null;
    const parsed = JSON.parse(value) as DevicePinEnvelope;
    return parsed.version === 1 && parsed.salt && parsed.iv && parsed.ciphertext ? parsed : null;
  } catch {
    return null;
  }
}

function authError(error: unknown) {
  const record = error && typeof error === "object" ? error as { code?: string; message?: string } : {};
  return { code: record.code || "auth/unknown", message: record.message || "Authentication could not be completed." };
}

function authErrorMessage(error: unknown) {
  const { code } = authError(error);
  const host = typeof window === "undefined" ? "this host" : window.location.hostname;
  const messages: Record<string, string> = {
    "auth/unauthorized-domain": `Google sign-in is not authorized for ${host}. This host must be added to Firebase Authentication authorized domains.`,
    "auth/operation-not-allowed": "Google sign-in is not enabled for this Firebase project.",
    "auth/network-request-failed": "The authentication service could not be reached. Check the connection and try again.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed before authentication finished.",
    "auth/cancelled-popup-request": "A newer Google sign-in attempt replaced the previous one. Please try once more.",
    "auth/web-storage-unsupported": "This browser is blocking the storage required to keep the Office session secure.",
    "auth/user-disabled": "This Google identity is disabled for the authentication project.",
    "auth/invalid-verification-code": "That six-digit authenticator PIN is invalid. Wait for a fresh code and try again.",
    "auth/code-expired": "That authenticator PIN has expired. Enter the newest code from your authenticator app.",
    "auth/invalid-multi-factor-session": "The secure sign-in window expired. Start the Google sign-in again.",
    "auth/multi-factor-info-not-found": "This authenticator is no longer enrolled. Start a new secure sign-in.",
    "auth/requires-recent-login": "For security, sign in with Google again before changing the authenticator.",
    "auth/unverified-email": "A verified Google email is required before an authenticator can be enrolled.",
    "auth/admin-restricted-operation": "Authenticator PIN sign-in is not enabled for this Firebase project yet.",
    "auth/operation-not-supported-in-this-environment": "This browser cannot complete the secure authenticator flow.",
  };
  return messages[code] || "Secure sign-in could not be completed. Please try again.";
}

function hasSecondFactorClaim(user: User) {
  return user.getIdTokenResult().then((token) => {
    const firebase = token.claims.firebase as { sign_in_second_factor?: string } | undefined;
    return Boolean(firebase?.sign_in_second_factor);
  }).catch(() => false);
}

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [accessLoading, setAccessLoading] = useState(isFirebaseConfigured);
  const [accessProfile, setAccessProfile] = useState<OfficeAccessProfile | null>(null);
  const [secondFactorState, setSecondFactorState] = useState<SecondFactorState>(isFirebaseConfigured ? "checking" : "idle");
  const [secondFactorBusy, setSecondFactorBusy] = useState(false);
  const [secondFactorError, setSecondFactorError] = useState<string | null>(null);
  const [secondFactorResolver, setSecondFactorResolver] = useState<MultiFactorResolver | null>(null);
  const [secondFactorSecret, setSecondFactorSecret] = useState<TotpSecret | null>(null);
  const [secondFactorEnrollment, setSecondFactorEnrollment] = useState<SecondFactorEnrollment | null>(null);
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
        let initialAccess: Pick<OfficeAccessProfile, "role" | "status"> | null = null;
        let shouldAcceptInvitation = false;

        if (!current.exists()) {
          const invitation = email ? await getDoc(doc(db, "office_invites", email)) : null;
          const inviteData = invitation?.exists() ? invitation.data() : null;
          shouldAcceptInvitation = inviteData?.status === "invited";
          initialAccess = inviteData?.status === "invited"
              ? { role: normalizeOfficeRole(inviteData.role), status: "active" }
              : { role: "viewer", status: "pending" };
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
    // Firebase keeps the already MFA-verified identity on this trusted browser.
    // A separate encrypted local PIN unlocks each new browser session.
    void setPersistence(auth, browserLocalPersistence);
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (!u) {
        setAccessProfile(null);
        setAccessLoading(false);
        setSecondFactorState((current) => current === "challenge" ? current : "idle");
        return;
      }

      setSecondFactorState("checking");
      setSecondFactorError(null);
      const factors = multiFactor(u).enrolledFactors;
      if (factors.length === 0) {
        setSecondFactorState("enroll");
        return;
      }

      const verifiedByFirebase = await hasSecondFactorClaim(u);
      const verifiedInTab = sessionStorage.getItem("lpk_mfa_verified_uid") === u.uid;
      const deviceUnlocked = sessionStorage.getItem(DEVICE_PIN_UNLOCKED_KEY) === u.uid;
      const hasDevicePin = Boolean(getDevicePinEnvelope(u.uid));
      if (verifiedByFirebase || verifiedInTab) {
        setSecondFactorState(hasDevicePin ? (deviceUnlocked ? "verified" : "device-pin") : "setup-device-pin");
      } else {
        setSecondFactorState("reauthenticate");
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
    setSecondFactorError(null);
    setSigningIn(true);
    
    try {
      // Try Popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const err = authError(error);
      console.warn("Auth Attempt Failed:", err.code);
      if (err.code === "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(auth, error as MultiFactorError);
        const totpHint = resolver.hints.find((hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID);
        if (!totpHint) {
          setLoginError("This account uses an unsupported second factor. Contact an Office owner.");
        } else {
          setSecondFactorResolver(resolver);
          setSecondFactorState("challenge");
        }
      } else if (err.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: unknown) {
          setLoginError(authErrorMessage(redirectError));
        }
      } else {
        setLoginError(authErrorMessage(error));
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Handle Redirect Result (Fallback)
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    getRedirectResult(auth).catch((error: unknown) => {
      const err = authError(error);
      if (err.code === "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(auth, error as MultiFactorError);
        const totpHint = resolver.hints.find((hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID);
        if (totpHint) {
          setSecondFactorResolver(resolver);
          setSecondFactorState("challenge");
          return;
        }
      }
      if (err.code !== "auth/web-storage-unsupported") setLoginError(authErrorMessage(error));
    });
  }, []);

  const beginSecondFactorEnrollment = async () => {
    if (!user) return;
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      const session = await multiFactor(user).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(session);
      const uri = secret.generateQrCodeUrl(user.email || user.uid, "Lorapok Labs Office");
      const qrDataUrl = await QRCode.toDataURL(uri, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 256,
        color: { dark: "#09271d", light: "#effff8" },
      });
      setSecondFactorSecret(secret);
      setSecondFactorEnrollment({ qrDataUrl, secretKey: secret.secretKey });
    } catch (error) {
      setSecondFactorError(authErrorMessage(error));
    } finally {
      setSecondFactorBusy(false);
    }
  };

  const confirmSecondFactorEnrollment = async (pin: string) => {
    if (!user || !secondFactorSecret || !/^\d{6}$/.test(pin)) {
      setSecondFactorError("Enter the current six-digit PIN from your authenticator app.");
      return;
    }
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(secondFactorSecret, pin);
      await multiFactor(user).enroll(assertion, "Lorapok Office authenticator");
      setSecondFactorSecret(null);
      setSecondFactorEnrollment(null);
      sessionStorage.removeItem("lpk_mfa_verified_uid");
      setSecondFactorState("reauthenticate");
      await logEvent("auth", "totp_enrolled", { factor: "totp" });
    } catch (error) {
      setSecondFactorError(authErrorMessage(error));
    } finally {
      setSecondFactorBusy(false);
    }
  };

  const verifySecondFactorPin = async (pin: string) => {
    if (!secondFactorResolver || !/^\d{6}$/.test(pin)) {
      setSecondFactorError("Enter the current six-digit PIN from your authenticator app.");
      return;
    }
    const hint = secondFactorResolver.hints.find((item) => item.factorId === TotpMultiFactorGenerator.FACTOR_ID);
    if (!hint) {
      setSecondFactorError("No compatible authenticator is enrolled for this account.");
      return;
    }
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, pin);
      const credential = await secondFactorResolver.resolveSignIn(assertion);
      sessionStorage.setItem("lpk_mfa_verified_uid", credential.user.uid);
      setSecondFactorResolver(null);
      if (getDevicePinEnvelope(credential.user.uid)) {
        sessionStorage.setItem(DEVICE_PIN_UNLOCKED_KEY, credential.user.uid);
        setSecondFactorState("verified");
      } else {
        setSecondFactorState("setup-device-pin");
      }
    } catch (error) {
      setSecondFactorError(authErrorMessage(error));
    } finally {
      setSecondFactorBusy(false);
    }
  };

  const setupDevicePin = async (pin: string, confirmation: string) => {
    if (!user || !/^\d{6}$/.test(pin)) {
      setSecondFactorError("Choose a six-digit device PIN.");
      return;
    }
    if (pin !== confirmation) {
      setSecondFactorError("The two device PIN entries do not match.");
      return;
    }
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      const envelope = await createDevicePinEnvelope(user.uid, pin);
      localStorage.setItem(`${DEVICE_PIN_PREFIX}${user.uid}`, JSON.stringify(envelope));
      localStorage.removeItem(`${DEVICE_PIN_ATTEMPTS_PREFIX}${user.uid}`);
      sessionStorage.setItem(DEVICE_PIN_UNLOCKED_KEY, user.uid);
      sessionStorage.setItem("lpk_mfa_verified_uid", user.uid);
      setSecondFactorState("verified");
      await logEvent("auth", "device_pin_created", { protection: "pbkdf2-aes-gcm", localOnly: true });
    } catch {
      setSecondFactorError("This browser could not create the encrypted device PIN. Update the browser and try again.");
    } finally {
      setSecondFactorBusy(false);
    }
  };

  const verifyDevicePin = async (pin: string) => {
    if (!user || !/^\d{6}$/.test(pin)) {
      setSecondFactorError("Enter your six-digit device PIN.");
      return;
    }
    const attemptKey = `${DEVICE_PIN_ATTEMPTS_PREFIX}${user.uid}`;
    const attemptState = (() => {
      try { return JSON.parse(localStorage.getItem(attemptKey) || "{}") as { count?: number; blockedUntil?: number }; }
      catch { return {}; }
    })();
    const now = currentEpochMs();
    if ((attemptState.blockedUntil || 0) > now) {
      const minutes = Math.max(1, Math.ceil(((attemptState.blockedUntil || 0) - now) / 60_000));
      setSecondFactorError(`Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or use the authenticator.`);
      return;
    }
    const envelope = getDevicePinEnvelope(user.uid);
    if (!envelope) {
      setSecondFactorState("setup-device-pin");
      return;
    }
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      const valid = await openDevicePinEnvelope(user.uid, pin, envelope);
      if (!valid) throw new Error("invalid-pin");
      localStorage.removeItem(attemptKey);
      sessionStorage.setItem(DEVICE_PIN_UNLOCKED_KEY, user.uid);
      sessionStorage.setItem("lpk_mfa_verified_uid", user.uid);
      setSecondFactorState("verified");
      await logEvent("auth", "device_pin_unlocked", { localOnly: true });
    } catch {
      const count = (attemptState.count || 0) + 1;
      const blockedUntil = count >= 5 ? currentEpochMs() + 5 * 60_000 : 0;
      localStorage.setItem(attemptKey, JSON.stringify({ count: count >= 5 ? 0 : count, blockedUntil }));
      setSecondFactorError(blockedUntil
        ? "Too many attempts. Device PIN is locked for five minutes; the authenticator remains available."
        : `Incorrect device PIN. ${5 - count} attempt${5 - count === 1 ? "" : "s"} remain before a short lock.`);
    } finally {
      setSecondFactorBusy(false);
    }
  };

  const resetDevicePin = async () => {
    if (user) {
      localStorage.removeItem(`${DEVICE_PIN_PREFIX}${user.uid}`);
      localStorage.removeItem(`${DEVICE_PIN_ATTEMPTS_PREFIX}${user.uid}`);
    }
    sessionStorage.removeItem(DEVICE_PIN_UNLOCKED_KEY);
    setSecondFactorError(null);
    await restartSecureSignIn();
  };

  const restartSecureSignIn = async () => {
    setSecondFactorBusy(true);
    setSecondFactorError(null);
    try {
      sessionStorage.removeItem("lpk_mfa_verified_uid");
      if (auth.currentUser) await signOut(auth);
    } finally {
      setSecondFactorBusy(false);
    }
    await handleSignIn();
  };

  const cancelSecondFactor = () => {
    setSecondFactorResolver(null);
    setSecondFactorSecret(null);
    setSecondFactorEnrollment(null);
    setSecondFactorError(null);
    setSecondFactorState(user ? "enroll" : "idle");
  };

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
    sessionStorage.removeItem("lpk_mfa_verified_uid");
    sessionStorage.removeItem(DEVICE_PIN_UNLOCKED_KEY);

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
    setSecondFactorState("idle");
    setSecondFactorResolver(null);
    setSecondFactorSecret(null);
    setSecondFactorEnrollment(null);
    setSecondFactorError(null);

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
  const hasOfficeRoleAccess = Boolean(user && accessProfile && accessStatus === "active" && hasOfficePermission(role, "view_office"));
  const canAccessOffice = hasOfficeRoleAccess && secondFactorState === "verified";
  const can = (permission: OfficePermission) => canAccessOffice && hasOfficePermission(role, permission);
  const isAdmin = can("manage_users");

  return (
    <DevContext.Provider
      value={{ 
        user, loading: loading || signingIn || accessLoading, signIn: handleSignIn, signOut: handleSignOut, isAdmin,
        secondFactorState, secondFactorBusy, secondFactorError, secondFactorEnrollment,
        beginSecondFactorEnrollment, confirmSecondFactorEnrollment, verifySecondFactorPin,
        setupDevicePin, verifyDevicePin, resetDevicePin, restartSecureSignIn, cancelSecondFactor,
        hasOfficeRoleAccess, canAccessOffice, role, accessStatus, accessProfile, can,
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
                } catch (error: unknown) { setLoginError(authErrorMessage(error)); setSigningIn(false); }
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

function LarvaeAuthTransition({ message, compact = false }: { message: string; compact?: boolean }) {
  return (
    <div className={`dev-auth-transition${compact ? " is-compact" : ""}`} role="status" aria-live="polite">
      <div className="dev-auth-orbit" aria-hidden="true">
        <span className="dev-auth-orbit__ring ring-one" />
        <span className="dev-auth-orbit__ring ring-two" />
        <span className="dev-auth-orbit__signal signal-one" />
        <span className="dev-auth-orbit__signal signal-two" />
        <img className="dev-auth-orbit__larva larva-core" src="/assets/ribo/generated/20261117/vault-guardian.webp" alt="" />
        <img className="dev-auth-orbit__larva larva-scout" src="/assets/ribo/species/neon-scout.webp" alt="" />
        <img className="dev-auth-orbit__larva larva-worker" src="/assets/ribo/species/robo-worker.webp" alt="" />
      </div>
      <div className="dev-auth-transition__copy">
        <strong>{message}</strong>
        <span><i /> Identity <i /> Role <i /> Authenticator</span>
      </div>
    </div>
  );
}

function AuthenticatorCodeForm({ busy, error, label, onSubmit }: {
  busy: boolean;
  error: string | null;
  label: string;
  onSubmit: (pin: string) => Promise<void>;
}) {
  const [pin, setPin] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onSubmit(pin);
  };
  return (
    <form className="dev-auth-pin" onSubmit={submit}>
      <label htmlFor="office-authenticator-pin">{label}</label>
      <input
        id="office-authenticator-pin"
        value={pin}
        onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="000 000"
        aria-describedby={error ? "office-authenticator-error" : undefined}
        autoFocus
      />
      {error && <p id="office-authenticator-error" className="dev-auth-error" role="alert">{error}</p>}
      <button className="dev-btn dev-btn-primary dev-auth-signin" type="submit" disabled={busy || pin.length !== 6}>
        {busy ? "Verifying authenticator…" : "Verify authenticator code"}
      </button>
    </form>
  );
}

function DevicePinForm({ busy, error, setup = false, onSubmit }: {
  busy: boolean;
  error: string | null;
  setup?: boolean;
  onSubmit: (pin: string, confirmation: string) => Promise<void>;
}) {
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onSubmit(pin, setup ? confirmation : pin);
  };
  return (
    <form className="dev-auth-pin dev-auth-device-pin" onSubmit={submit}>
      <label htmlFor="office-device-pin">{setup ? "Choose a six-digit device PIN" : "Device PIN"}</label>
      <input
        id="office-device-pin"
        value={pin}
        onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete={setup ? "new-password" : "current-password"}
        pattern="[0-9]{6}"
        maxLength={6}
        placeholder="••• •••"
        aria-describedby={error ? "office-device-pin-error" : undefined}
        autoFocus
      />
      {setup && (
        <>
          <label htmlFor="office-device-pin-confirm">Confirm device PIN</label>
          <input
            id="office-device-pin-confirm"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="new-password"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="••• •••"
          />
        </>
      )}
      {error && <p id="office-device-pin-error" className="dev-auth-error" role="alert">{error}</p>}
      <button className="dev-btn dev-btn-primary dev-auth-signin" type="submit" disabled={busy || pin.length !== 6 || (setup && confirmation.length !== 6)}>
        {busy ? "Securing this device…" : setup ? "Create secure device PIN" : "Unlock Office"}
      </button>
    </form>
  );
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { loading, can } = useDevAuth();

  if (loading) return <LarvaeAuthTransition message="Checking owner permissions" compact />;

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
  const {
    user, loading, signIn, signOut: leaveOffice, hasOfficeRoleAccess, canAccessOffice, accessStatus,
    secondFactorState, secondFactorBusy, secondFactorError, secondFactorEnrollment,
    beginSecondFactorEnrollment, confirmSecondFactorEnrollment, verifySecondFactorPin,
    setupDevicePin, verifyDevicePin, resetDevicePin, restartSecureSignIn, cancelSecondFactor,
  } = useDevAuth();

  if (loading || (user && secondFactorState === "checking")) {
    return <LarvaeAuthTransition message="Waking the secure Office" />;
  }

  if (user && secondFactorState === "device-pin") {
    return (
      <div className="dev-auth-gate dev-auth-gate--secure">
        <div className="dev-auth-gate-inner">
          <LarvaeAuthTransition message="Trusted browser recognized" compact />
          <div className="dev-auth-badge">Quick unlock · this device only</div>
          <h2 className="dev-auth-title"><span>Enter</span> your device PIN</h2>
          <p className="dev-auth-sub">Your Google and authenticator session is still trusted. Use the local six-digit PIN to unlock this browser without opening the authenticator app again.</p>
          <DevicePinForm busy={secondFactorBusy} error={secondFactorError} onSubmit={(pin) => verifyDevicePin(pin)} />
          <button className="dev-auth-text-button" type="button" disabled={secondFactorBusy} onClick={() => void resetDevicePin()}>Forgot PIN? Verify with authenticator</button>
          <p className="dev-auth-security-note">The PIN is encrypted for this browser and is never uploaded to Lorapok or Firebase.</p>
        </div>
      </div>
    );
  }

  if (user && secondFactorState === "setup-device-pin") {
    return (
      <div className="dev-auth-gate dev-auth-gate--secure">
        <div className="dev-auth-gate-inner">
          <LarvaeAuthTransition message="Preparing quick unlock" compact />
          <div className="dev-auth-badge">One-time setup · trusted device</div>
          <h2 className="dev-auth-title"><span>Create</span> your device PIN</h2>
          <p className="dev-auth-sub">Choose a six-digit PIN for this browser. Future visits use this quick unlock while your Firebase authenticator remains the recovery and new-device security factor.</p>
          <DevicePinForm busy={secondFactorBusy} error={secondFactorError} setup onSubmit={setupDevicePin} />
          <button className="dev-auth-text-button" type="button" onClick={leaveOffice}>Not a trusted device? Sign out</button>
          <p className="dev-auth-security-note">Protected with PBKDF2 and AES-GCM. Five incorrect attempts trigger a temporary lock.</p>
        </div>
      </div>
    );
  }

  if (secondFactorState === "challenge") {
    return (
      <div className="dev-auth-gate dev-auth-gate--secure">
        <div className="dev-auth-gate-inner">
          <LarvaeAuthTransition message="Google identity verified" compact />
          <div className="dev-auth-badge">Second factor · authenticator</div>
          <h2 className="dev-auth-title"><span>Authenticator</span> code required</h2>
          <p className="dev-auth-sub">Enter the rotating six-digit code from the authenticator app enrolled for this Office identity.</p>
          <AuthenticatorCodeForm busy={secondFactorBusy} error={secondFactorError} label="Six-digit authenticator code" onSubmit={verifySecondFactorPin} />
          <button className="dev-auth-text-button" type="button" onClick={cancelSecondFactor}>Use another Google account</button>
        </div>
      </div>
    );
  }

  if (user && !hasOfficeRoleAccess) {
    const statusMessage = accessStatus === "suspended"
      ? "This Office account is suspended. Contact an owner if access should be restored."
      : "Your Google identity is recorded as pending. An Office owner must approve it or send an invitation before workspace access is granted.";
    return (
      <div className="dev-auth-gate">
        <div className="dev-auth-gate-inner">
          <div className="dev-auth-badge">Lorapok Labs Office</div>
          <h2 className="dev-auth-title"><span>Office</span> Sign-in</h2>
          <p className="dev-auth-sub">Sign in with an invited Google account to enter the role-controlled studio, project control plane, and LoLaBo operations center.</p>
          <div className="dev-auth-origin">Secure origin · {window.location.hostname}</div>
          
          <div className="dev-access-state">
            <strong>{accessStatus === "suspended" ? "Access suspended" : "Request recorded · approval pending"}</strong>
            <p>{statusMessage}</p>
            <small>{user.email}</small>
            {accessStatus === "pending" && (
              <div className="dev-access-progress" aria-label="Office access request progress">
                <span className="is-complete"><i>1</i> Google identity received</span>
                <span className="is-current"><i>2</i> Administrator assigns role</span>
                <span><i>3</i> Authenticator enrollment unlocks</span>
              </div>
            )}
            <p className="dev-access-live-note">This screen updates automatically when Access &amp; Admin approves the request.</p>
            <button className="dev-btn dev-btn-ghost dev-btn-sm" onClick={leaveOffice}>Use another account</button>
          </div>
        </div>
      </div>
    );
  }

  if (user && hasOfficeRoleAccess && secondFactorState === "enroll") {
    return (
      <div className="dev-auth-gate dev-auth-gate--enroll">
        <div className="dev-auth-gate-inner dev-auth-gate-inner--wide">
          <div className="dev-auth-badge">Access approved · required protection</div>
          <h2 className="dev-auth-title"><span>Enroll</span> your authenticator</h2>
          <p className="dev-auth-sub">An administrator approved this identity and role. Complete the one-time authenticator setup to enter Lorapok Labs Office.</p>
          {!secondFactorEnrollment ? (
            <div className="dev-auth-enroll-intro">
              <LarvaeAuthTransition message="Preparing a private authenticator" compact />
              {secondFactorError && <p className="dev-auth-error" role="alert">{secondFactorError}</p>}
              <button className="dev-btn dev-btn-primary dev-auth-signin" type="button" disabled={secondFactorBusy} onClick={() => void beginSecondFactorEnrollment()}>
                {secondFactorBusy ? "Creating secure setup…" : "Create authenticator setup"}
              </button>
              <button className="dev-auth-text-button" type="button" onClick={leaveOffice}>Use another Google account</button>
            </div>
          ) : (
            <div className="dev-auth-enrollment">
              <div className="dev-auth-qr">
                <img src={secondFactorEnrollment.qrDataUrl} alt="Authenticator enrollment QR code" />
                <span>Scan with Google Authenticator, 1Password, Authy, or another TOTP app.</span>
              </div>
              <div className="dev-auth-enrollment__form">
                <div className="dev-auth-secret">
                  <span>Manual setup key</span>
                  <code>{secondFactorEnrollment.secretKey}</code>
                </div>
                <AuthenticatorCodeForm busy={secondFactorBusy} error={secondFactorError} label="Confirm the current six-digit authenticator code" onSubmit={confirmSecondFactorEnrollment} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (user && hasOfficeRoleAccess && secondFactorState === "reauthenticate") {
    return (
      <div className="dev-auth-gate dev-auth-gate--secure">
        <div className="dev-auth-gate-inner">
          <LarvaeAuthTransition message="Authenticator linked" compact />
          <div className="dev-auth-badge">Final security check</div>
          <h2 className="dev-auth-title"><span>Protection</span> is ready</h2>
          <p className="dev-auth-sub">Sign in once more so Firebase can challenge the newly enrolled authenticator before opening the Office.</p>
          {secondFactorError && <p className="dev-auth-error" role="alert">{secondFactorError}</p>}
          <button className="dev-btn dev-btn-primary dev-auth-signin" type="button" disabled={secondFactorBusy} onClick={() => void restartSecureSignIn()}>
            {secondFactorBusy ? "Securing session…" : "Continue secure sign-in"}
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dev-auth-gate dev-auth-gate--request">
        <div className="dev-auth-gate-inner">
          <LarvaeAuthTransition message="Office perimeter ready" compact />
          <div className="dev-auth-badge">Lorapok Labs Office</div>
          <h2 className="dev-auth-title"><span>Two signals.</span> One secure Office.</h2>
          <p className="dev-auth-sub">Sign in with Google to request access. New identities remain locked until an Office administrator reviews the request and assigns a role.</p>
          <div className="dev-auth-origin">Google identity · approved role · authenticator recovery · device PIN</div>
          <div className="dev-auth-steps" aria-label="Office login instructions">
            <div><b>01</b><span><strong>Request with Google</strong><small>Use the Google identity you want connected to Lorapok Labs Office.</small></span></div>
            <div><b>02</b><span><strong>Wait for administrator approval</strong><small>An owner or administrator approves the identity and assigns its least-privilege role.</small></span></div>
            <div><b>03</b><span><strong>Secure and enter</strong><small>Enroll the authenticator once, then create a quick-unlock PIN for your trusted browser.</small></span></div>
          </div>
          <p className="dev-auth-approval-note">Google sign-in does not grant Office or Blog System access automatically.</p>
          <button className="dev-btn dev-btn-primary dev-auth-signin" type="button" onClick={() => void signIn()}>
            Request access with Google
          </button>
        </div>
      </div>
    );
  }

  if (!canAccessOffice) return <LarvaeAuthTransition message="Completing secure sign-in" />;

  return <>{children}</>;
}

