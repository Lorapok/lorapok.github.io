export type OfficeRole = "owner" | "admin" | "editor" | "researcher" | "teammate" | "viewer";
export type OfficeAccessStatus = "pending" | "active" | "suspended";

export type OfficePermission =
  | "view_office"
  | "manage_projects"
  | "manage_content"
  | "manage_team"
  | "manage_offers"
  | "manage_feedback"
  | "collaborate"
  | "use_ai"
  | "view_analytics"
  | "manage_users"
  | "manage_lolabo"
  | "manage_blog"
  | "use_developer_tools";

export interface OfficeRoleDefinition {
  label: string;
  description: string;
  permissions: readonly OfficePermission[];
}

const ALL_PERMISSIONS: readonly OfficePermission[] = [
  "view_office", "manage_projects", "manage_content", "manage_team", "manage_offers",
  "manage_feedback", "collaborate", "use_ai", "view_analytics", "manage_users",
  "manage_lolabo", "manage_blog", "use_developer_tools",
];

export const OFFICE_ROLES: Record<OfficeRole, OfficeRoleDefinition> = {
  owner: {
    label: "Owner",
    description: "Protected workspace owner with every permission, including role administration.",
    permissions: ALL_PERMISSIONS,
  },
  admin: {
    label: "Administrator",
    description: "Runs Office operations and manages non-administrator teammates.",
    permissions: ALL_PERMISSIONS,
  },
  editor: {
    label: "Editor",
    description: "Manages projects, publishing, team profiles, offers, feedback, and creative tools.",
    permissions: [
      "view_office", "manage_projects", "manage_content", "manage_team", "manage_offers",
      "manage_feedback", "collaborate", "manage_blog", "use_developer_tools",
    ],
  },
  researcher: {
    label: "Researcher",
    description: "Operates LoLaBo, the AI laboratory, research publishing, and analytics.",
    permissions: ["view_office", "use_ai", "view_analytics", "manage_lolabo", "manage_blog", "use_developer_tools"],
  },
  teammate: {
    label: "Teammate",
    description: "Uses collaboration, team, content-drafting, and brand workspace tools.",
    permissions: ["view_office", "manage_content", "manage_team", "manage_feedback", "collaborate"],
  },
  viewer: {
    label: "Viewer",
    description: "Read-only Office access to the dashboard and personal profile.",
    permissions: ["view_office"],
  },
};

export const BOOTSTRAP_OWNER_EMAILS = [
  "imaizied@gmail.com",
  "mdshuvo40@gmail.com",
  "lorapokdev@gmail.com",
] as const;

export function isOfficeRole(value: unknown): value is OfficeRole {
  return typeof value === "string" && value in OFFICE_ROLES;
}

export function normalizeOfficeRole(value: unknown): OfficeRole {
  if (isOfficeRole(value)) return value;
  return value === "user" ? "viewer" : "viewer";
}

export function hasOfficePermission(role: OfficeRole, permission: OfficePermission): boolean {
  return OFFICE_ROLES[role].permissions.includes(permission);
}

export const PANEL_PERMISSIONS: Record<string, OfficePermission> = {
  dashboard: "view_office",
  profile: "view_office",
  projects: "manage_projects",
  partners: "manage_offers",
  content: "manage_content",
  "team-studio": "manage_team",
  offers: "manage_offers",
  feedback: "manage_feedback",
  mail: "collaborate",
  chat: "collaborate",
  meetings: "collaborate",
  tasks: "collaborate",
  social: "manage_content",
  brand: "collaborate",
  "ai-labs": "use_ai",
  prompts: "use_ai",
  playground: "use_ai",
  compare: "use_ai",
  analytics: "view_analytics",
  admin: "manage_users",
  lolabo: "manage_lolabo",
  blog: "manage_blog",
  readme: "use_developer_tools",
  commits: "use_developer_tools",
};
