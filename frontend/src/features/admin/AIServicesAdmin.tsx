import React, { useState, useEffect } from 'react';
import { Bot, AlertTriangle, Server, FileText, Database } from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';
import type { AIServiceStats } from '../../services/adminMockService';

export const AIServicesAdmin: React.FC = () => {
  const [aiServices, setAiServices] = useState<AIServiceStats[]>([]);
  const ragDocs = [
    { name: 'National_Building_Code_India_2026.pdf', size: '14.5 MB', status: 'Indexed', type: 'Core Regulation' },
    { name: 'Karnataka_Building_Bye_Laws_2024.pdf', size: '8.2 MB', status: 'Indexed', type: 'State Code' },
    { name: 'Cost_Estimations_Market_Rates_Bengaluru.csv', size: '1.2 MB', status: 'Indexed', type: 'Market Price Rates' },
    { name: 'Disputed_Escrow_Terms_Faqs.txt', size: '45 KB', status: 'Failed', error: 'Parsing Error: Formatting mismatch', type: 'Internal Terms' }
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setAiServices(adminMockService.getAIServices());
  };

  const handleRestartService = (name: string) => {
    adminMockService.addAuditLog(`Rebooted AI Service Container`, 'AI Services', name, 'System health refresh');
    alert(`AI Service container for ${name} has been rebooted and healthy connections verified.`);
  };

  return (
    <div className="space-y-6">
      {/* Infrastructure System Health Alert Banner */}
      <div className="p-5 rounded-3xl border border-yellow-200 bg-yellow-50/10 flex items-start space-x-4">
        <div className="p-2 rounded-2xl bg-yellow-50 text-yellow-600 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs font-bold text-gray-600 space-y-1">
          <h3 className="text-brandDark-black font-extrabold text-sm">System Health Watch</h3>
          <p>
            AI Interior Studio is experiencing <strong>Degraded Performance</strong> (avg error rate: 7.9% over past 4 hours) due to GPU cluster congestion on Node 3-East. Other services remain fully operational.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiServices.map((service) => (
          <div key={service.id} className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider">{service.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center space-x-1 ${
                service.status === 'Operational' ? 'bg-green-50 text-green-500 border border-green-200' :
                service.status === 'Degraded Performance' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                'bg-red-50 text-red-500 border border-red-200'
              }`}>
                <span className={`w-1 h-1 rounded-full mr-1 ${
                  service.status === 'Operational' ? 'bg-green-500' :
                  service.status === 'Degraded Performance' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                {service.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-[11px] font-bold">
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Requests Today</span>
                <span className="text-brandDark-black font-extrabold text-sm">{service.requestsToday.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Latency (Avg)</span>
                <span className="text-brandDark-black font-extrabold text-sm">{service.avgLatency}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Daily Cost</span>
                <span className="text-brandDark-black font-extrabold text-sm">${service.estimatedCost.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Success Rate</span>
                <span className="text-green-500 font-extrabold">
                  {((service.successfulRequests / service.requestsToday) * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Error Rate</span>
                <span className={`font-extrabold ${service.errorRate > 5 ? 'text-red-500' : 'text-gray-500'}`}>
                  {service.errorRate}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block uppercase">Capacity Load</span>
                <span className="text-brandDark-black font-extrabold">{service.usagePercent}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-brandLight-border h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${service.status === 'Operational' ? 'bg-primary' : 'bg-yellow-500'}`} style={{ width: `${service.usagePercent}%` }} />
              </div>
            </div>

            {/* Control Panel */}
            <div className="pt-2 border-t border-brandLight-border/50 flex gap-2">
              <button 
                onClick={() => handleRestartService(service.name)}
                className="px-3 py-1.5 bg-brandLight-slate hover:bg-brandLight-border text-brandDark-black text-[10px] font-black rounded-lg transition-colors flex items-center space-x-1"
              >
                <Server className="w-3.5 h-3.5 text-gray-400" />
                <span>Reboot Container</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RAG Knowledge Base Section */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-5">
        <div className="flex justify-between items-center pb-2 border-b border-brandLight-border">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
              NLP / RAG Knowledge Base Status
            </h2>
          </div>
          <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-500 rounded-lg text-[9px] font-black uppercase">
            Syncing (45 docs active)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Docs Table */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Knowledge Base Files</h4>
            <div className="space-y-2">
              {ragDocs.map((doc, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-brandLight-panel border border-brandLight-border rounded-xl flex justify-between items-center text-xs font-bold"
                >
                  <div className="space-y-0.5">
                    <p className="text-brandDark-black font-extrabold">{doc.name}</p>
                    <p className="text-[9px] text-gray-400 font-semibold">{doc.type} • {doc.size}</p>
                    {doc.error && <p className="text-[9px] text-red-500 font-semibold">{doc.error}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    doc.status === 'Indexed' ? 'bg-green-50 text-green-500 border border-green-200' :
                    'bg-red-50 text-red-500 border border-red-200'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload panel */}
          <div className="p-5 rounded-2xl bg-brandLight-panel border border-brandLight-border flex flex-col justify-between h-56">
            <div>
              <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Upload Reference Documents</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                Upload local bylaws, tax structures, or estimating guidelines (PDF, CSV, TXT). Max size: 50MB.
              </p>
            </div>
            
            <div className="border-2 border-dashed border-brandLight-border hover:border-primary/40 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors mt-4">
              <FileText className="w-6 h-6 text-gray-400" />
              <span className="text-[9px] font-black text-primary mt-2">Drag and drop documents here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
