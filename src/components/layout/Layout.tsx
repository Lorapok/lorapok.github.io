import React, { useEffect, useState } from 'react';
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
  const [compactMotion, setCompactMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 760px), (pointer: coarse)').matches
      : false,
  );
  useV4Effects([pathname]);
  const isHome = pathname === '/';
  const cinematicMotion = !reduceMotion && !compactMotion;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px), (pointer: coarse)');
    const updateMotionMode = () => setCompactMotion(media.matches);

    updateMotionMode();
    media.addEventListener?.('change', updateMotionMode);
    return () => media.removeEventListener?.('change', updateMotionMode);
  }, []);

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
        <AnimatePresence mode={cinematicMotion ? 'wait' : 'sync'} initial={false}>
          <motion.div
            key={pathname}
            className="route-page-shell"
            initial={reduceMotion ? false : cinematicMotion ? { opacity: 0, y: 18, filter: 'blur(7px)' } : { opacity: 0.72 }}
            animate={cinematicMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : cinematicMotion ? { opacity: 0, y: -10, filter: 'blur(4px)' } : { opacity: 0.88 }}
            transition={{ duration: reduceMotion ? 0 : cinematicMotion ? 0.42 : 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {cinematicMotion && <motion.div
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
        {!reduceMotion && compactMotion && <motion.div
          key={`route-progress:${pathname}`}
          className="route-transition-progress"
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 0.72, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.72, 1], ease: 'easeOut' }}
        />}
      </main>
      <Footer />
    </div>
  );
}
