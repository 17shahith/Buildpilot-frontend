import React, { useState, useEffect } from 'react';
import { Check, Flag, EyeOff, FileText } from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';
import type { MarketplaceVendor, MarketplaceProduct, Transaction } from '../../services/adminMockService';

export const MarketplaceAdmin: React.FC = () => {
  const [vendors, setVendors] = useState<MarketplaceVendor[]>([]);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [activeSection, setActiveSection] = useState<'vendors' | 'products' | 'orders'>('vendors');

  // Confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'vendor-approve' | 'vendor-reject' | 'product-approve' | 'product-hide' | 'product-flag';
    targetId: string;
    targetName: string;
  } | null>(null);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVendors(adminMockService.getMarketplaceVendors());
    setProducts(adminMockService.getMarketplaceProducts());
    setOrders(adminMockService.getTransactions().filter(t => t.type === 'Marketplace Order'));
  };

  const handleActionClick = (
    type: 'vendor-approve' | 'vendor-reject' | 'product-approve' | 'product-hide' | 'product-flag', 
    targetId: string, 
    targetName: string
  ) => {
    setConfirmAction({ type, targetId, targetName });
    setActionReason('');
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, targetId } = confirmAction;

    if (type === 'vendor-approve') {
      adminMockService.verifyVendor(targetId, true, actionReason);
    } else if (type === 'vendor-reject') {
      adminMockService.verifyVendor(targetId, false, actionReason);
    } else if (type === 'product-approve') {
      adminMockService.moderateProduct(targetId, 'Approve', actionReason);
    } else if (type === 'product-hide') {
      adminMockService.moderateProduct(targetId, 'Hide', actionReason);
    } else if (type === 'product-flag') {
      adminMockService.moderateProduct(targetId, 'Flag', actionReason);
    }

    loadData();
    setConfirmAction(null);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Sections Tab Header */}
      <div className="flex space-x-1.5 bg-white p-1 rounded-2xl border border-brandLight-border w-max">
        {[
          { id: 'vendors', label: 'Vendors' },
          { id: 'products', label: 'Product Moderation' },
          { id: 'orders', label: 'Marketplace Orders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeSection === tab.id 
                ? 'bg-primary text-white shadow-glow' 
                : 'text-gray-500 hover:text-brandDark-black hover:bg-brandLight-slate'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vendors Sub-section */}
      {activeSection === 'vendors' && (
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Vendor Business Approvals</h2>
          <div className="space-y-3">
            {vendors.map((v) => (
              <div 
                key={v.id} 
                className="p-4 bg-brandLight-panel border border-brandLight-border rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs font-bold"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-brandDark-black text-sm">{v.businessName}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      v.status === 'Approved' ? 'bg-green-50 text-green-500 border border-green-200' :
                      v.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-[10px] text-gray-400 mt-2 font-semibold">
                    <p>License ID: <strong className="text-gray-600 font-extrabold">{v.license}</strong></p>
                    <p>Phone: <strong className="text-gray-600 font-extrabold">{v.phone}</strong></p>
                    <p>Joined: <strong className="text-gray-600 font-extrabold">{v.joinedDate}</strong></p>
                    <p>Email: <strong className="text-gray-600 font-extrabold">{v.email}</strong></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('GST & Company profiles verified in database scan.')}
                    className="px-3.5 py-2 border border-brandLight-border bg-white text-brandDark-black font-black rounded-xl hover:bg-brandLight-slate transition-colors flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View GST</span>
                  </button>
                  {v.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleActionClick('vendor-approve', v.id, v.businessName)}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white font-black rounded-xl transition-all shadow-glow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleActionClick('vendor-reject', v.id, v.businessName)}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 font-black rounded-xl transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Sub-section */}
      {activeSection === 'products' && (
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Product Catalog Moderation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3.5">Product</th>
                  <th className="pb-3.5">Vendor</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Price</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5">Flag Reason</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-brandLight-panel transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="text-brandDark-black font-extrabold text-xs">{p.name}</p>
                        <p className="text-[9px] text-gray-400 font-semibold font-mono">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="py-4">{p.vendorName}</td>
                    <td className="py-4">{p.category}</td>
                    <td className="py-4 text-brandDark-black font-extrabold">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        p.status === 'Approved' ? 'bg-green-50 text-green-500 border border-green-200' :
                        p.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                        'bg-red-50 text-red-500 border border-red-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-[10px] text-red-400 font-semibold max-w-xs truncate">
                      {p.flagReason || '-'}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {p.status !== 'Approved' && (
                          <button
                            onClick={() => handleActionClick('product-approve', p.id, p.name)}
                            className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg border border-green-100"
                            title="Approve Listing"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {p.status !== 'Hidden' && (
                          <button
                            onClick={() => handleActionClick('product-hide', p.id, p.name)}
                            className="p-1.5 bg-gray-55 hover:bg-brandLight-border text-gray-500 rounded-lg border border-brandLight-border"
                            title="Hide Listing"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {p.status !== 'Flagged' && (
                          <button
                            onClick={() => handleActionClick('product-flag', p.id, p.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100"
                            title="Flag Listing"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Sub-section */}
      {activeSection === 'orders' && (
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider font-display">Completed Orders Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3.5">Order ID</th>
                  <th className="pb-3.5">Client User</th>
                  <th className="pb-3.5">Amount</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-brandLight-panel transition-colors">
                    <td className="py-3.5 font-mono text-[10px] text-brandDark-black">{o.id}</td>
                    <td className="py-3.5">{o.userName}</td>
                    <td className="py-3.5 text-brandDark-black font-extrabold">₹{o.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        o.status === 'Completed' ? 'bg-green-50 text-green-500 border border-green-200' :
                        o.status === 'Failed' ? 'bg-red-50 text-red-500 border border-red-200' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-200'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-gray-400">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-brandLight-border shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-brandDark-black">
              Confirm Marketplace Action
            </h3>

            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Are you sure you want to perform moderation action: <strong>{confirmAction.type}</strong> on <strong>{confirmAction.targetName}</strong>?
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Action Reason / Justification</label>
              <textarea
                placeholder="Details of GST checks or flag reasons..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full min-h-[70px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 border border-brandLight-border text-xs font-black rounded-xl">Cancel</button>
              <button onClick={executeAction} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl shadow-glow">Confirm Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
