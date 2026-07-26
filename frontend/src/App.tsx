import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import LandingPage from './views/LandingPage';
import AIEstimator from './views/AIEstimator';
import ARVisualizer from './views/ARVisualizer';
import Marketplace from './views/Marketplace';
import DashboardClient from './views/DashboardClient';
import DashboardProfessional from './views/DashboardProfessional';
import DashboardAdmin from './views/DashboardAdmin';

function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [role, setRole] = useState<'client' | 'pro' | 'admin'>('client');

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Simple Router Switcher
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage setCurrentView={setCurrentView} />;
      case 'estimator':
        return <AIEstimator />;
      case 'ar':
        return <ARVisualizer />;
      case 'marketplace':
        return <Marketplace />;
      case 'dashboard-client':
        return <DashboardClient />;
      case 'dashboard-pro':
        return <DashboardProfessional />;
      case 'dashboard-admin':
        return <DashboardAdmin />;
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Decorative Mesh Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brandLight-slate transition-colors duration-300">
        {/* Ambient Top Glow Grid */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/5 filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 filter blur-[100px] pointer-events-none"></div>
      </div>

      {/* Global Navbar */}
      <div className="relative z-50">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          role={role}
          setRole={setRole}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        {renderActiveView()}
      </main>

      {/* Global Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Floating AI Chat Assistant */}
      <div className="relative z-50">
        <AIChatbot />
      </div>
    </div>
  );
}

export default App;
