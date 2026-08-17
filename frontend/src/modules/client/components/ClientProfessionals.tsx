import React from 'react';
import { clientMockService } from '../../../services/api/clientMockService';
import { Users, Star, MessageSquare } from 'lucide-react';

interface ClientProfessionalsProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId: (id: string) => void;
}

export const ClientProfessionals: React.FC<ClientProfessionalsProps> = ({
  setActiveView,
  setSelectedProjectId
}) => {
  const projects = clientMockService.getProjects();

  // Aggregate active hired team experts across active projects
  const teamPros: any[] = [];
  projects.forEach(p => {
    p.team.forEach(t => {
      if (!teamPros.find(tp => tp.email === t.email)) {
        teamPros.push({
          ...t,
          projectName: p.name,
          projectId: p.id
        });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
        <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>My Project Hired Professionals</span>
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">Coordinate directly with verified architects, interior designers, structural engineers, and general contractors.</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamPros.map((pro, i) => (
          <div
            key={i}
            className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase border border-primary/20">
                {pro.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-black text-brandDark-black">{pro.name}</h3>
                  {pro.verified && (
                    <span className="text-[7px] bg-green-50 border border-green-200 text-green-700 font-black px-1 py-0.2 rounded-md uppercase tracking-wider">
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{pro.role} • {pro.specialization}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-500 font-bold space-y-1">
              <div className="flex justify-between">
                <span>Hired Project:</span>
                <span className="text-brandDark-black font-black">{pro.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Email:</span>
                <span className="text-brandDark-black font-black font-mono">{pro.email}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span className="flex items-center text-yellow-500 font-black">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 mr-1" />
                <span>{pro.rating} rating</span>
              </span>

              <button
                onClick={() => {
                  setSelectedProjectId(pro.projectId);
                  setActiveView('project-workspace');
                }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-black text-slate-600 flex items-center space-x-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct Chat</span>
              </button>
            </div>
          </div>
        ))}

        {teamPros.length === 0 && (
          <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No Hired Professionals</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
              Hired experts will show up here after booking a consultation and initializing a contract in the Marketplace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
