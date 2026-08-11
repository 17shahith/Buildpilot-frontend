import React, { useState } from 'react';
import { Briefcase, Cpu, Eye, Menu, X, Home, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  role: 'client' | 'pro' | 'admin';
  setRole: (role: 'client' | 'pro' | 'admin') => void;
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  role,
  setRole: _setRole,
  setMarketplaceTab,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'estimator', label: 'AI Estimator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'ar', label: 'AR Visualiser', icon: <Eye className="w-4 h-4" /> },
    { id: 'studio', label: 'AI Studio', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'homecare', label: 'HomeCare', icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 premium-glass transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-extrabold text-xl tracking-tight font-display">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brandDark-black font-extrabold text-lg tracking-tight font-display transition-colors">
                BuildBridge
              </span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase -mt-1">
                AI & AR Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'marketplace') {
                    setMarketplaceTab('pros');
                  }
                  setCurrentView(item.id);
                }}
                className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide font-display transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border border-primary/20 shadow-sm'
                    : 'text-gray-600 hover:text-brandDark-black hover:bg-gray-100/50 hover:-translate-y-0.5'
                }`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls Area */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Dashboard Quick Link */}
            <button
              onClick={() => {
                if (role === 'client') setCurrentView('dashboard-client');
                if (role === 'pro') setCurrentView('dashboard-pro');
                if (role === 'admin') setCurrentView('dashboard-admin');
              }}
              className={`hidden lg:flex items-center px-4 py-2 rounded-xl text-sm font-semibold tracking-wide font-display border transition-all ${
                currentView.startsWith('dashboard')
                  ? 'bg-primary text-white border-primary shadow-glow'
                  : 'border-brandLight-border text-gray-700 hover:border-primary/40'
              }`}
            >
              Dashboard
            </button>

            {/* Consult Pro button */}
            <button
              onClick={() => {
                setMarketplaceTab('pros');
                setCurrentView('marketplace');
              }}
              className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary-light to-primary-dark text-white font-semibold text-sm font-display tracking-wide shadow-glow-lg transition-all duration-500 hover:shadow-glow hover:-translate-y-0.5 active:scale-95 overflow-hidden group bg-[length:200%_auto] hover:bg-[center_right_1rem]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <span className="relative flex items-center">
                Hire a Pro <span className="ml-1.5 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex md:hidden p-2.5 rounded-xl border border-brandLight-border bg-brandLight-slate text-gray-700 hover:border-primary/45 transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-brandLight-border bg-white px-4 py-4 space-y-2 flex flex-col shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'marketplace') {
                  setMarketplaceTab('pros');
                }
                setCurrentView(item.id);
                setIsMobileOpen(false);
              }}
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide font-display transition-all ${
                currentView === item.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-600 hover:text-brandDark-black hover:bg-brandDark-black/5'
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ))}
          <div className="border-t border-brandLight-border/60 my-2 pt-3 flex flex-col space-y-2">
            {/* Dashboard Quick Link for mobile */}
            <button
              onClick={() => {
                if (role === 'client') setCurrentView('dashboard-client');
                if (role === 'pro') setCurrentView('dashboard-pro');
                if (role === 'admin') setCurrentView('dashboard-admin');
                setIsMobileOpen(false);
              }}
              className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide font-display border transition-all ${
                currentView.startsWith('dashboard')
                  ? 'bg-primary text-white border-primary'
                  : 'border-brandLight-border text-gray-700'
              }`}
            >
              Dashboard Portal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
