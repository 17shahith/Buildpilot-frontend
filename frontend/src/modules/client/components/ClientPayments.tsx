import React from 'react';
import { clientMockService } from '../../../services/api/clientMockService';
import { DollarSign, ShieldCheck, TrendingUp, CreditCard } from 'lucide-react';

export const ClientPayments: React.FC = () => {
  const projects = clientMockService.getProjects();

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalPaid = projects.reduce((acc, p) => acc + p.spent, 0);
  const totalEscrow = projects.reduce((acc, p) => acc + p.escrow.remaining, 0);

  return (
    <div className="space-y-6">
      {/* Financial metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Capital Allocated', val: `₹${totalBudget.toLocaleString()}`, icon: <CreditCard className="w-5 h-5 text-blue-500" />, note: 'Overall project budgets' },
          { label: 'Released Payments', val: `₹${totalPaid.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-green-500" />, note: 'Paid to professionals' },
          { label: 'Held in Escrow', val: `₹${totalEscrow.toLocaleString()}`, icon: <ShieldCheck className="w-5 h-5 text-[#EA580C]" />, note: 'Locked in active stages' },
          { label: 'Remaining Balance', val: `₹${(totalBudget - totalPaid).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-emerald-500" />, note: 'Outstanding liabilities' }
        ].map((k, i) => (
          <div key={i} className="bg-white border border-brandLight-border p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{k.label}</span>
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">{k.icon}</div>
            </div>
            <div>
              <span className="text-xl font-black text-brandDark-black block tracking-tight font-mono">{k.val}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{k.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow rules information */}
      <div className="bg-[#FFF7ED] border border-[#FED7AA] p-6 rounded-3xl space-y-3">
        <h3 className="text-xs font-black text-[#EA580C] uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-[#FED7AA]">
          <ShieldCheck className="w-4.5 h-4.5 text-[#EA580C]" />
          <span>BuildPilot Escrow & Safety Guidelines</span>
        </h3>
        <p className="text-xs font-bold text-[#EA580C]/90 leading-relaxed max-w-3xl">
          To protect project owners and service providers alike, client deposits are held in a secure third-party escrow account. Payments are only released incrementally upon client verification of milestone deliverables.
        </p>
      </div>

      {/* Project ledger list */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
          Contracts Payment Ledger
        </h3>

        <div className="space-y-3">
          {projects.map((p) => {
            const paidPct = Math.floor((p.spent / p.budget) * 100);
            return (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition-all">
                <div className="space-y-1.5 text-xs font-bold text-slate-500">
                  <span className="text-brandDark-black font-black block leading-none">{p.name}</span>
                  <span className="block text-[10px] text-slate-400">Professional: {p.professionalName} ({p.role})</span>
                  <div className="w-40 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-green-500 h-full" style={{ width: `${paidPct}%` }}></div>
                  </div>
                </div>

                <div className="flex gap-6 text-xs font-bold text-slate-500">
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Budget</span>
                    <span className="text-brandDark-black font-black font-mono">₹{p.budget.toLocaleString()}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Released</span>
                    <span className="text-green-600 font-black font-mono">₹{p.spent.toLocaleString()}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">In Escrow</span>
                    <span className="text-[#EA580C] font-black font-mono">₹{p.escrow.remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
