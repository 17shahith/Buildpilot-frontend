import React, { useState } from 'react';
import { Menu, X, Cpu, Eye, Sparkles, Briefcase, Home, LayoutDashboard, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  setMarketplaceTab,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isMainApp = location.pathname.startsWith('/main');
  const { user, userRole, logout } = useAuth();

  // Nav items when in the Main App (/main)
  const appNavItems = [
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin Portal', icon: <Shield className="w-4 h-4" /> }] : []),
    ...(userRole === 'pro' || userRole === 'admin' ? [{ id: 'professional', label: 'Pro Portal', icon: <Briefcase className="w-4 h-4" /> }] : []),
    ...(userRole === 'client' || userRole === 'admin' ? [{ id: 'client', label: 'Client Portal', icon: <LayoutDashboard className="w-4 h-4" /> }] : []),
    { id: 'estimator', label: 'AI Estimator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'ar', label: 'AR Visualiser', icon: <Eye className="w-4 h-4" /> },
    { id: 'studio', label: 'AI Studio', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'homecare', label: 'HomeCare', icon: <Home className="w-4 h-4" /> },
  ];

  const isNavItemActive = (id: string) => {
    if (id === 'client' && (currentView === 'client' || currentView === 'dashboard-client')) return true;
    if (id === 'professional' && (currentView === 'professional' || currentView === 'dashboard-pro')) return true;
    if (id === 'admin' && (currentView === 'admin' || currentView === 'dashboard-admin')) return true;
    return currentView === id;
  };

  // Nav items when on Landing Page (/) or Auth (/auth)
  const landingNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'security', label: 'Security' },
  ];

  const handleLandingNavItemClick = (id: string) => {
    setIsMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(`${id}-section`);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(`${id}-section`);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAppNavItemClick = (id: string) => {
    setIsMobileOpen(false);
    if (id === 'marketplace' && setMarketplaceTab) {
      setMarketplaceTab('pros');
    }
    setCurrentView(id);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-150 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with BuildCore towers */}
          <div 
            onClick={() => {
              if (isMainApp) {
                navigate('/main');
                setCurrentView('dashboard-client');
              } else {
                navigate('/');
              }
            }} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="flex items-end space-x-0.5 h-7">
              <div className="w-2.5 bg-[#F97316] rounded-t group-hover:scale-y-110 transition-transform duration-300" style={{ height: '50%' }}></div>
              <div className="w-2.5 bg-[#F97316] rounded-t group-hover:scale-y-110 transition-transform duration-300" style={{ height: '100%', transitionDelay: '75ms' }}></div>
              <div className="w-2.5 bg-[#F97316] rounded-t group-hover:scale-y-110 transition-transform duration-300" style={{ height: '70%', transitionDelay: '150ms' }}></div>
            </div>
            <span className="text-[#0F172A] font-black text-xl tracking-tight font-display transition-colors">
              Build<span className="text-[#F97316]">Core</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            {isMainApp ? (
              appNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAppNavItemClick(item.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all duration-300 ${
                    isNavItemActive(item.id)
                      ? 'bg-[#F97316]/10 text-[#F97316]'
                      : 'text-gray-500 hover:text-[#0F172A] hover:-translate-y-0.5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))
            ) : (
              landingNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLandingNavItemClick(item.id)}
                  className="text-xs uppercase font-extrabold tracking-widest text-gray-500 hover:text-[#0F172A] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>{item.label}</span>
                </button>
              ))
            )}
          </div>

          {/* Right Controls Area */}
          <div className="flex items-center space-x-4">
            {isMainApp && user ? (
              <div className="flex items-center space-x-4">
                {/* User Info & Avatar */}
                <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-2xl shadow-sm">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-[#F97316]/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-[#0F172A] max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-[#EA580C] hover:bg-[#EA580C]/5 border border-slate-200 hover:border-[#EA580C]/30 rounded-xl transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="relative px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-300 active:scale-95 flex items-center space-x-1.5"
              >
                <span>Get Started</span>
                <span className="font-semibold">→</span>
              </button>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:border-[#F97316] transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 flex flex-col shadow-inner">
          {isMainApp ? (
            appNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAppNavItemClick(item.id)}
                className={`flex items-center space-x-2 text-left text-xs uppercase font-extrabold tracking-widest py-2 ${
                  isNavItemActive(item.id) ? 'text-[#F97316]' : 'text-gray-500'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))
          ) : (
            landingNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLandingNavItemClick(item.id)}
                className="text-left text-xs uppercase font-extrabold tracking-widest text-gray-500 hover:text-[#0F172A] py-2"
              >
                <span>{item.label}</span>
              </button>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
