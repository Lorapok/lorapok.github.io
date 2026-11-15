import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import '../../styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="lp-shell min-h-screen text-gray-200 flex flex-col font-sans">
      <a href="#main" className="lp-skip">Skip to content</a>
      <ScrollProgress />
      <Navbar />
      <main id="main" style={{ minHeight: '100vh', paddingTop: '64px' }} className="flex-grow flex flex-col relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
