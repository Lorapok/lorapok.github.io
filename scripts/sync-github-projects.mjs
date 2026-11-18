#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OWNERS = ["Lorapok", "Maijied"];
const OUTPUT = path.resolve("public/data/github-projects.json");
const PROJECT_VISUALS = {
  "lorapok/lorapok.github.io": "/assets/projects/generated/lorapok-labs-website-product-v2.webp",
  "lorapok/lorapok-instar": "/assets/projects/generated/lorapok-instar-product-v2.webp",
  "lorapok/nocatch": "/assets/projects/generated/nocatch-product-v2.webp",
  "maijied/bnp": "/assets/projects/generated/bnp-product-v2.webp",
  "lorapok/loragi": "/assets/projects/generated/loragi-product-v2.webp",
  "maijied/cursor-curse-monitor-by-lorapok": "/assets/projects/generated/cursor-curse-monitor-product-v2.webp",
};
const FIELDS = [
  "name",
  "nameWithOwner",
  "description",
  "url",
  "homepageUrl",
  "primaryLanguage",
  "repositoryTopics",
  "stargazerCount",
  "forkCount",
  "isArchived",
  "isFork",
  "isPrivate",
  "visibility",
  "defaultBranchRef",
  "createdAt",
  "updatedAt",
  "pushedAt",
].join(",");

function inferCategory(repo) {
  const haystack = [
    repo.name,
    repo.description,
    ...(repo.repositoryTopics || []).map((topic) => topic.name),
    repo.primaryLanguage?.name,
  ].filter(Boolean).join(" ").toLowerCase();

  if (/agent|\bai\b|llm|machine learning|gemini|openai/.test(haystack)) return "AI";
  if (/android|kotlin|flutter|mobile/.test(haystack)) return "Mobile Apps";
  if (/firefox|chrome|extension|browser/.test(haystack)) return "Browser Extensions";
  if (/media|video|audio|player|subtitle/.test(haystack)) return "Media";
  if (/keyboard|bangla|bengali|language|input/.test(haystack)) return "Language/Input";
  if (/laravel|php|composer/.test(haystack)) return "Laravel/PHP";
  if (/linux|desktop|electron|gtk|qt/.test(haystack)) return "Desktop/Linux";
  if (/game|utility|toolbox/.test(haystack)) return "Games/Utilities";
  if (/wifi|sensor|hardware|csi|rssi|iot/.test(haystack)) return "Sensory & Hardware";
  return "Developer Tools";
}

function readOwner(owner) {
  const raw = execFileSync(
    "gh",
    ["repo", "list", owner, "--limit", "200", "--json", FIELDS],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  return JSON.parse(raw);
}

const deduped = new Map();
for (const owner of OWNERS) {
  for (const repo of readOwner(owner)) {
    // The public artifact must never disclose private repository metadata.
    if (repo.isPrivate || String(repo.visibility).toUpperCase() !== "PUBLIC") continue;
    const key = repo.nameWithOwner.toLowerCase();
    const image = PROJECT_VISUALS[key];
    deduped.set(key, {
      id: key.replace(/[^a-z0-9]+/g, "-"),
      owner: repo.nameWithOwner.split("/")[0],
      name: repo.name,
      fullName: repo.nameWithOwner,
      description: repo.description || "Public Lorapok repository.",
      url: repo.url,
      homepage: repo.homepageUrl || "",
      language: repo.primaryLanguage?.name || "Other",
      languageColor: repo.primaryLanguage?.color || "#6b7280",
      topics: (repo.repositoryTopics || []).map((topic) => topic.name).sort(),
      stars: repo.stargazerCount || 0,
      forks: repo.forkCount || 0,
      archived: Boolean(repo.isArchived),
      fork: Boolean(repo.isFork),
      // Owned repositories publish by default. Forks and archived repositories
      // remain available in Project Office for review without diluting the public catalog.
      visibility: repo.isFork || repo.isArchived ? "draft" : "published",
      category: inferCategory(repo),
      featured: false,
      defaultBranch: repo.defaultBranchRef?.name || "main",
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      pushedAt: repo.pushedAt,
      source: "github",
      origin: "github",
      projectModel: "unclassified",
      stage: repo.isArchived ? "archived" : "active",
      ...(image ? { image, imageType: "cover" } : {}),
    });
  }
}

const projects = Array.from(deduped.values()).sort((a, b) => {
  if (a.archived !== b.archived) return Number(a.archived) - Number(b.archived);
  return new Date(b.pushedAt || 0).getTime() - new Date(a.pushedAt || 0).getTime();
});

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  owners: OWNERS,
  publicRepositoryCount: projects.length,
  projects,
}, null, 2)}\n`, "utf8");

console.log(`Synced ${projects.length} public GitHub repositories to ${OUTPUT}`);
