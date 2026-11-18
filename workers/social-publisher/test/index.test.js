import assert from "node:assert/strict";
import test from "node:test";
import worker, { parseMetaSignedRequest } from "../src/index.js";

const env = {
  FIREBASE_PROJECT_ID: "lorapok-labs",
  GRAPH_API_VERSION: "v27.0",
  PUBLIC_BASE_URL: "https://publisher.example.test",
  ALLOWED_ORIGINS: "https://lorapok.tech",
};

test("health reports an unconfigured gateway without exposing secrets", async () => {
  const response = await worker.fetch(new Request("https://publisher.example.test/health", { headers: { origin: "https://lorapok.tech" } }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "lorapok-social-publisher", configured: false });
  assert.equal(response.headers.get("access-control-allow-origin"), "https://lorapok.tech");
});

test("private endpoints reject disallowed origins before authentication", async () => {
  const response = await worker.fetch(new Request("https://publisher.example.test/api/status", { headers: { origin: "https://evil.example" } }), env);
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error, "Origin is not allowed");
});

test("private endpoints require Office authorization", async () => {
  const response = await worker.fetch(new Request("https://publisher.example.test/api/status", { headers: { origin: "https://lorapok.tech" } }), env);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error, "Office authorization is required");
});

test("unsigned media cannot be read", async () => {
  const response = await worker.fetch(new Request("https://publisher.example.test/media/user/file.jpg"), env);
  assert.equal(response.status, 403);
});

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

test("Meta signed requests are verified with HMAC-SHA256", async () => {
  const secret = "test-app-secret";
  const payloadPart = base64url(JSON.stringify({ algorithm: "HMAC-SHA256", user_id: "12345" }));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = Buffer.from(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadPart))).toString("base64url");
  const payload = await parseMetaSignedRequest(`${signature}.${payloadPart}`, secret);
  assert.equal(payload.user_id, "12345");
  await assert.rejects(parseMetaSignedRequest(`invalid.${payloadPart}`, secret));
});
