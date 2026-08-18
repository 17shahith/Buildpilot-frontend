import React, { useState } from 'react';
import { Briefcase, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface ClientProjectsProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId: (id: string) => void;
}

export const ClientProjects: React.FC<ClientProjectsProps> = ({
  setActiveView,
  setSelectedProjectId
}) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Upcoming' | 'Completed' | 'Archived'>('Active');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          // Map backend project fields to frontend representation
          const mapped = (json.data || []).map((bp: any) => {
            const spent = bp.expenses ? bp.expenses.reduce((sum: number, e: any) => sum + e.amount, 0) : 0;
            return {
              id: bp.id,
              name: bp.name,
              professionalName: bp.contractor?.email || 'Rahul Architects',
              professionalId: bp.contractorId || 'usr-3',
              role: 'Contractor',
              budget: bp.budget,
              spent,
              remaining: bp.budget - spent,
              progress: 0,
              status: bp.status === 'PLANNING' ? 'Upcoming' : bp.status === 'COMPLETED' ? 'Completed' : 'Active',
              currentMilestone: 'Initial Setup',
              deadline: bp.deadline || '2026-12-31',
              paymentStatus: 'In Escrow',
              startDate: bp.createdAt ? bp.createdAt.split('T')[0] : '2026-08-18',
              description: bp.name,
              requirements: ['Verify soil loads', 'Submit blueprint approvals'],
              milestones: [],
              documents: []
            };
          });
          setProjects(mapped);
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const filtered = projects.filter(p => {
    if (activeTab === 'Active') return p.status === 'Active';
    if (activeTab === 'Upcoming') return p.status === 'Upcoming';
    if (activeTab === 'Completed') return p.status === 'Completed';
    return p.status === 'Archived';
  });

  const handleOpenWorkspace = (id: string) => {
    setSelectedProjectId(id);
    setActiveView('project-workspace');
  };

  const tabs = ['Active', 'Upcoming', 'Completed', 'Archived'] as const;

  if (loading) {
    return (
      <div className="bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-4 shadow-sm text-xs font-bold text-slate-500">
        Loading project contracts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display">My Project Contracts</h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Oversee construction builds, approve architectural milestones, and authorize payments.</p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === tab
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => {
          const escrowReleasedPercent = Math.floor((p.spent / p.budget) * 100);
          return (
            <div
              key={p.id}
              className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black text-brandDark-black leading-tight">{p.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Professional: {p.professionalName} ({p.role})</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-black uppercase font-mono ${
                    p.status === 'Active' ? 'bg-blue-50 border-blue-150 text-blue-600' : p.status === 'Completed' ? 'bg-green-50 border-green-150 text-green-600' : 'bg-slate-100 border-slate-150 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black text-slate-500">
                    <span>Work Completion Progress</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>

                {/* Costs details */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-black leading-none mb-0.5 font-sans">Budget</span>
                      <span className="text-brandDark-black font-black font-mono">₹{p.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-black leading-none mb-0.5 font-sans font-mono">Deadline</span>
                      <span className="text-brandDark-black font-black font-mono">{p.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-500 font-bold flex justify-between items-center">
                  <span>Current Milestone: <strong className="text-slate-800 font-black">{p.currentMilestone}</strong></span>
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200 uppercase font-black font-mono">{escrowReleasedPercent}% paid</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenWorkspace(p.id)}
                className="w-full py-2.5 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary rounded-2xl text-xs font-black text-slate-600 flex items-center justify-center space-x-1.5 transition-all duration-300"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No {activeTab} Projects Found</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
              Any projects matching the {activeTab.toLowerCase()} status will appear here. Start a project from an estimate or marketplace booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
