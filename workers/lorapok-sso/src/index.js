const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const ROLE_PERMISSIONS = {
  owner: ["view_office", "manage_projects", "manage_content", "manage_team", "manage_offers", "manage_feedback", "collaborate", "use_ai", "view_analytics", "manage_users", "manage_lolabo", "manage_blog", "use_developer_tools"],
  admin: ["view_office", "manage_projects", "manage_content", "manage_team", "manage_offers", "manage_feedback", "collaborate", "use_ai", "view_analytics", "manage_users", "manage_lolabo", "manage_blog", "use_developer_tools"],
  editor: ["view_office", "manage_projects", "manage_content", "manage_team", "manage_offers", "manage_feedback", "collaborate", "manage_blog", "use_developer_tools"],
  researcher: ["view_office", "use_ai", "view_analytics", "manage_lolabo", "manage_blog", "use_developer_tools"],
  teammate: ["view_office", "manage_content", "manage_team", "manage_feedback", "collaborate"],
  viewer: ["view_office"],
};

let cachedJwks = null;
let jwksExpiresAt = 0;

function trustedPlatformOrigin(origin, env) {
  if (!origin) return false;
  const explicit = new Set((env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean));
  if (explicit.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && (url.hostname === "lorapok.tech" || url.hostname.endsWith(".lorapok.tech"));
  } catch {
    return false;
  }
}

function corsHeaders(origin, env) {
  return trustedPlatformOrigin(origin, env) ? {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "Authorization, Content-Type",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-max-age": "86400",
    vary: "Origin",
  } : { vary: "Origin" };
}

function registeredAppOrigin(origin, app) {
  return Boolean(origin && app?.status === "active" && Array.isArray(app.origins) && app.origins.includes(origin));
}

function approvedCorsHeaders(origin, env, app) {
  if (!trustedPlatformOrigin(origin, env) && !registeredAppOrigin(origin, app)) return { vary: "Origin" };
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "Authorization, Content-Type",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function json(body, status, origin, env, app = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...approvedCorsHeaders(origin, env, app),
      "cache-control": "private, no-store",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function decodeJsonPart(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

async function getJwks() {
  const now = Date.now();
  if (cachedJwks && now < jwksExpiresAt) return cachedJwks;
  const response = await fetch(JWKS_URL, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Identity signing keys are unavailable");
  cachedJwks = await response.json();
  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] || 300);
  jwksExpiresAt = now + Math.min(Math.max(maxAge, 60), 21600) * 1000;
  return cachedJwks;
}

export async function verifyFirebaseToken(token, projectId, nowSeconds = Math.floor(Date.now() / 1000)) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed identity token");
  const header = decodeJsonPart(parts[0]);
  const payload = decodeJsonPart(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported identity signature");
  const keys = await getJwks();
  const jwk = keys.keys?.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Unknown identity signing key");
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const validSignature = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeBase64Url(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!validSignature) throw new Error("Invalid identity signature");
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("Identity token is for another project");
  if (typeof payload.sub !== "string" || payload.sub.length < 1 || payload.sub.length > 128) throw new Error("Invalid identity subject");
  if (Number(payload.exp || 0) <= nowSeconds || Number(payload.iat || 0) > nowSeconds + 60) throw new Error("Expired or premature identity token");
  if (payload.email_verified !== true) throw new Error("A verified email is required");
  if (!payload.firebase?.sign_in_second_factor) throw new Error("Authenticator verification is required");
  return payload;
}

function firestoreValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(firestoreValue);
  if ("mapValue" in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, item]) => [key, firestoreValue(item)]));
  return null;
}

async function getDocument(env, token, path) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/${path}`;
  const response = await fetch(url, token ? { headers: { authorization: `Bearer ${token}` } } : undefined);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Access registry returned ${response.status}`);
  const document = await response.json();
  return Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, firestoreValue(value)]));
}

function validAppId(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]{1,62}$/.test(value);
}

async function getRegisteredApp(url, env, origin) {
  const appId = url.searchParams.get("appId") || "";
  if (!validAppId(appId)) return { error: json({ error: "A valid appId query parameter is required" }, 400, origin, env) };
  try {
    const app = await getDocument(env, "", `sso_apps/${encodeURIComponent(appId)}`);
    if (!registeredAppOrigin(origin, app)) return { error: json({ error: "Origin is not registered for this Lorapok application" }, 403, origin, env) };
    return { appId, app };
  } catch {
    return { error: json({ error: "The Lorapok application registry is temporarily unavailable" }, 503, origin, env) };
  }
}

async function createSession(request, env, origin, url) {
  const registered = await getRegisteredApp(url, env, origin);
  if (registered.error) return registered.error;
  const { appId, app } = registered;
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return json({ error: "Missing identity token" }, 401, origin, env, app);
  let body;
  try { body = await request.json(); } catch { return json({ error: "A JSON request body is required" }, 400, origin, env, app); }
  if (body?.appId !== appId) return json({ error: "The application ID does not match the registered request" }, 400, origin, env, app);

  let claims;
  try { claims = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID); }
  catch { return json({ error: "A current Google and authenticator sign-in is required" }, 401, origin, env, app); }

  try {
    const [profile, grant] = await Promise.all([
      getDocument(env, token, `users/${encodeURIComponent(claims.sub)}`),
      getDocument(env, token, `sso_access/${encodeURIComponent(`${claims.sub}__${appId}`)}`),
    ]);
    if (!profile || profile.status !== "active") return json({ error: "Lorapok account access is not active" }, 403, origin, env, app);
    const privileged = profile.role === "owner" || profile.role === "admin";
    if (!privileged && grant?.status !== "active") return json({ error: "Access has not been granted for this application" }, 403, origin, env, app);
    const scopes = Array.isArray(grant?.scopes) ? grant.scopes.filter((item) => typeof item === "string").slice(0, 30) : [];
    return json({
      authenticated: true,
      app: { id: appId, name: app.name },
      user: {
        uid: claims.sub,
        email: claims.email,
        displayName: profile.displayName || claims.name || "Lorapok member",
        photoURL: profile.photoURL || claims.picture || "",
        role: profile.role,
        department: profile.department || "",
        title: profile.title || "",
      },
      permissions: ROLE_PERMISSIONS[profile.role] || ROLE_PERMISSIONS.viewer,
      scopes,
      secondFactor: claims.firebase.sign_in_second_factor,
      issuedAt: new Date().toISOString(),
    }, 200, origin, env, app);
  } catch (error) {
    console.error("lorapok-sso", error instanceof Error ? error.message : "registry error");
    return json({ error: "The Lorapok access registry is temporarily unavailable" }, 503, origin, env, app);
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && url.pathname === "/v1/session") {
      const registered = await getRegisteredApp(url, env, origin);
      if (registered.error) return registered.error;
      return new Response(null, { status: 204, headers: approvedCorsHeaders(origin, env, registered.app) });
    }
    if (request.method === "OPTIONS") return new Response(null, { status: trustedPlatformOrigin(origin, env) ? 204 : 403, headers: corsHeaders(origin, env) });
    if (request.method === "GET" && url.pathname === "/health") return json({ ok: true, service: "lorapok-sso", version: 1 }, 200, origin, env);
    if (request.method === "POST" && url.pathname === "/v1/session") return createSession(request, env, origin, url);
    return json({ error: "Not found" }, 404, origin, env);
  },
};
