import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            className="route-page-shell"
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {!reduceMotion && <motion.div
          key={`route-curtain:${pathname}`}
          className="route-transition-curtain"
          aria-hidden="true"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1], delay: 0.03 }}
        >
          <div className="route-transition-curtain__signal"><span /><img src="/assets/ribo/inner-pages/ecosystem-cartographer.webp" alt="" /><span /></div>
          <small>Lorapok Labs · opening {pathname === '/' ? 'home' : pathname.slice(1).replaceAll('-', ' ')}</small>
        </motion.div>}
      </main>
      <Footer />
    </div>
  );
}
