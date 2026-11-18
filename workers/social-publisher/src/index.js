const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const PUBLISH_ROLES = new Set(["super-admin", "owner", "admin", "editor"]);
const PLACEMENTS = new Set(["facebook_feed", "facebook_reel", "instagram_feed", "instagram_reel", "instagram_story"]);
const THREADS_MEDIA_TYPES = new Set(["text", "image", "video"]);
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 90 * 1024 * 1024;
let cachedJwks = null;
let jwksExpiresAt = 0;

function allowedOrigin(origin, env) {
  return new Set((env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean)).has(origin);
}

function corsHeaders(origin, env) {
  return allowedOrigin(origin, env) ? {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "Authorization, Content-Type",
    "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
    "access-control-max-age": "86400",
    vary: "Origin",
  } : { vary: "Origin" };
}

function securityHeaders() {
  return {
    "cache-control": "private, no-store",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  };
}

function json(body, status, origin, env, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...corsHeaders(origin, env), ...securityHeaders(), ...extra } });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function parseMetaSignedRequest(value, appSecret) {
  const [signaturePart, payloadPart] = String(value || "").split(".");
  if (!signaturePart || !payloadPart || !appSecret) throw new Error("Invalid signed request");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(appSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadPart)));
  const supplied = decodeBase64Url(signaturePart);
  if (!constantTimeEqual(expected, supplied)) throw new Error("Invalid signed request signature");
  const payload = decodeJsonPart(payloadPart);
  if (payload.algorithm && String(payload.algorithm).toUpperCase() !== "HMAC-SHA256") throw new Error("Unsupported signed request algorithm");
  if (!payload.user_id) throw new Error("Signed request has no user identity");
  return payload;
}

function decodeJsonPart(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

async function getJwks() {
  if (cachedJwks && Date.now() < jwksExpiresAt) return cachedJwks;
  const response = await fetch(JWKS_URL, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("Identity signing keys are unavailable");
  cachedJwks = await response.json();
  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] || 300);
  jwksExpiresAt = Date.now() + Math.min(Math.max(maxAge, 60), 21600) * 1000;
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
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const signatureValid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decodeBase64Url(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!signatureValid) throw new Error("Invalid identity signature");
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("Identity token is for another project");
  if (typeof payload.sub !== "string" || payload.sub.length < 1 || payload.sub.length > 128) throw new Error("Invalid identity subject");
  if (Number(payload.exp || 0) <= nowSeconds || Number(payload.iat || 0) > nowSeconds + 60) throw new Error("Expired identity token");
  if (payload.email_verified !== true) throw new Error("A verified email is required");
  return payload;
}

function firestoreValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("timestampValue" in value) return value.timestampValue;
  return null;
}

async function authorize(request, env) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return { error: "Office authorization is required", status: 401 };
  let identity;
  try { identity = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID); }
  catch { return { error: "Office authorization is invalid or expired", status: 401 }; }
  const profileUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/users/${encodeURIComponent(identity.sub)}`;
  const response = await fetch(profileUrl, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) return { error: "Office profile verification failed", status: response.status === 403 ? 403 : 401 };
  const document = await response.json();
  const profile = Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, firestoreValue(value)]));
  if (profile.status !== "active" || !PUBLISH_ROLES.has(profile.role)) return { error: "Social publishing permission is required", status: 403 };
  return { uid: identity.sub, email: identity.email || "", role: profile.role };
}

function base64(bytes) {
  let value = "";
  bytes.forEach((byte) => { value += String.fromCharCode(byte); });
  return btoa(value);
}

function encryptionKey(env) {
  const raw = Uint8Array.from(atob(env.TOKEN_ENCRYPTION_KEY || ""), (character) => character.charCodeAt(0));
  if (raw.length !== 32) throw new Error("Token encryption is not configured");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function seal(value, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(env);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(value)));
  return JSON.stringify({ version: 1, iv: base64(iv), ciphertext: base64(new Uint8Array(ciphertext)) });
}

async function unseal(value, env) {
  const envelope = JSON.parse(value);
  const iv = Uint8Array.from(atob(envelope.iv), (character) => character.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(envelope.ciphertext), (character) => character.charCodeAt(0));
  const key = await encryptionKey(env);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext));
}

function graphVersion(env) {
  return /^v\d+\.\d+$/.test(env.GRAPH_API_VERSION || "") ? env.GRAPH_API_VERSION : "v27.0";
}

async function graph(path, token, env, init = {}, host = "graph.facebook.com") {
  const response = await fetch(`https://${host}/${graphVersion(env)}/${path.replace(/^\//, "")}`, {
    ...init,
    headers: { ...(init.headers || {}), authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const message = payload.error?.error_user_msg || payload.error?.message || `Meta API returned ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function threadsGraph(path, token, init = {}) {
  const response = await fetch(`https://graph.threads.net/${path.replace(/^\//, "")}`, {
    ...init,
    headers: { ...(init.headers || {}), authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const message = payload.error?.error_user_msg || payload.error?.message || `Threads API returned ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function connectionFor(uid, env) {
  const stored = await env.SOCIAL_SESSIONS.get(`connection:${uid}`);
  if (!stored) return null;
  try {
    const connection = await unseal(stored, env);
    if (connection.expiresAt && Date.parse(connection.expiresAt) <= Date.now()) return null;
    return connection;
  } catch { return null; }
}

async function discoverPages(connection, env) {
  const fields = "id,name,access_token,picture{url},instagram_business_account{id,username,name,profile_picture_url}";
  const payload = await graph(`me/accounts?limit=100&fields=${encodeURIComponent(fields)}`, connection.userAccessToken, env);
  return (payload.data || []).map((page) => ({
    id: String(page.id),
    name: String(page.name || "Facebook Page"),
    accessToken: page.access_token,
    pictureUrl: page.picture?.data?.url || "",
    instagram: page.instagram_business_account ? {
      id: String(page.instagram_business_account.id),
      username: String(page.instagram_business_account.username || ""),
      name: String(page.instagram_business_account.name || page.instagram_business_account.username || "Instagram"),
      profilePictureUrl: page.instagram_business_account.profile_picture_url || "",
    } : null,
  }));
}

function publicPages(pages) {
  return pages.map(({ accessToken: _accessToken, ...page }) => page);
}

async function listJobs(uid, env) {
  const listed = await env.SOCIAL_SESSIONS.list({ prefix: `job:${uid}:`, limit: 20 });
  const jobs = await Promise.all(listed.keys.map((key) => env.SOCIAL_SESSIONS.get(key.name, "json")));
  return jobs.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function listWhatsAppMessages(env) {
  const listed = await env.SOCIAL_SESSIONS.list({ prefix: "whatsapp-message:", limit: 100 });
  const messages = await Promise.all(listed.keys.map((key) => env.SOCIAL_SESSIONS.get(key.name, "json")));
  return messages.filter(Boolean).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 50);
}

async function audit(uid, data, env) {
  const createdAt = new Date().toISOString();
  const id = crypto.randomUUID();
  const job = { id, createdAt, ...data };
  await env.SOCIAL_SESSIONS.put(`job:${uid}:${createdAt}:${id}`, JSON.stringify(job), { expirationTtl: 60 * 60 * 24 * 90 });
  return job;
}

async function signMedia(key, expires, env) {
  const cryptoKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.MEDIA_SIGNING_KEY || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(`${key}:${expires}`));
  return base64(new Uint8Array(signature)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function validMediaSignature(key, expires, signature, env) {
  if (!expires || Number(expires) < Math.floor(Date.now() / 1000) || !signature) return false;
  const expected = await signMedia(key, expires, env);
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}

function safeReturnOrigin(value, env) {
  try { const url = new URL(value); return allowedOrigin(url.origin, env) ? url.origin : "https://lorapok.tech"; }
  catch { return "https://lorapok.tech"; }
}

async function connectStart(request, access, env, origin) {
  if (!env.META_APP_ID || !env.META_APP_SECRET || !env.TOKEN_ENCRYPTION_KEY || !env.MEDIA_SIGNING_KEY) return json({ error: "Meta App configuration is not complete yet" }, 503, origin, env);
  const state = crypto.randomUUID();
  await env.SOCIAL_SESSIONS.put(`oauth:${state}`, JSON.stringify({ uid: access.uid, origin, createdAt: Date.now() }), { expirationTtl: 600 });
  const redirect = `${env.PUBLIC_BASE_URL.replace(/\/$/, "")}/oauth/callback`;
  const params = new URLSearchParams({
    client_id: env.META_APP_ID,
    redirect_uri: redirect,
    state,
    response_type: "code",
    scope: "pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish",
  });
  return json({ authorizationUrl: `https://www.facebook.com/${graphVersion(env)}/dialog/oauth?${params}` }, 200, origin, env);
}

async function oauthCallback(url, env) {
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const stored = state ? await env.SOCIAL_SESSIONS.get(`oauth:${state}`, "json") : null;
  if (!stored || !code || Date.now() - stored.createdAt > 600_000) return new Response("Meta connection expired. Return to Lorapok Office and try again.", { status: 400 });
  await env.SOCIAL_SESSIONS.delete(`oauth:${state}`);
  const redirect = `${env.PUBLIC_BASE_URL.replace(/\/$/, "")}/oauth/callback`;
  const exchangeParams = new URLSearchParams({ client_id: env.META_APP_ID, client_secret: env.META_APP_SECRET, redirect_uri: redirect, code });
  const shortResponse = await fetch(`https://graph.facebook.com/${graphVersion(env)}/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: exchangeParams,
  });
  const short = await shortResponse.json();
  if (!shortResponse.ok || !short.access_token) return new Response("Meta did not authorize this connection.", { status: 400 });
  const longParams = new URLSearchParams({ grant_type: "fb_exchange_token", client_id: env.META_APP_ID, client_secret: env.META_APP_SECRET, fb_exchange_token: short.access_token });
  const longResponse = await fetch(`https://graph.facebook.com/${graphVersion(env)}/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: longParams,
  });
  const long = await longResponse.json();
  if (!longResponse.ok || !long.access_token) return new Response("Meta token exchange failed.", { status: 400 });
  const expiresAt = new Date(Date.now() + Number(long.expires_in || 5_184_000) * 1000).toISOString();
  const identity = await graph("me?fields=id", long.access_token, env);
  await env.SOCIAL_SESSIONS.put(`connection:${stored.uid}`, await seal({ userAccessToken: long.access_token, expiresAt, metaUserId: String(identity.id || "") }, env));
  if (identity.id) await env.SOCIAL_SESSIONS.put(`meta-user:${identity.id}`, stored.uid, { expirationTtl: Number(long.expires_in || 5_184_000) });
  const safeOrigin = safeReturnOrigin(stored.origin, env);
  const html = `<!doctype html><meta charset="utf-8"><title>Meta connected</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#061c17;color:#eafff6;font:16px system-ui;text-align:center}strong{color:#67f5bb;font-size:24px}</style><div><strong>Meta connected</strong><p>You can return to Lorapok Office.</p></div><script>window.opener&&window.opener.postMessage({type:"lorapok-meta-connected"},${JSON.stringify(safeOrigin)});setTimeout(()=>window.close(),700);<\/script>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...securityHeaders(), "content-security-policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'" } });
}

async function threadsConnectionFor(uid, env) {
  const stored = await env.SOCIAL_SESSIONS.get(`threads-connection:${uid}`);
  if (!stored) return null;
  try {
    const connection = await unseal(stored, env);
    if (connection.expiresAt && Date.parse(connection.expiresAt) <= Date.now()) return null;
    return connection;
  } catch { return null; }
}

async function threadsConnectStart(_request, access, env, origin) {
  if (!env.THREADS_APP_ID || !(env.THREADS_APP_SECRET || env.META_APP_SECRET) || !env.TOKEN_ENCRYPTION_KEY) {
    return json({ error: "Threads App configuration is not complete yet" }, 503, origin, env);
  }
  const state = crypto.randomUUID();
  await env.SOCIAL_SESSIONS.put(`threads-oauth:${state}`, JSON.stringify({ uid: access.uid, origin, createdAt: Date.now() }), { expirationTtl: 600 });
  const redirect = `${env.PUBLIC_BASE_URL.replace(/\/$/, "")}/threads/oauth/callback`;
  const params = new URLSearchParams({
    client_id: env.THREADS_APP_ID,
    redirect_uri: redirect,
    state,
    response_type: "code",
    scope: "threads_basic,threads_content_publish",
  });
  return json({ authorizationUrl: `https://threads.net/oauth/authorize?${params}` }, 200, origin, env);
}

async function threadsOauthCallback(url, env) {
  const appSecret = env.THREADS_APP_SECRET || env.META_APP_SECRET;
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const stored = state ? await env.SOCIAL_SESSIONS.get(`threads-oauth:${state}`, "json") : null;
  if (!stored || !code || Date.now() - stored.createdAt > 600_000) return new Response("Threads connection expired. Return to Lorapok Office and try again.", { status: 400 });
  await env.SOCIAL_SESSIONS.delete(`threads-oauth:${state}`);
  const redirect = `${env.PUBLIC_BASE_URL.replace(/\/$/, "")}/threads/oauth/callback`;
  const exchange = await fetch("https://graph.threads.net/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.THREADS_APP_ID, client_secret: appSecret, grant_type: "authorization_code", redirect_uri: redirect, code }),
  });
  const short = await exchange.json().catch(() => ({}));
  if (!exchange.ok || !short.access_token) return new Response("Threads did not authorize this connection.", { status: 400 });
  const longUrl = new URL("https://graph.threads.net/access_token");
  longUrl.search = new URLSearchParams({ grant_type: "th_exchange_token", client_secret: appSecret, access_token: short.access_token }).toString();
  const longResponse = await fetch(longUrl);
  const long = await longResponse.json().catch(() => ({}));
  const accessToken = longResponse.ok && long.access_token ? long.access_token : short.access_token;
  const expiresIn = Number(long.expires_in || short.expires_in || 5_184_000);
  const profile = await threadsGraph("me?fields=id,username,threads_profile_picture_url", accessToken);
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  await env.SOCIAL_SESSIONS.put(`threads-connection:${stored.uid}`, await seal({
    accessToken,
    expiresAt,
    userId: String(profile.id || ""),
    username: String(profile.username || ""),
    profilePictureUrl: String(profile.threads_profile_picture_url || ""),
  }, env));
  const safeOrigin = safeReturnOrigin(stored.origin, env);
  const html = `<!doctype html><meta charset="utf-8"><title>Threads connected</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#061c17;color:#eafff6;font:16px system-ui;text-align:center}strong{color:#67f5bb;font-size:24px}</style><div><strong>Threads connected</strong><p>You can return to Lorapok Office.</p></div><script>window.opener&&window.opener.postMessage({type:"lorapok-threads-connected"},${JSON.stringify(safeOrigin)});setTimeout(()=>window.close(),700);<\/script>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...securityHeaders(), "content-security-policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'" } });
}

async function deleteKeysByPrefix(namespace, prefix) {
  let cursor;
  do {
    const page = await namespace.list({ prefix, cursor, limit: 500 });
    await Promise.all(page.keys.map((key) => namespace.delete(key.name)));
    cursor = page.list_complete === false ? page.cursor : undefined;
  } while (cursor);
}

async function deleteMediaByPrefix(bucket, prefix) {
  let cursor;
  do {
    const page = await bucket.list({ prefix, cursor, limit: 500 });
    if (page.objects.length) await bucket.delete(page.objects.map((object) => object.key));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
}

async function removeMetaIdentity(metaUserId, env) {
  const uid = await env.SOCIAL_SESSIONS.get(`meta-user:${metaUserId}`);
  if (!uid) return null;
  await Promise.all([
    env.SOCIAL_SESSIONS.delete(`connection:${uid}`),
    env.SOCIAL_SESSIONS.delete(`meta-user:${metaUserId}`),
  ]);
  return uid;
}

async function metaSignedCallback(request, env, deletion = false) {
  let payload;
  try {
    const form = await request.formData();
    payload = await parseMetaSignedRequest(form.get("signed_request"), env.META_APP_SECRET);
  } catch {
    return new Response("Invalid signed request", { status: 400, headers: securityHeaders() });
  }
  const uid = await removeMetaIdentity(String(payload.user_id), env);
  if (!deletion) return new Response("", { status: 200, headers: securityHeaders() });
  const confirmationCode = crypto.randomUUID();
  if (uid) {
    await Promise.all([
      deleteKeysByPrefix(env.SOCIAL_SESSIONS, `job:${uid}:`),
      deleteMediaByPrefix(env.SOCIAL_MEDIA, `${uid}/`),
    ]);
  }
  await env.SOCIAL_SESSIONS.put(`deletion:${confirmationCode}`, JSON.stringify({ status: "complete", requestedAt: new Date().toISOString() }), { expirationTtl: 60 * 60 * 24 * 30 });
  return new Response(JSON.stringify({
    url: `${env.PUBLIC_BASE_URL.replace(/\/$/, "")}/meta/data-deletion/status?code=${encodeURIComponent(confirmationCode)}`,
    confirmation_code: confirmationCode,
  }), { headers: { ...JSON_HEADERS, ...securityHeaders() } });
}

async function status(access, env, origin) {
  const configured = Boolean(env.META_APP_ID && env.META_APP_SECRET && env.TOKEN_ENCRYPTION_KEY && env.MEDIA_SIGNING_KEY);
  const threadsConfigured = Boolean(env.THREADS_APP_ID && (env.THREADS_APP_SECRET || env.META_APP_SECRET) && env.TOKEN_ENCRYPTION_KEY);
  const whatsappConfigured = Boolean(env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_VERIFY_TOKEN);
  const threadsConnection = threadsConfigured ? await threadsConnectionFor(access.uid, env) : null;
  const channels = {
    threads: {
      configured: threadsConfigured,
      connected: Boolean(threadsConnection),
      profile: threadsConnection ? { id: threadsConnection.userId, username: threadsConnection.username, profilePictureUrl: threadsConnection.profilePictureUrl } : null,
    },
    whatsapp: {
      configured: whatsappConfigured,
      connected: whatsappConfigured,
      displayName: env.WHATSAPP_DISPLAY_NAME || "Lorapok Labs WhatsApp",
      messages: whatsappConfigured ? await listWhatsAppMessages(env) : [],
    },
  };
  if (!configured) return json({ configured: false, connected: false, pages: [], jobs: [], channels, message: "Meta App configuration is incomplete." }, 200, origin, env);
  const connection = await connectionFor(access.uid, env);
  if (!connection) return json({ configured: true, connected: false, pages: [], jobs: await listJobs(access.uid, env), channels }, 200, origin, env);
  try {
    const pages = await discoverPages(connection, env);
    return json({ configured: true, connected: true, expiresAt: connection.expiresAt, pages: publicPages(pages), jobs: await listJobs(access.uid, env), channels }, 200, origin, env);
  } catch (error) {
    if (error.status === 400 || error.status === 401) await env.SOCIAL_SESSIONS.delete(`connection:${access.uid}`);
    return json({ configured: true, connected: false, pages: [], jobs: await listJobs(access.uid, env), channels, message: "Reconnect Meta to refresh expired permissions." }, 200, origin, env);
  }
}

async function uploadMedia(request, access, env, origin, url) {
  const form = await request.formData();
  const file = form.get("file");
  const mediaType = form.get("mediaType");
  if (!(file instanceof File) || !["image", "video"].includes(mediaType)) return json({ error: "A valid image or video is required" }, 400, origin, env);
  const max = mediaType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size < 1 || file.size > max) return json({ error: `${mediaType === "image" ? "Image" : "Video"} exceeds the protected upload limit` }, 413, origin, env);
  if (mediaType === "image" && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return json({ error: "Use JPEG, PNG, or WebP images" }, 415, origin, env);
  if (mediaType === "video" && !["video/mp4", "video/quicktime"].includes(file.type)) return json({ error: "Use MP4 or MOV video" }, 415, origin, env);
  const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "video/quicktime" ? "mov" : "mp4";
  const key = `${access.uid}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  await env.SOCIAL_MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "private, max-age=86400" }, customMetadata: { owner: access.uid, mediaType, width: String(form.get("width") || ""), height: String(form.get("height") || "") } });
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const signature = await signMedia(key, expires, env);
  const mediaUrl = `${url.origin}/media/${key.split("/").map(encodeURIComponent).join("/")}?expires=${expires}&signature=${encodeURIComponent(signature)}`;
  return json({ mediaUrl, mediaKey: key }, 201, origin, env);
}

async function publishInstagram(page, input, env) {
  if (!page.instagram || page.instagram.id !== input.instagramAccountId) throw new Error("The selected Instagram account is not linked to this Page");
  if (!input.mediaUrl || !input.mediaType) throw new Error("Instagram publishing requires prepared media");
  const params = new URLSearchParams();
  if (input.mediaType === "image") params.set("image_url", input.mediaUrl);
  else params.set("video_url", input.mediaUrl);
  if (input.placement === "instagram_reel") params.set("media_type", "REELS");
  if (input.placement === "instagram_story") params.set("media_type", "STORIES");
  if (input.placement !== "instagram_story" && input.caption) params.set("caption", input.caption);
  const container = await graph(`${page.instagram.id}/media`, page.accessToken, env, { method: "POST", body: params });
  if (!container.id) throw new Error("Instagram did not create a media container");
  if (input.mediaType === "video") {
    for (let attempt = 0; attempt < 15; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const state = await graph(`${container.id}?fields=status_code,status`, page.accessToken, env);
      if (state.status_code === "FINISHED") break;
      if (state.status_code === "ERROR" || state.status_code === "EXPIRED") throw new Error(state.status || "Instagram could not process this video");
      if (attempt === 14) throw new Error("Instagram is still processing this video. Try publishing again shortly.");
    }
  }
  const publish = await graph(`${page.instagram.id}/media_publish`, page.accessToken, env, { method: "POST", body: new URLSearchParams({ creation_id: container.id }) });
  return String(publish.id || container.id);
}

async function publishFacebook(page, input, env) {
  if (input.placement === "facebook_reel") {
    if (input.mediaType !== "video" || !input.mediaUrl) throw new Error("Facebook Reels require a prepared video");
    const start = await graph(`${page.id}/video_reels`, page.accessToken, env, { method: "POST", body: new URLSearchParams({ upload_phase: "START" }) });
    if (!start.video_id || !start.upload_url) throw new Error("Facebook could not start the Reel upload");
    const upload = await fetch(start.upload_url, { method: "POST", headers: { authorization: `OAuth ${page.accessToken}`, file_url: input.mediaUrl } });
    if (!upload.ok) throw new Error("Facebook could not ingest the Reel video");
    const finish = await graph(`${page.id}/video_reels`, page.accessToken, env, { method: "POST", body: new URLSearchParams({ upload_phase: "FINISH", video_id: start.video_id, video_state: "PUBLISHED", description: input.caption || "", title: input.title || "" }) });
    return String(finish.post_id || start.video_id);
  }
  if (input.mediaType === "image" && input.mediaUrl) {
    const result = await graph(`${page.id}/photos`, page.accessToken, env, { method: "POST", body: new URLSearchParams({ url: input.mediaUrl, message: input.caption || "", published: "true" }) });
    return String(result.post_id || result.id);
  }
  if (input.mediaType === "video" && input.mediaUrl) {
    const result = await graph(`${page.id}/videos`, page.accessToken, env, { method: "POST", body: new URLSearchParams({ file_url: input.mediaUrl, description: input.caption || "", title: input.title || "" }) }, "graph-video.facebook.com");
    return String(result.id);
  }
  if (!input.caption && !input.link) throw new Error("Facebook Feed requires a caption, link, or media");
  const params = new URLSearchParams({ message: input.caption || "" });
  if (input.link) params.set("link", input.link);
  const result = await graph(`${page.id}/feed`, page.accessToken, env, { method: "POST", body: params });
  return String(result.id);
}

async function validatePreparedMedia(input, access, env, origin, url) {
  if (!input.mediaUrl) return null;
  let media;
  try { media = new URL(input.mediaUrl); } catch { return json({ error: "Prepared media URL is invalid" }, 400, origin, env); }
  if (media.origin !== url.origin || !media.pathname.startsWith("/media/")) return json({ error: "Only media prepared by this protected gateway can be published" }, 400, origin, env);
  const mediaKey = media.pathname.slice("/media/".length).split("/").map(decodeURIComponent).join("/");
  if (!mediaKey.startsWith(`${access.uid}/`) || !await validMediaSignature(mediaKey, media.searchParams.get("expires"), media.searchParams.get("signature"), env)) {
    return json({ error: "Prepared media does not belong to this Office account or has expired" }, 403, origin, env);
  }
  const staged = await env.SOCIAL_MEDIA.head(mediaKey);
  if (!staged || staged.customMetadata?.owner !== access.uid || staged.customMetadata?.mediaType !== input.mediaType) {
    return json({ error: "Prepared media metadata is invalid" }, 400, origin, env);
  }
  return null;
}

async function publishThreads(request, access, env, origin, url) {
  const input = await request.json().catch(() => null);
  if (!input || !THREADS_MEDIA_TYPES.has(input.mediaType || "text")) return json({ error: "Choose a supported Threads publication type" }, 400, origin, env);
  if (typeof input.text !== "string" || input.text.length < 1 || input.text.length > 500) return json({ error: "Threads text must contain 1–500 characters" }, 400, origin, env);
  if (input.mediaType !== "text" && !input.mediaUrl) return json({ error: "Threads image and video posts require prepared media" }, 400, origin, env);
  const mediaError = await validatePreparedMedia(input, access, env, origin, url);
  if (mediaError) return mediaError;
  const connection = await threadsConnectionFor(access.uid, env);
  if (!connection) return json({ error: "Connect Threads before publishing" }, 409, origin, env);
  const params = new URLSearchParams({ media_type: input.mediaType.toUpperCase(), text: input.text });
  if (input.mediaType === "image") params.set("image_url", input.mediaUrl);
  if (input.mediaType === "video") params.set("video_url", input.mediaUrl);
  try {
    const container = await threadsGraph(`${connection.userId}/threads`, connection.accessToken, { method: "POST", body: params });
    if (!container.id) throw new Error("Threads did not create a publication container");
    if (input.mediaType === "video") {
      for (let attempt = 0; attempt < 15; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const state = await threadsGraph(`${container.id}?fields=status,error_message`, connection.accessToken);
        if (state.status === "FINISHED") break;
        if (state.status === "ERROR" || state.status === "EXPIRED") throw new Error(state.error_message || "Threads could not process this video");
        if (attempt === 14) throw new Error("Threads is still processing this video. Try again shortly.");
      }
    }
    const result = await threadsGraph(`${connection.userId}/threads_publish`, connection.accessToken, { method: "POST", body: new URLSearchParams({ creation_id: container.id }) });
    const postId = String(result.id || container.id);
    await audit(access.uid, { placement: "threads_post", accountName: `@${connection.username || "threads"}`, status: "published", postId }, env);
    return json({ ok: true, postId, placement: "threads_post" }, 201, origin, env);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Threads publishing failed";
    await audit(access.uid, { placement: "threads_post", accountName: `@${connection.username || "threads"}`, status: "failed", message }, env);
    return json({ error: message }, error.status && error.status < 500 ? 400 : 502, origin, env);
  }
}

async function sendWhatsAppMessage(request, access, env, origin) {
  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) return json({ error: "WhatsApp Business is not configured" }, 503, origin, env);
  const input = await request.json().catch(() => null);
  const recipient = String(input?.recipient || "").replace(/[^0-9]/g, "");
  const message = String(input?.message || "").trim();
  if (!/^\d{8,15}$/.test(recipient)) return json({ error: "Enter a valid WhatsApp number with country code" }, 400, origin, env);
  if (!message || message.length > 4096) return json({ error: "WhatsApp message must contain 1–4,096 characters" }, 400, origin, env);
  try {
    const result = await graph(`${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, env.WHATSAPP_ACCESS_TOKEN, env, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: recipient, type: "text", text: { preview_url: true, body: message } }),
    });
    const messageId = String(result.messages?.[0]?.id || "");
    const createdAt = new Date().toISOString();
    await env.SOCIAL_SESSIONS.put(`whatsapp-message:${createdAt}:${crypto.randomUUID()}`, JSON.stringify({ id: messageId || crypto.randomUUID(), direction: "outbound", from: env.WHATSAPP_DISPLAY_NAME || "Lorapok Labs", to: recipient, text: message, createdAt, status: "sent", sentBy: access.email }), { expirationTtl: 60 * 60 * 24 * 90 });
    await audit(access.uid, { placement: "whatsapp_message", accountName: env.WHATSAPP_DISPLAY_NAME || "Lorapok Labs WhatsApp", status: "published", postId: messageId }, env);
    return json({ ok: true, messageId }, 201, origin, env);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "WhatsApp message could not be sent" }, 502, origin, env);
  }
}

async function whatsappWebhook(request, env, url) {
  if (request.method === "GET") {
    const valid = url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === env.WHATSAPP_VERIFY_TOKEN;
    return new Response(valid ? url.searchParams.get("hub.challenge") || "" : "Invalid verification token", { status: valid ? 200 : 403, headers: securityHeaders() });
  }
  const rawBody = await request.text();
  const suppliedSignature = String(request.headers.get("x-hub-signature-256") || "");
  if (env.META_APP_SECRET) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.META_APP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
    const suppliedHex = suppliedSignature.startsWith("sha256=") ? suppliedSignature.slice(7) : "";
    const supplied = suppliedHex && /^[0-9a-f]{64}$/i.test(suppliedHex)
      ? Uint8Array.from(suppliedHex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
      : new Uint8Array();
    if (!constantTimeEqual(expected, supplied)) return new Response("Invalid webhook signature", { status: 403, headers: securityHeaders() });
  }
  const payload = JSON.parse(rawBody || "null");
  const changes = (payload?.entry || []).flatMap((entry) => entry.changes || []);
  const records = [];
  for (const change of changes) {
    const value = change.value || {};
    const contacts = new Map((value.contacts || []).map((contact) => [contact.wa_id, contact.profile?.name || contact.wa_id]));
    for (const message of value.messages || []) {
      const createdAt = new Date(Number(message.timestamp || Math.floor(Date.now() / 1000)) * 1000).toISOString();
      records.push({
        id: String(message.id || crypto.randomUUID()),
        direction: "inbound",
        from: String(message.from || ""),
        fromName: String(contacts.get(message.from) || message.from || "WhatsApp contact"),
        to: String(value.metadata?.display_phone_number || ""),
        text: String(message.text?.body || message.button?.text || message.interactive?.button_reply?.title || `[${message.type || "message"}]`),
        type: String(message.type || "text"),
        createdAt,
        status: "received",
      });
    }
  }
  await Promise.all(records.map((record) => env.SOCIAL_SESSIONS.put(`whatsapp-message:${record.createdAt}:${record.id}`, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 90 })));
  return new Response("EVENT_RECEIVED", { status: 200, headers: securityHeaders() });
}

async function publish(request, access, env, origin, url) {
  const input = await request.json().catch(() => null);
  if (!input || !PLACEMENTS.has(input.placement) || !/^\d+$/.test(input.pageId || "")) return json({ error: "A valid Page and placement are required" }, 400, origin, env);
  if (typeof input.caption !== "string" || input.caption.length > 2200 || typeof input.title !== "string" || input.title.length > 120) return json({ error: "Publication text exceeds the supported length" }, 400, origin, env);
  if (input.link !== undefined && (typeof input.link !== "string" || input.link.length > 2048)) return json({ error: "Publication link is invalid" }, 400, origin, env);
  if (input.link) {
    let link;
    try { link = new URL(input.link); } catch { return json({ error: "Publication link is invalid" }, 400, origin, env); }
    if (!["http:", "https:"].includes(link.protocol)) return json({ error: "Publication link must use HTTP or HTTPS" }, 400, origin, env);
  }
  if (input.mediaUrl) {
    let media;
    try { media = new URL(input.mediaUrl); } catch { return json({ error: "Prepared media URL is invalid" }, 400, origin, env); }
    if (media.origin !== url.origin || !media.pathname.startsWith("/media/")) return json({ error: "Only media prepared by this protected gateway can be published" }, 400, origin, env);
    const mediaKey = media.pathname.slice("/media/".length).split("/").map(decodeURIComponent).join("/");
    if (!mediaKey.startsWith(`${access.uid}/`) || !await validMediaSignature(mediaKey, media.searchParams.get("expires"), media.searchParams.get("signature"), env)) {
      return json({ error: "Prepared media does not belong to this Office account or has expired" }, 403, origin, env);
    }
    const staged = await env.SOCIAL_MEDIA.head(mediaKey);
    if (!staged || staged.customMetadata?.owner !== access.uid || staged.customMetadata?.mediaType !== input.mediaType) {
      return json({ error: "Prepared media metadata is invalid" }, 400, origin, env);
    }
  }
  const connection = await connectionFor(access.uid, env);
  if (!connection) return json({ error: "Connect Meta before publishing" }, 409, origin, env);
  let accountName = "Meta account";
  try {
    const pages = await discoverPages(connection, env);
    const page = pages.find((item) => item.id === input.pageId);
    if (!page) throw new Error("The selected Facebook Page is no longer available");
    accountName = input.placement.startsWith("instagram") ? `@${page.instagram?.username || "instagram"}` : page.name;
    const postId = input.placement.startsWith("instagram") ? await publishInstagram(page, input, env) : await publishFacebook(page, input, env);
    await audit(access.uid, { placement: input.placement, accountName, status: "published", postId }, env);
    return json({ ok: true, postId, placement: input.placement }, 201, origin, env);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Meta publishing failed";
    await audit(access.uid, { placement: input.placement, accountName, status: "failed", message }, env);
    return json({ error: message }, error.status && error.status < 500 ? 400 : 502, origin, env);
  }
}

async function media(request, env, url) {
  const key = url.pathname.slice("/media/".length).split("/").map(decodeURIComponent).join("/");
  if (!await validMediaSignature(key, url.searchParams.get("expires"), url.searchParams.get("signature"), env)) return new Response("Media URL expired", { status: 403, headers: securityHeaders() });
  const object = await env.SOCIAL_MEDIA.get(key);
  if (!object) return new Response("Media not found", { status: 404, headers: securityHeaders() });
  return new Response(request.method === "HEAD" ? null : object.body, { headers: { "content-type": object.httpMetadata?.contentType || "application/octet-stream", "content-length": String(object.size), "cache-control": "private, max-age=3600", "x-content-type-options": "nosniff" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    if (url.pathname === "/health") return json({ ok: true, service: "lorapok-social-publisher", configured: Boolean(env.META_APP_ID && env.META_APP_SECRET && env.TOKEN_ENCRYPTION_KEY && env.MEDIA_SIGNING_KEY) }, 200, origin, env);
    if (url.pathname === "/oauth/callback" && request.method === "GET") return oauthCallback(url, env);
    if (url.pathname === "/threads/oauth/callback" && request.method === "GET") return threadsOauthCallback(url, env);
    if (url.pathname === "/meta/whatsapp-webhook" && ["GET", "POST"].includes(request.method)) return whatsappWebhook(request, env, url);
    if (url.pathname === "/meta/deauthorize" && request.method === "POST") return metaSignedCallback(request, env, false);
    if (url.pathname === "/meta/data-deletion" && request.method === "POST") return metaSignedCallback(request, env, true);
    if (url.pathname === "/meta/data-deletion/status" && request.method === "GET") {
      const status = await env.SOCIAL_SESSIONS.get(`deletion:${url.searchParams.get("code") || ""}`, "json");
      return new Response(status ? "Your Lorapok Social Publisher data deletion is complete." : "This deletion confirmation code is invalid or expired.", { status: status ? 200 : 404, headers: { "content-type": "text/plain; charset=utf-8", ...securityHeaders() } });
    }
    if (url.pathname.startsWith("/media/") && ["GET", "HEAD"].includes(request.method)) return media(request, env, url);
    if (!allowedOrigin(origin, env)) return json({ error: "Origin is not allowed" }, 403, origin, env);
    const access = await authorize(request, env);
    if (access.error) return json({ error: access.error }, access.status, origin, env);
    if (url.pathname === "/api/status" && request.method === "GET") return status(access, env, origin);
    if (url.pathname === "/api/connect/start" && request.method === "POST") return connectStart(request, access, env, origin);
    if (url.pathname === "/api/threads/connect/start" && request.method === "POST") return threadsConnectStart(request, access, env, origin);
    if (url.pathname === "/api/threads/connection" && request.method === "DELETE") {
      await env.SOCIAL_SESSIONS.delete(`threads-connection:${access.uid}`);
      return json({ ok: true }, 200, origin, env);
    }
    if (url.pathname === "/api/connection" && request.method === "DELETE") {
      const connection = await connectionFor(access.uid, env);
      await env.SOCIAL_SESSIONS.delete(`connection:${access.uid}`);
      if (connection?.metaUserId) await env.SOCIAL_SESSIONS.delete(`meta-user:${connection.metaUserId}`);
      return json({ ok: true }, 200, origin, env);
    }
    if (url.pathname === "/api/media" && request.method === "POST") return uploadMedia(request, access, env, origin, url);
    if (url.pathname === "/api/publish" && request.method === "POST") return publish(request, access, env, origin, url);
    if (url.pathname === "/api/threads/publish" && request.method === "POST") return publishThreads(request, access, env, origin, url);
    if (url.pathname === "/api/whatsapp/messages" && request.method === "POST") return sendWhatsAppMessage(request, access, env, origin);
    return json({ error: "Not found" }, 404, origin, env);
  },
  async scheduled(_event, env) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let cursor;
    do {
      const page = await env.SOCIAL_MEDIA.list({ cursor, limit: 500 });
      const expired = page.objects.filter((object) => object.uploaded && object.uploaded.getTime() < cutoff).map((object) => object.key);
      if (expired.length) await env.SOCIAL_MEDIA.delete(expired);
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
  },
};
