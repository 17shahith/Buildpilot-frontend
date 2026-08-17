import React, { useState } from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { FileText, ArrowRight } from 'lucide-react';

interface ProProposalsProps {
  setActiveView: (view: string) => void;
}

export const ProProposals: React.FC<ProProposalsProps> = ({ 
  setActiveView
}) => {
  const [proposals, setProposals] = useState(professionalMockService.getProposals());
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('All');

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'All') return true;
    return p.status === activeTab;
  });

  const handleStartProject = (proposalId: string) => {
    const success = professionalMockService.acceptProposalAndStartProject(proposalId);
    if (success) {
      alert('Project successfully initialized! Navigating to your Active Projects...');
      setProposals(professionalMockService.getProposals());
      setActiveView('projects');
    } else {
      alert('Failed to start project.');
    }
  };

  const tabs = ['All', 'Pending', 'Accepted', 'Rejected'] as const;

  return (
    <div className="space-y-6">
      {/* Header and Filter Tabs */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display">My Submitted Proposals</h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Track reviews, price quotes, and start contract work for accepted estimates.</p>
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

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm hover:border-slate-200 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-black text-brandDark-black">{p.projectTitle}</h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Submitted: {p.submittedDate} • Duration: {p.durationDays} Days</span>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg border uppercase tracking-wider font-black font-mono w-fit ${
                p.status === 'Accepted' ? 'bg-green-50 border-green-200 text-green-600' : p.status === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Your Proposed Methodology</span>
                <p className="text-xs text-slate-600 leading-relaxed font-bold">{p.approach}</p>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Proposed Milestones</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {p.milestones.map((m, idx) => (
                    <span key={idx} className="text-[9px] bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500 font-bold">
                      {idx + 1}. {m.split(' (')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black block">Price Bid Quote</span>
                <span className="text-base font-black text-brandDark-black font-mono">₹{p.proposedPrice.toLocaleString()}</span>
              </div>

              {p.status === 'Accepted' && (
                <button
                  onClick={() => handleStartProject(p.id)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>Initialize Active Project</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredProposals.length === 0 && (
          <div className="bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3 shadow-sm">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No {activeTab} Proposals</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
              Any proposals that match this status tab will appear here. Go to the project list to find matching opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
