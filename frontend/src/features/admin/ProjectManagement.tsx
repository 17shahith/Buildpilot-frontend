import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, X } from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';
import type { Project } from '../../services/adminMockService';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Status Change Dialog
  const [statusChange, setStatusChange] = useState<{
    projectId: string;
    projectName: string;
    newStatus: Project['status'];
  } | null>(null);
  const [changeReason, setChangeReason] = useState('');

  // Escrow Release Dialog
  const [escrowRelease, setEscrowRelease] = useState<{
    projectId: string;
    projectName: string;
    maxAmount: number;
  } | null>(null);
  const [releaseAmount, setReleaseAmount] = useState(0);
  const [releaseReason, setReleaseReason] = useState('');

  // Escrow Hold Confirmation
  const [escrowHold, setEscrowHold] = useState<{
    projectId: string;
    projectName: string;
  } | null>(null);
  const [holdReason, setHoldReason] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(adminMockService.getProjects());
  };

  const handleOpenDetails = (proj: Project) => {
    setSelectedProject(proj);
  };

  const handleStatusChangeClick = (projectId: string, projectName: string, newStatus: Project['status']) => {
    setStatusChange({ projectId, projectName, newStatus });
    setChangeReason('');
  };

  const executeStatusChange = () => {
    if (!statusChange) return;
    adminMockService.updateProjectStatus(statusChange.projectId, statusChange.newStatus, changeReason);
    loadProjects();
    
    if (selectedProject && selectedProject.id === statusChange.projectId) {
      setSelectedProject(adminMockService.getProjectById(statusChange.projectId) || null);
    }
    
    setStatusChange(null);
    setChangeReason('');
  };

  const handleReleaseClick = (projectId: string, projectName: string, maxAmount: number) => {
    setEscrowRelease({ projectId, projectName, maxAmount });
    setReleaseAmount(maxAmount);
    setReleaseReason('');
  };

  const executeRelease = () => {
    if (!escrowRelease) return;
    const success = adminMockService.releaseEscrowFunds(escrowRelease.projectId, releaseAmount, releaseReason);
    if (success) {
      alert(`Successfully released ₹${releaseAmount.toLocaleString('en-IN')}!`);
      loadProjects();
      if (selectedProject && selectedProject.id === escrowRelease.projectId) {
        setSelectedProject(adminMockService.getProjectById(escrowRelease.projectId) || null);
      }
    } else {
      alert('Failed to release funds. Check amount.');
    }
    setEscrowRelease(null);
  };

  const handleHoldClick = (projectId: string, projectName: string) => {
    setEscrowHold({ projectId, projectName });
    setHoldReason('');
  };

  const executeHold = () => {
    if (!escrowHold) return;
    adminMockService.holdEscrowFunds(escrowHold.projectId, holdReason);
    loadProjects();
    if (selectedProject && selectedProject.id === escrowHold.projectId) {
      setSelectedProject(adminMockService.getProjectById(escrowHold.projectId) || null);
    }
    setEscrowHold(null);
  };

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          (p.contractorName && p.contractorName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = status === '' || p.status === status;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalCount = projects.length + 344; // real dashboard offset
  const activeCount = projects.filter(p => p.status === 'Active').length + 348 - 2;
  const pendingCount = projects.filter(p => p.status === 'Pending').length + 42;
  const completedCount = projects.filter(p => p.status === 'Completed').length + 892;
  const delayedCount = projects.filter(p => p.status === 'Delayed').length + 23;
  const disputedCount = projects.filter(p => p.status === 'Disputed').length + 17;

  return (
    <div className="space-y-6">
      {/* Top statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Projects', count: totalCount, color: 'border-gray-200 text-gray-500' },
          { label: 'Active', count: activeCount, color: 'border-green-200 text-green-600' },
          { label: 'Pending', count: pendingCount, color: 'border-yellow-200 text-yellow-600' },
          { label: 'Completed', count: completedCount, color: 'border-gray-300 text-gray-400' },
          { label: 'Delayed', count: delayedCount, color: 'border-orange-200 text-orange-500' },
          { label: 'Disputed', count: disputedCount, color: 'border-red-200 text-red-500' },
        ].map((item, i) => (
          <div key={i} className={`p-4 bg-white border rounded-2xl ${item.color.split(' ')[0]}`}>
            <span className="text-[9px] font-black uppercase tracking-wider block text-gray-400">{item.label}</span>
            <span className="text-lg font-black text-brandDark-black font-display mt-1 block">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-5 rounded-3xl border border-brandLight-border bg-white flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, client, contractor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="premium-input pl-10 text-xs"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="premium-input text-xs"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="Disputed">Disputed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-3.5">Project</th>
                <th className="pb-3.5">Customer</th>
                <th className="pb-3.5">Assigned Contractor</th>
                <th className="pb-3.5">Budget</th>
                <th className="pb-3.5">Progress</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-brandLight-panel transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-brandDark-black font-extrabold text-xs">{p.name}</p>
                      <p className="text-[9px] text-gray-400 font-semibold font-mono">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="py-4">{p.customerName}</td>
                  <td className="py-4 text-gray-500">{p.contractorName || 'Not Assigned'}</td>
                  <td className="py-4 text-brandDark-black font-extrabold">₹{p.budget.toLocaleString('en-IN')}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-brandLight-border h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-extrabold font-mono text-gray-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      p.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                      p.status === 'Delayed' ? 'bg-orange-50 text-orange-500 border border-orange-200' :
                      p.status === 'Disputed' ? 'bg-red-50 text-red-500 border border-red-200' :
                      p.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleOpenDetails(p)}
                      className="px-3 py-1.5 bg-brandLight-slate hover:bg-brandLight-border text-brandDark-black text-[10px] rounded-lg transition-colors font-extrabold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-fade-in animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-brandLight-border">
              <div>
                <h3 className="text-sm font-black text-brandDark-black">{selectedProject.name}</h3>
                <p className="text-[10px] text-gray-400 font-mono">Project ID: {selectedProject.id}</p>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1.5 bg-brandLight-slate hover:bg-brandLight-border text-gray-500 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column: Details, Escrow, Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overview metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-brandLight-panel border border-brandLight-border/50 text-[11px] font-bold">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Customer</span>
                    <span className="text-brandDark-black font-extrabold">{selectedProject.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Expert / Architect</span>
                    <span className="text-brandDark-black font-extrabold">{selectedProject.expertName || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Contractor</span>
                    <span className="text-brandDark-black font-extrabold">{selectedProject.contractorName || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Total Budget</span>
                    <span className="text-brandDark-black font-extrabold">₹{selectedProject.budget.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Created Date</span>
                    <span className="text-brandDark-black">{selectedProject.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Last Activity</span>
                    <span className="text-brandDark-black">{selectedProject.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Overall Progress</span>
                    <span className="text-brandDark-black">{selectedProject.progress}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Status</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black inline-block mt-0.5 ${
                      selectedProject.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {selectedProject.status}
                    </span>
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Milestone Progress</h4>
                  <div className="space-y-2.5">
                    {selectedProject.milestones.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-brandLight-panel text-xs font-bold">
                        <div className="flex items-center space-x-2.5">
                          {m.status === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          ) : m.status === 'active' ? (
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400" />
                          )}
                          <span className={m.status === 'completed' ? 'text-gray-400 line-through' : 'text-brandDark-black'}>
                            {m.name}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black uppercase ${
                          m.status === 'completed' ? 'text-green-500' :
                          m.status === 'active' ? 'text-primary' : 'text-gray-400'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Escrow Status Ledger */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
                    <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Escrow Financial Ledger</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      selectedProject.escrow.status === 'held' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      selectedProject.escrow.status === 'released' ? 'bg-green-50 text-green-500 border border-green-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      Escrow: {selectedProject.escrow.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
                    <div className="p-3 bg-brandLight-panel rounded-xl">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Total Escrow</span>
                      <p className="text-sm font-black text-brandDark-black">₹{selectedProject.escrow.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 bg-brandLight-panel rounded-xl">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Released to Pro</span>
                      <p className="text-sm font-black text-green-500">₹{selectedProject.escrow.released.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 bg-brandLight-panel rounded-xl">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Held Balance</span>
                      <p className="text-sm font-black text-brandDark-black">₹{selectedProject.escrow.remaining.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 bg-brandLight-panel rounded-xl">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold">Pending Release</span>
                      <p className="text-sm font-black text-primary">₹{selectedProject.escrow.pendingRelease.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Financial Controls */}
                  <div className="flex gap-2">
                    {selectedProject.escrow.remaining > 0 && (
                      <>
                        <button 
                          onClick={() => handleReleaseClick(selectedProject.id, selectedProject.name, selectedProject.escrow.remaining)}
                          className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black rounded-xl transition-all shadow-glow"
                        >
                          Release Funds
                        </button>
                        {selectedProject.escrow.status !== 'held' && (
                          <button 
                            onClick={() => handleHoldClick(selectedProject.id, selectedProject.name)}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 text-[10px] font-black rounded-xl transition-all"
                          >
                            Hold Escrow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Documents, Chat Feed, Timeline */}
              <div className="space-y-6">
                {/* Action controls */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3 bg-brandLight-panel">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Project Control</h4>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase block">Modify Project Status</label>
                    <select
                      value={selectedProject.status}
                      onChange={(e) => handleStatusChangeClick(selectedProject.id, selectedProject.name, e.target.value as any)}
                      className="premium-input text-xs bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Disputed">Disputed</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                {/* Documents List */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Contracts & Plans</h4>
                  <div className="space-y-2.5">
                    {selectedProject.documents.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-bold p-2 hover:bg-brandLight-slate rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-brandDark-black text-[11px]">{doc.name}</p>
                            <p className="text-[9px] text-gray-400 font-semibold font-mono">{doc.size} • {doc.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedProject.documents.length === 0 && (
                      <p className="text-gray-400 text-xs italic">No documents uploaded.</p>
                    )}
                  </div>
                </div>

                {/* Communication Feed */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Communication Feed</h4>
                  <div className="space-y-3.5 max-h-48 overflow-y-auto">
                    {selectedProject.messages.map((m, idx) => (
                      <div key={idx} className="text-[10px] font-bold space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>{m.sender} ({m.role})</span>
                          <span className="font-mono text-[9px]">{m.time}</span>
                        </div>
                        <p className="p-2.5 bg-brandLight-panel rounded-xl text-brandDark-black border border-brandLight-border/50">
                          {m.text}
                        </p>
                      </div>
                    ))}
                    {selectedProject.messages.length === 0 && (
                      <p className="text-gray-400 text-xs italic">No conversation log found.</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Activity Timeline</h4>
                  <div className="space-y-3 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-brandLight-border">
                    {selectedProject.timeline.map((event, idx) => (
                      <div key={idx} className="text-[10px] font-bold relative before:absolute before:-left-4 before:top-1 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary">
                        <p className="text-brandDark-black">{event.title}</p>
                        <span className="text-[9px] text-gray-400 font-mono block mt-0.5">{event.date} • {event.actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {statusChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black">Modify Project Status</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Are you sure you want to change the status of <strong>{statusChange.projectName}</strong> to <strong className="text-primary">{statusChange.newStatus}</strong>?
            </p>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Justification for Audit</label>
              <textarea 
                placeholder="Scope change, delays, milestone adjustments..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="w-full min-h-[60px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setStatusChange(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeStatusChange} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl shadow-glow">Confirm Status Change</button>
            </div>
          </div>
        </div>
      )}

      {escrowRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black">Release Escrow Funds</h3>
            <p className="text-xs text-gray-500 font-semibold">
              Releasing funds from <strong>{escrowRelease.projectName}</strong>. Max release: ₹{escrowRelease.maxAmount.toLocaleString('en-IN')}.
            </p>
            <div className="space-y-3 font-bold text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase block">Amount to Release (₹)</label>
                <input
                  type="number"
                  max={escrowRelease.maxAmount}
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  className="premium-input text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase block">Release Reason / Description</label>
                <textarea
                  placeholder="Completed Milestone 2 verification..."
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                  className="w-full min-h-[60px] p-3 bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEscrowRelease(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeRelease} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-xl shadow-glow">Approve Release</button>
            </div>
          </div>
        </div>
      )}

      {escrowHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black text-red-500">Lock / Hold Escrow Funds</h3>
            <p className="text-xs text-gray-500 font-semibold">
              Locking escrow payments for <strong>{escrowHold.projectName}</strong>. This halts all milestone disbursements.
            </p>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Reason for Hold</label>
              <textarea
                placeholder="Pending dispute investigation, quality checks..."
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                className="w-full min-h-[60px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEscrowHold(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeHold} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl">Confirm Hold</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
