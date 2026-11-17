import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { defaultPartnerRecords, defaultPublishedPartners, toPublicPartner } from "../data/partners";
import type { PartnerRecord, PublicPartnerRecord } from "../types/partners";
import { db, isFirebaseConfigured } from "./firebase";

const OFFICE_COLLECTION = "office_partners";
const PUBLIC_COLLECTION = "published_partners";

function sortPartners<T extends { featured: boolean; sortOrder: number; name: string }>(records: T[]) {
  return [...records].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

function normalizePartner(input: PartnerRecord): PartnerRecord {
  return {
    ...input,
    id: input.id.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || `partner-${Date.now()}`,
    slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-") || input.id,
    name: input.name.trim(),
    status: input.status || "pending",
    visibility: input.visibility || "draft",
    relationship: input.relationship || "affiliate-reference",
    featured: Boolean(input.featured),
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 100,
  };
}

function mergePartnerRecords(base: PartnerRecord[], overrides: PartnerRecord[]) {
  const records = new Map(base.map((partner) => [partner.id, partner]));
  overrides.forEach((partner) => records.set(partner.id, normalizePartner(partner)));
  return sortPartners(Array.from(records.values()));
}

export function subscribeOfficePartners(onPartners: (partners: PartnerRecord[]) => void, onError?: (error: Error) => void): Unsubscribe {
  onPartners(sortPartners(defaultPartnerRecords));
  if (!isFirebaseConfigured) return () => undefined;
  return onSnapshot(collection(db, OFFICE_COLLECTION), (snapshot) => {
    const overrides = snapshot.docs.map((entry) => normalizePartner({ ...entry.data(), id: entry.id } as PartnerRecord));
    onPartners(mergePartnerRecords(defaultPartnerRecords, overrides));
  }, (error) => onError?.(error));
}

export function subscribePublishedPartners(onPartners: (partners: PublicPartnerRecord[]) => void, onError?: (error: Error) => void): Unsubscribe {
  onPartners(sortPartners(defaultPublishedPartners));
  if (!isFirebaseConfigured) return () => undefined;
  return onSnapshot(collection(db, PUBLIC_COLLECTION), (snapshot) => {
    const records = snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id } as PublicPartnerRecord));
    onPartners(sortPartners(records));
  }, (error) => onError?.(error));
}

export async function saveOfficePartner(partner: PartnerRecord, updatedBy: string) {
  const record = normalizePartner(partner);
  await setDoc(doc(db, OFFICE_COLLECTION, record.id), {
    ...record,
    updatedBy,
    officeUpdatedAt: serverTimestamp(),
  }, { merge: true });

  const publicReference = doc(db, PUBLIC_COLLECTION, record.id);
  if (record.visibility === "published" && record.status === "active") {
    await setDoc(publicReference, { ...toPublicPartner(record), publishedAt: serverTimestamp() });
  } else {
    await deleteDoc(publicReference);
  }
}
