import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Info, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
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
      <Outlet />
    </div>
  );
};
export default DashboardLayout;
