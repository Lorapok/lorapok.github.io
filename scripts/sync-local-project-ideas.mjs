#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const requireFromAgent = createRequire(path.resolve("agent/package.json"));
const admin = requireFromAgent("firebase-admin");

const ROOT = path.resolve(process.env.PERSONAL_PROJECTS_ROOT || "/mnt/NewVolume/Personal_Projects");
const SERVICE_ACCOUNT_PATH = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "agent/.credentials/lorapok-labs-sa.json");
const EXCLUDED = new Set([
  ".loragent", ".wrangler", "archive", "backup keys or credentials", "claude", "cred",
  "Firefox Backup", "frqGhost Resources", "Informations", "JFK 2", "LoraHost-backups",
  "Lorapok Assets", "Lorapok Labs Asset", "Network Share", "node_modules", "Shohoz", "dulal_work",
  ...String(process.env.LOCAL_PROJECT_EXCLUDE || "").split(",").map((item) => item.trim()).filter(Boolean),
]);
const IGNORED_CHILDREN = new Set([".git", "node_modules", "vendor", "dist", "build", ".next", ".cache", ".venv", "venv"]);

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
}

function isGitProject(directory) {
  try {
    execFileSync("git", ["-C", directory, "rev-parse", "--show-toplevel"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function findFiles(directory, names, depth = 2) {
  const found = [];
  const visit = (current, level) => {
    if (level > depth) return;
    let entries = [];
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (entry.name.startsWith(".") || IGNORED_CHILDREN.has(entry.name)) continue;
      const target = path.join(current, entry.name);
      if (entry.isFile() && names.has(entry.name)) found.push(target);
      else if (entry.isDirectory()) visit(target, level + 1);
    }
  };
  visit(directory, 0);
  return found;
}

function readPackage(directory) {
  for (const file of findFiles(directory, new Set(["package.json"]), 2)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      if (data.name || data.description) return data;
    } catch { /* Ignore malformed local manifests. */ }
  }
  return {};
}

function readReadme(directory) {
  const file = findFiles(directory, new Set(["README.md", "readme.md", "README.txt"]), 2)[0];
  if (!file) return {};
  try {
    const content = fs.readFileSync(file, "utf8").slice(0, 12000);
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.replace(/[*_`]/g, "").trim();
    const paragraphs = content.split(/\n\s*\n/).map((item) => item.replace(/[#>*_`\[\]]/g, " ").replace(/\s+/g, " ").trim());
    const description = paragraphs.find((item) => item.length >= 35 && !item.startsWith("!") && !/^(install|usage|license|table of contents)/i.test(item));
    return { heading, description };
  } catch {
    return {};
  }
}

function inferCategory(text) {
  const value = text.toLowerCase();
  if (/agent|\bai\b|llm|gemini|openai|automation/.test(value)) return "AI";
  if (/android|flutter|mobile|wearable/.test(value)) return "Mobile Apps";
  if (/firefox|chrome|extension|browser/.test(value)) return "Browser Extensions";
  if (/video|audio|media|subtitle|player|music/.test(value)) return "Media";
  if (/keyboard|bangla|bengali|language|input/.test(value)) return "Language/Input";
  if (/laravel|php|composer|erp|inventory|restaurant|shop/.test(value)) return "Laravel/PHP";
  if (/linux|desktop|electron|ubuntu|tray/.test(value)) return "Desktop/Linux";
  if (/game|score|utility|cleaner|time healer/.test(value)) return "Games/Utilities";
  if (/wifi|sensor|hardware|nfc|iot|frequency|csi/.test(value)) return "Sensory & Hardware";
  if (/3d|storybook|blender|experience/.test(value)) return "3D Art & Design";
  return "Developer Tools";
}

function inferLanguage(directory, packageData) {
  if (packageData.dependencies || packageData.devDependencies) return "JavaScript / TypeScript";
  const markers = new Set(findFiles(directory, new Set(["composer.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod", "pubspec.yaml"]), 2).map((file) => path.basename(file)));
  if (markers.has("composer.json")) return "PHP / Laravel";
  if (markers.has("pyproject.toml") || markers.has("requirements.txt")) return "Python";
  if (markers.has("Cargo.toml")) return "Rust";
  if (markers.has("go.mod")) return "Go";
  if (markers.has("pubspec.yaml")) return "Flutter / Dart";
  return "Concept / Mixed stack";
}

function discoverProjects() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && !EXCLUDED.has(entry.name))
    .map((entry) => ({ entry, directory: path.join(ROOT, entry.name) }))
    .filter(({ directory }) => !isGitProject(directory))
    .map(({ entry, directory }) => {
      const packageData = readPackage(directory);
      const readme = readReadme(directory);
      const displayName = readme.heading || packageData.productName || packageData.name || entry.name;
      const description = String(packageData.description || readme.description || `Local Lorapok project idea discovered in ${entry.name}.`).slice(0, 500);
      const language = inferLanguage(directory, packageData);
      const id = `local-${slug(entry.name)}`;
      return {
        id,
        owner: "Lorapok Local Lab",
        name: slug(packageData.name || entry.name),
        fullName: `Local/${entry.name}`,
        displayName,
        description,
        summary: description,
        url: "",
        homepage: "",
        language,
        topics: ["local-project", "project-idea"],
        stars: 0,
        forks: 0,
        archived: false,
        fork: false,
        visibility: "draft",
        category: inferCategory(`${entry.name} ${displayName} ${description} ${language}`),
        featured: false,
        defaultBranch: "",
        source: "office",
        origin: "local",
        localFolder: entry.name,
        projectModel: "unclassified",
        stage: "idea",
        badge: "Local idea",
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  throw new Error("Firebase service account is unavailable. Use the secure local credential path; never place credentials in the repository.");
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const projects = discoverProjects();
let created = 0;
let refreshed = 0;

for (const project of projects) {
  const reference = db.collection("office_projects").doc(project.id);
  const existing = await reference.get();
  if (existing.exists) {
    await reference.set({ localScannedAt: admin.firestore.FieldValue.serverTimestamp(), localFolder: project.localFolder, origin: "local" }, { merge: true });
    await db.collection("published_projects").doc(project.id).delete();
    refreshed++;
    continue;
  }
  await reference.set({
    ...project,
    createdBy: "local-project-scanner",
    officeCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
    officeUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    localScannedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  // Local concepts remain entirely inside the authenticated Office until an admin publishes them.
  await db.collection("published_projects").doc(project.id).delete();
  created++;
}

console.log(`Local Project Office sync complete: ${projects.length} ideas scanned, ${created} created, ${refreshed} refreshed.`);
