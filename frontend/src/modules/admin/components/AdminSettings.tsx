import React, { useState, useEffect } from 'react';
import { Save, ShieldAlert, Key, Check } from 'lucide-react';
import { adminMockService } from '../../../services/api/adminMockService';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    escrowFeePercent: 0,
    marketplaceCommission: 0,
    requireEscrowForPros: false,
    maintenanceMode: false,
    aiBillingThreshold: 0,
    maxRAGUploadSize: 0
  });

  const [activeTab, setActiveTab] = useState<'platform' | 'roles'>('platform');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setSettings(adminMockService.getSettings());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminMockService.updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Role permissions breakdown
  const rolePermissions = [
    {
      name: 'Super Admin',
      desc: 'Full platform administration & operational override control.',
      privileges: ['Full user control', 'Complete escrow disbursements', 'System configurations edit', 'AI reboots', 'Dispute resolutions']
    },
    {
      name: 'Platform Admin',
      desc: 'Standard operations management & catalog moderation.',
      privileges: ['Users list access', 'Marketplace product moderation', 'Verification processing']
    },
    {
      name: 'Finance Admin',
      desc: 'Ledger management, payouts and deposit approvals.',
      privileges: ['Escrow milestone releases', 'Refund processing', 'Txn history audit access']
    },
    {
      name: 'Moderation Admin',
      desc: 'Resolution of platform disputes and community reports.',
      privileges: ['Disputes reviews', 'evidence verification', 'Client/Pro communication audit']
    },
    {
      name: 'AI Admin',
      desc: 'AI Services configurations and knowledge base management.',
      privileges: ['RAG Document index additions', 'AI model configs edit', 'AI Container reboots']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sections Tab Header */}
      <div className="flex space-x-1.5 bg-white p-1 rounded-2xl border border-brandLight-border w-max">
        {[
          { id: 'platform', label: 'Platform Configuration' },
          { id: 'roles', label: 'Role-Based Access (RBAC)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-glow' 
                : 'text-gray-500 hover:text-brandDark-black hover:bg-brandLight-slate'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'platform' && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">System Rule Configuration</h2>
            <div className="flex items-center space-x-2">
              {isSaved && (
                <span className="text-[10px] text-green-500 font-extrabold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Settings saved successfully
                </span>
              )}
              <button 
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-glow flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-gray-600">
            {/* Platform Details */}
            <div className="space-y-4">
              <h3 className="text-[10px] text-brandDark-black uppercase tracking-wider font-black">Company Profiles</h3>
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 uppercase">Platform Brand Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="premium-input text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-400 uppercase">System Support Contact Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="premium-input text-xs font-bold"
                />
              </div>
            </div>

            {/* Financial variables */}
            <div className="space-y-4">
              <h3 className="text-[10px] text-brandDark-black uppercase tracking-wider font-black">Escrow & Marketplace Rates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase">Escrow Release Fee (%)</label>
                  <input
                    type="number"
                    value={settings.escrowFeePercent}
                    onChange={(e) => setSettings({ ...settings, escrowFeePercent: Number(e.target.value) })}
                    className="premium-input text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase">Marketplace Margin (%)</label>
                  <input
                    type="number"
                    value={settings.marketplaceCommission}
                    onChange={(e) => setSettings({ ...settings, marketplaceCommission: Number(e.target.value) })}
                    className="premium-input text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="requireEscrow"
                  checked={settings.requireEscrowForPros}
                  onChange={(e) => setSettings({ ...settings, requireEscrowForPros: e.target.checked })}
                  className="w-4 h-4 rounded border-brandLight-border text-primary focus:ring-primary"
                />
                <label htmlFor="requireEscrow" className="text-brandDark-black font-extrabold text-[11px] cursor-pointer">
                  Require active Escrow account prior to Professional matches
                </label>
              </div>
            </div>

            {/* AI thresholds */}
            <div className="space-y-4 pt-4 border-t border-brandLight-border md:col-span-2">
              <h3 className="text-[10px] text-brandDark-black uppercase tracking-wider font-black">AI Computing & RAG Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase">Daily API Billing Warning Threshold ($)</label>
                  <input
                    type="number"
                    value={settings.aiBillingThreshold}
                    onChange={(e) => setSettings({ ...settings, aiBillingThreshold: Number(e.target.value) })}
                    className="premium-input text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-400 uppercase">Max RAG Document Upload File Size (MB)</label>
                  <input
                    type="number"
                    value={settings.maxRAGUploadSize}
                    onChange={(e) => setSettings({ ...settings, maxRAGUploadSize: Number(e.target.value) })}
                    className="premium-input text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance */}
            <div className="space-y-4 pt-4 border-t border-brandLight-border md:col-span-2">
              <h3 className="text-[10px] text-red-500 uppercase tracking-wider font-black">System Controls</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded border-brandLight-border text-red-500 focus:ring-red-500"
                />
                <label htmlFor="maintMode" className="text-red-500 font-extrabold text-[11px] cursor-pointer flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Enforce system-wide Maintenance Mode (suspends guest transactions)</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Roles RBAC subview */}
      {activeTab === 'roles' && (
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Role Access Privilege Levels</h2>
          </div>

          <div className="space-y-5">
            {rolePermissions.map((role, idx) => (
              <div key={idx} className="p-4 bg-brandLight-panel border border-brandLight-border rounded-2xl space-y-2">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider">{role.name}</h3>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold">{role.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {role.privileges.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-brandLight-border/70 text-gray-600 rounded-md text-[9px] font-bold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
