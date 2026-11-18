import type { Auth, AuthProvider, User } from "firebase/auth";

export interface LorapokSsoOptions {
  auth: Auth;
  appId: string;
  gatewayUrl: string;
  issuerName?: string;
  provider?: AuthProvider;
}

export interface LorapokSession {
  status: "authenticated";
  authenticated: true;
  app: { id: string; name: string };
  user: { uid: string; email: string; displayName: string; photoURL: string; role: string; department: string; title: string };
  permissions: string[];
  scopes: string[];
  secondFactor: string;
  issuedAt: string;
}

export type LorapokAuthResult = LorapokSession | { status: "signed-out" | "totp-required" | "reauthentication-required" };

export interface LorapokSsoClient {
  signIn(): Promise<LorapokAuthResult>;
  verifyTotp(pin: string): Promise<LorapokSession>;
  beginTotpEnrollment(accountLabel?: string): Promise<{ qrCodeUri: string; secretKey: string }>;
  confirmTotpEnrollment(pin: string, displayName?: string): Promise<{ status: "reauthentication-required" }>;
  getSession(forceRefresh?: boolean): Promise<LorapokSession | { status: "signed-out" }>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  signOut(): Promise<void>;
}

export function createLorapokSso(options: LorapokSsoOptions): LorapokSsoClient;
