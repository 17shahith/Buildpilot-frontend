import React, { useState } from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { FileText, Folder, Download } from 'lucide-react';

export const ProDocuments: React.FC = () => {
  const documents = professionalMockService.getDocuments();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Contract', 'Drawing', 'Estimate', 'Report'];

  const filteredDocs = selectedCategory === 'All' 
    ? documents 
    : documents.filter(d => d.type === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header and Category Filter */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
            <Folder className="w-5 h-5 text-primary" />
            <span>Contracts & Deliverables Library</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Access contracts, structural drawings, material estimates, and deliverables files.</p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-brandLight-border p-5 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3 text-xs font-bold text-slate-500">
              <div className="flex justify-between items-start">
                <span className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <FileText className="w-5 h-5 text-slate-400" />
                </span>
                <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-wider font-black">
                  {doc.type}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-black text-brandDark-black truncate block">{doc.name}</h3>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Project: {doc.projectName}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>Date: {doc.date}</span>
              <button
                onClick={() => alert(`Opening or downloading: ${doc.name}`)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-black flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get File</span>
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No {selectedCategory} Files</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
              Any files uploaded under this category will show up in this folder directory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
