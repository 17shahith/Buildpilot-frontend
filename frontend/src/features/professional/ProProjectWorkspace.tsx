import React, { useState } from 'react';
import { professionalMockService } from '../../services/professionalMockService';
import type { ProProject } from '../../services/professionalMockService';
import { ChevronLeft, Info, AlertCircle, FileText, Send, Paperclip, DollarSign, Upload } from 'lucide-react';

interface ProProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export const ProProjectWorkspace: React.FC<ProProjectWorkspaceProps> = ({ 
  projectId, 
  onBack 
}) => {
  const [project, setProject] = useState<ProProject | undefined>(
    professionalMockService.getProjectById(projectId)
  );

  const [activeTab, setActiveTab] = useState<'Overview' | 'Milestones' | 'Deliverables' | 'Documents' | 'Messages' | 'Payments'>('Overview');

  // Input states for workspace interactions
  const [milestoneProgress, setMilestoneProgress] = useState<string>('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  
  // Deliverable upload states
  const [delivName, setDelivName] = useState('');
  const [delivType, setDelivType] = useState('PDF');
  const [delivMilestoneId, setDelivMilestoneId] = useState('');
  
  // Chat state
  const [newMessage, setNewMessage] = useState('');

  if (!project) {
    return (
      <div className="bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-sm font-black text-slate-700">Project Not Found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const handleUpdateMilestone = (milestoneId: string) => {
    const prog = Number(milestoneProgress);
    if (Number.isNaN(prog) || prog < 0 || prog > 100) {
      alert('Please enter a valid progress percentage (0-100).');
      return;
    }

    professionalMockService.updateMilestoneProgress(project.id, milestoneId, prog);
    alert('Milestone progress updated successfully!');
    setProject(professionalMockService.getProjectById(projectId));
    setMilestoneProgress('');
    setSelectedMilestoneId('');
  };

  const handleSubmitMilestoneForApproval = (milestoneId: string) => {
    professionalMockService.updateMilestoneProgress(project.id, milestoneId, 100);
    alert('Milestone completed and submitted for Client approval! A notification has been dispatched.');
    setProject(professionalMockService.getProjectById(projectId));
  };

  const handleUploadDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivName.trim() || !delivMilestoneId) {
      alert('Please fill out the deliverable name and target milestone.');
      return;
    }

    const success = professionalMockService.uploadDeliverable(project.id, delivMilestoneId, {
      name: delivName.trim(),
      url: '#',
      type: delivType
    });

    if (success) {
      alert('Deliverable uploaded and recorded successfully!');
      setProject(professionalMockService.getProjectById(projectId));
      setDelivName('');
      setDelivMilestoneId('');
    } else {
      alert('Failed to upload deliverable.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    professionalMockService.sendMessage(project.id, newMessage.trim());
    setProject(professionalMockService.getProjectById(projectId));
    setNewMessage('');
  };

  const tabs = ['Overview', 'Milestones', 'Deliverables', 'Documents', 'Messages', 'Payments'] as const;

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl text-slate-500 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-black text-brandDark-black flex items-center space-x-2">
                <span>{project.name}</span>
                <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-500 font-black uppercase">
                  {project.role}
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-bold block mt-0.5">Assigned Client: {project.clientName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Project Progress</span>
              <span className="text-sm font-black text-brandDark-black font-mono">{project.progress}%</span>
            </div>
            <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-100 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 text-xs font-black whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <div className="min-h-[400px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Detailed Specifications
              </h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                {project.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Project Scope Requirements</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500 font-bold">
                  {project.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Professional Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500 font-bold">
                  {project.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Execution Stats
              </h3>
              <div className="space-y-3.5 text-xs font-bold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Start Date</span>
                  <span className="text-brandDark-black font-black font-mono">{project.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Final Deadline</span>
                  <span className="text-brandDark-black font-black font-mono">{project.deadline}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Days Budgeted</span>
                  <span className="text-brandDark-black font-black font-mono">{project.timelineDays} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Schedule</span>
                  <span className="text-primary font-black uppercase font-mono">{project.paymentStatus}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span>Total Value</span>
                  <span className="text-lg font-black text-brandDark-black font-mono">₹{project.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'Milestones' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Milestones & Verification Checklist
              </h3>
              
              <div className="space-y-3">
                {project.milestones.map((m, idx) => (
                  <div key={m.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 hover:border-slate-200 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <h4 className="text-xs font-black text-brandDark-black">{idx + 1}. {m.name}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-lg border uppercase tracking-wider w-fit font-black font-mono ${
                        m.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-600' : m.status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span className="font-mono">Due: {m.dueDate}</span>
                      <span>Progress: {m.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${m.progress}%` }}></div>
                    </div>

                    {m.status !== 'Completed' && (
                      <div className="pt-2 flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMilestoneId(m.id);
                            setMilestoneProgress(String(m.progress));
                          }}
                          className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-white rounded-lg text-[10px] font-black text-slate-500"
                        >
                          Quick Progress Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitMilestoneForApproval(m.id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-black"
                        >
                          Submit For Client Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Update Panel */}
            <div className="space-y-6">
              {selectedMilestoneId && (
                <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                    Update Progress Value
                  </h3>
                  <div className="space-y-4 text-xs font-bold text-slate-600">
                    <p className="leading-relaxed">Adjust progress percentage (0 - 100) for the active milestone step.</p>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Progress Value (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 75"
                        value={milestoneProgress}
                        onChange={(e) => setMilestoneProgress(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMilestoneId('')}
                        className="flex-1 py-2 border border-slate-200 hover:border-slate-350 rounded-xl text-[10px] font-black text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateMilestone(selectedMilestoneId)}
                        className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-black"
                      >
                        Save Progress
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#FFF7ED] border border-[#FED7AA] p-5 rounded-2xl flex items-start space-x-2 text-[10px] font-black text-[#EA580C] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#EA580C] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black mb-1">Authorization Check</span>
                  Only the Client/Customer holds the authority to mark a milestone as fully approved and unlock the corresponding escrow payments.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELIVERABLES TAB */}
        {activeTab === 'Deliverables' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Uploaded Design & Planning Deliverables
              </h3>
              
              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div key={m.id} className="space-y-2">
                    {m.deliverables.map((d, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-500 text-xs font-black uppercase font-mono">
                            {d.type}
                          </div>
                          <div>
                            <span className="text-xs font-black text-brandDark-black block">{d.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold block">Uploaded {d.date} • Milestone: {m.name}</span>
                          </div>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert(`Downloading file: ${d.name}`); }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
                {project.milestones.every(m => m.deliverables.length === 0) && (
                  <div className="text-center py-10 text-xs font-bold text-slate-400 space-y-2">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>No deliverables uploaded for this project yet. Use the upload panel to submit plans.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deliverable Uploader Form */}
            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Mock Deliverable Uploader
              </h3>
              <form onSubmit={handleUploadDeliverable} className="space-y-4 text-xs font-bold text-slate-600">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Deliverable File Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical_Plan_v1.pdf"
                    value={delivName}
                    onChange={(e) => setDelivName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">File Type Format</label>
                  <select
                    value={delivType}
                    onChange={(e) => setDelivType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 bg-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DWG">AutoCAD Drawing (DWG)</option>
                    <option value="Image">JPG/PNG Render</option>
                    <option value="Report">Excel Sheet (XLSX)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Associate Milestone Step</label>
                  <select
                    value={delivMilestoneId}
                    onChange={(e) => setDelivMilestoneId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 bg-white"
                  >
                    <option value="">Select Target Milestone...</option>
                    {project.milestones.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Bind File</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'Documents' && (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
              Contract & Verification Documents
            </h3>
            
            <div className="space-y-2">
              {project.documents.map((d) => (
                <div key={d.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <span className="text-xs font-black text-brandDark-black block">{d.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold block">Category: {d.type} • Uploaded by {d.uploadedBy} on {d.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Opening document: ${d.name}`)}
                    className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-white rounded-lg text-[10px] font-black text-slate-500"
                  >
                    View
                  </button>
                </div>
              ))}
              {project.documents.length === 0 && (
                <div className="text-center py-8 text-xs font-bold text-slate-400">
                  No contracts or verification files loaded for this project yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'Messages' && (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm flex flex-col h-[500px]">
            {/* Conversation Header */}
            <div className="pb-3 border-b border-slate-100 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs uppercase">
                {project.clientName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-black text-brandDark-black block leading-none">{project.clientName}</span>
                <span className="text-[9px] text-green-500 font-bold block mt-1">Direct Client Chat</span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {project.messages.map((m, i) => {
                const isPro = m.role === 'Professional';
                return (
                  <div key={i} className={`flex ${isPro ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3.5 rounded-2xl text-xs font-bold leading-normal max-w-[70%] border shadow-sm ${
                      isPro 
                        ? 'bg-primary/5 border-primary/20 text-brandDark-black rounded-tr-none' 
                        : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none'
                    }`}>
                      <span className="text-[9px] text-slate-400 font-black block uppercase mb-1">{m.sender}</span>
                      <p>{m.text}</p>
                      <span className="text-[8px] text-slate-400 block text-right mt-1.5 font-mono">{m.time}</span>
                    </div>
                  </div>
                );
              })}
              {project.messages.length === 0 && (
                <div className="text-center py-20 text-xs font-bold text-slate-400">
                  Send your first message to alignment with {project.clientName}.
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => alert('Attachments dialog')}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message to your client..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary text-slate-700"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'Payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-5 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Project Escrow Fund Status
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Total Deposited</span>
                  <span className="text-base font-black text-brandDark-black font-mono">₹{project.escrow.deposited.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Amount Released</span>
                  <span className="text-base font-black text-green-600 font-mono">₹{project.escrow.released.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Remaining Held</span>
                  <span className="text-base font-black text-[#EA580C] font-mono">₹{project.escrow.remaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-500 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div className="flex justify-between items-center text-brandDark-black pb-2 border-b border-slate-200/50">
                  <span>Escrow Account Allocation Status</span>
                  <span className="text-[9px] bg-green-50 border border-green-200 text-green-600 px-2 py-0.5 rounded-lg font-black uppercase font-mono">
                    Secured
                  </span>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Funds deposited by Client</span>
                    <span className="text-brandDark-black font-black font-mono">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Release Requests</span>
                    <span className="text-brandDark-black font-black font-mono">₹{project.escrow.pendingRelease.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Workflow Notice */}
            <div className="bg-[#FFF7ED] border border-[#FED7AA] p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-[#EA580C] uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-[#FED7AA]">
                <DollarSign className="w-4 h-4 text-[#EA580C]" />
                <span>Payment release flow</span>
              </h3>
              <div className="text-[10px] font-black text-[#EA580C] uppercase tracking-wider space-y-3 leading-relaxed">
                <p>Escrow balances are locked in secure wallets during milestones.</p>
                <div className="space-y-1.5 font-bold text-xs lowercase text-[#EA580C]/80 normal-case">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[9px] font-black">1</span>
                    <span>Client deposits budget in escrow.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[9px] font-black">2</span>
                    <span>Professional delivers the milestone drawings.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[9px] font-black">3</span>
                    <span>Professional submits milestone for review.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[9px] font-black">4</span>
                    <span>Client approves delivery and releases funds.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
