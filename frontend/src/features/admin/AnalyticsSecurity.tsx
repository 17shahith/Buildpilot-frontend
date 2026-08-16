import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Search, ShieldCheck, History } from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';
import type { AuditLog, SecurityAlert } from '../../services/adminMockService';

export const AnalyticsSecurity: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'security' | 'audit'>('security');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLogs(adminMockService.getAuditLogs());
    setAlerts(adminMockService.getSecurityAlerts());
  };

  const handleResolveAlert = (id: string) => {
    adminMockService.resolveSecurityAlert(id);
    adminMockService.addAuditLog('Resolved security alert', 'SecurityAlert', id, 'Investigated and marked secure');
    loadData();
    alert('Security Alert resolved and logged.');
  };

  const filteredLogs = logs.filter(l => 
    l.actor.toLowerCase().includes(search.toLowerCase()) || 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sections Tab Header */}
      <div className="flex space-x-1.5 bg-white p-1 rounded-2xl border border-brandLight-border w-max">
        {[
          { id: 'security', label: 'Security & Threat Detection' },
          { id: 'audit', label: 'Admin Audit Log' },
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

      {/* Security Alerts tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Main Alerts List */}
          <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Real-time Security Warnings</span>
            </h2>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-bold transition-all ${
                    alert.status === 'Resolved' 
                      ? 'bg-brandLight-panel border-brandLight-border opacity-70' 
                      : alert.severity === 'Critical' ? 'bg-red-50/10 border-red-200' : 'bg-yellow-50/10 border-yellow-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        alert.severity === 'Critical' ? 'bg-red-50 text-red-500 border border-red-200' :
                        alert.severity === 'High' ? 'bg-orange-50 text-orange-500 border border-orange-200' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-extrabold text-brandDark-black text-sm">{alert.title}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-semibold">{alert.description}</p>
                    <span className="text-[9px] text-gray-400 block font-mono">Timestamp: {alert.timestamp}</span>
                  </div>

                  <div>
                    {alert.status === 'Active' ? (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white font-black rounded-xl transition-all shadow-glow flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Resolve Alert</span>
                      </button>
                    ) : (
                      <span className="text-green-500 font-black flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Audit Log tab */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-1.5">
              <History className="w-4 h-4 text-primary" />
              <span>Administrative Action Trails</span>
            </h2>

            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brandLight-slate border border-brandLight-border rounded-xl pl-8 pr-3 py-1.5 text-[10px] font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3.5">Timestamp</th>
                  <th className="pb-3.5">Actor</th>
                  <th className="pb-3.5">Action Perform</th>
                  <th className="pb-3.5">Entity</th>
                  <th className="pb-3.5">IP Address</th>
                  <th className="pb-3.5">Result</th>
                  <th className="pb-3.5 text-right">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brandLight-panel transition-colors">
                    <td className="py-4 text-gray-400 font-mono text-[10px]">{log.timestamp}</td>
                    <td className="py-4 text-brandDark-black font-extrabold">{log.actor}</td>
                    <td className="py-4">{log.action}</td>
                    <td className="py-4">
                      <span className="text-[9px] bg-brandLight-slate px-1.5 py-0.5 rounded font-black text-gray-500">
                        {log.entity}:{log.entityId}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-gray-400 text-[10px]">{log.ip}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        log.result === 'Success' ? 'bg-green-50 text-green-500 border border-green-200' :
                        'bg-red-50 text-red-500 border border-red-200'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="py-4 text-right text-gray-500 text-[10px] font-semibold max-w-xs truncate">
                      {log.reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
