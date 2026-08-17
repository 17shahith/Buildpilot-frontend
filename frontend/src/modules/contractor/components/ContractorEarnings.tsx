import React, { useState } from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { DollarSign, TrendingUp, ShieldAlert, Receipt } from 'lucide-react';

export const ProEarnings: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'30' | '90' | '365'>('30');
  const details = professionalMockService.getEarningsDetails();
  const transactions = professionalMockService.getTransactions();

  return (
    <div className="space-y-6">
      {/* Earnings summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume Earned', val: `₹${details.totalEarnings.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-green-500" />, note: 'All-time releases' },
          { label: 'This Month Revenue', val: `₹${details.monthlyEarnings.toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-blue-500" />, note: '+12.4% vs last month' },
          { label: 'Held in Escrow', val: `₹${details.pendingEscrow.toLocaleString()}`, icon: <ShieldAlert className="w-5 h-5 text-yellow-500" />, note: 'Locked in contracts' },
          { label: 'Available Payout', val: `₹${details.availablePayout.toLocaleString()}`, icon: <Receipt className="w-5 h-5 text-emerald-500" />, note: 'Ready to cashout' }
        ].map((k, i) => (
          <div key={i} className="bg-white border border-brandLight-border p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{k.label}</span>
              <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100">{k.icon}</div>
            </div>
            <div>
              <span className="text-xl font-black text-brandDark-black block tracking-tight">{k.val}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{k.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: EARNINGS GRAPH MOCK & LEDGER */}
        <div className="lg:col-span-2 space-y-6 bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Earnings Over Time</h3>
            <div className="flex bg-slate-50 border border-slate-100 p-0.5 rounded-xl">
              {['30', '90', '365'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t as any)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                    timeFilter === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {t} Days
                </button>
              ))}
            </div>
          </div>

          {/* Simple Visual Mock Graph */}
          <div className="h-48 w-full flex items-end justify-between px-2 pt-6 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
              <div className="border-b border-black w-full"></div>
              <div className="border-b border-black w-full"></div>
              <div className="border-b border-black w-full"></div>
              <div className="border-b border-black w-full"></div>
            </div>
            {[
              { label: 'W1', val: 12000 }, { label: 'W2', val: 24500 }, { label: 'W3', val: 32000 }, { label: 'W4', val: 16000 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div 
                  className="bg-primary/20 hover:bg-primary border border-primary/40 rounded-t-xl transition-all duration-300 w-12"
                  style={{ height: `${(d.val / 35000) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brandDark-black text-white text-[9px] font-mono font-black py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                    ₹{d.val.toLocaleString()}
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-400 mt-2 font-mono uppercase">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION LEDGER */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm h-fit">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
            Payment History Ledger
          </h3>
          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {transactions.map((t) => (
              <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-bold text-slate-500">
                <div className="space-y-1">
                  <span className="text-brandDark-black font-black block leading-none">{t.projectName}</span>
                  <span className="text-[9px] text-slate-400 font-bold block truncate max-w-[170px]">{t.milestoneName}</span>
                  <span className="text-[8px] text-slate-400 font-mono block">{t.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-brandDark-black font-black font-mono block">₹{t.amount.toLocaleString()}</span>
                  <span className={`text-[8px] font-black font-mono uppercase ${
                    t.status === 'Released' ? 'text-green-600' : t.status === 'In Escrow' ? 'text-yellow-600' : 'text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
