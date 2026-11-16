import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import type { GitHubProjectInventory, OfficeProject } from "../types/officeProjects";

const COLLECTION = "office_projects";
const PUBLIC_COLLECTION = "published_projects";

function sanitizeProject(input: Partial<OfficeProject> & Pick<OfficeProject, "id">): Partial<OfficeProject> & Pick<OfficeProject, "id"> {
  return {
    ...input,
    id: input.id,
    topics: Array.isArray(input.topics) ? input.topics.filter(Boolean).slice(0, 20) : [],
    visibility: input.visibility || "published",
    featured: Boolean(input.featured),
    projectModel: input.projectModel || "unclassified",
    stage: input.stage || (input.archived ? "archived" : "active"),
    origin: input.origin || (input.source === "github" ? "github" : "office"),
  };
}

function mergeProjects(base: OfficeProject[], overrides: Array<Partial<OfficeProject> & Pick<OfficeProject, "id">>) {
  const map = new Map(base.map((project) => [project.id, project]));
  for (const override of overrides) {
    const current = map.get(override.id);
    if (current) map.set(override.id, { ...current, ...override } as OfficeProject);
    else if (override.name && (override.url || override.origin === "local")) map.set(override.id, override as OfficeProject);
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
    if (a.archived !== b.archived) return Number(a.archived) - Number(b.archived);
    return new Date(b.pushedAt || b.updatedAt || 0).getTime() - new Date(a.pushedAt || a.updatedAt || 0).getTime();
  });
}

export async function loadGitHubProjectInventory(): Promise<GitHubProjectInventory> {
  const response = await fetch("/data/github-projects.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Project inventory request failed (${response.status})`);
  return response.json() as Promise<GitHubProjectInventory>;
}

export async function loadOfficeProjects(): Promise<OfficeProject[]> {
  const inventory = await loadGitHubProjectInventory();
  if (!isFirebaseConfigured) return inventory.projects;
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const overrides = snapshot.docs.map((entry) => sanitizeProject({ ...entry.data(), id: entry.id }));
    return mergeProjects(inventory.projects, overrides);
  } catch {
    return inventory.projects;
  }
}

export function subscribeOfficeProjects(
  onProjects: (projects: OfficeProject[], inventory: GitHubProjectInventory) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let unsubscribe: Unsubscribe = () => undefined;
  let disposed = false;

  loadGitHubProjectInventory()
    .then((inventory) => {
      if (disposed) return;
      onProjects(inventory.projects, inventory);
      if (!isFirebaseConfigured) return;
      unsubscribe = onSnapshot(
        collection(db, COLLECTION),
        (snapshot) => {
          const overrides = snapshot.docs.map((entry) => sanitizeProject({ ...entry.data(), id: entry.id }));
          onProjects(mergeProjects(inventory.projects, overrides), inventory);
        },
        (error) => onError?.(error),
      );
    })
    .catch((error: Error) => onError?.(error));

  return () => {
    disposed = true;
    unsubscribe();
  };
}

export function subscribePublishedOfficeProjects(
  onProjects: (projects: OfficeProject[], inventory: GitHubProjectInventory) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  let unsubscribe: Unsubscribe = () => undefined;
  let disposed = false;

  loadGitHubProjectInventory()
    .then((inventory) => {
      if (disposed) return;
      const publishedBase = inventory.projects.filter((project) => project.visibility === "published");
      onProjects(publishedBase, inventory);
      if (!isFirebaseConfigured) return;
      unsubscribe = onSnapshot(
        collection(db, PUBLIC_COLLECTION),
        (snapshot) => {
          const overrides = snapshot.docs.map((entry) => sanitizeProject({ ...entry.data(), id: entry.id }));
          onProjects(mergeProjects(publishedBase, overrides).filter((project) => project.visibility === "published"), inventory);
        },
        (error) => onError?.(error),
      );
    })
    .catch((error: Error) => onError?.(error));

  return () => {
    disposed = true;
    unsubscribe();
  };
}

async function syncPublicProjection(project: OfficeProject) {
  const reference = doc(db, PUBLIC_COLLECTION, project.id);
  if (project.visibility !== "published") {
    await deleteDoc(reference);
    return;
  }
  await setDoc(reference, sanitizeProject(project));
}

export async function saveOfficeProject(project: OfficeProject, updatedBy: string) {
  const record = sanitizeProject(project);
  await setDoc(doc(db, COLLECTION, project.id), {
    ...record,
    updatedBy,
    officeUpdatedAt: serverTimestamp(),
  }, { merge: true });
  await syncPublicProjection(project);
}

export async function createOfficeProject(project: OfficeProject, updatedBy: string) {
  await setDoc(doc(db, COLLECTION, project.id), {
    ...sanitizeProject(project),
    createdBy: updatedBy,
    officeCreatedAt: serverTimestamp(),
    officeUpdatedAt: serverTimestamp(),
  });
  await syncPublicProjection(project);
}
