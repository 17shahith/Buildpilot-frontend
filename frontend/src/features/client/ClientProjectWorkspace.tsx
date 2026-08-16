import React, { useState } from 'react';
import { clientMockService, ClientProject } from '../../services/clientMockService';
import { ChevronLeft, Info, CheckCircle2, AlertCircle, FileText, Send, Paperclip, DollarSign, Upload, Star, Clock, Heart, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export const ClientProjectWorkspace: React.FC<ClientProjectWorkspaceProps> = ({
  projectId,
  onBack
}) => {
  const [project, setProject] = useState<ClientProject | undefined>(
    clientMockService.getProjectById(projectId)
  );

  const [activeTab, setActiveTab] = useState<'Overview' | 'Milestones' | 'Budget' | 'Documents' | 'Photos' | 'Messages' | 'Team' | 'Activity'>('Overview');

  // Milestone Approval and Revision states
  const [reviewMilestoneId, setReviewMilestoneId] = useState<string>('');
  const [revisionComments, setRevisionComments] = useState<string>('');
  const [showRevisionForm, setShowRevisionForm] = useState<boolean>(false);

  // Document upload state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Drawing');

  // Photo upload state
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoMilestone, setPhotoMilestone] = useState('');

  // Messages state
  const [newMessage, setNewMessage] = useState('');

  // Rating review states
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewCommentsText, setReviewCommentsText] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

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

  const handleApproveMilestone = (milestoneId: string) => {
    const success = clientMockService.approveMilestone(project.id, milestoneId);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 }
      });
      alert('Milestone approved! Funds released from escrow wallet to the professional.');
      setProject(clientMockService.getProjectById(projectId));
      setReviewMilestoneId('');
    } else {
      alert('Failed to approve milestone.');
    }
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionComments.trim()) {
      alert('Please provide detailed instructions of the required changes.');
      return;
    }

    const success = clientMockService.requestMilestoneRevision(project.id, reviewMilestoneId, revisionComments.trim());
    if (success) {
      alert('Revision request logged and dispatched to professional.');
      setProject(clientMockService.getProjectById(projectId));
      setReviewMilestoneId('');
      setRevisionComments('');
      setShowRevisionForm(false);
    } else {
      alert('Failed to request revision.');
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const success = clientMockService.uploadDocument(project.id, {
      name: docName.trim(),
      type: docType
    });

    if (success) {
      alert('Document recorded successfully!');
      setProject(clientMockService.getProjectById(projectId));
      setDocName('');
    } else {
      alert('Failed to upload document.');
    }
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoCaption.trim()) return;

    const success = clientMockService.uploadProgressPhoto(project.id, photoMilestone, photoCaption.trim());
    if (success) {
      alert('Progress photo recorded in project timeline gallery!');
      setProject(clientMockService.getProjectById(projectId));
      setPhotoCaption('');
      setPhotoMilestone('');
    } else {
      alert('Failed to add photo.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    clientMockService.sendMessage(project.id, newMessage.trim());
    setProject(clientMockService.getProjectById(projectId));
    setNewMessage('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    clientMockService.submitReview(project.id, {
      overall: ratingVal,
      comments: reviewCommentsText.trim()
    });
    setReviewSubmitted(true);
    alert('Thank you! Your feedback has been recorded and added to the professional profile.');
  };

  const tabs = ['Overview', 'Milestones', 'Budget', 'Documents', 'Photos', 'Messages', 'Team', 'Activity'] as const;

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
                <span className={`text-[9px] px-2 py-0.5 rounded-lg border font-black uppercase ${
                  project.status === 'Active' ? 'bg-blue-50 border-blue-150 text-blue-600' : 'bg-green-50 border-green-150 text-green-600'
                }`}>
                  {project.status}
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-bold block mt-0.5">Hired Pro: {project.professionalName} ({project.role})</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase font-black block">Construction Progress</span>
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
                Project Scope & Details
              </h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                {project.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Client Requirements</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500 font-bold">
                  {project.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              {project.status === 'Completed' && (
                <div className="bg-green-50 border border-green-200 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black text-green-800 uppercase flex items-center space-x-1">
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                    <span>Project Complete!</span>
                  </h4>
                  <p className="text-xs text-green-700 font-bold">
                    All milestones have been audited, and escrow balances have been released. Please leave a rating feedback for your professional partner below:
                  </p>

                  {!reviewSubmitted ? (
                    <form onSubmit={handleSubmitReview} className="space-y-3.5 bg-white p-4 border border-green-200 rounded-xl text-xs font-bold text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span>Overall Rating:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingVal(star)}
                              className="text-yellow-500 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-5 h-5 ${ratingVal >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 block uppercase">Review & Feedback Remarks</label>
                        <textarea
                          rows={2}
                          required
                          value={reviewCommentsText}
                          onChange={(e) => setReviewCommentsText(e.target.value)}
                          placeholder="Describe communication quality, timelines compliance, and work quality..."
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-white border border-green-200 text-green-800 rounded-xl text-center text-xs font-bold">
                      Feedback submitted successfully. Thank you!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Timeline parameters
              </h3>
              <div className="space-y-3.5 text-xs font-bold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Contract Start</span>
                  <span className="text-brandDark-black font-black font-mono">{project.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Deadline</span>
                  <span className="text-brandDark-black font-black font-mono">{project.deadline}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Budget Escrow Protection</span>
                  <span className="text-green-600 font-black uppercase font-mono">{project.paymentStatus}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span>Contract Sum Value</span>
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
                Milestone Approval Checklist
              </h3>
              
              <div className="space-y-3">
                {project.milestones.map((m, idx) => (
                  <div key={m.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 hover:border-slate-200 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div>
                        <h4 className="text-xs font-black text-brandDark-black">{idx + 1}. {m.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{m.description}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-lg border uppercase tracking-wider w-fit font-black font-mono ${
                        m.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-600' : m.status === 'Submitted' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="font-mono">Timeline due: {m.dueDate}</span>
                      <span className="text-slate-500 font-black">Release Capital: ₹{m.paymentAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${m.progress}%` }}></div>
                    </div>

                    {/* Deliverables details */}
                    {m.deliverables.length > 0 && (
                      <div className="pt-2 space-y-1.5 border-t border-slate-200/50">
                        <span className="text-[9px] text-slate-400 uppercase font-black block">Submitted Deliverables:</span>
                        {m.deliverables.map((d, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-white border border-slate-150 rounded-xl text-[10px] font-bold text-slate-500">
                            <span>{d.name} ({d.type})</span>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); alert(`Previewing deliverable: ${d.name}`); }}
                              className="text-primary hover:text-primary-dark font-black"
                            >
                              View File
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.status === 'Submitted' && (
                      <div className="pt-2.5 flex justify-end gap-2 border-t border-slate-200/50">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewMilestoneId(m.id);
                            setShowRevisionForm(true);
                          }}
                          className="px-3.5 py-2 border border-slate-200 hover:border-slate-350 hover:bg-white rounded-xl text-[10px] font-black text-slate-500 transition-all"
                        >
                          Request Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveMilestone(m.id)}
                          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-black transition-all shadow-sm"
                        >
                          Approve & Release Payments
                        </button>
                      </div>
                    )}

                    {m.revisionComments && (
                      <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-[10px] text-red-800 font-bold">
                        <strong>Requested revision:</strong> "{m.revisionComments}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revision request dialog panel */}
            <div className="space-y-6">
              {showRevisionForm && reviewMilestoneId && (
                <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm animate-in fade-in duration-200">
                  <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                    Request Structural Revision
                  </h3>
                  <form onSubmit={handleRequestRevision} className="space-y-4 text-xs font-bold text-slate-600">
                    <p className="leading-normal">Please specify exactly what needs adjustment or correction before milestone payouts can be released.</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 block uppercase">Revision Instructions</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="e.g. Please update wall tiling thickness specifications in the CAD blueprint..."
                        value={revisionComments}
                        onChange={(e) => setRevisionComments(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRevisionForm(false);
                          setReviewMilestoneId('');
                        }}
                        className="flex-1 py-2 border border-slate-200 hover:border-slate-350 rounded-xl text-[10px] font-black text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-black shadow-sm"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-2.5 text-[10px] font-black text-blue-800 uppercase tracking-wider">
                <Info className="w-4.5 h-4.5 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="block font-black mb-1">Escrow Payout Guidelines</span>
                  Funds held in escrow are released to the expert only when you explicitly approve the milestone stage. Revisions can be requested at any stage prior to approval.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'Budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-5 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Budget Allocation Summary
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Approved Budget</span>
                  <span className="text-base font-black text-brandDark-black font-mono">₹{project.budget.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Released to Pro</span>
                  <span className="text-base font-black text-green-600 font-mono">₹{project.spent.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Remaining Escrow</span>
                  <span className="text-base font-black text-[#EA580C] font-mono">₹{project.remaining.toLocaleString()}</span>
                </div>
              </div>

              {/* Escrow Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Released Wallet Allocation</span>
                  <span>{Math.floor((project.spent / project.budget) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${(project.spent / project.budget) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Payment Milestones
              </h3>
              <div className="space-y-3">
                {project.milestones.map((m, idx) => (
                  <div key={m.id} className="flex justify-between items-center text-xs font-bold text-slate-500 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span>{idx + 1}. {m.name}</span>
                    <span className={`font-mono font-black ${
                      m.status === 'Approved' ? 'text-green-600' : 'text-slate-400'
                    }`}>
                      ₹{m.paymentAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'Documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Project Folder Documents
              </h3>

              <div className="space-y-2">
                {project.documents.map((d) => (
                  <div key={d.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-bold text-slate-500">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="text-brandDark-black font-black block leading-none">{d.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">Version: {d.version} • Uploaded by {d.uploadedBy} on {d.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Opening document: ${d.name}`)}
                      className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 hover:bg-white rounded-xl text-[10px] font-black text-slate-500 transition-all"
                    >
                      View
                    </button>
                  </div>
                ))}
                {project.documents.length === 0 && (
                  <div className="text-center py-6 text-xs font-bold text-slate-400">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>

            {/* Document Uploader */}
            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Upload File
              </h3>
              <form onSubmit={handleUploadDocument} className="space-y-4 text-xs font-bold text-slate-600">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 block uppercase">Document File Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Survey_Report.pdf"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 block uppercase">Category Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white"
                  >
                    <option value="Contract">Signed Contract</option>
                    <option value="Drawing">Structural Design / Sketch</option>
                    <option value="Invoice">Receipt / Invoice</option>
                    <option value="Report">Inspection report</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'Photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Progress Gallery Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.photos.map((ph) => (
                  <div key={ph.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between hover:shadow-sm transition-all">
                    <img src={ph.url} alt={ph.caption} className="w-full h-32 object-cover border-b border-slate-100" />
                    <div className="p-3 space-y-1 text-[10px] font-bold text-slate-500">
                      <p className="text-brandDark-black font-black">{ph.caption}</p>
                      <span>Date: {ph.date} • By {ph.uploadedBy}</span>
                    </div>
                  </div>
                ))}
                {project.photos.length === 0 && (
                  <div className="col-span-full text-center py-10 text-xs font-bold text-slate-400">
                    No site photos loaded in timeline.
                  </div>
                )}
              </div>
            </div>

            {/* Photo Uploader */}
            <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
              <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
                Add Progress Photo
              </h3>
              <form onSubmit={handleUploadPhoto} className="space-y-4 text-xs font-bold text-slate-600">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 block uppercase">Caption Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Demolition work completed on partition walls..."
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 block uppercase">Link to Milestone</label>
                  <select
                    value={photoMilestone}
                    onChange={(e) => setPhotoMilestone(e.target.value)}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white"
                  >
                    <option value="">Select Associated Step...</option>
                    {project.milestones.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="border border-slate-200 border-dashed rounded-xl p-4 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 block">Select site snapshot</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black shadow-sm transition-all"
                >
                  Save Photo
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'Messages' && (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm flex flex-col h-[500px]">
            <div className="pb-3 border-b border-slate-100 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs uppercase">
                {project.professionalName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-black text-brandDark-black block leading-none">{project.professionalName}</span>
                <span className="text-[9px] text-green-500 font-bold block mt-1">Project Thread</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {project.messages.map((m, i) => {
                const isPro = m.role === 'Professional';
                return (
                  <div key={i} className={`flex ${!isPro ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3.5 rounded-2xl text-xs font-bold leading-normal max-w-[70%] border shadow-sm ${
                      !isPro 
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
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => alert('Attachments dialogue')}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Type a message to the team..."
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

        {/* TEAM TAB */}
        {activeTab === 'Team' && (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
              Project Hired Experts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.team.map((t, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase border border-primary/20">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-brandDark-black block">{t.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{t.role} • {t.specialization}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-yellow-500 font-black block">{t.rating} ★</span>
                    <button
                      onClick={() => {
                        setActiveTab('Messages');
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-[9px] font-black text-slate-600 rounded-lg flex items-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY LOG TAB */}
        {activeTab === 'Activity' && (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
              Project Auditable Activity Log
            </h3>
            
            <div className="space-y-3.5">
              {project.activityLog.map((log, i) => (
                <div key={i} className="flex space-x-3 text-xs font-bold text-slate-500">
                  <span className="font-mono text-[10px] text-slate-400 pt-0.5">{log.date}</span>
                  <div className="flex-1 bg-slate-50 p-3 border border-slate-100 rounded-xl">
                    <p className="text-brandDark-black">{log.action}</p>
                    <span className="text-[9px] text-slate-400 block mt-1">Logged by: {log.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Paperclip: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);
