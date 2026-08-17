import React, { useState } from 'react';
import { clientMockService } from '../../../services/api/clientMockService';
import { FileText, Folder, Download, Search } from 'lucide-react';

export const ClientDocuments: React.FC = () => {
  const projects = clientMockService.getProjects();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  // Collect all documents from projects
  const allDocs = projects.flatMap(p => 
    p.documents.map(d => ({ ...d, projectName: p.name, projectId: p.id }))
  );

  const categories = ['All', 'Contract', 'Drawing', 'Invoice', 'Report'];

  let filtered = allDocs;
  if (selectedCat !== 'All') {
    filtered = filtered.filter(d => d.type === selectedCat);
  }
  if (search.trim()) {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
            <Folder className="w-5 h-5 text-primary" />
            <span>Documents & Blueprints Registry</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold">Access, search, and audit design drafts, signed agreements, and payment invoices.</p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>
      </div>

      {/* Search Input bar */}
      <div className="bg-white border border-brandLight-border p-4 rounded-2xl shadow-sm relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search document by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-inner"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
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
                <span className="text-[9px] text-slate-400 font-bold block">Version: {doc.version}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>Uploaded {doc.date}</span>
              <button
                onClick={() => alert(`Opening or downloading file: ${doc.name}`)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-black flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get File</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3 shadow-sm">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-black text-slate-700">No matching documents found</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
              Any uploads associated with your project plans will show up in this folder registry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
