import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Import sub-views
import { ProfessionalOverview } from './professional/ProfessionalOverview';
import { FindProjects } from './professional/FindProjects';
import { ProProjects } from './professional/ProProjects';
import { ProProjectWorkspace } from './professional/ProProjectWorkspace';
import { ProProposals } from './professional/ProProposals';
import { ProClients } from './professional/ProClients';
import { ProSchedule } from './professional/ProSchedule';
import { ProEarnings } from './professional/ProEarnings';
import { ProDocuments } from './professional/ProDocuments';
import { ProPortfolio } from './professional/ProPortfolio';
import { ProProfile } from './professional/ProProfile';
import { ProSettings } from './professional/ProSettings';

// Import existing BuildPilot tools
import AIEstimator from './AIEstimator';
import ARVisualizer from './ARVisualizer';
import AIInteriorStudio from './AIInteriorStudio';

// Icons
import {
  LayoutDashboard,
  Search,
  Briefcase,
  FileText,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Folder,
  Star,
  User,
  Settings,
  Cpu,
  Eye,
  Sparkles,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const DashboardProfessional: React.FC = () => {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Sidebar items
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'find-projects', label: 'Find Projects', icon: <Search className="w-4 h-4" /> },
    { id: 'projects', label: 'My Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'proposals', label: 'Proposals', icon: <FileText className="w-4 h-4" /> },
    { id: 'clients', label: 'My Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <Folder className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Star className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // AI integrations
  const aiTools = [
    { id: 'estimator', label: 'AI Estimator', icon: <Cpu className="w-4 h-4 text-primary" /> },
    { id: 'ar', label: 'AR Visualiser', icon: <Eye className="w-4 h-4 text-primary" /> },
    { id: 'studio', label: 'AI Studio', icon: <Sparkles className="w-4 h-4 text-primary" /> }
  ];

  const handleNavItemClick = (id: string) => {
    setActiveView(id);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Render correct sub-view
  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <ProfessionalOverview 
            setActiveView={setActiveView} 
            setSelectedProjectId={setSelectedProjectId} 
          />
        );
      case 'find-projects':
        return <FindProjects />;
      case 'projects':
        return (
          <ProProjects 
            setActiveView={setActiveView} 
            setSelectedProjectId={setSelectedProjectId} 
          />
        );
      case 'project-workspace':
        return (
          <ProProjectWorkspace 
            projectId={selectedProjectId || 'proj-1'} 
            onBack={() => setActiveView('projects')} 
          />
        );
      case 'proposals':
        return (
          <ProProposals 
            setActiveView={setActiveView} 
          />
        );
      case 'clients':
        return (
          <ProClients 
            setActiveView={setActiveView} 
            setSelectedProjectId={setSelectedProjectId} 
          />
        );
      case 'schedule':
        return <ProSchedule />;
      case 'messages':
        // Renders workspace messages as fallback/context or open project messages
        return (
          <ProProjectWorkspace 
            projectId="proj-1" 
            onBack={() => setActiveView('overview')} 
          />
        );
      case 'earnings':
        return <ProEarnings />;
      case 'documents':
        return <ProDocuments />;
      case 'portfolio':
        return <ProPortfolio />;
      case 'profile':
        return <ProProfile />;
      case 'settings':
        return <ProSettings />;
      
      // AI integrations
      case 'estimator':
        return (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
            <AIEstimator />
          </div>
        );
      case 'ar':
        return (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
            <ARVisualizer />
          </div>
        );
      case 'studio':
        return (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
            <AIInteriorStudio />
          </div>
        );

      default:
        return <ProfessionalOverview setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brandLight-slate flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1600px] mx-auto">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-brandLight-border flex flex-col justify-between p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0 lg:rounded-3xl lg:border ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6 overflow-y-auto">
          {/* Logo & Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">BuildPilot</span>
              <h2 className="text-sm font-black text-[#EA580C] uppercase tracking-wider font-display">Pro Workspace</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = activeView === item.id || (item.id === 'projects' && activeView === 'project-workspace');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* AI Tools */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-4">AI Design & Estimation</span>
            <nav className="space-y-1">
              {aiTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleNavItemClick(tool.id)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeView === tool.id
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
        {/* HEADER BAR */}
        <header className="bg-white border border-brandLight-border px-6 py-4 rounded-3xl flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block relative w-60">
              <input
                type="text"
                placeholder="Search workspace..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-150 rounded-xl text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => alert('Notifications clicked')}
              className="p-2 bg-slate-50 border border-slate-150 hover:bg-slate-100 rounded-xl text-slate-500 relative transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
            </button>

            {/* Profile badge */}
            <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/30">
                A
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-black text-brandDark-black block leading-none">Ananya Roy</span>
                <span className="text-[9px] text-green-500 font-bold block mt-1">Verified Pro</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT PANE */}
        <main className="flex-1 min-h-0">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default DashboardProfessional;
