import React, { useState } from 'react';
import { Briefcase, Cpu, Eye, User, ShieldCheck, Menu, X } from 'lucide-react';

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
  setRole,
  setMarketplaceTab,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'estimator', label: 'AI Estimator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'ar', label: 'AR Visualiser', icon: <Eye className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-brandLight-border bg-white/85 backdrop-blur-md transition-colors duration-300">
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
                className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide font-display transition-all duration-250 ${
                  currentView === item.id
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow/10'
                    : 'text-gray-600 hover:text-brandDark-black hover:bg-brandDark-black/5'
                }`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls Area */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Simulated Role Selector (Developer Quick-Switch) */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-brandLight-border bg-brandLight-slate text-xs font-semibold uppercase tracking-wider text-gray-700">
                {role === 'client' && <User className="w-3.5 h-3.5 text-primary" />}
                {role === 'pro' && <Briefcase className="w-3.5 h-3.5 text-green-500" />}
                {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-yellow-500" />}
                <span className="hidden sm:inline">{role} Portal</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel p-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shadow-2xl z-50">
                <button
                  onClick={() => { setRole('client'); setCurrentView('dashboard-client'); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-gray-700 hover:bg-brandDark-black/5 flex items-center space-x-2"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Client View</span>
                </button>
                <button
                  onClick={() => { setRole('pro'); setCurrentView('dashboard-pro'); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-gray-700 hover:bg-brandDark-black/5 flex items-center space-x-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-green-500" />
                  <span>Professional View</span>
                </button>
                <button
                  onClick={() => { setRole('admin'); setCurrentView('dashboard-admin'); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-gray-700 hover:bg-brandDark-black/5 flex items-center space-x-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Admin View</span>
                </button>
              </div>
            </div>

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
              className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm font-display tracking-wide shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
              <span className="relative flex items-center">
                Hire a Pro <span className="ml-1.5">→</span>
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
