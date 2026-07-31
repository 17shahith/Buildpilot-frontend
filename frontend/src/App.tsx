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
import HomeCare from './views/HomeCare';
import { Lock, User, Eye, EyeOff, Info, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

// Simple SHA-256 Hashing helper
const hashPassword = async (pwd: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Pre-hashed passwords for demo credentials
const DEMO_ACCOUNTS = [
  {
    username: 'homecare_pro',
    // SHA-256 of "Pro@123"
    hash: 'fd08912d9457be4f4fd8291ba91bba4f9db9bfe59cd5be3d4174957e0d546c89',
    role: 'pro',
    fullName: 'Technician Account'
  },
  {
    username: 'homecare_admin',
    // SHA-256 of "Admin@123"
    hash: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
    role: 'admin',
    fullName: 'System Administrator'
  }
];

interface LoginGateProps {
  requiredRole: 'pro' | 'admin';
  onLoginSuccess: (user: any) => void;
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
      const enteredHash = await hashPassword(passwordInput);
      const matched = DEMO_ACCOUNTS.find(
        acc => acc.username === usernameInput && acc.hash === enteredHash && acc.role === requiredRole
      );

      if (matched) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        onLoginSuccess(matched);
      } else {
        setLoginError(`Invalid credentials. Must match the ${requiredRole === 'admin' ? 'Admin' : 'Professional'} demo login details.`);
      }
    } catch {
      setLoginError('Authentication error occurred.');
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

        {/* Demo Credentials Alert Banner */}
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#EA580C] font-extrabold uppercase">
            <Info className="w-4 h-4" />
            <span>Demo Credentials Required</span>
          </div>
          {requiredRole === 'pro' ? (
            <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
              Username: <span className="font-mono text-slate-800">homecare_pro</span> <br />
              Password: <span className="font-mono text-slate-800">Pro@123</span>
            </p>
          ) : (
            <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
              Username: <span className="font-mono text-slate-800">homecare_admin</span> <br />
              Password: <span className="font-mono text-slate-800">Admin@123</span>
            </p>
          )}
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
  const [proSession, setProSession] = useState<any | null>(null);
  const [adminSession, setAdminSession] = useState<any | null>(null);

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Handle portal session logouts
  const handleLogout = () => {
    setProSession(null);
    setAdminSession(null);
    setRole('client');
    setCurrentView('landing');
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
