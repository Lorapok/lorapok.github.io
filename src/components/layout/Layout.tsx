import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 flex flex-col font-sans">
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }} className="flex-grow flex flex-col relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}
