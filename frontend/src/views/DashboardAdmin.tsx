import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

const DashboardAdmin: React.FC = () => {
  // Verification queue data
  const [prosQueue, setProsQueue] = useState([
    { id: '1', name: 'John Doe', role: 'Plumber', license: 'LP-982736', date: 'Jul 24', status: 'Pending' },
    { id: '2', name: 'James Carter', role: 'Electrician', license: 'LE-873645', date: 'Jul 25', status: 'Pending' }
  ]);

  // Mod flagged posts queue
  const [flaggedPosts, setFlaggedPosts] = useState([
    { id: 'f1', type: 'Property Listing', title: 'Unverified Cabin Plot', reason: 'Suspected fake deeds documentation', date: 'Jul 25' }
  ]);

  const handleApprovePro = (id: string, name: string) => {
    setProsQueue(prev => prev.filter(p => p.id !== id));
    confetti({
      particleCount: 40,
      spread: 30,
      origin: { y: 0.6 }
    });
    alert(`Professional registration for ${name} has been approved and issued a Verified Badge!`);
  };

  const handleDeclinePro = (id: string, name: string) => {
    setProsQueue(prev => prev.filter(p => p.id !== id));
    alert(`Registration for ${name} declined and ticket resolved.`);
  };

  const handleIgnoreFlag = (id: string) => {
    setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    alert('Post flag cleared. Content restored as active.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Info */}
      <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white light-theme:text-brandDark-black font-display">System Operations Admin Console</h1>
            <p className="text-xs text-gray-500 font-semibold">Security Access Level: Master Administrator</p>
          </div>
        </div>
      </div>

      {/* Grid: Metrics, Approval Queue, Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue & Flag Logs (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Queue */}
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h2 className="text-sm font-extrabold text-white light-theme:text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-brandDark-border/60">
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Professional Verification Queue</span>
            </h2>

            <div className="space-y-3">
              {prosQueue.map((pro) => (
                <div
                  key={pro.id}
                  className="p-4 bg-brandDark-black/40 border border-brandDark-border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs light-theme:bg-white light-theme:border-brandLight-border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white light-theme:text-brandDark-black">{pro.name}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{pro.role}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">License ID: {pro.license} • Applied {pro.date}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeclinePro(pro.id, pro.name)}
                      className="px-3 py-1.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold rounded-lg transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprovePro(pro.id, pro.name)}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all shadow-glow"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}

              {prosQueue.length === 0 && (
                <p className="text-center text-xs text-gray-500 py-6">All professional license verification tickets resolved.</p>
              )}
            </div>
          </div>

          {/* Flagged Content Queue */}
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h2 className="text-sm font-extrabold text-white light-theme:text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-brandDark-border/60">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Flagged Marketplace Listings</span>
            </h2>

            <div className="space-y-3">
              {flaggedPosts.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 bg-brandDark-black/40 border border-brandDark-border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs light-theme:bg-white light-theme:border-brandLight-border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white light-theme:text-brandDark-black">{flag.title}</span>
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{flag.type}</span>
                    </div>
                    <p className="text-[10px] text-red-400 font-medium">Issue: {flag.reason}</p>
                    <span className="text-[9px] text-gray-500 block">Flagged on {flag.date}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFlaggedPosts(prev => prev.filter(f => f.id !== flag.id));
                        alert('Listing has been suspended and taken down.');
                      }}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
                    >
                      De-list Post
                    </button>
                    <button
                      onClick={() => handleIgnoreFlag(flag.id)}
                      className="px-3 py-1.5 border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white rounded-lg transition-all"
                    >
                      Clear Flag
                    </button>
                  </div>
                </div>
              ))}

              {flaggedPosts.length === 0 && (
                <p className="text-center text-xs text-gray-500 py-6">All listings flags clear.</p>
              )}
            </div>
          </div>
        </div>

        {/* Platform Ledger Metrics Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-5 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center space-x-2">
              <Coins className="w-4 h-4 text-primary" />
              <span>Escrow Commission Ledger</span>
            </h3>

            {[
              { label: 'Total Commissions Net', value: '₹45,820', sub: 'Calculated 4% fee structure' },
              { label: 'Weekly Platform Volume', value: '₹1,142,000', sub: 'Buy, rent and builder milestones' },
              { label: 'Transactions Active', value: '148', sub: 'In progress escrows' }
            ].map((metric, i) => (
              <div key={i} className="p-4 bg-brandDark-black/40 border border-brandDark-border rounded-xl space-y-1 text-xs light-theme:bg-white light-theme:border-brandLight-border">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">{metric.label}</span>
                <p className="text-xl font-extrabold text-white light-theme:text-brandDark-black tracking-tight">{metric.value}</p>
                <span className="text-[10px] text-gray-500 font-medium block">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
