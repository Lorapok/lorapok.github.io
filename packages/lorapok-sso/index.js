import {
  GoogleAuthProvider,
  TotpMultiFactorGenerator,
  browserSessionPersistence,
  getMultiFactorResolver,
  multiFactor,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

function assertPin(pin) {
  if (!/^\d{6}$/.test(pin)) throw new Error("Enter the current six-digit authenticator PIN.");
}

export function createLorapokSso({ auth, appId, gatewayUrl, issuerName = "Lorapok Labs", provider = new GoogleAuthProvider() }) {
  if (!auth || !appId || !gatewayUrl) throw new Error("auth, appId, and gatewayUrl are required");
  let resolver = null;
  let enrollmentSecret = null;

  async function getSession(forceRefresh = false) {
    if (!auth.currentUser) return { status: "signed-out" };
    const token = await auth.currentUser.getIdToken(forceRefresh);
    const response = await fetch(`${gatewayUrl.replace(/\/$/, "")}/v1/session?appId=${encodeURIComponent(appId)}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ appId }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || "Lorapok SSO session could not be opened");
      error.status = response.status;
      throw error;
    }
    return { status: "authenticated", ...payload };
  }

  async function signIn() {
    await setPersistence(auth, browserSessionPersistence);
    try {
      await signInWithPopup(auth, provider);
      return getSession(true);
    } catch (error) {
      if (error?.code !== "auth/multi-factor-auth-required") throw error;
      resolver = getMultiFactorResolver(auth, error);
      const hint = resolver.hints.find((item) => item.factorId === TotpMultiFactorGenerator.FACTOR_ID);
      if (!hint) throw new Error("This identity uses an unsupported second factor.");
      return { status: "totp-required" };
    }
  }

  async function verifyTotp(pin) {
    assertPin(pin);
    if (!resolver) throw new Error("Start a new Google sign-in before entering the authenticator PIN.");
    const hint = resolver.hints.find((item) => item.factorId === TotpMultiFactorGenerator.FACTOR_ID);
    if (!hint) throw new Error("No authenticator factor is available.");
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, pin);
    await resolver.resolveSignIn(assertion);
    resolver = null;
    return getSession(true);
  }

  async function beginTotpEnrollment(accountLabel) {
    if (!auth.currentUser) throw new Error("Sign in with Google before enrolling an authenticator.");
    const session = await multiFactor(auth.currentUser).getSession();
    enrollmentSecret = await TotpMultiFactorGenerator.generateSecret(session);
    return {
      qrCodeUri: enrollmentSecret.generateQrCodeUrl(accountLabel || auth.currentUser.email || auth.currentUser.uid, issuerName),
      secretKey: enrollmentSecret.secretKey,
    };
  }

  async function confirmTotpEnrollment(pin, displayName = `${issuerName} authenticator`) {
    assertPin(pin);
    if (!auth.currentUser || !enrollmentSecret) throw new Error("Start authenticator enrollment before confirming the PIN.");
    const assertion = TotpMultiFactorGenerator.assertionForEnrollment(enrollmentSecret, pin);
    await multiFactor(auth.currentUser).enroll(assertion, displayName);
    enrollmentSecret = null;
    return { status: "reauthentication-required" };
  }

  return {
    signIn,
    verifyTotp,
    beginTotpEnrollment,
    confirmTotpEnrollment,
    getSession,
    onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
    signOut: () => signOut(auth),
  };
}
