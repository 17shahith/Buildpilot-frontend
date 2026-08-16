import React, { useState, useEffect } from 'react';
import { X, MessageSquare, History } from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';
import type { Dispute } from '../../services/adminMockService';

export const DisputesReports: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  // Resolution dialog
  const [resolveAction, setResolveAction] = useState<{
    disputeId: string;
    actionType: 'refund' | 'release' | 'split';
  } | null>(null);
  const [resolutionReason, setResolutionReason] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = () => {
    setDisputes(adminMockService.getDisputes());
  };

  const handleOpenDetails = (disp: Dispute) => {
    setSelectedDispute(disp);
    // Add audit log for investigating
    adminMockService.addAuditLog('Admin opened dispute investigation', 'Dispute', disp.id, `Viewing files & messages`);
  };

  const handleResolveClick = (disputeId: string, actionType: 'refund' | 'release' | 'split') => {
    setResolveAction({ disputeId, actionType });
    setResolutionReason('');
  };

  const executeResolution = () => {
    if (!resolveAction) return;
    const { disputeId, actionType } = resolveAction;

    const success = adminMockService.resolveDispute(disputeId, actionType, resolutionReason);
    if (success) {
      alert(`Dispute successfully resolved with action: ${actionType.toUpperCase()}`);
      loadDisputes();
      setSelectedDispute(null);
    } else {
      alert('Failed to resolve dispute.');
    }
    setResolveAction(null);
  };

  // Stats
  const highPriority = disputes.filter(d => d.status === 'High Priority').length;
  const underReview = disputes.filter(d => d.status === 'Under Review').length;
  const resolved = disputes.filter(d => d.status === 'Resolved').length + 48; // offset from prompt

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl border border-brandLight-border bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">High Priority Disputes</span>
            <span className="p-1 px-2 text-[10px] font-black text-red-500 bg-red-50 border border-red-200 rounded-lg">Critical</span>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">{highPriority}</h3>
        </div>

        <div className="p-5 rounded-3xl border border-brandLight-border bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Under Review</span>
            <span className="p-1 px-2 text-[10px] font-black text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg">Reviewing</span>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">{underReview}</h3>
        </div>

        <div className="p-5 rounded-3xl border border-brandLight-border bg-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Resolved Cases</span>
            <span className="p-1 px-2 text-[10px] font-black text-green-500 bg-green-50 border border-green-200 rounded-lg">Closed</span>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">{resolved}</h3>
        </div>
      </div>

      {/* Main Dispute List */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Active Disputes</h2>
        <div className="space-y-3">
          {disputes.map((d) => (
            <div 
              key={d.id} 
              className="p-4 bg-brandLight-panel border border-brandLight-border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-bold"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-brandDark-black text-sm">{d.projectName}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    d.status === 'High Priority' ? 'bg-red-50 text-red-500 border border-red-200' :
                    d.status === 'Under Review' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                    'bg-green-50 text-green-500 border border-green-200'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                  Customer: <strong className="text-gray-600">{d.customerName}</strong> • Defendant: <strong className="text-gray-600">{d.defendantName}</strong>
                </p>
                <p className="text-[10px] text-red-500 font-medium max-w-xl truncate mt-1">Issue: {d.reason}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-brandDark-black font-display">₹{d.amount.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => handleOpenDetails(d)}
                  className="px-3.5 py-2 bg-brandLight-slate hover:bg-brandLight-border text-brandDark-black font-black rounded-xl transition-colors"
                >
                  Investigate
                </button>
              </div>
            </div>
          ))}

          {disputes.length === 0 && (
            <p className="text-center py-6 text-gray-400 italic">No open disputes reported.</p>
          )}
        </div>
      </div>

      {/* Investigation Details Drawer / Overlay */}
      {selectedDispute && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-fade-in animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-brandLight-border">
              <div>
                <h3 className="text-sm font-black text-brandDark-black">Investigating: {selectedDispute.projectName}</h3>
                <p className="text-[10px] text-gray-400 font-mono">Dispute ID: {selectedDispute.id}</p>
              </div>
              <button 
                onClick={() => setSelectedDispute(null)}
                className="p-1.5 bg-brandLight-slate hover:bg-brandLight-border text-gray-500 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Side: Summary, evidence, Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* Meta details */}
                <div className="p-4 rounded-2xl bg-brandLight-panel border border-brandLight-border/50 text-[11px] font-bold space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Filing Party (Customer)</span>
                      <span className="text-brandDark-black font-extrabold">{selectedDispute.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Responding Party</span>
                      <span className="text-brandDark-black font-extrabold">{selectedDispute.defendantName} ({selectedDispute.defendantRole})</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-brandLight-border/50">
                    <span className="text-[9px] text-gray-400 block uppercase">Disputed Amount</span>
                    <span className="text-sm font-black text-brandDark-black font-display">₹{selectedDispute.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-brandLight-border/50">
                    <span className="text-[9px] text-gray-400 block uppercase">Complaint Description</span>
                    <p className="text-[11px] text-gray-600 leading-relaxed font-semibold mt-1 bg-white p-3 border border-brandLight-border rounded-xl">
                      {selectedDispute.reason}
                    </p>
                  </div>
                </div>

                {/* Evidence list */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Submitted Evidence & Documentation</h4>
                  <div className="space-y-2">
                    {selectedDispute.evidence.map((ev, idx) => (
                      <div key={idx} className="p-3 bg-brandLight-panel border border-brandLight-border rounded-xl flex justify-between items-center text-xs font-bold">
                        <div>
                          <p className="text-brandDark-black text-[11px]">{ev.name}</p>
                          <p className="text-[9px] text-gray-400 font-semibold">{ev.type} • Uploaded {ev.date}</p>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert('Downloading evidence preview...'); }}
                          className="px-2.5 py-1 bg-white border border-brandLight-border rounded-lg text-[9px] font-black hover:bg-brandLight-slate transition-colors"
                        >
                          View File
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispute timeline */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-gray-400" />
                    <span>Dispute Process Log</span>
                  </h4>
                  <div className="space-y-3 relative pl-3.5 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-brandLight-border">
                    {selectedDispute.timeline.map((step, idx) => (
                      <div key={idx} className="text-[10px] font-bold relative before:absolute before:-left-4 before:top-1 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary">
                        <p className="text-brandDark-black">{step.step}</p>
                        <span className="text-[9px] text-gray-400 font-mono block mt-0.5">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Communication Logs & Resolution Control */}
              <div className="space-y-6">
                {/* Resolution Controls */}
                {selectedDispute.status !== 'Resolved' && (
                  <div className="p-5 rounded-2xl border border-brandLight-border space-y-3.5 bg-brandLight-panel">
                    <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Arbitration Panel</h4>
                    <div className="space-y-2 flex flex-col">
                      <button
                        onClick={() => handleResolveClick(selectedDispute.id, 'refund')}
                        className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all shadow-glow"
                      >
                        Refund Customer Entirely
                      </button>
                      <button
                        onClick={() => handleResolveClick(selectedDispute.id, 'release')}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-xl transition-all"
                      >
                        Release Funds to Pro
                      </button>
                      <button
                        onClick={() => handleResolveClick(selectedDispute.id, 'split')}
                        className="w-full py-2 border border-brandLight-border bg-white hover:bg-brandLight-slate text-brandDark-black text-xs font-black rounded-xl transition-all"
                      >
                        Authorize Split Settlement
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages feed */}
                <div className="p-5 rounded-2xl border border-brandLight-border space-y-3">
                  <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span>Dispute Chat Log</span>
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedDispute.messages.map((m, idx) => (
                      <div key={idx} className="text-[10px] font-bold space-y-0.5">
                        <div className="flex justify-between text-gray-400">
                          <span>{m.sender}</span>
                          <span className="font-mono text-[9px]">{m.time}</span>
                        </div>
                        <p className="p-2.5 bg-brandLight-panel border border-brandLight-border rounded-xl text-brandDark-black font-semibold">
                          {m.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Confirmation Modal */}
      {resolveAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black uppercase tracking-wide">
              Confirm Dispute Resolution: {resolveAction.actionType}
            </h3>

            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Are you sure you want to resolve this dispute? This will process financial settlements and close the investigation.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Resolution Reason / Settlement Detail</label>
              <textarea
                placeholder="Enter justification for the audit feed..."
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                className="w-full min-h-[70px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setResolveAction(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeResolution} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl shadow-glow">Confirm Settlement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
