import React, { useState } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';

export const ClientSchedule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const events = [
    { id: 'ev-1', title: 'Site Inspection & Foundation Check', type: 'Inspection', date: '2026-08-18', time: '10:00 AM', projectName: 'Modern Kitchen Renovation' },
    { date: '2026-08-20', type: 'Design Review', title: 'Cabinet panel selection walkthrough', time: '04:30 PM', projectName: 'Modern Kitchen Renovation' },
    { date: '2026-08-24', type: 'Deadline', title: 'Tiling stage target completion', time: '05:00 PM', projectName: 'Modern Kitchen Renovation' }
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 5; // Starts on Friday

  return (
    <div className="space-y-6">
      {/* Header and Toggle Controls */}
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-brandDark-black font-display flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span>Project Calendars & Events</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">Oversee scheduled site inspections, blueprints walkthroughs, and delivery deadlines.</p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              viewMode === 'calendar'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              viewMode === 'list'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Dynamic Scheduling views */}
      {viewMode === 'calendar' ? (
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="text-center font-black text-sm text-brandDark-black uppercase tracking-wider">
            August 2026
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Day offsets */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="min-h-[80px] bg-slate-50/30 rounded-2xl border border-slate-50/50"></div>
            ))}

            {/* Monthly Days */}
            {daysInMonth.map((day) => {
              const dateStr = `2026-08-${day.toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);

              return (
                <div key={day} className="min-h-[80px] p-2 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all flex flex-col justify-between group">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-brandDark-black font-mono">{day}</span>
                  <div className="space-y-1">
                    {dayEvents.map((e, idx) => (
                      <div
                        key={idx}
                        onClick={() => alert(`Event: ${e.title}\nProject: ${e.projectName}\nTime: ${e.time}`)}
                        className={`text-[8px] p-1 rounded font-bold truncate cursor-pointer ${
                          e.type === 'Inspection' ? 'bg-orange-50 text-orange-600 border border-orange-200/50' : e.type === 'Deadline' ? 'bg-red-50 text-red-600 border border-red-200/50' : 'bg-blue-50 text-blue-600 border border-blue-200/50'
                        }`}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
            Scheduled Events List
          </h3>

          <div className="space-y-3">
            {events.map((e, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-200 transition-all">
                <div className="space-y-1.5 text-xs font-bold text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-lg border font-black uppercase font-mono ${
                      e.type === 'Inspection' ? 'bg-orange-50 border-orange-200 text-orange-600' : e.type === 'Deadline' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 text-blue-600'
                    }`}>
                      {e.type}
                    </span>
                    <span className="text-brandDark-black font-black">{e.title}</span>
                  </div>
                  <span className="block text-[10px] text-slate-400">Associated Project: {e.projectName}</span>
                </div>

                <div className="flex items-center space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div className="text-left sm:text-right text-xs font-bold text-slate-500">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Scheduled Date</span>
                    <span className="text-brandDark-black font-black font-mono">{e.date} at {e.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
