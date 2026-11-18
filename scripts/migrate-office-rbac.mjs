#!/usr/bin/env node

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const requireFromAgent = createRequire(path.resolve("agent/package.json"));
const admin = requireFromAgent("firebase-admin");
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "agent/.credentials/lorapok-labs-sa.json");
const primarySuperAdminEmail = "mdshuvo40@gmail.com";
const roles = new Set(["super-admin", "owner", "admin", "editor", "researcher", "teammate", "viewer"]);
const statuses = new Set(["pending", "active", "suspended"]);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase service account is unavailable at the protected local credential path.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const snapshot = await db.collection("users").get();
let superAdmins = 0;
let normalized = 0;

for (const entry of snapshot.docs) {
  const data = entry.data();
  const email = String(data.email || "").trim().toLowerCase();
  const isPrimarySuperAdmin = email === primarySuperAdminEmail;
  const role = isPrimarySuperAdmin ? "super-admin" : (roles.has(data.role) && data.role !== "super-admin" ? data.role : "viewer");
  const status = isPrimarySuperAdmin ? "active" : (statuses.has(data.status) ? data.status : "pending");
  await entry.ref.set({
    email,
    role,
    status,
    rbacMigratedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  if (isPrimarySuperAdmin) superAdmins++;
  else normalized++;
}

console.log(`Office RBAC migration complete: ${superAdmins} protected Super Admin, ${normalized} member records normalized.`);
