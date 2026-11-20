import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ExperienceControls from './ExperienceControls';
import { useV4Effects } from '../v4/useV4Effects';
import '../../styles/v4.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation();
  useV4Effects([pathname]);
  const isHome = pathname === '/';

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.getElementById('main')?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className="v4 min-h-screen flex flex-col">
      <a href="#main" className="skip">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <Navbar />
      <ExperienceControls />
      <main id="main" tabIndex={-1} className={`flex-grow flex flex-col relative${isHome ? '' : ' page-top'}`}>
        <div key={pathname} className="route-page-shell">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
