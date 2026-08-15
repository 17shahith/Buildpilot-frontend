import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import LandingPage from './features/LandingPage';
import AIEstimator from './features/AIEstimator';
import ARVisualizer from './features/ARVisualizer';
import AIInteriorStudio from './features/AIInteriorStudio';
import Marketplace from './features/Marketplace';
import DashboardClient from './features/DashboardClient';
import DashboardProfessional from './features/DashboardProfessional';
import DashboardAdmin from './features/DashboardAdmin';
import HomeCare from './features/HomeCare';
import { SecurePortalVerification } from './components/auth/SecurePortalVerification';
import { useAuth } from './auth/AuthProvider';
import { Info, LogOut } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [role, setRole] = useState<'client' | 'pro' | 'admin'>('client');
  const [marketplaceTab, setMarketplaceTab] = useState<'pros' | 'properties'>('pros');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');
  const [marketplaceRole, setMarketplaceRole] = useState<string>('');

  const { supabaseUser, isPortalVerified, portalRole, isLoading, signInWithGoogle, signOut } = useAuth();

  // Listen to hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/professional/login' || hash === '#/professional/dashboard') {
        setCurrentView('dashboard-pro');
        setRole('pro');
      } else if (hash === '#/admin/login' || hash === '#/admin/dashboard') {
        setCurrentView('dashboard-admin');
        setRole('admin');
      } else if (hash === '#/client/dashboard') {
        setCurrentView('dashboard-client');
        setRole('client');
      } else if (hash === '#/homecare') {
        setCurrentView('homecare');
      } else if (hash === '#/estimator') {
        setCurrentView('estimator');
      } else if (hash === '#/ar') {
        setCurrentView('ar');
      } else if (hash === '#/studio') {
        setCurrentView('studio');
      } else if (hash === '#/marketplace') {
        setCurrentView('marketplace');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    setRole('client');
    window.location.hash = '#/';
  };

  // Google Login Component for unauthenticated users trying to access dashboard
  const GoogleLoginPrompt = ({ requiredRole }: { requiredRole: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm w-full">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-500 mb-6">
          Please sign in with Google to access the {requiredRole} portal.
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center w-full px-4 py-3 space-x-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 font-bold text-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );

  const renderDashboardWrapper = (dashboard: React.ReactNode, requiredRole: 'client' | 'pro' | 'admin') => {
    if (isLoading) {
      return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
    }

    // Tier 1: Check Supabase Auth
    if (!supabaseUser) {
      return <GoogleLoginPrompt requiredRole={requiredRole} />;
    }

    // Tier 2: Check Portal Authorization (Only for Pro and Admin, skipping for client if you want, but prompt implies all portals)
    // The prompt says "Secure Portal Verification screen must become the first protected module shown after a user successfully authenticates"
    if (!isPortalVerified || portalRole !== requiredRole) {
      return <SecurePortalVerification requiredRole={requiredRole} />;
    }

    // Successfully passed both tiers
    return (
      <div className="space-y-4">
        <div className="bg-[#FFF7ED] border-b border-[#FED7AA] py-3.5 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-2xl mt-4 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#EA580C]">
            <Info className="w-4 h-4" />
            <span>Logged in as: {supabaseUser.user_metadata?.full_name || supabaseUser.email} ({portalRole})</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white rounded-lg text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
        {dashboard}
      </div>
    );
  };

  // Simple Router Switcher
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            setCurrentView={setCurrentView}
            setMarketplaceTab={setMarketplaceTab}
            setMarketplaceSearch={setMarketplaceSearch}
            setMarketplaceRole={setMarketplaceRole}
          />
        );
      case 'estimator': return <AIEstimator />;
      case 'ar': return <ARVisualizer />;
      case 'studio': return <AIInteriorStudio />;
      case 'marketplace':
        return (
          <Marketplace
            tab={marketplaceTab}
            setTab={setMarketplaceTab}
            search={marketplaceSearch}
            setSearch={setMarketplaceSearch}
            filterRole={marketplaceRole}
            setFilterRole={setMarketplaceRole}
          />
        );
      case 'homecare': return <HomeCare />;
      case 'dashboard-client':
        return renderDashboardWrapper(<DashboardClient />, 'client');
      case 'dashboard-pro':
        return renderDashboardWrapper(<DashboardProfessional />, 'pro');
      case 'dashboard-admin':
        return renderDashboardWrapper(<DashboardAdmin />, 'admin');
      default:
        return (
          <LandingPage
            setCurrentView={setCurrentView}
            setMarketplaceTab={setMarketplaceTab}
            setMarketplaceSearch={setMarketplaceSearch}
            setMarketplaceRole={setMarketplaceRole}
          />
        );
    }
  };

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
          role={role}
          setRole={setRole}
          setMarketplaceTab={setMarketplaceTab}
        />
      </div>
      <main className="flex-grow relative z-10">
        {renderActiveView()}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <div className="relative z-50">
        <AIChatbot />
      </div>
    </div>
  );
}

export default App;
