import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/animations.css";
import "./styles/components.css";
import "./index.css";

// Eagerly loaded
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";

// Lazy-loaded pages for code splitting
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const EngineeringCraftPage = lazy(() => import("./pages/EngineeringCraftPage"));
const CreatorWorksPage = lazy(() => import("./pages/CreatorWorksPage"));
const AgentsPage = lazy(() => import("./pages/AgentsPage"));
const MascotGalleryPage = lazy(() => import("./pages/MascotGalleryPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const BlogApp = lazy(() => import("./blog/BlogApp"));
const DevModePortal = lazy(() => import("./dev/DevModePortal"));

// Legacy App fallback
const LegacyApp = lazy(() => import("./App"));

function LoadingFallback() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span className="route-loader__orbit" aria-hidden="true"><i /><img src="/assets/ribo/inner-pages/ecosystem-cartographer.webp" alt="" /></span>
      <span>Growing the next view</span>
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
