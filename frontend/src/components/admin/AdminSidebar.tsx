import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, FolderKanban, ShieldCheck, 
  CircleDollarSign, ShoppingCart, Bot, AlertTriangle, 
  BarChart3, ShieldAlert, Bell, Settings, ChevronRight, ChevronDown, X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen 
}) => {
  const [usersExpanded, setUsersExpanded] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users,
      hasSubmenu: true,
      submenu: [
        { id: 'users-all', label: 'All Users' },
        { id: 'users-customers', label: 'Customers' },
        { id: 'users-experts', label: 'Experts' },
        { id: 'users-contractors', label: 'Contractors' },
        { id: 'users-vendors', label: 'Vendors' },
      ]
    },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'finance', label: 'Finance & Escrow', icon: CircleDollarSign },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'ai-services', label: 'AI Services', icon: Bot },
    { id: 'disputes', label: 'Disputes & Reports', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security & Audit', icon: ShieldAlert },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setUsersExpanded(!usersExpanded);
    } else {
      setActiveView(id);
      setIsOpen(false); // Close sidebar on mobile after clicking
    }
  };

  const isUserSubViewActive = activeView.startsWith('users-');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-brandLight-border 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-140px)] lg:rounded-3xl lg:border lg:shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header (Mobile Only) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brandLight-border lg:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-black text-primary font-display">BuildPilot</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Admin</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Header (Desktop) */}
        <div className="hidden lg:flex flex-col px-6 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-display">B</div>
            <span className="text-lg font-black text-brandDark-black font-display tracking-tight">BuildPilot</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Panel</span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">Control Center</p>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeView === item.id || (item.id === 'users' && isUserSubViewActive);
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleNavClick(item.id, item.hasSubmenu)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-gray-600 hover:bg-brandLight-slate hover:text-brandDark-black'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-gray-400 group-hover:text-brandDark-black'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <div>
                      {usersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && (usersExpanded || isUserSubViewActive) && (
                  <div className="pl-9 space-y-1 mt-1 transition-all duration-300">
                    {item.submenu?.map((subItem) => {
                      const isSubSelected = activeView === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveView(subItem.id);
                            setIsOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-200
                            ${isSubSelected 
                              ? 'text-primary bg-primary/5' 
                              : 'text-gray-500 hover:text-brandDark-black hover:bg-brandLight-slate'
                            }
                          `}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
