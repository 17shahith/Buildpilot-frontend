import React, { useState } from 'react';
import { 
  Users, FolderKanban, Coins, AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { adminMockService } from '../../services/adminMockService';

interface OverviewProps {
  setActiveView: (view: string) => void;
  setFilterStatus?: (status: string) => void;
}

export const AdminOverview: React.FC<OverviewProps> = ({ setActiveView }) => {
  const kpis = adminMockService.getDashboardKPIs();
  const projects = adminMockService.getProjects();
  const transactions = adminMockService.getTransactions().slice(0, 5);
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Hardcoded chart data projections to render SVG paths beautifully
  const chartData = {
    '7d': [20, 35, 30, 45, 60, 55, 70],
    '30d': [15, 25, 20, 38, 30, 48, 52, 45, 60, 68, 58, 75],
    '90d': [30, 45, 50, 42, 58, 65, 72, 68, 80, 85, 90, 110],
    '1y': [120, 240, 210, 320, 450, 490, 580, 620, 710, 840, 920, 1050]
  };

  const currentPoints = chartData[chartRange];
  const maxVal = Math.max(...currentPoints);
  const minVal = Math.min(...currentPoints);
  
  // Calculate SVG line points
  const width = 500;
  const height = 150;
  const padding = 10;
  const step = (width - padding * 2) / (currentPoints.length - 1);
  const pointsStr = currentPoints.map((val, index) => {
    const x = padding + index * step;
    const y = height - padding - ((val - minVal) / (maxVal - minVal || 1)) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Calculate SVG Area path
  const areaPath = `M ${padding},${height - padding} L ${pointsStr} L ${padding + (currentPoints.length - 1) * step},${height - padding} Z`;

  // Project breakdown
  const statusCounts = {
    Active: projects.filter(p => p.status === 'Active').length + 348 - 2, // Keep aligned with kpis
    Pending: projects.filter(p => p.status === 'Pending').length + 42,
    Completed: projects.filter(p => p.status === 'Completed').length + 892,
    Disputed: projects.filter(p => p.status === 'Disputed').length + 17,
    Delayed: projects.filter(p => p.status === 'Delayed').length + 23,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div 
          onClick={() => setActiveView('users-all')}
          className="p-5 rounded-3xl border border-brandLight-border bg-white hover-card cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-xl bg-primary/5 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-brandDark-black font-display">
              {kpis.totalUsers.toLocaleString()}
            </h3>
            <span className="text-[10px] text-green-500 font-extrabold flex items-center mt-1">
              ↑ 8.4% this month
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => setActiveView('projects')}
          className="p-5 rounded-3xl border border-brandLight-border bg-white hover-card cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-xl bg-primary/5 text-primary">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-brandDark-black font-display">
              {kpis.activeProjects.toLocaleString()}
            </h3>
            <span className="text-[10px] text-green-500 font-extrabold flex items-center mt-1">
              ↑ 12.2% this month
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => setActiveView('finance')}
          className="p-5 rounded-3xl border border-brandLight-border bg-white hover-card cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Escrow Balance</span>
            <div className="p-2 rounded-xl bg-primary/5 text-primary">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-brandDark-black font-display">
              ₹{(kpis.escrowBalance / 100000).toFixed(1)} L
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
              Currently held in escrow
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          className="p-5 rounded-3xl border border-brandLight-border bg-white hover-card"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Actions</span>
            <div className="p-2 rounded-xl bg-red-500/5 text-red-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-brandDark-black font-display">
              {kpis.pendingActions}
            </h3>
            <span className="text-[10px] text-red-500 font-extrabold flex items-center mt-1">
              Requires your attention
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Chart + Project Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large activity chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Platform Activity</h2>
              <p className="text-[10px] text-gray-400">Aggregated construction requests & updates</p>
            </div>
            <div className="flex bg-brandLight-slate p-0.5 rounded-xl border border-brandLight-border">
              {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-extrabold transition-all ${
                    chartRange === r 
                      ? 'bg-white text-brandDark-black shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full relative h-40 pt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5722" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#FF5722" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#chart-grad)" />
              <polyline
                fill="none"
                stroke="#FF5722"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsStr}
              />
            </svg>
          </div>
        </div>

        {/* Project Status */}
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white flex flex-col justify-between">
          <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-3 border-b border-brandLight-border/60">
            Project Status Overview
          </h2>
          <div className="mt-4 space-y-3.5 flex-grow">
            {[
              { label: 'Active', count: statusCounts.Active, color: 'bg-green-500' },
              { label: 'Pending', count: statusCounts.Pending, color: 'bg-yellow-500' },
              { label: 'Completed', count: statusCounts.Completed, color: 'bg-gray-400' },
              { label: 'Disputed', count: statusCounts.Disputed, color: 'bg-red-500' },
              { label: 'Delayed', count: statusCounts.Delayed, color: 'bg-orange-400' },
            ].map((status, i) => (
              <div 
                key={i} 
                onClick={() => setActiveView('projects')}
                className="flex items-center justify-between text-xs font-semibold cursor-pointer hover:bg-brandLight-slate p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                  <span className="text-gray-600">{status.label}</span>
                </div>
                <span className="font-extrabold text-brandDark-black">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requires Attention Section */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Requires Admin Attention</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: '12 contractor verification requests', view: 'verification', priority: 'High' },
            { label: '5 payment disputes pending resolve', view: 'disputes', priority: 'Critical' },
            { label: '4 escrow release approval requests', view: 'finance', priority: 'High' },
            { label: '3 marketplace vendor applications', view: 'marketplace', priority: 'Medium' },
            { label: '3 suspicious accounts detected', view: 'security', priority: 'Critical' },
          ].map((item, i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl border border-brandLight-border/80 bg-brandLight-panel flex flex-col justify-between h-28 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${
                  item.priority === 'Critical' ? 'bg-red-50 text-red-500 border border-red-200' :
                  item.priority === 'High' ? 'bg-orange-50 text-orange-500 border border-orange-200' :
                  'bg-yellow-50 text-yellow-600 border border-yellow-200'
                }`}>
                  {item.priority}
                </span>
              </div>
              <p className="text-[11px] font-bold text-brandDark-black mt-2">{item.label}</p>
              <button 
                onClick={() => setActiveView(item.view)}
                className="flex items-center text-[10px] font-black text-primary hover:text-primary-dark mt-2"
              >
                <span>Review</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Distribution */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
          User Distribution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Customers', count: 8420, view: 'users-customers', color: 'border-l-4 border-green-500' },
            { label: 'Experts', count: 1240, view: 'users-experts', color: 'border-l-4 border-blue-500' },
            { label: 'Contractors', count: 2100, view: 'users-contractors', color: 'border-l-4 border-orange-500' },
            { label: 'Vendors', count: 722, view: 'users-vendors', color: 'border-l-4 border-purple-500' },
          ].map((dist, i) => (
            <div 
              key={i}
              onClick={() => setActiveView(dist.view)}
              className={`p-4 bg-brandLight-panel rounded-2xl hover:bg-brandLight-slate transition-colors cursor-pointer ${dist.color}`}
            >
              <span className="text-[9px] font-extrabold text-gray-400 uppercase block">{dist.label}</span>
              <span className="text-lg font-black text-brandDark-black mt-1 block">{dist.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects & Recent Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Recent Projects</h2>
            <button 
              onClick={() => setActiveView('projects')}
              className="text-[10px] font-black text-primary hover:text-primary-dark"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5">Project</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Budget</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
                {projects.slice(0, 4).map((p) => (
                  <tr key={p.id} className="hover:bg-brandLight-panel transition-colors">
                    <td className="py-3 text-brandDark-black font-extrabold">{p.name}</td>
                    <td className="py-3">{p.customerName}</td>
                    <td className="py-3">₹{p.budget.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black ${
                        p.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                        p.status === 'Delayed' ? 'bg-orange-50 text-orange-500 border border-orange-200' :
                        p.status === 'Disputed' ? 'bg-red-50 text-red-500 border border-red-200' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">Recent Transactions</h2>
            <button 
              onClick={() => setActiveView('finance')}
              className="text-[10px] font-black text-primary hover:text-primary-dark"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5">Txn ID</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-brandLight-panel transition-colors">
                    <td className="py-3 font-mono text-[10px]">{t.id}</td>
                    <td className="py-3">{t.type}</td>
                    <td className="py-3 text-brandDark-black font-extrabold">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black ${
                        t.status === 'Completed' ? 'bg-green-50 text-green-500 border border-green-200' :
                        t.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                        'bg-red-50 text-red-500 border border-red-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
