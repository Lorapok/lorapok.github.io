type RouteModule = Promise<{ default: React.ComponentType<unknown> }>;

export const routeLoaders: Record<string, () => RouteModule> = {
  '/projects': () => import('../pages/ProjectsPage'),
  '/engineering-craft': () => import('../pages/EngineeringCraftPage'),
  '/creator-works': () => import('../pages/CreatorWorksPage'),
  '/agents': () => import('../pages/AgentsPage'),
  '/mascots': () => import('../pages/MascotGalleryPage'),
  '/partners': () => import('../pages/PartnersPage'),
  '/blog': () => import('../blog/BlogApp'),
  '/team': () => import('../pages/TeamPage'),
  '/about': () => import('../pages/AboutPage'),
  '/changelog': () => import('../pages/ChangelogPage'),
  '/contact': () => import('../pages/ContactPage'),
  '/privacy': () => import('../pages/PrivacyPage'),
  '/terms': () => import('../pages/TermsPage'),
  '/security': () => import('../pages/SecurityPage'),
  '/dev': () => import('../dev/DevModePortal'),
};

const requestedRoutes = new Set<string>();

export function normalizeRoutePath(path: string) {
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '');
  return normalized.startsWith('/blog/') ? '/blog' : normalized;
}

export function preloadRoute(path: string) {
  const normalized = normalizeRoutePath(path);
  const loader = routeLoaders[normalized];

  if (!loader || requestedRoutes.has(normalized)) return;
  requestedRoutes.add(normalized);
  void loader().catch(() => requestedRoutes.delete(normalized));
}
