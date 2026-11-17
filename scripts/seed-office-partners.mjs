#!/usr/bin/env node

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const requireFromAgent = createRequire(path.resolve("agent/package.json"));
const admin = requireFromAgent("firebase-admin");
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "agent/.credentials/lorapok-labs-sa.json");

if (!fs.existsSync(serviceAccountPath)) throw new Error("Firebase service account is unavailable at the protected local credential path.");

const records = [
  { id: "dynadot", name: "Dynadot", slug: "dynadot", tagline: "Domains for builders growing on the open web.", description: "Lorapok Labs participates in the Dynadot Ambassador Program and shares a verified referral benefit for new qualifying customers.", relationship: "approved-affiliate", status: "active", visibility: "published", websiteUrl: "https://www.dynadot.com/", offerUrl: "https://www.dynadot.com/?s7Lqjn7oK847e", offerLabel: "$5 account credit", offerDetail: "New referred customers are eligible for $5 in Dynadot account credit after creating an account and placing a qualifying first order of $9.99 or more. Provider review and current terms apply.", discountCode: "7Lqjn7oK847e", termsUrl: "https://www.dynadot.com/help/dynadot-programs/refer-a-friend", adminUrl: "https://www.dynadot.com/account/affiliate/", logoUrl: "", accent: "#67f5bb", featured: true, verifiedAt: "2026-11-17", sourceNote: "Verified from Dynadot Ambassador approval and referral-benefit emails.", sortOrder: 10 },
  { id: "hix-ai", name: "HIX.AI", slug: "hix-ai", tagline: "An AI workspace referenced through an approved affiliate account.", description: "Lorapok Labs was accepted into the HIX.AI Affiliate Program. No visitor discount is claimed unless HIX.AI publishes one through the linked page.", relationship: "approved-affiliate", status: "active", visibility: "published", websiteUrl: "https://hix.ai/", offerUrl: "https://hix.ai/?ref=yzqxzmq", offerLabel: "Affiliate access", offerDetail: "Open the provider's current offer page. Lorapok does not claim a coupon or guaranteed price reduction for this relationship.", discountCode: "", termsUrl: "", adminUrl: "", logoUrl: "", accent: "#c7b8ff", featured: false, verifiedAt: "2026-11-17", sourceNote: "Verified from the HIX.AI affiliate acceptance email; coupon promotion is not claimed.", sortOrder: 20 },
  { id: "higgsfield", name: "Higgsfield", slug: "higgsfield", tagline: "A third-party creative AI reference used by the studio.", description: "This is an affiliate reference, not a claim of a formal Lorapok partnership. The provider controls products, pricing, availability, and terms.", relationship: "affiliate-reference", status: "active", visibility: "published", websiteUrl: "https://higgsfield.ai/", offerUrl: "https://higgsfield.ai?fpr=lorapoklabs", offerLabel: "Lorapok referral access", offerDetail: "Use Lorapok's tracked Higgsfield reference link or referral code. Higgsfield controls eligibility, credits, pricing, and current terms; no guaranteed customer discount is claimed.", discountCode: "lorapoklabs", termsUrl: "", adminUrl: "", logoUrl: "", accent: "#ffdf70", featured: false, verifiedAt: "2026-11-18", sourceNote: "Tracked referral parameter and code are lorapoklabs. No formal partner approval or visitor discount was verified.", sortOrder: 30 },
  { id: "airtm", name: "Airtm", slug: "airtm", tagline: "A digital-dollar account reference for globally connected builders.", description: "This is a user-provided invitation reference, not a claim of a formal Lorapok partnership. Airtm controls account eligibility, regional availability, fees, rewards, and terms.", relationship: "affiliate-reference", status: "active", visibility: "published", websiteUrl: "https://www.airtm.com/", offerUrl: "https://app.airtm.com/ivt/new7qpzo8gu", offerLabel: "Invitation access", offerDetail: "Open Airtm through Lorapok's invitation link. No fixed bonus, discount, or guaranteed reward is claimed; check the provider's current onboarding terms before registering.", discountCode: "new7qpzo8gu", termsUrl: "https://www.airtm.com/terms-and-conditions/", adminUrl: "https://app.airtm.com/", logoUrl: "", accent: "#58c9ff", featured: false, verifiedAt: "2026-11-18", sourceNote: "Invitation URL supplied directly by the Lorapok owner on 2026-11-18; no specific visitor reward was claimed.", sortOrder: 35 },
  { id: "rezi", name: "Rezi", slug: "rezi", tagline: "Resume platform relationship preserved for reactivation review.", description: "The program is currently deactivated, so referral links and rewards are not promoted publicly.", relationship: "approved-affiliate", status: "paused", visibility: "draft", websiteUrl: "https://www.rezi.ai/", offerUrl: "", offerLabel: "Program paused", offerDetail: "Do not publish until the provider reactivates the program and current terms are verified.", discountCode: "", termsUrl: "https://www.rezi.ai/legal", adminUrl: "https://partners.dub.co/programs/rezi", logoUrl: "", accent: "#80e6ce", featured: false, verifiedAt: "2026-11-17", sourceNote: "Dub dashboard and provider email both confirm the Rezi program is deactivated.", sortOrder: 40 },
  { id: "rizon", name: "Rizon", slug: "rizon", tagline: "Partner-program lead awaiting a verified public link.", description: "The provider advertises a partner program, but Lorapok's unique link and visitor benefit still require verification.", relationship: "affiliate-reference", status: "pending", visibility: "draft", websiteUrl: "https://rizon.app/", offerUrl: "", offerLabel: "Verification needed", offerDetail: "Add the confirmed referral URL and exact visitor terms before publishing.", discountCode: "", termsUrl: "", adminUrl: "https://rizon.app/", logoUrl: "", accent: "#9fd8ff", featured: false, verifiedAt: "2026-11-17", sourceNote: "Program email found; unique Lorapok referral link was not included.", sortOrder: 50 },
  { id: "beyond-next-phase", name: "Beyond Next Phase", slug: "beyond-next-phase", tagline: "Student-bundle proposal under commercial review.", description: "A collaboration proposal was received for LoraHost and student bundles; commercial terms and tracking remain unconfirmed.", relationship: "strategic-partner", status: "pending", visibility: "draft", websiteUrl: "https://bnp.store/", offerUrl: "", offerLabel: "Proposal pending", offerDetail: "Keep private until both parties approve commercial terms and a measurable public benefit.", discountCode: "", termsUrl: "", adminUrl: "", logoUrl: "", accent: "#ffb86b", featured: false, verifiedAt: "2026-11-17", sourceNote: "Proposal and Lorapok follow-up were found; no accepted terms or launch confirmation was found.", sortOrder: 60 },
];

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

for (const record of records) {
  await db.collection("office_partners").doc(record.id).set({ ...record, updatedBy: "partner-registry-seed", officeUpdatedAt: timestamp }, { merge: true });
  const publicReference = db.collection("published_partners").doc(record.id);
  if (record.visibility === "published" && record.status === "active") {
    const { adminUrl: _adminUrl, sourceNote: _sourceNote, ...publicRecord } = record;
    await publicReference.set({ ...publicRecord, publishedAt: timestamp }, { merge: true });
  } else {
    await publicReference.delete();
  }
}

console.log(`Partner Office seed complete: ${records.length} records, ${records.filter((record) => record.visibility === "published" && record.status === "active").length} public.`);
