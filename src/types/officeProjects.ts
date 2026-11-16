import type { ProjectCategory } from "../data/lorapok";

export type ProjectVisibility = "published" | "draft" | "hidden";

export interface OfficeProject {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  displayName?: string;
  description: string;
  summary?: string;
  url: string;
  homepage: string;
  language: string;
  languageColor?: string;
  topics: string[];
  stars: number;
  forks: number;
  archived: boolean;
  fork: boolean;
  visibility: ProjectVisibility;
  category: ProjectCategory;
  featured: boolean;
  defaultBranch: string;
  createdAt?: string;
  updatedAt?: string;
  pushedAt?: string;
  source: "github" | "office";
  badge?: string;
}

export interface GitHubProjectInventory {
  generatedAt: string;
  owners: string[];
  publicRepositoryCount: number;
  projects: OfficeProject[];
}
