import React from 'react';
import { motion } from 'framer-motion';

import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import AIChatbot from '../../components/common/AIChatbot';

interface MainLayoutProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentView,
  setCurrentView,
  setMarketplaceTab,
  children
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brandLight-slate transition-colors duration-500">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="ambient-glow-primary top-[-20%] left-[-10%] animate-pulse-slow"
        />
        <motion.div
          animate={{ x: [0, -30, 40, 0], y: [0, 30, -50, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="ambient-glow-secondary bottom-[-20%] right-[-10%] animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="ambient-glow-accent top-[40%] left-[60%] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>
      <div className="relative z-50">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          setMarketplaceTab={setMarketplaceTab}
        />
      </div>
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <div className="relative z-50">
        <AIChatbot />
      </div>
    </div>
  );
};
