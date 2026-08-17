import React, { useState } from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { Users, Star } from 'lucide-react';

interface ProClientsProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId: (id: string) => void;
}

export const ProClients: React.FC<ProClientsProps> = ({ 
  setActiveView,
  setSelectedProjectId 
}) => {
  const clients = professionalMockService.getClients();
  const projects = professionalMockService.getProjects();
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  // Filter projects associated with this client
  const clientProjects = selectedClient 
    ? projects.filter(p => p.clientId === selectedClient.id) 
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Clients list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-black text-brandDark-black font-display">Client Connections</h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">View client contacts, reviews, ratings, and associated projects.</p>
        </div>

        <div className="space-y-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-3xl border shadow-sm transition-all duration-300 flex justify-between items-center ${
                selectedClient?.id === c.id 
                  ? 'bg-primary/5 border-primary' 
                  : 'bg-white border-brandLight-border hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-700 uppercase">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-brandDark-black">{c.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{c.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedClient(c)}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white rounded-xl text-xs font-bold text-slate-600 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Detail View */}
      <div className="space-y-6">
        {selectedClient ? (
          <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-5 shadow-sm animate-in fade-in duration-200">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-700 text-lg uppercase mx-auto">
                {selectedClient.name.charAt(0)}
              </div>
              <h3 className="text-sm font-black text-brandDark-black">{selectedClient.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-xs text-yellow-500 font-black">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>{selectedClient.rating} Client Score</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-bold text-slate-500">
              <div className="flex justify-between items-center">
                <span>Active Work order</span>
                <span className="text-brandDark-black font-black font-mono">{selectedClient.activeProjects} Projects</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Completed works</span>
                <span className="text-brandDark-black font-black font-mono">{selectedClient.completedProjects} Projects</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total reviews left</span>
                <span className="text-brandDark-black font-black font-mono">{selectedClient.reviewsCount} reviews</span>
              </div>
            </div>

            {/* Projects associated with this client */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Contracts List</h4>
              <div className="space-y-2">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveView('project-workspace');
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-xl flex justify-between items-center cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-xs font-black text-brandDark-black block">{p.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Budget: ₹{p.budget.toLocaleString()} • {p.status}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-brandLight-border p-8 rounded-3xl text-center space-y-3 shadow-sm h-fit">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-xs font-black text-slate-700">Select a Client</h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-normal">
              Click "View Details" on any client contact cards to preview project schedules and direct messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
