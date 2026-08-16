import React, { useState } from 'react';
import { Search, Bell, Shield, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminMockService } from '../../services/adminMockService';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const AdminHeader: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  searchTerm, 
  setSearchTerm 
}) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const notifications = adminMockService.getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-brandLight-border shadow-sm rounded-3xl mb-6">
      {/* Left side: Hamburger (mobile) + Admin Title */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg hover:bg-brandLight-slate lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-black text-brandDark-black font-display tracking-tight sm:text-base">
            BuildPilot Admin Control Center
          </h1>
          <p className="text-[10px] text-gray-500 font-semibold hidden sm:block">
            Platform overview and operational management
          </p>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search users, projects, disputes, transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-brandLight-slate border border-brandLight-border rounded-xl pl-10 pr-4 py-2 text-xs text-brandDark-black placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
        />
      </div>

      {/* Right side: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
              if (!notificationsOpen) adminMockService.markNotificationsAsRead();
            }}
            className="p-2 rounded-xl bg-brandLight-slate hover:bg-brandLight-border text-gray-600 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-brandLight-border rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-brandLight-border flex justify-between items-center">
                <span className="text-[11px] font-black text-brandDark-black uppercase tracking-wider">Notifications</span>
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{unreadCount} New</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-2.5 hover:bg-brandLight-slate border-b border-brandLight-border/50 text-[10px] text-gray-600 transition-colors">
                    <p className="font-semibold">{n.text}</p>
                    <span className="text-[9px] text-gray-400 block mt-1">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center space-x-2.5 p-1.5 pr-3 bg-brandLight-slate hover:bg-brandLight-border rounded-xl transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-xs font-display">
              VM
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] font-bold text-brandDark-black leading-tight">Vikram Mehta</span>
              <span className="text-[9px] text-gray-400 font-extrabold flex items-center">
                <Shield className="w-2.5 h-2.5 text-primary mr-0.5" />
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-brandLight-border rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-brandLight-border">
                <p className="text-[10px] font-bold text-brandDark-black">{user?.email}</p>
                <p className="text-[9px] text-gray-400">ID: admin-vikram</p>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50/50 hover:text-red-600 text-left transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
