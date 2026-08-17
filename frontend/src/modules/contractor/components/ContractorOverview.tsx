import React from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { Briefcase, Clock, FileText, CheckCircle2, TrendingUp, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

interface ProfessionalOverviewProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId?: (id: string) => void;
}

export const ProfessionalOverview: React.FC<ProfessionalOverviewProps> = ({ 
  setActiveView,
  setSelectedProjectId 
}) => {
  const kpis = professionalMockService.getWorkspaceKPIs();
  const perf = professionalMockService.getPerformanceStats();
  const alerts = professionalMockService.getAttentionAlerts();
  const projects = professionalMockService.getProjects();
  const leads = professionalMockService.getLeads().slice(0, 2); // Show top 2 matches

  const activeProjects = projects.filter(p => p.status === 'Active');

  const handleAlertClick = (alert: any) => {
    if (alert.view === 'messages' || alert.view === 'milestones') {
      if (setSelectedProjectId && alert.refId) {
        setSelectedProjectId(alert.refId);
        setActiveView('project-workspace');
      }
    } else {
      setActiveView(alert.view);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FFF7ED] border border-[#FED7AA] p-6 rounded-3xl flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-black text-brandDark-black font-display flex items-center space-x-2">
            <span>Good evening, Ananya 👋</span>
          </h2>
          <p className="text-xs font-bold text-[#EA580C] mt-1">Here is a quick overview of your professional business workspace today.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-[10px] font-black uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Profile Verified</span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start space-x-3">
        <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-bold text-blue-800">
          <span className="uppercase tracking-wider font-extrabold block mb-0.5 text-[10px]">AI Responsibility Disclaimer</span>
          BuildPilot AI-generated design concepts, budget breakdowns, and structural defect scans are advisory recommendations. All output should be audited and verified by a qualified professional before final submission or execution.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', val: activeProjects.length, icon: <Briefcase className="w-5 h-5 text-blue-500" />, desc: 'Delivering work' },
          { label: 'Pending Proposals', val: kpis.pendingProposalsCount, icon: <FileText className="w-5 h-5 text-yellow-500" />, desc: 'Awaiting review' },
          { label: 'Upcoming Deadlines', val: kpis.upcomingDeadlinesCount, icon: <Clock className="w-5 h-5 text-red-500" />, desc: 'Next 7 days' },
          { label: 'Earnings (This Month)', val: `₹${kpis.thisMonthEarnings.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-green-500" />, desc: '+12.4% vs last month' }
        ].map((k, i) => (
          <div key={i} className="bg-white border border-brandLight-border p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{k.label}</span>
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">{k.icon}</div>
            </div>
            <div>
              <span className="text-2xl font-black text-brandDark-black block tracking-tight">{k.val}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{k.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: UPCOMING WORK & ATTENTION NEEDED */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Center */}
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-brandLight-border">
              <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
              <span>Requires Your Attention</span>
            </h3>
            <div className="space-y-2.5">
              {alerts.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleAlertClick(a)}
                  className="w-full text-left p-3.5 bg-red-50/30 hover:bg-red-50/70 border border-red-100 hover:border-red-200 text-xs font-bold text-red-900 rounded-2xl flex justify-between items-center transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span>{a.text}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Work */}
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-brandLight-border">
              Upcoming Project Deliverables
            </h3>
            <div className="space-y-4">
              {activeProjects.map((p) => {
                const activeMilestone = p.milestones.find(m => m.status === 'In Progress') || p.milestones.find(m => m.status === 'Not Started');
                return (
                  <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition-all">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-black text-brandDark-black">{p.name}</h4>
                      <p className="text-xs text-slate-500 font-bold">
                        Client: <span className="text-slate-800">{p.clientName}</span> | Current Milestone: <span className="text-primary">{activeMilestone?.name || 'Handover'}</span>
                      </p>
                      <div className="w-full sm:w-60 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">Due Date</span>
                        <span className="text-xs font-black text-brandDark-black font-mono">{activeMilestone?.dueDate || p.deadline}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (setSelectedProjectId) {
                            setSelectedProjectId(p.id);
                            setActiveView('project-workspace');
                          }
                        }}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Open Workspace
                      </button>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="text-center py-6 text-xs font-bold text-slate-400">
                  No active projects currently. Submit proposals to get hired!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERFORMANCE STATS & MATCHED PROJECTS */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-brandLight-border">
              Performance Scorecard
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Completed Projects', val: perf.completedCount, suffix: '' },
                { label: 'Proposal Success', val: perf.successRatePercent, suffix: '%' },
                { label: 'Client Rating', val: perf.averageRatingValue, suffix: ' ★' },
                { label: 'On-Time Completion', val: perf.onTimePercent, suffix: '%' }
              ].map((p, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">{p.label}</span>
                  <span className="text-lg font-black text-brandDark-black font-mono">
                    {p.val}{p.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Projects */}
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-brandLight-border">
              Recommended Projects
            </h3>
            <div className="space-y-3">
              {leads.map((l) => (
                <div key={l.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 hover:border-brandLight-border transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-brandDark-black max-w-[170px] truncate">{l.title}</h4>
                    <span className="text-[9px] font-black text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-1.5 py-0.5 rounded-lg uppercase">
                      92% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal truncate">{l.description}</p>
                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/50">
                    <span className="text-[10px] font-black text-brandDark-black">₹{l.budgetMin.toLocaleString()} - ₹{l.budgetMax.toLocaleString()}</span>
                    <button
                      onClick={() => setActiveView('find-projects')}
                      className="text-[10px] font-black text-primary hover:text-primary-dark flex items-center space-x-0.5"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
