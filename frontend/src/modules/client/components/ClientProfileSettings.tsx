import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';


export const ClientProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  // Preference states
  const [alertNewMilestone, setAlertNewMilestone] = useState(true);
  const [alertEscrowPayout, setAlertEscrowPayout] = useState(true);
  const [alertChatMsg, setAlertChatMsg] = useState(true);
  const [alertMaintenance, setAlertMaintenance] = useState(true);

  const [address, setAddress] = useState('No. 12, Lake View Road, Chennai');
  const [phone, setPhone] = useState('+91 98456 12301');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-brandLight-border p-6 rounded-3xl shadow-sm space-y-4">
        <h2 className="text-lg font-black text-brandDark-black font-display">Account & Profile Settings</h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">Configure phone coordinates, alerts preferences, and contact locations.</p>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-2xl text-center">
            Profile changes saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs font-bold text-slate-650">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Account Username / Email</label>
              <input
                type="text"
                disabled
                value={user?.email || 'client@buildpilot.in'}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Hiring Coordinator Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Primary Site Construction Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-800 bg-white"
            />
          </div>

          {/* Alerts Preferences */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Escrow & Milestone Alert Preferences</h3>
            
            <div className="space-y-2.5">
              {[
                { label: 'Notify when professional submits a milestone for review', val: alertNewMilestone, setter: setAlertNewMilestone },
                { label: 'Notify when escrow deposits are successfully processed', val: alertEscrowPayout, setter: setAlertEscrowPayout },
                { label: 'Notify when support agents or contractors message', val: alertChatMsg, setter: setAlertChatMsg },
                { label: 'Notify when maintenance request status changes', val: alertMaintenance, setter: setAlertMaintenance }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="text-slate-600 font-bold">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => item.setter(!item.val)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-all ${
                      item.val ? 'bg-primary' : 'bg-slate-350'
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${
                        item.val ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
          >
            Save Account Details
          </button>
        </form>
      </div>
    </div>
  );
};
