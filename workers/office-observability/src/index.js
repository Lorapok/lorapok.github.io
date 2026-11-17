const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const ANALYTICS_ROLES = new Set(["owner", "admin", "researcher"]);

function corsHeaders(origin, env) {
  const allowed = new Set([
    "https://lorapok.tech",
    "https://www.lorapok.tech",
    ...(env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean),
  ]);
  return allowed.has(origin) ? {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "Authorization, Content-Type",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-max-age": "86400",
    vary: "Origin",
  } : { vary: "Origin" };
}

function json(body, status, origin, env, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...corsHeaders(origin, env), ...extra } });
}

function decodeTokenPayload(token) {
  const part = token.split(".")[1];
  if (!part) throw new Error("Malformed Firebase token");
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  return JSON.parse(atob(base64));
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

async function authorize(request, env) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { ok: false, status: 401, message: "Missing Office authorization" };

  let payload;
  try { payload = decodeTokenPayload(token); } catch { return { ok: false, status: 401, message: "Invalid Office authorization" }; }
  if (!payload.sub || payload.aud !== env.FIREBASE_PROJECT_ID || Number(payload.exp || 0) * 1000 <= Date.now()) {
    return { ok: false, status: 401, message: "Expired or invalid Office authorization" };
  }

  const profileUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/users/${encodeURIComponent(payload.sub)}`;
  const profileResponse = await fetch(profileUrl, { headers: { authorization: `Bearer ${token}` } });
  if (!profileResponse.ok) return { ok: false, status: profileResponse.status === 403 ? 403 : 401, message: "Office profile verification failed" };
  const document = await profileResponse.json();
  const profile = Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, firestoreValue(value)]));
  if (profile.status !== "active" || !ANALYTICS_ROLES.has(profile.role)) {
    return { ok: false, status: 403, message: "Infrastructure analytics permission required" };
  }
  return { ok: true, uid: payload.sub, role: profile.role };
}

async function cloudflare(env, path, init = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const message = payload.errors?.map((error) => error.message).join(", ") || `Cloudflare API returned ${response.status}`;
    throw new Error(message);
  }
  return payload.result;
}

async function trafficAnalytics(env, start, end) {
  const query = `query OfficeOverview($zone: string!, $start: DateTime!, $end: DateTime!) {
    viewer {
      zones(filter: { zoneTag: $zone }) {
        traffic: httpRequestsAdaptiveGroups(limit: 168, orderBy: [datetimeHour_ASC], filter: { datetime_geq: $start, datetime_lt: $end, requestSource: \"eyeball\" }) {
          count
          sum { edgeResponseBytes visits }
          dimensions { datetimeHour }
        }
        cache: httpRequestsAdaptiveGroups(limit: 30, orderBy: [count_DESC], filter: { datetime_geq: $start, datetime_lt: $end, requestSource: \"eyeball\" }) {
          count
          dimensions { cacheStatus }
        }
        status: httpRequestsAdaptiveGroups(limit: 100, orderBy: [count_DESC], filter: { datetime_geq: $start, datetime_lt: $end, requestSource: \"eyeball\" }) {
          count
          dimensions { edgeResponseStatus }
        }
      }
    }
  }`;
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { zone: env.CLOUDFLARE_ZONE_ID, start, end } }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.map((error) => error.message).join(", ") || "Analytics query failed");
  return payload.data?.viewer?.zones?.[0] || {};
}

async function securityAnalytics(env, start, end) {
  const query = `query OfficeSecurity($zone: string!, $start: DateTime!, $end: DateTime!) {
    viewer { zones(filter: { zoneTag: $zone }) {
      security: firewallEventsAdaptiveGroups(limit: 50, orderBy: [count_DESC], filter: { datetime_geq: $start, datetime_lt: $end }) { count }
    } }
  }`;
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { zone: env.CLOUDFLARE_ZONE_ID, start, end } }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.map((error) => error.message).join(", ") || "Security analytics query failed");
  return payload.data?.viewer?.zones?.[0]?.security || [];
}

function summarizeAnalytics(result) {
  const traffic = (result.traffic || []).map((point) => ({
    timestamp: point.dimensions?.datetimeHour,
    requests: Number(point.count || 0),
    bandwidth: Number(point.sum?.edgeResponseBytes || 0),
    visits: Number(point.sum?.visits || 0),
  })).filter((point) => point.timestamp);
  const totals = traffic.reduce((all, point) => ({
    requests: all.requests + point.requests,
    bandwidth: all.bandwidth + point.bandwidth,
    visits: all.visits + point.visits,
  }), { requests: 0, bandwidth: 0, visits: 0 });
  const cachedRequests = (result.cache || []).filter((item) => ["hit", "stale", "revalidated", "updating"].includes(String(item.dimensions?.cacheStatus || "").toLowerCase())).reduce((sum, item) => sum + Number(item.count || 0), 0);
  const originErrors = (result.status || []).filter((item) => Number(item.dimensions?.edgeResponseStatus || 0) >= 500).reduce((sum, item) => sum + Number(item.count || 0), 0);
  return { traffic, totals: { ...totals, cachedRequests, originErrors, threats: 0 } };
}

async function getOverview(env) {
  const notices = [];
  const now = new Date();
  const periodHours = Math.min(Math.max(Number(env.PERIOD_HOURS || 24), 1), 168);
  const start = new Date(now.getTime() - periodHours * 60 * 60 * 1000).toISOString();
  const end = now.toISOString();

  const [zoneResult, dnsResult, workersResult, analyticsResult, securityResult] = await Promise.allSettled([
    cloudflare(env, `/zones/${env.CLOUDFLARE_ZONE_ID}`),
    cloudflare(env, `/zones/${env.CLOUDFLARE_ZONE_ID}/dns_records?per_page=100&order=type&direction=asc`),
    cloudflare(env, `/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts?per_page=100`),
    trafficAnalytics(env, start, end),
    securityAnalytics(env, start, end),
  ]);

  if (zoneResult.status === "rejected") throw zoneResult.reason;
  if (dnsResult.status === "rejected") notices.push("DNS inventory could not be read with the current Cloudflare token scope.");
  if (workersResult.status === "rejected") notices.push("Worker inventory could not be read with the current Cloudflare token scope.");
  if (analyticsResult.status === "rejected") notices.push("Traffic analytics are unavailable for the current token scope or plan.");
  if (securityResult.status === "rejected") notices.push("Security event totals are unavailable for the current Cloudflare plan.");

  const zone = zoneResult.value;
  const summary = analyticsResult.status === "fulfilled"
    ? summarizeAnalytics(analyticsResult.value)
    : { traffic: [], totals: { requests: 0, bandwidth: 0, visits: 0, cachedRequests: 0, threats: 0, originErrors: 0 } };
  if (securityResult.status === "fulfilled") {
    summary.totals.threats = securityResult.value.reduce((sum, item) => sum + Number(item.count || 0), 0);
  }

  return {
    generatedAt: now.toISOString(),
    periodHours,
    zone: {
      name: zone.name,
      status: zone.status,
      plan: zone.plan?.name || "Unknown",
      developmentMode: Number(zone.development_mode || 0),
      nameServers: zone.name_servers || [],
    },
    totals: summary.totals,
    traffic: summary.traffic,
    dns: dnsResult.status === "fulfilled" ? dnsResult.value.map((record) => ({ name: record.name, type: record.type, proxied: Boolean(record.proxied), ttl: Number(record.ttl || 0) })) : [],
    workers: workersResult.status === "fulfilled" ? workersResult.value.map((worker) => ({ name: worker.id || worker.name, modifiedAt: worker.modified_on || worker.modified_at || null, usageModel: worker.usage_model || null })) : [],
    notices,
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    const url = new URL(request.url);
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, origin, env);
    if (url.pathname === "/health") return json({ ok: true, service: "lorapok-office-observability" }, 200, origin, env, { "cache-control": "no-store" });
    if (url.pathname !== "/api/overview") return json({ error: "Not found" }, 404, origin, env);

    try {
      const access = await authorize(request, env);
      if (!access.ok) return json({ error: access.message }, access.status, origin, env, { "cache-control": "no-store" });
      const cacheKey = new Request(`${url.origin}/_cache/overview-v2`, { method: "GET" });
      const cache = caches.default;
      const cached = await cache.match(cacheKey);
      if (cached) return new Response(cached.body, { status: cached.status, headers: { ...Object.fromEntries(cached.headers), ...corsHeaders(origin, env) } });
      const overview = await getOverview(env);
      const response = json(overview, 200, origin, env, { "cache-control": "private, max-age=0", "x-content-type-options": "nosniff" });
      const cacheResponse = new Response(JSON.stringify(overview), { headers: { ...JSON_HEADERS, "cache-control": "public, max-age=60" } });
      await cache.put(cacheKey, cacheResponse);
      return response;
    } catch (error) {
      console.error("office-observability", error instanceof Error ? error.message : "unknown error");
      return json({ error: "Cloudflare monitoring is temporarily unavailable" }, 503, origin, env, { "cache-control": "no-store" });
    }
  },
};
