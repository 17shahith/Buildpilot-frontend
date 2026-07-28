import React, { useState } from 'react';
import { User, CheckCircle2, ChevronRight } from 'lucide-react';

const DashboardClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'saved' | 'messages'>('projects');

  // Client projects mock data
  const projects = [
    {
      id: 'p1',
      title: 'Modern Kitchen Renovation',
      leadPro: 'Ripon Ahmed (Architect)',
      progress: 65,
      milestone: 'Drywall & Tiling In Progress',
      cost: 45000,
      stages: [
        { name: 'Structural Design Approval', done: true },
        { name: 'Demolition & Wiring Prep', done: true },
        { name: 'Cabinetry Assembly & Tiling', done: false },
        { name: 'Appliance Fitting & Paint', done: false }
      ]
    },
    {
      id: 'p2',
      title: 'Oceanview Deck Extensions',
      leadPro: 'David Miller (Contractor)',
      progress: 100,
      milestone: 'Project Completed & Audited',
      cost: 28000,
      stages: [
        { name: 'Foundation Pier Pouring', done: true },
        { name: 'Steel Framework Assembly', done: true },
        { name: 'Composite Deck Boarding', done: true },
        { name: 'Escrow Signoff Review', done: true }
      ]
    }
  ];

  // Saved properties mock data
  const savedProps = [
    { id: 'p1', title: 'The Obsidian Glass Villa', price: '₹1,250,000', location: 'Beverly Hills, CA', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 'p2', title: 'Minimalist Urban Loft', price: '₹4,200/mo', location: 'SoHo, New York', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300&h=200' }
  ];

  // Messages threads mock data
  const threads = [
    { id: '1', name: 'Ripon Ahmed', role: 'Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100', text: 'I updated the kitchen drywall layout on the back wall. Take a look at the rendering mockup.', time: '2 hours ago', active: true },
    { id: '2', name: 'Sarah Connor', role: 'Structural Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100', text: 'Seismic calculations for your deck joists are ready for approval. Sending the report.', time: '1 day ago', active: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Client Header info card */}
      <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow/10">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white light-theme:text-brandDark-black font-display">Welcome Back, Client Portal</h1>
            <p className="text-xs text-gray-500 font-semibold">Account Level: Standard Member • Escrow Active</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            Saved Sites
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-primary text-white animate-pulse'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            Messages
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className="grid grid-cols-1 gap-6">
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Active Project Portfolios</h2>
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-3xl border border-brandDark-border/60 bg-brandDark-charcoal/40 glass-panel grid grid-cols-1 lg:grid-cols-3 gap-6 items-start light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
              >
                {/* Project details */}
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white light-theme:text-brandDark-black font-display">{proj.title}</h3>
                  <p className="text-xs text-primary font-semibold">Lead Expert: {proj.leadPro}</p>
                  <div className="pt-2">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Escrow Budget Capital</span>
                    <span className="text-base font-black text-white light-theme:text-brandDark-black">₹{proj.cost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300 light-theme:text-gray-600">Milestone Progress</span>
                    <span className="text-primary font-extrabold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-brandDark-black rounded-full overflow-hidden light-theme:bg-brandLight-slate">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mr-1.5" />
                    <span>{proj.milestone}</span>
                  </p>
                </div>

                {/* Stages List */}
                <div className="space-y-2 rounded-2xl bg-brandDark-black/30 p-4 border border-brandDark-border/50 text-xs light-theme:bg-white light-theme:border-brandLight-border">
                  <span className="font-bold text-white light-theme:text-brandDark-black block border-b border-brandDark-border pb-1.5 mb-1.5 light-theme:border-brandLight-border">Structural Stage Tracker</span>
                  {proj.stages.map((stage, i) => (
                    <div key={i} className="flex justify-between items-center text-gray-400 light-theme:text-gray-600">
                      <span className={stage.done ? 'line-through text-gray-600' : 'font-semibold text-gray-300 light-theme:text-brandDark-black'}>
                        {stage.name}
                      </span>
                      {stage.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Saved Site & Plot Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedProps.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-2xl border border-brandDark-border bg-brandDark-charcoal p-4 flex gap-4 glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
                >
                  <img src={prop.image} alt={prop.title} className="w-24 h-24 object-cover rounded-xl border border-brandDark-border" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-sm text-white light-theme:text-brandDark-black">{prop.title}</h3>
                      <p className="text-[11px] text-gray-400">{prop.location}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-extrabold text-primary">{prop.price}</span>
                      <button className="text-xs text-gray-400 hover:text-white flex items-center font-bold">
                        <span>Compare</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Expert Messages Inbox</h2>
            <div className="grid grid-cols-1 gap-4">
              {threads.map((t) => (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl border flex gap-4 items-start cursor-pointer transition-all ${
                    t.active
                      ? 'bg-brandDark-charcoal border-primary/40 glass-panel light-theme:bg-brandLight-panel'
                      : 'bg-brandDark-charcoal/40 border-brandDark-border/60 hover:bg-brandDark-charcoal glass-panel light-theme:bg-brandLight-panel'
                  }`}
                >
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-brandDark-border" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-white light-theme:text-brandDark-black">{t.name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{t.role}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{t.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 light-theme:text-gray-600 leading-relaxed max-w-2xl font-medium">
                      "{t.text}"
                    </p>
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

export default DashboardClient;
