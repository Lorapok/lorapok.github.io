import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ExperienceControls from './ExperienceControls';
import LarvaePlanetSystem from './LarvaePlanetSystem';
import { useV4Effects } from '../v4/useV4Effects';
import '../../styles/v4.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  useV4Effects([pathname]);
  const isHome = pathname === '/';
  return (
    <div className="v4 min-h-screen flex flex-col">
      <a href="#main" className="skip">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <LarvaePlanetSystem />
      <Navbar />
      <ExperienceControls />
      <main id="main" className={`flex-grow flex flex-col relative${isHome ? '' : ' page-top'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
