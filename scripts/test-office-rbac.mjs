#!/usr/bin/env node

import fs from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

const projectId = "demo-lorapok-rbac";
const testEnv = await initializeTestEnvironment({
  projectId,
  firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
});

const profile = (uid, email, role, status = "active") => ({ uid, email, displayName: role, role, status });

try {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, "users", "owner-uid"), profile("owner-uid", "imaizied@gmail.com", "owner")),
      setDoc(doc(db, "users", "admin-uid"), profile("admin-uid", "admin@example.com", "admin")),
      setDoc(doc(db, "users", "editor-uid"), profile("editor-uid", "editor@example.com", "editor")),
      setDoc(doc(db, "users", "research-uid"), profile("research-uid", "research@example.com", "researcher")),
      setDoc(doc(db, "users", "team-uid"), profile("team-uid", "team@example.com", "teammate")),
      setDoc(doc(db, "users", "viewer-uid"), profile("viewer-uid", "viewer@example.com", "viewer")),
      setDoc(doc(db, "users", "pending-uid"), profile("pending-uid", "pending@example.com", "viewer", "pending")),
      setDoc(doc(db, "users", "suspended-uid"), profile("suspended-uid", "suspended@example.com", "editor", "suspended")),
      setDoc(doc(db, "published_projects", "public-project"), { id: "public-project", visibility: "published" }),
      setDoc(doc(db, "office_projects", "private-project"), { id: "private-project", visibility: "draft" }),
      setDoc(doc(db, "published_partners", "public-partner"), { id: "public-partner", visibility: "published", status: "active" }),
      setDoc(doc(db, "office_partners", "private-partner"), { id: "private-partner", visibility: "draft", status: "paused" }),
      setDoc(doc(db, "blog_posts", "public-post"), { id: "public-post", status: "published" }),
      setDoc(doc(db, "blog_posts", "draft-post"), { id: "draft-post", status: "draft" }),
      setDoc(doc(db, "office_modules", "content"), { items: [] }),
      setDoc(doc(db, "office_modules", "offers"), { items: [] }),
      setDoc(doc(db, "office_modules", "chat"), { items: [] }),
    ]);
  });

  const dbFor = (uid, email) => testEnv.authenticatedContext(uid, { email }).firestore();
  const anonymous = testEnv.unauthenticatedContext().firestore();
  const owner = dbFor("owner-uid", "imaizied@gmail.com");
  const admin = dbFor("admin-uid", "admin@example.com");
  const editor = dbFor("editor-uid", "editor@example.com");
  const researcher = dbFor("research-uid", "research@example.com");
  const teammate = dbFor("team-uid", "team@example.com");
  const viewer = dbFor("viewer-uid", "viewer@example.com");
  const pending = dbFor("pending-uid", "pending@example.com");
  const suspended = dbFor("suspended-uid", "suspended@example.com");

  await assertSucceeds(getDoc(doc(anonymous, "published_projects", "public-project")));
  await assertSucceeds(getDoc(doc(anonymous, "published_partners", "public-partner")));
  await assertSucceeds(getDoc(doc(anonymous, "blog_posts", "public-post")));
  await assertFails(getDoc(doc(anonymous, "office_projects", "private-project")));
  await assertFails(getDoc(doc(anonymous, "office_partners", "private-partner")));
  await assertFails(getDoc(doc(anonymous, "blog_posts", "draft-post")));

  await assertSucceeds(setDoc(doc(anonymous, "newsletter_subscribers", "valid-subscription"), {
    email: "subscriber@example.com",
    source: "home_newsletter",
    consentVersion: "2026-11",
    createdAt: serverTimestamp(),
  }));
  await assertFails(setDoc(doc(anonymous, "newsletter_subscribers", "invalid-subscription"), {
    email: "not-an-email",
    source: "home_newsletter",
    consentVersion: "2026-11",
    createdAt: serverTimestamp(),
  }));
  await assertFails(getDoc(doc(anonymous, "newsletter_subscribers", "valid-subscription")));

  await assertSucceeds(setDoc(doc(owner, "office_invites", "new-admin@example.com"), { email: "new-admin@example.com", role: "admin", status: "invited" }));
  await assertSucceeds(setDoc(doc(admin, "office_invites", "new-editor@example.com"), { email: "new-editor@example.com", role: "editor", status: "invited" }));
  await assertFails(setDoc(doc(admin, "office_invites", "second-admin@example.com"), { email: "second-admin@example.com", role: "admin", status: "invited" }));

  await assertSucceeds(setDoc(doc(editor, "office_projects", "editor-project"), { id: "editor-project", visibility: "draft" }));
  await assertSucceeds(setDoc(doc(editor, "office_partners", "editor-partner"), { id: "editor-partner", visibility: "draft", status: "pending" }));
  await assertSucceeds(setDoc(doc(editor, "published_partners", "editor-public-partner"), { id: "editor-public-partner", visibility: "published", status: "active" }));
  await assertSucceeds(setDoc(doc(editor, "blog_posts", "editor-draft"), { id: "editor-draft", status: "draft" }));
  await assertFails(setDoc(doc(editor, "agent_config", "lolabo_settings"), { isEnabled: true }));
  await assertSucceeds(setDoc(doc(editor, "office_modules", "content"), { items: [{ id: "story" }] }));
  await assertSucceeds(setDoc(doc(editor, "office_modules", "offers"), { items: [{ id: "offer" }] }));
  await assertSucceeds(setDoc(doc(editor, "office_modules", "tasks"), { items: [{ id: "task" }] }));

  await assertSucceeds(setDoc(doc(researcher, "agent_config", "lolabo_settings"), { isEnabled: true }));
  await assertSucceeds(setDoc(doc(researcher, "blog_posts", "research-draft"), { id: "research-draft", status: "draft" }));
  await assertFails(setDoc(doc(researcher, "office_projects", "research-project"), { id: "research-project" }));
  await assertFails(setDoc(doc(researcher, "office_partners", "research-partner"), { id: "research-partner" }));
  await assertFails(getDoc(doc(researcher, "office_modules", "chat")));

  await assertSucceeds(getDoc(doc(teammate, "users", "team-uid")));
  await assertFails(getDoc(doc(teammate, "office_projects", "private-project")));
  await assertFails(getDoc(doc(teammate, "office_partners", "private-partner")));
  await assertSucceeds(getDoc(doc(teammate, "office_modules", "content")));
  await assertSucceeds(setDoc(doc(teammate, "office_modules", "chat"), { items: [{ id: "message" }] }));
  await assertFails(getDoc(doc(teammate, "office_modules", "offers")));
  await assertFails(setDoc(doc(teammate, "office_modules", "offers"), { items: [] }));
  await assertFails(getDoc(doc(viewer, "agent_config", "lolabo_settings")));
  await assertFails(getDoc(doc(viewer, "office_modules", "content")));
  await assertFails(getDoc(doc(pending, "office_projects", "private-project")));
  await assertFails(getDoc(doc(pending, "office_modules", "content")));
  await assertFails(getDoc(doc(suspended, "office_projects", "private-project")));
  await assertFails(getDoc(doc(suspended, "office_modules", "content")));
  await assertFails(updateDoc(doc(teammate, "users", "team-uid"), { role: "admin" }));

  await assertSucceeds(updateDoc(doc(admin, "users", "team-uid"), { role: "editor", status: "active" }));
  await assertFails(updateDoc(doc(admin, "users", "editor-uid"), { role: "admin", status: "active" }));
  await assertFails(updateDoc(doc(admin, "users", "owner-uid"), { role: "viewer", status: "suspended" }));

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "office_invites", "invited@example.com"), {
      email: "invited@example.com", role: "researcher", status: "invited",
    });
  });
  const invited = dbFor("invited-uid", "invited@example.com");
  await assertSucceeds(setDoc(doc(invited, "users", "invited-uid"), profile("invited-uid", "invited@example.com", "researcher")));
  await assertSucceeds(updateDoc(doc(invited, "office_invites", "invited@example.com"), {
    status: "accepted", acceptedUid: "invited-uid", acceptedAt: new Date(),
  }));

  const uninvited = dbFor("new-uid", "new@example.com");
  await assertSucceeds(setDoc(doc(uninvited, "users", "new-uid"), profile("new-uid", "new@example.com", "viewer", "pending")));
  await assertFails(setDoc(doc(uninvited, "users", "new-uid-2"), profile("new-uid-2", "new@example.com", "editor")));

  console.log("Office RBAC rule tests passed: public, owner, admin, editor, researcher, teammate, viewer, pending, suspended, and invitation boundaries verified.");
} finally {
  await testEnv.cleanup();
}
