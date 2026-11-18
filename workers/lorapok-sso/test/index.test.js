import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const env = {
  FIREBASE_PROJECT_ID: "lorapok-labs",
  ALLOWED_ORIGINS: "http://localhost:4175",
};

async function withRegisteredOrigins(origins, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.hostname !== "firestore.googleapis.com") return originalFetch(input);
    return new Response(JSON.stringify({ fields: {
      name: { stringValue: "Test application" },
      status: { stringValue: "active" },
      origins: { arrayValue: { values: origins.map((origin) => ({ stringValue: origin })) } },
    } }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try { return await run(); } finally { globalThis.fetch = originalFetch; }
}

test("health endpoint returns hardened no-store response", async () => {
  const response = await worker.fetch(new Request("https://sso.example/health", {
    headers: { origin: "https://reportkit.lorapok.tech" },
  }), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("access-control-allow-origin"), "https://reportkit.lorapok.tech");
  assert.deepEqual(await response.json(), { ok: true, service: "lorapok-sso", version: 1 });
});

test("untrusted origins cannot create a session", async () => {
  const response = await withRegisteredOrigins(["https://reportkit.lorapok.tech"], () => worker.fetch(new Request("https://sso.example/v1/session?appId=reportkit", {
      method: "POST",
      headers: { origin: "https://attacker.example", "content-type": "application/json" },
      body: JSON.stringify({ appId: "reportkit" }),
    }), env));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("session endpoint rejects missing and malformed identity tokens", async () => {
  await withRegisteredOrigins(["http://localhost:4175"], async () => {
    const missing = await worker.fetch(new Request("https://sso.example/v1/session?appId=reportkit", {
      method: "POST",
      headers: { origin: "http://localhost:4175", "content-type": "application/json" },
      body: JSON.stringify({ appId: "reportkit" }),
    }), env);
    assert.equal(missing.status, 401);

    const malformed = await worker.fetch(new Request("https://sso.example/v1/session?appId=reportkit", {
      method: "POST",
      headers: { origin: "http://localhost:4175", authorization: "Bearer not-a-jwt", "content-type": "application/json" },
      body: JSON.stringify({ appId: "reportkit" }),
    }), env);
    assert.equal(malformed.status, 401);
  });
});

test("preflight follows the dynamic application origin registry", async () => {
  await withRegisteredOrigins(["https://automate.lorapok.tech"], async () => {
    const allowed = await worker.fetch(new Request("https://sso.example/v1/session?appId=automate", {
      method: "OPTIONS",
      headers: { origin: "https://automate.lorapok.tech" },
    }), env);
    assert.equal(allowed.status, 204);
    assert.equal(allowed.headers.get("access-control-allow-origin"), "https://automate.lorapok.tech");
    const denied = await worker.fetch(new Request("https://sso.example/v1/session?appId=automate", {
      method: "OPTIONS",
      headers: { origin: "https://example.com" },
    }), env);
    assert.equal(denied.status, 403);
  });
});
