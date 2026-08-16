import React, { useState } from 'react';
import { professionalMockService } from '../../services/professionalMockService';
import type { DiscoverProject } from '../../services/professionalMockService';
import { Search, MapPin, X, Clock, HelpCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FindProjects: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<DiscoverProject | null>(null);
  
  // Proposal Flow states
  const [isApplying, setIsApplying] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [approach, setApproach] = useState('');
  const [experience, setExperience] = useState('');
  
  // Milestones input builder
  const [milestones, setMilestones] = useState<string[]>(['Site Analysis & Layout Planning', 'Concept Renderings Draft', 'Detailed Design Deliverables']);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const leads = professionalMockService.getLeads(categoryFilter, search);

  const categories = [
    'All', 'Architecture', 'Interior Design', 'Structural Engineering', 'Landscape', 'Consultation', 'Renovation'
  ];

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      setMilestones([...milestones, newMilestoneText.trim()]);
      setNewMilestoneText('');
    }
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedPrice || !durationDays || !approach || !experience || !selectedProject) {
      alert('Please fill in all proposal fields.');
      return;
    }

    if (milestones.length === 0) {
      alert('Please add at least one milestone to your proposal plan.');
      return;
    }

    const price = Number(proposedPrice);
    const duration = Number(durationDays);

    if (Number.isNaN(price) || price <= 0 || Number.isNaN(duration) || duration <= 0) {
      alert('Please provide valid positive numbers for price and duration.');
      return;
    }

    // Submit via mock service
    professionalMockService.submitProposal({
      projectTitle: selectedProject.title,
      projectId: selectedProject.id,
      proposedPrice: price,
      durationDays: duration,
      approach: approach.trim(),
      experience: experience.trim(),
      milestones: milestones
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    alert('Proposal submitted successfully! Redirecting to proposals tab...');
    
    // Clear states
    setIsApplying(false);
    setSelectedProject(null);
    setProposedPrice('');
    setDurationDays('');
    setApproach('');
    setExperience('');
    setMilestones(['Site Analysis & Layout Planning', 'Concept Renderings Draft', 'Detailed Design Deliverables']);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
        <h2 className="text-lg font-black text-brandDark-black font-display">Discover Client Opportunities</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, requirement, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-inner"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leads.map((l) => (
          <div
            key={l.id}
            className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-500 font-black uppercase tracking-wider">
                  {l.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{l.postedTime}</span>
                </span>
              </div>
              <h3 className="text-base font-black text-brandDark-black">{l.title}</h3>
              <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{l.location}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">
                {l.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-black block">Budget Scale</span>
                <span className="text-sm font-black text-brandDark-black font-mono">
                  ₹{l.budgetMin.toLocaleString()} - ₹{l.budgetMax.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProject(l)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(l);
                    setIsApplying(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No Matching Projects Found</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-normal">
              Try adjusting your category filter, changing your search terms, or check back later for new customer posts.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedProject && !isApplying && (
        <div className="fixed inset-0 z-50 bg-brandDark-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brandLight-border rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FFF7ED]/30">
              <div>
                <span className="text-[9px] bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] px-2 py-0.5 rounded-lg uppercase tracking-wider font-black block w-fit mb-1">
                  Project Details
                </span>
                <h3 className="text-base font-black text-brandDark-black leading-tight">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 text-xs font-bold text-slate-600 leading-relaxed overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Budget</span>
                  <span className="text-xs font-black text-brandDark-black font-mono">₹{selectedProject.budgetMin/1000}K - ₹{selectedProject.budgetMax/1000}K</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Location</span>
                  <span className="text-xs font-black text-brandDark-black">{selectedProject.location}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Duration</span>
                  <span className="text-xs font-black text-brandDark-black">{selectedProject.timelineDays} Days</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] text-slate-400 uppercase font-black block mb-0.5">Proposals</span>
                  <span className="text-xs font-black text-brandDark-black">{selectedProject.proposalsCount} Active</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Project Description</h4>
                <p className="text-slate-500 leading-normal font-semibold bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Requirements</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-500 font-semibold">
                  {selectedProject.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Expected Deliverables</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-500 font-semibold">
                  {selectedProject.expectedDeliverables.map((del, idx) => (
                    <li key={idx}>{del}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 uppercase">
                    {selectedProject.clientName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-brandDark-black block">{selectedProject.clientName}</span>
                    <span className="text-[10px] text-slate-400 font-bold block">Client Verified • Rating {selectedProject.clientRating} ★</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsApplying(true)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Wizard Modal */}
      {selectedProject && isApplying && (
        <div className="fixed inset-0 z-50 bg-brandDark-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brandLight-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FFF7ED]/30">
              <div>
                <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-lg uppercase tracking-wider font-black block w-fit mb-1">
                  Proposal Submission
                </span>
                <h3 className="text-base font-black text-brandDark-black leading-tight">Apply for: {selectedProject.title}</h3>
              </div>
              <button
                onClick={() => {
                  setIsApplying(false);
                  setSelectedProject(null);
                }}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="p-6 space-y-5 text-xs font-bold text-slate-700 leading-relaxed overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Your Proposed Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 240000"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-800 bg-slate-50/50"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5">Recommended client budget: ₹{selectedProject.budgetMin.toLocaleString()} - ₹{selectedProject.budgetMax.toLocaleString()}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Estimated Duration (Days)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-800 bg-slate-50/50"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5">Client preference: {selectedProject.timelineDays} Days</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Proposed Approach & Methodology</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe step-by-step how you will tackle the project, your design choices, materials, and communication guidelines..."
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Relevant Experience</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mention similar projects you successfully delivered, structural design styles, and qualifications..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              {/* Milestones Construction */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-black">Proposed Milestone Schedule</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{milestones.length} Milestones added</span>
                </div>

                <div className="space-y-2">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl">
                      <span className="text-xs text-slate-700 font-bold">{idx + 1}. {m}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom milestone name..."
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Add Step
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-5 py-2.5 border border-slate-250 hover:border-slate-350 text-slate-500 rounded-xl text-xs font-bold transition-all"
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
