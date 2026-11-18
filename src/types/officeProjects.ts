import type { ProjectCategory } from "../data/lorapok";

export type ProjectVisibility = "published" | "draft" | "hidden";
export type ProjectModel = "unclassified" | "open-source" | "commercial";
export type ProjectStage = "idea" | "prototype" | "active" | "paused" | "archived";
export type ProjectOrigin = "github" | "local" | "office";

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
  image?: string;
  imageType?: "cover" | "icon";
  projectModel?: ProjectModel;
  stage?: ProjectStage;
  origin?: ProjectOrigin;
  localFolder?: string;
}

export interface GitHubProjectInventory {
  generatedAt: string;
  owners: string[];
  publicRepositoryCount: number;
  projects: OfficeProject[];
}
