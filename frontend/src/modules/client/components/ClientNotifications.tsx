import React, { useState } from 'react';
import { clientMockService } from '../../../services/api/clientMockService';
import { Bell, Check, ArrowRight } from 'lucide-react';

interface ClientNotificationsProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId: (id: string) => void;
}

export const ClientNotifications: React.FC<ClientNotificationsProps> = ({
  setActiveView,
  setSelectedProjectId
}) => {
  const [notifications, setNotifications] = useState(clientMockService.getNotifications());
  const [filter, setFilter] = useState<'All' | 'Projects' | 'Payments' | 'Messages'>('All');

  const handleNotificationClick = (n: any) => {
    clientMockService.markNotificationRead(n.id);
    setNotifications(clientMockService.getNotifications());
    if (n.actionView === 'project-workspace' && n.projectId) {
      setSelectedProjectId(n.projectId);
      setActiveView('project-workspace');
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => clientMockService.markNotificationRead(n.id));
    setNotifications(clientMockService.getNotifications());
    alert('All notifications marked as read.');
  };

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    return n.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header and Toggle Controls */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span>Actionable Notifications</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold">Track updates on structural designs, escrow payouts, and contractor messages.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white rounded-xl text-xs font-bold text-slate-600 transition-all"
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters */}
        <div className="bg-white border border-brandLight-border p-5 rounded-3xl space-y-2 shadow-sm">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-3">Filter Categories</span>
          {['All', 'Projects', 'Payments', 'Messages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === cat
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-2xl border flex justify-between items-center gap-4 cursor-pointer transition-all duration-200 ${
                n.unread
                  ? 'bg-[#FFF7ED]/35 border-primary/20 hover:border-primary/45 shadow-sm'
                  : 'bg-white border-brandLight-border hover:border-slate-350'
              }`}
            >
              <div className="space-y-1 text-xs font-bold text-slate-500 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                    n.category === 'Milestones' ? 'bg-orange-50 text-orange-600 border border-orange-200/50' : 'bg-blue-50 text-blue-600 border-blue-200/50'
                  }`}>
                    {n.category}
                  </span>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                </div>
                <p className="text-brandDark-black text-[11px] font-black leading-tight mt-1">{n.text}</p>
                <span className="text-[9px] text-slate-400 block font-mono mt-0.5">{n.date}</span>
              </div>

              {n.actionView && (
                <span className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </span>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-white border border-brandLight-border p-12 rounded-3xl text-center space-y-3 shadow-sm">
              <Check className="w-8 h-8 text-green-500 mx-auto" />
              <h3 className="text-sm font-black text-slate-700">You're all caught up!</h3>
              <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-normal">
                No notifications to display in this category filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
