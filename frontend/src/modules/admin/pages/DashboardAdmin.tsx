import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { AdminOverview } from '../components/AdminOverview';
import { UserManagement } from '../components/UserManagement';
import { VerificationCenter } from '../components/VerificationCenter';
import { ProjectManagement } from '../components/ProjectManagement';
import { FinanceEscrow } from '../components/FinanceEscrow';
import { DisputesReports } from '../components/DisputesReports';
import { MarketplaceAdmin } from '../components/MarketplaceAdmin';
import { AIServicesAdmin } from '../components/AIServicesAdmin';
import { AnalyticsSecurity } from '../components/AnalyticsSecurity';
import { AdminSettings } from '../components/AdminSettings';
import { adminMockService } from '../../../services/api/adminMockService';
import { Bell } from 'lucide-react';

const DashboardAdmin: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = adminMockService.getNotifications();

  const handleClearNotifications = () => {
    adminMockService.markNotificationsAsRead();
    alert('All notifications marked as read.');
  };

  // Render Sub-view
  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverview setActiveView={setActiveView} />;
      case 'users-all':
        return <UserManagement roleFilter="all" />;
      case 'users-customers':
        return <UserManagement roleFilter="client" />;
      case 'users-experts':
      case 'users-contractors':
        return <UserManagement roleFilter="pro" />;
      case 'users-vendors':
        return <UserManagement roleFilter="vendor" />;
      case 'projects':
        return <ProjectManagement />;
      case 'verification':
        return <VerificationCenter />;
      case 'finance':
        return <FinanceEscrow />;
      case 'marketplace':
        return <MarketplaceAdmin />;
      case 'ai-services':
        return <AIServicesAdmin />;
      case 'disputes':
        return <DisputesReports />;
      case 'analytics':
      case 'security':
        return <AnalyticsSecurity />;
      case 'notifications':
        return (
          <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
              <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-primary" />
                <span>All System Notifications</span>
              </h2>
              <button 
                onClick={handleClearNotifications}
                className="text-[10px] font-black text-primary hover:text-primary-dark"
              >
                Mark all as read
              </button>
            </div>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-2xl border text-xs font-bold flex justify-between items-center ${
                    n.read ? 'bg-brandLight-panel border-brandLight-border opacity-75' : 'bg-primary/5 border-primary/25'
                  }`}
                >
                  <p className="text-brandDark-black">{n.text}</p>
                  <span className="text-[10px] text-gray-400 font-mono">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brandLight-slate flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1600px] mx-auto">
      {/* Persistent / Drawer Sidebar */}
      <AdminSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <AdminHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-1">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
