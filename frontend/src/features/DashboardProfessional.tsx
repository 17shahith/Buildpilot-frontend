import React, { useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

const DashboardProfessional: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'leads' | 'quotes' | 'earnings'>('leads');

  // Quotation Builder form states
  const [clientName, setClientName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [remarks, setRemarks] = useState('');

  // Leads list
  const leads = [
    { id: 'l1', client: 'Alice Jenkins', details: 'Wants architectural design for 2400 sqft residential structure.', budget: 65000, date: 'Received Today', urgency: 'High' },
    { id: 'l2', client: 'Marcus Aurelius', details: 'Deck extension review and structural load validation.', budget: 14000, date: '2 days ago', urgency: 'Medium' }
  ];

  // Calendar meetings
  const appointments = [
    { title: 'Kitchen Site Measurement Scan', date: 'July 28, 10:00 AM', client: 'Alice Jenkins' },
    { title: 'Foundation Plan Signoff', date: 'July 30, 2:30 PM', client: 'Marcus Aurelius' }
  ];

  const handleIssueQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const material = Number(materialCost);
    const labor = Number(laborCost);
    if (!clientName.trim() || !Number.isFinite(material) || !Number.isFinite(labor) || material < 0 || labor < 0) return;
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.6 }
    });
    alert(`Quotation successfully created and dispatched to ${clientName}!`);
    setClientName('');
    setMaterialCost('');
    setLaborCost('');
    setRemarks('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Pro Header Info */}
      <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/0 border border-green-500/20 flex items-center justify-center text-green-500">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white light-theme:text-brandDark-black font-display">Welcome Back, {user?.displayName || user?.email || 'Professional'} (Pro Portal)</h1>
            <p className="text-xs text-gray-500 font-semibold">Verified Architecture Contractor Partner • Rating: 4.9 (142 reviews)</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            Leads & Calendar
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quotes'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            Quotation Builder
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'earnings'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white light-theme:text-gray-600'
            }`}
          >
            Analytics & Earnings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ACTIVE VIEW STATE */}
        <div className="lg:col-span-2 space-y-6">
          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Incoming Client Leads</h2>
              <div className="grid grid-cols-1 gap-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl border border-brandDark-border/60 bg-brandDark-charcoal/40 glass-panel flex flex-col sm:flex-row justify-between sm:items-center gap-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white light-theme:text-brandDark-black">{lead.client}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          lead.urgency === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {lead.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 light-theme:text-gray-500 font-medium">{lead.details}</p>
                      <span className="text-[10px] text-gray-500 font-semibold block">{lead.date}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-brandDark-border sm:border-0 pt-4 sm:pt-0 light-theme:border-brandLight-border">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-500 uppercase block font-bold">Estimated Budget</span>
                        <span className="text-sm font-black text-white light-theme:text-brandDark-black">₹{lead.budget.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          alert(`Contacting client ${lead.client}. Check inbox messages.`);
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all shadow-glow"
                      >
                        Accept Lead
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUOTE BUILDER TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Generate Commercial Quotation</h2>
              <form onSubmit={handleIssueQuote} className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Client Target Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alice Jenkins"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      maxLength={120}
                      className="premium-input text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Material Estimate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(e.target.value)}
                      min="0"
                      max="100000000"
                      step="0.01"
                      className="premium-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Labor & Site Supervision (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 12000"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                      min="0"
                      max="100000000"
                      step="0.01"
                      className="premium-input text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Calculated Sum Total</label>
                    <div className="w-full bg-brandDark-black border border-brandDark-border rounded-xl px-4 py-3 text-xs font-black text-primary light-theme:bg-white light-theme:border-brandLight-border">
                      ₹{(Number(materialCost) + Number(laborCost)).toLocaleString() || 0} INR
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Quote Notes & Exclusions</label>
                  <textarea
                    rows={3}
                    placeholder="Describe material grades, delivery dates, or structural design exclusions..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    maxLength={2000}
                    className="premium-input text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary text-white font-bold text-xs uppercase tracking-wider shadow-glow transition-all"
                >
                  Issue Formal Quotation
                </button>
              </form>
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white light-theme:text-brandDark-black font-display">Revenue & Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'YTD Earnings Net', val: '₹84,500', note: '+12% vs previous quarter' },
                  { label: 'Outstanding Invoices', val: '₹12,400', note: '2 clients in billing queue' }
                ].map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-brandDark-border bg-brandDark-charcoal/60 glass-panel space-y-1.5 light-theme:bg-white light-theme:border-brandLight-border">
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">{c.label}</span>
                    <span className="text-2xl font-black text-white light-theme:text-brandDark-black tracking-tight">{c.val}</span>
                    <span className="text-[10px] text-green-500 font-semibold block">{c.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CALENDAR & APPOINTMENTS */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Appointment Calendar</span>
            </h3>

            <div className="space-y-3">
              {appointments.map((ap, i) => (
                <div key={i} className="p-3 bg-brandDark-black/40 border border-brandDark-border rounded-xl space-y-1.5 text-xs light-theme:bg-white light-theme:border-brandLight-border">
                  <div className="flex justify-between items-start font-bold">
                    <span className="text-white light-theme:text-brandDark-black">{ap.title}</span>
                    <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">{ap.date}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold">Client: {ap.client}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessional;
