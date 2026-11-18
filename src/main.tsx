import { StrictMode, lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/animations.css";
import "./styles/components.css";
import "./index.css";

// Eagerly loaded
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import { routeLoaders } from "./lib/routePreload";

// Lazy-loaded pages for code splitting
const ProjectsPage = lazy(routeLoaders['/projects']);
const EngineeringCraftPage = lazy(routeLoaders['/engineering-craft']);
const CreatorWorksPage = lazy(routeLoaders['/creator-works']);
const AgentsPage = lazy(routeLoaders['/agents']);
const MascotGalleryPage = lazy(routeLoaders['/mascots']);
const PartnersPage = lazy(routeLoaders['/partners']);
const TeamPage = lazy(routeLoaders['/team']);
const AboutPage = lazy(routeLoaders['/about']);
const ChangelogPage = lazy(routeLoaders['/changelog']);
const ContactPage = lazy(routeLoaders['/contact']);
const PrivacyPage = lazy(routeLoaders['/privacy']);
const TermsPage = lazy(routeLoaders['/terms']);
const SecurityPage = lazy(routeLoaders['/security']);
const BlogApp = lazy(routeLoaders['/blog']);
const DevModePortal = lazy(routeLoaders['/dev']);

// Legacy App fallback
const LegacyApp = lazy(() => import("./App"));

function LoadingFallback() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 6500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span className="route-loader__orbit" aria-hidden="true"><i /><img src="/assets/ribo/inner-pages/ecosystem-cartographer.webp" alt="" /></span>
      <span>Growing the next view</span>
      {slow && <div className="route-loader__recovery">
        <small>{navigator.onLine ? 'This view is taking longer than expected.' : 'Your device appears to be offline.'}</small>
        <button type="button" onClick={() => window.location.reload()}>Retry this page</button>
      </div>}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* v2.0 Routes with new Layout */}
          <Route element={<Layout><HomePage /></Layout>} path="/" />
          <Route element={<Layout><ProjectsPage /></Layout>} path="/projects" />
          <Route element={<Layout><EngineeringCraftPage /></Layout>} path="/engineering-craft" />
          <Route element={<Layout><CreatorWorksPage /></Layout>} path="/creator-works" />
          <Route element={<Layout><AgentsPage /></Layout>} path="/agents" />
          <Route element={<Layout><MascotGalleryPage /></Layout>} path="/mascots" />
          <Route element={<Layout><PartnersPage /></Layout>} path="/partners" />
          <Route element={<Layout><BlogApp /></Layout>} path="/blog" />
          <Route element={<Layout><BlogApp /></Layout>} path="/blog/:slug" />
          <Route element={<Layout><TeamPage /></Layout>} path="/team" />
          <Route element={<Layout><AboutPage /></Layout>} path="/about" />
          <Route element={<Layout><ChangelogPage /></Layout>} path="/changelog" />
          <Route element={<Navigate to="/" replace />} path="/support" />
          <Route element={<Layout><ContactPage /></Layout>} path="/contact" />
          <Route element={<Layout><PrivacyPage /></Layout>} path="/privacy" />
          <Route element={<Layout><TermsPage /></Layout>} path="/terms" />
          <Route element={<Layout><SecurityPage /></Layout>} path="/security" />

          {/* Dev Mode (authenticated, no public layout) */}
          <Route
            element={
              <DevModePortal
                onClose={() => {
                  window.location.href = "/";
                }}
              />
            }
            path="/dev"
          />

          {/* Fallback to legacy app for unmatched routes */}
          <Route element={<LegacyApp />} path="/*" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
