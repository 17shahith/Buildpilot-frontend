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
import { Lock, User, Eye, EyeOff, Info, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from './utils/api';
import type { AuthenticatedUser } from './types/auth';

interface LoginGateProps {
  requiredRole: 'client' | 'pro' | 'admin';
  onLoginSuccess: (user: AuthenticatedUser) => void;
}

const LoginGate: React.FC<LoginGateProps> = ({ requiredRole, onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const response = await api.post('api/auth/login', {
        username: usernameInput.trim(),
        password: passwordInput,
      }, { retries: 1 });
      const user = response?.user ?? response;
      const backendRole = user?.role;
      const normalizedRole = backendRole === 'CLIENT' ? 'client' : backendRole === 'PROFESSIONAL' ? 'pro' : backendRole === 'ADMIN' ? 'admin' : backendRole;

      if (normalizedRole === requiredRole) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        if (response?.token) api.setAccessToken(response.token);
        user.role = normalizedRole;
        onLoginSuccess(user as AuthenticatedUser);
      } else {
        setLoginError('You are not authorized for this portal.');
      }
    } catch {
      setLoginError('Invalid credentials or unavailable authentication service.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-lg mx-auto">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight mt-3">
            Secure Portal Verification
          </h2>
          <p className="text-xs text-slate-500">
            Please authorize to unlock the {requiredRole === 'admin' ? 'Admin Panel' : 'Professional Dashboard'}
          </p>
        </div>

        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#EA580C] font-extrabold uppercase">
            <Info className="w-4 h-4" />
            <span>Secure Sign In Required</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Sign in with an account issued by the BuildPilot backend. Portal permissions are verified server-side.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
              {loginError}
            </div>
          )}

          <div className="space-y-1 text-xs">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter your username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center space-x-2"
          >
            {isLoginLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify and Access</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [role, setRole] = useState<'client' | 'pro' | 'admin'>('client');
  const [marketplaceTab, setMarketplaceTab] = useState<'pros' | 'properties'>('pros');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');
  const [marketplaceRole, setMarketplaceRole] = useState<string>('');

  // Authentication states for portals
  const [clientSession, setClientSession] = useState<AuthenticatedUser | null>(null);
  const [proSession, setProSession] = useState<AuthenticatedUser | null>(null);
  const [adminSession, setAdminSession] = useState<AuthenticatedUser | null>(null);

  // Listen to hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/professional/login' || hash === '#/professional/dashboard') {
        setCurrentView('dashboard-pro');
      } else if (hash === '#/admin/login' || hash === '#/admin/dashboard') {
        setCurrentView('dashboard-admin');
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

  // Restore a server-backed session after refresh. No credentials are stored
  // in localStorage or sessionStorage.
  useEffect(() => {
    let cancelled = false;
    api.get('api/auth/me', { retries: 1 })
      .then((response) => {
        const user = response?.user ?? response;
        if (cancelled || !user?.role) return;
        const backendRole = user.role;
        user.role = backendRole === 'CLIENT' ? 'client' : backendRole === 'PROFESSIONAL' ? 'pro' : backendRole === 'ADMIN' ? 'admin' : backendRole;
        const session = user as AuthenticatedUser;
        if (session.role === 'client') setClientSession(session);
        if (session.role === 'pro') setProSession(session);
        if (session.role === 'admin') setAdminSession(session);
        setRole(session.role);
      })
      .catch(() => {
        // Anonymous visitors are expected to receive a normal login gate.
      });

    return () => { cancelled = true; };
  }, []);

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Handle portal session logouts
  const handleLogout = () => {
    void api.post('api/auth/logout', {}, { retries: 1 }).catch(() => undefined);
    api.clearAccessToken();
    setClientSession(null);
    setProSession(null);
    setAdminSession(null);
    setRole('client');
    window.location.hash = '#/';
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
      case 'estimator':
        return <AIEstimator />;
      case 'ar':
        return <ARVisualizer />;
      case 'studio':
        return <AIInteriorStudio />;
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
      case 'homecare':
        return <HomeCare />;
      case 'dashboard-client':
        if (!clientSession) {
          return (
            <LoginGate
              requiredRole="client"
              onLoginSuccess={(user) => {
                setClientSession(user);
                setRole('client');
              }}
            />
          );
        }
        return <DashboardClient />;
      case 'dashboard-pro':
        if (!proSession) {
          return (
            <LoginGate
              requiredRole="pro"
              onLoginSuccess={(user) => {
                setProSession(user);
                setRole('pro');
              }}
            />
          );
        }
        return (
          <div className="space-y-4">
            <div className="bg-[#FFF7ED] border-b border-[#FED7AA] py-3.5 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-2xl mt-4 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#EA580C]">
                <Info className="w-4 h-4" />
                <span>Logged in as: {proSession.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white rounded-lg text-xs font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Portal</span>
              </button>
            </div>
            <DashboardProfessional />
          </div>
        );
      case 'dashboard-admin':
        if (!adminSession) {
          return (
            <LoginGate
              requiredRole="admin"
              onLoginSuccess={(user) => {
                setAdminSession(user);
                setRole('admin');
              }}
            />
          );
        }
        return (
          <div className="space-y-4">
            <div className="bg-[#FFF7ED] border-b border-[#FED7AA] py-3.5 px-6 flex justify-between items-center max-w-7xl mx-auto rounded-2xl mt-4 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#EA580C]">
                <Info className="w-4 h-4" />
                <span>Logged in as Admin: {adminSession.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white rounded-lg text-xs font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Portal</span>
              </button>
            </div>
            <DashboardAdmin />
          </div>
        );
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
      {/* Background Decorative Mesh Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brandLight-slate transition-colors duration-500">
        <div className="ambient-glow-primary top-[-20%] left-[-10%] animate-pulse-slow"></div>
        <div className="ambient-glow-secondary bottom-[-20%] right-[-10%] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="ambient-glow-accent top-[40%] left-[60%] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        {/* Subtle dot pattern overlay for texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Global Navbar */}
      <div className="relative z-50">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          role={role}
          setRole={setRole}
          setMarketplaceTab={setMarketplaceTab}
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
