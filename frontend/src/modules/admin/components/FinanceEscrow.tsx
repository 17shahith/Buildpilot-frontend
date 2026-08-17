import React, { useState, useEffect } from 'react';
import { Coins, Search, AlertTriangle } from 'lucide-react';
import { adminMockService } from '../../../services/api/adminMockService';
import type { Transaction, Project } from '../../../services/api/adminMockService';

export const FinanceEscrow: React.FC = () => {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ledger, setLedger] = useState({
    totalVolume: 0,
    heldEscrow: 0,
    released: 0,
    pendingRelease: 0,
    refunds: 0
  });

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  // Escrow Release Dialog
  const [escrowRelease, setEscrowRelease] = useState<{
    projectId: string;
    projectName: string;
    maxAmount: number;
    contractorName: string;
  } | null>(null);
  const [releaseAmount, setReleaseAmount] = useState(0);
  const [releaseReason, setReleaseReason] = useState('');

  // Hold Escrow Dialog
  const [escrowHold, setEscrowHold] = useState<{
    projectId: string;
    projectName: string;
  } | null>(null);
  const [holdReason, setHoldReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTxns(adminMockService.getTransactions());
    setProjects(adminMockService.getProjects());
    setLedger(adminMockService.getEscrowLedger());
  };

  const handleReleaseClick = (p: Project) => {
    setEscrowRelease({
      projectId: p.id,
      projectName: p.name,
      maxAmount: p.escrow.remaining,
      contractorName: p.contractorName || 'Contractor'
    });
    setReleaseAmount(p.escrow.remaining);
    setReleaseReason('');
  };

  const executeRelease = () => {
    if (!escrowRelease) return;
    const success = adminMockService.releaseEscrowFunds(escrowRelease.projectId, releaseAmount, releaseReason);
    if (success) {
      alert(`Released ₹${releaseAmount.toLocaleString('en-IN')} successfully.`);
      loadData();
    } else {
      alert('Action failed. Verify the balance amount.');
    }
    setEscrowRelease(null);
  };

  const handleHoldClick = (p: Project) => {
    setEscrowHold({
      projectId: p.id,
      projectName: p.name
    });
    setHoldReason('');
  };

  const executeHold = () => {
    if (!escrowHold) return;
    adminMockService.holdEscrowFunds(escrowHold.projectId, holdReason);
    loadData();
    setEscrowHold(null);
  };

  const filteredTxns = txns.filter(t => {
    const matchesSearch = t.userName.toLowerCase().includes(search.toLowerCase()) || 
                          (t.projectName && t.projectName.toLowerCase().includes(search.toLowerCase())) ||
                          t.id.includes(search);
    const matchesType = type === '' || t.type === type;
    const matchesStatus = status === '' || t.status === status;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Financial ledger metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {[
          { label: 'Total Volume', value: ledger.totalVolume, color: 'text-brandDark-black bg-white' },
          { label: 'Held in Escrow', value: ledger.heldEscrow, color: 'text-yellow-600 bg-yellow-50/10 border-yellow-200' },
          { label: 'Released Funds', value: ledger.released, color: 'text-green-600 bg-green-50/10 border-green-200' },
          { label: 'Pending Release', value: ledger.pendingRelease, color: 'text-primary bg-primary/5 border-primary/20' },
          { label: 'Platform Refunds', value: ledger.refunds, color: 'text-red-500 bg-red-50/10 border-red-200' },
        ].map((item, i) => (
          <div key={i} className={`p-4 border border-brandLight-border rounded-2xl ${item.color}`}>
            <span className="text-[9px] font-black uppercase tracking-wider block text-gray-400">{item.label}</span>
            <span className="text-lg font-black font-display mt-1 block">
              ₹{(item.value / 100000).toFixed(2)} L
            </span>
            <span className="text-[9px] font-semibold text-gray-400 block mt-0.5">₹{item.value.toLocaleString('en-IN')} total</span>
          </div>
        ))}
      </div>

      {/* Escrow Ledger Section */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
          Active Escrows By Project ({projects.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-3.5">Project</th>
                <th className="pb-3.5">Total Escrow</th>
                <th className="pb-3.5">Released</th>
                <th className="pb-3.5">Remaining</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-brandLight-panel transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-brandDark-black font-extrabold text-xs">{p.name}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{p.customerName} (Client) • {p.contractorName || 'No Contractor'}</p>
                    </div>
                  </td>
                  <td className="py-4 text-brandDark-black font-extrabold">₹{p.escrow.total.toLocaleString('en-IN')}</td>
                  <td className="py-4 text-green-500">₹{p.escrow.released.toLocaleString('en-IN')}</td>
                  <td className="py-4">₹{p.escrow.remaining.toLocaleString('en-IN')}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      p.escrow.status === 'released' ? 'bg-green-50 text-green-500 border border-green-200' :
                      p.escrow.status === 'held' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {p.escrow.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {p.escrow.remaining > 0 && (
                        <>
                          <button
                            onClick={() => handleReleaseClick(p)}
                            className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] rounded-lg transition-colors"
                          >
                            Release
                          </button>
                          {p.escrow.status !== 'held' && (
                            <button
                              onClick={() => handleHoldClick(p)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 font-extrabold text-[10px] rounded-lg transition-colors"
                            >
                              Hold
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History Filter & Table */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
            Transaction History ({filteredTxns.length})
          </h2>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search txns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brandLight-slate border border-brandLight-border rounded-xl pl-8 pr-3 py-1.5 text-[10px] font-bold focus:outline-none"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-brandLight-slate border border-brandLight-border text-[10px] font-bold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Escrow Deposit">Escrow Deposit</option>
              <option value="Escrow Release">Escrow Release</option>
              <option value="Payment">Payment</option>
              <option value="Refund">Refund</option>
              <option value="Marketplace Order">Marketplace Order</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-brandLight-slate border border-brandLight-border text-[10px] font-bold rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-3.5">Txn ID</th>
                <th className="pb-3.5">Project / Description</th>
                <th className="pb-3.5">User</th>
                <th className="pb-3.5">Amount</th>
                <th className="pb-3.5">Type</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-brandLight-panel transition-colors">
                  <td className="py-3.5 font-mono text-[10px] text-brandDark-black">{t.id}</td>
                  <td className="py-3.5">{t.projectName || 'Marketplace Checkout'}</td>
                  <td className="py-3.5">{t.userName}</td>
                  <td className="py-3.5 text-brandDark-black font-extrabold">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-brandLight-slate text-brandDark-black uppercase">
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      t.status === 'Completed' ? 'bg-green-50 text-green-500 border border-green-200' :
                      t.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      t.status === 'Under Review' ? 'bg-orange-50 text-orange-500 border border-orange-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-gray-400">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Release Modal */}
      {escrowRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-500" />
              <span>Confirm Escrow Release Authorization</span>
            </h3>
            
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              You are authorizing a milestone disbursement of <strong>₹{releaseAmount.toLocaleString('en-IN')}</strong> from escrow to contractor <strong>{escrowRelease.contractorName}</strong> on project: <strong>{escrowRelease.projectName}</strong>.
            </p>

            <div className="space-y-3 font-bold text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase block font-semibold">Amount to Release (₹)</label>
                <input
                  type="number"
                  max={escrowRelease.maxAmount}
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  className="premium-input font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase block font-semibold">Release Reason / Description</label>
                <textarea
                  placeholder="Approve stage structural stage validation check..."
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                  className="w-full min-h-[60px] p-3 bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEscrowRelease(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeRelease} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-xl shadow-glow">Confirm Release</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Hold Modal */}
      {escrowHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Lock Escrow Funds</span>
            </h3>

            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Locking escrow disbursements on project: <strong>{escrowHold.projectName}</strong>. This blocks all release requests.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Reason for Lock Action</label>
              <textarea
                placeholder="Describe project dispute or audit flag..."
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                className="w-full min-h-[60px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEscrowHold(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeHold} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl">Hold Escrow Funds</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
