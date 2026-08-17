import React from 'react';

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
        <div className="ambient-glow-primary top-[-20%] left-[-10%] animate-pulse-slow"></div>
        <div className="ambient-glow-secondary bottom-[-20%] right-[-10%] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="ambient-glow-accent top-[40%] left-[60%] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
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
