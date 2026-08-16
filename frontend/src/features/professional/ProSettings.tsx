import React, { useState } from 'react';
import { professionalMockService } from '../../services/professionalMockService';

export const ProSettings: React.FC = () => {
  const [settings, setSettings] = useState(professionalMockService.getSettings());
  const [success, setSuccess] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated as any);
    professionalMockService.updateSettings(updated);
    triggerSuccess();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updated = { ...settings, specialization: e.target.value };
    setSettings(updated as any);
    professionalMockService.updateSettings(updated);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm space-y-4">
        <h2 className="text-lg font-black text-brandDark-black font-display">Workspace Configuration</h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">Control recommendations, notification digests, and project availability.</p>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl text-center">
            Settings auto-saved successfully.
          </div>
        )}

        <div className="space-y-5 text-xs font-bold text-slate-700 pt-2">
          {/* Availability Switch */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
            <div className="space-y-1 pr-4">
              <span className="text-brandDark-black font-black block">Available for New Projects</span>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">When active, clients can view your profile and send custom work requests in the marketplace.</p>
            </div>
            <button
              onClick={() => handleToggle('availableForWork')}
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                settings.availableForWork ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                  settings.availableForWork ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Primary Specialization */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Primary Specialization</label>
            <select
              value={settings.specialization}
              onChange={handleSelectChange}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 bg-white"
            >
              <option value="Architecture & Interior Design">Architecture & Interior Design</option>
              <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
              <option value="Landscape Planning">Landscape & Rooftop Planning</option>
              <option value="Project Supervision & Contracting">Project Supervision & Contracting</option>
            </select>
          </div>

          {/* Notification Options */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Alert Preferences</h3>
            
            <div className="space-y-2">
              {[
                { label: 'New Project recommendation alerts', key: 'alertNewProjects' },
                { label: 'Escrow payment and release alerts', key: 'alertPaymentEscrow' },
                { label: 'Unread client message notifications', key: 'alertClientMessages' },
                { label: 'Weekly email performance digests', key: 'emailDigests' }
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="text-slate-600 font-bold">{item.label}</span>
                  <button
                    onClick={() => handleToggle(item.key as any)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-all ${
                      (settings as any)[item.key] ? 'bg-primary' : 'bg-slate-350'
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${
                        (settings as any)[item.key] ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
