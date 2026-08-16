import React, { useState } from 'react';
import { professionalMockService } from '../../services/professionalMockService';
import { Star, Plus, X, Upload } from 'lucide-react';

export const ProPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState(professionalMockService.getPortfolio());
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [services, setServices] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !location.trim() || !duration.trim() || !budget.trim() || !description.trim()) {
      alert('Please fill out all project showcase details.');
      return;
    }

    const serviceList = services.split(',').map(s => s.trim()).filter(s => s.length > 0);

    professionalMockService.addPortfolioItem({
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      duration: duration.trim(),
      budget: budget.trim(),
      services: serviceList,
      description: description.trim(),
      images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600']
    });

    alert('Showcase project published to your profile successfully!');
    setPortfolio(professionalMockService.getPortfolio());
    setIsAdding(false);
    
    // Clear forms
    setTitle('');
    setCategory('');
    setLocation('');
    setDuration('');
    setBudget('');
    setServices('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle Add */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex justify-between items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display">Work Portfolio Showcase</h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Exhibit completed designs, project parameters, and client ratings to win more contracts.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Close Builder' : 'Add Showcase'}</span>
        </button>
      </div>

      {/* Grid Portfolio Showcase */}
      {!isAdding ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-brandLight-border rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover border-b border-slate-100"
                />
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-brandDark-black">{item.title}</h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{item.category} • {item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-yellow-500 font-black">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.services.map((s, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Showcase Footer details */}
              <div className="p-6 pt-0 border-t border-slate-100/50 mt-4 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>Value: <strong className="text-brandDark-black font-black font-mono">{item.budget}</strong></span>
                <span>Took {item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Add Showcase Form */
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm max-w-2xl mx-auto animate-in fade-in duration-200">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-3 border-b border-slate-100 mb-5">
            Create Portfolio Showcase Card
          </h3>
          <form onSubmit={handleAddProject} className="space-y-4 text-xs font-bold text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Project Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Sea Villa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Showcase Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Residential Architecture"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, TN"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Execution Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4 Months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Budget Scale</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹20L"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Services Performed (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Vastu planning, 3D Renders, Material selection"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Showcase Description</label>
              <textarea
                rows={3}
                required
                placeholder="Describe material choices, layout challenges, and wind/light structural considerations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 resize-none"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-center space-y-1">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-600 block">Drag & Drop pictures or blueprints to build your showcase gallery</span>
              <span className="text-[8px] text-slate-400 font-bold block">Support PNG, JPG, or PDF up to 10MB</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Publish Portfolio Showcase
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
