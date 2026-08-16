import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
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
import { AuthPage } from './features/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Info, LogOut } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard-client');
  const [role, setRole] = useState<'client' | 'pro' | 'admin'>('client');
  const [marketplaceTab, setMarketplaceTab] = useState<'pros' | 'properties'>('pros');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');
  const [marketplaceRole, setMarketplaceRole] = useState<string>('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Sync role with currentView inside /main
  useEffect(() => {
    if (currentView === 'dashboard-client') setRole('client');
    else if (currentView === 'dashboard-pro') setRole('pro');
    else if (currentView === 'dashboard-admin') setRole('admin');
  }, [currentView]);

  // Sync route and currentView view-switcher
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentView('landing');
    } else if (path === '/auth') {
      setCurrentView('auth');
    } else if (path === '/main/client') {
      setCurrentView('dashboard-client');
      setRole('client');
    } else if (path === '/main/professional') {
      setCurrentView('dashboard-pro');
      setRole('pro');
    } else if (path === '/main/admin') {
      setCurrentView('dashboard-admin');
      setRole('admin');
    } else if (path.startsWith('/main/')) {
      const view = path.replace('/main/', '');
      setCurrentView(view);
    }
  }, [location.pathname]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setRole('client');
    navigate('/');
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
          setCurrentView={(view) => {
            if (view === 'landing') navigate('/');
            else if (view === 'auth') navigate('/auth');
            else if (view === 'dashboard-client') navigate('/main/client');
            else navigate(`/main/${view}`);
          }}
          role={role}
          setRole={setRole}
          setMarketplaceTab={setMarketplaceTab}
        />
      </div>
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={
            <LandingPage
              setCurrentView={(view) => {
                if (view === 'auth') {
                  navigate('/auth');
                } else if (user) {
                  if (view === 'dashboard-client') navigate('/main/client');
                  else navigate(`/main/${view}`);
                } else {
                  navigate('/auth');
                }
              }}
              setMarketplaceTab={setMarketplaceTab}
              setMarketplaceSearch={setMarketplaceSearch}
              setMarketplaceRole={setMarketplaceRole}
            />
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/main" element={
            <ProtectedRoute>
              <div className="space-y-4">
                <div className="bg-[#FFF7ED] border-b border-[#FED7AA] py-3.5 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-2xl mt-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#EA580C]">
                    <Info className="w-4 h-4" />
                    <span>Logged in as: {user?.displayName || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Dashboard Role Switcher Tabs */}
                {['dashboard-client', 'dashboard-pro', 'dashboard-admin'].includes(currentView) && (
                  <div className="max-w-7xl mx-auto px-6 mt-2">
                    <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-sm">
                      <button
                        onClick={() => navigate('/main/client')}
                        className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          location.pathname === '/main/client'
                            ? 'bg-white text-[#F97316] shadow-sm'
                            : 'text-gray-500 hover:text-slate-900'
                        }`}
                      >
                        Client Portal
                      </button>
                      <button
                        onClick={() => navigate('/main/professional')}
                        className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          location.pathname === '/main/professional'
                            ? 'bg-white text-[#F97316] shadow-sm'
                            : 'text-gray-500 hover:text-slate-900'
                        }`}
                      >
                        Professional Portal
                      </button>
                      <button
                        onClick={() => navigate('/main/admin')}
                        className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          location.pathname === '/main/admin'
                            ? 'bg-white text-[#F97316] shadow-sm'
                            : 'text-gray-500 hover:text-slate-900'
                        }`}
                      >
                        Admin Portal
                      </button>
                    </div>
                  </div>
                )}

                <Outlet />
              </div>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="client" replace />} />
            <Route path="client" element={<DashboardClient />} />
            <Route path="professional" element={<DashboardProfessional />} />
            <Route path="admin" element={<DashboardAdmin />} />
            <Route path="estimator" element={<AIEstimator />} />
            <Route path="ar" element={<ARVisualizer />} />
            <Route path="studio" element={<AIInteriorStudio />} />
            <Route path="marketplace" element={
              <Marketplace
                tab={marketplaceTab}
                setTab={setMarketplaceTab}
                search={marketplaceSearch}
                setSearch={setMarketplaceSearch}
                filterRole={marketplaceRole}
                setFilterRole={setMarketplaceRole}
              />
            } />
            <Route path="homecare" element={<HomeCare />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
