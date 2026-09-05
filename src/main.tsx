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
const TeamPage = lazy(() => import("./pages/TeamPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DevModePortal = lazy(() => import("./dev/DevModePortal"));

// Legacy App fallback
const LegacyApp = lazy(() => import("./App"));

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--lp-font-mono)",
        fontSize: "0.875rem",
        letterSpacing: "0.1em",
      }}
    >
      LOADING...
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
          <Route element={<Layout><TeamPage /></Layout>} path="/team" />
          <Route element={<Layout><AboutPage /></Layout>} path="/about" />
          <Route element={<Layout><ChangelogPage /></Layout>} path="/changelog" />
          <Route element={<Navigate to="/" replace />} path="/support" />
          <Route element={<Layout><ContactPage /></Layout>} path="/contact" />

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
