import React, { useState } from 'react';
import { clientMockService } from '../../../services/api/clientMockService';
import { Heart, Users, Home, Cpu, Sparkles, ChevronRight } from 'lucide-react';

export const SavedItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pros' | 'properties' | 'estimates' | 'designs'>('pros');

  const savedPros = clientMockService.getSavedPros();
  const savedProps = clientMockService.getSavedProperties();
  const savedEstimates = clientMockService.getSavedEstimates();
  const savedDesigns = clientMockService.getSavedDesigns();

  const tabs = [
    { id: 'pros', label: 'Professionals', icon: <Users className="w-4 h-4" /> },
    { id: 'properties', label: 'Properties', icon: <Home className="w-4 h-4" /> },
    { id: 'estimates', label: 'Saved Estimates', icon: <Cpu className="w-4 h-4" /> },
    { id: 'designs', label: 'Saved Designs', icon: <Sparkles className="w-4 h-4" /> }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header and Tabs */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span>My Bookmarks & Favorites</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Quickly access saved contractor profiles, villa plots, cost sheets, and modular layouts.</p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <div className="min-h-[300px]">
        {/* PROFESSIONALS BOOKMARKS */}
        {activeTab === 'pros' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPros.map((p) => (
              <div key={p.id} className="bg-white border border-brandLight-border p-5 rounded-3xl flex justify-between items-center shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center space-x-3.5">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-full object-cover border border-slate-150" />
                  <div>
                    <h3 className="text-xs font-black text-brandDark-black">{p.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{p.role} • {p.location}</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-yellow-500 font-black block">{p.rating} ★</span>
                  <a
                    href="/main/marketplace"
                    className="text-[10px] font-black text-primary hover:text-primary-dark flex items-center space-x-0.5"
                  >
                    <span>Hire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
            {savedPros.length === 0 && (
              <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-2 shadow-sm text-xs font-bold text-slate-400">
                No bookmarked professional profiles.
              </div>
            )}
          </div>
        )}

        {/* PROPERTIES BOOKMARKS */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedProps.map((p) => (
              <div key={p.id} className="bg-white border border-brandLight-border p-4 rounded-3xl flex gap-4 shadow-sm hover:border-slate-200 transition-all">
                <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded-xl border border-slate-150" />
                <div className="flex-grow flex flex-col justify-between py-0.5 text-xs font-bold text-slate-500">
                  <div>
                    <h3 className="text-xs font-black text-brandDark-black leading-tight">{p.title}</h3>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{p.location}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-sm font-black text-primary font-mono">{p.price}</span>
                    <a
                      href="/main/marketplace"
                      className="text-[10px] font-black text-slate-500 hover:text-primary flex items-center space-x-0.5"
                    >
                      <span>Compare</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {savedProps.length === 0 && (
              <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-2 shadow-sm text-xs font-bold text-slate-400">
                No bookmarked properties.
              </div>
            )}
          </div>
        )}

        {/* ESTIMATES BOOKMARKS */}
        {activeTab === 'estimates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedEstimates.map((est) => (
              <div key={est.id} className="bg-white border border-brandLight-border p-5 rounded-3xl flex justify-between items-center shadow-sm hover:border-slate-200 transition-all">
                <div className="text-xs font-bold text-slate-500 space-y-1">
                  <h3 className="text-xs font-black text-brandDark-black leading-tight">{est.title}</h3>
                  <span className="text-[9px] text-slate-400 font-bold block">Size: {est.area} sq.ft • Quality: {est.quality}</span>
                  <span className="text-[8px] text-slate-400 font-mono block">Saved: {est.date}</span>
                </div>

                <div className="text-right space-y-2">
                  <span className="text-base font-black text-brandDark-black font-mono block">₹{est.totalEstimate.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      clientMockService.createProjectFromEstimate(est);
                      alert('Project contract initialized successfully! Navigating to your projects...');
                      window.location.reload();
                    }}
                    className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-black shadow-sm transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            ))}
            {savedEstimates.length === 0 && (
              <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-2 shadow-sm text-xs font-bold text-slate-400">
                No saved material estimates. Estimates saved inside the AI Estimator tool will show up here.
              </div>
            )}
          </div>
        )}

        {/* DESIGNS BOOKMARKS */}
        {activeTab === 'designs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedDesigns.map((ds) => (
              <div key={ds.id} className="bg-white border border-brandLight-border p-5 rounded-3xl flex justify-between items-center shadow-sm hover:border-slate-200 transition-all">
                <div className="text-xs font-bold text-slate-500 space-y-1">
                  <h3 className="text-xs font-black text-brandDark-black leading-tight capitalize">{ds.roomType} Concept</h3>
                  <span className="text-[10px] text-slate-400 font-bold block">Material: {ds.material} • Finish: {ds.finish}</span>
                  <span className="text-[8px] text-slate-400 font-mono block">Saved: {ds.date}</span>
                </div>
                <button
                  onClick={() => alert(`Showing details for design configuration ${ds.id}`)}
                  className="px-3.5 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 transition-all"
                >
                  Inspect details
                </button>
              </div>
            ))}
            {savedDesigns.length === 0 && (
              <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-2 shadow-sm text-xs font-bold text-slate-400">
                No saved interior layouts. Modular studio configurations saved inside AI Interior Studio will show up here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
