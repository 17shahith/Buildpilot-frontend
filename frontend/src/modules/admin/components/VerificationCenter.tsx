import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { adminMockService } from '../../../services/api/adminMockService';
import type { User } from '../../../services/api/adminMockService';
import confetti from 'canvas-confetti';

export const VerificationCenter: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Confirmation Modal state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'info';
    user: User;
  } | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Filter to show pros/vendors only since they require verification
    const allUsers = adminMockService.getUsers().filter(u => u.role === 'pro' || u.role === 'vendor');
    setUsers(allUsers);
  };

  const handleActionClick = (type: 'approve' | 'reject' | 'info', user: User) => {
    setConfirmAction({ type, user });
    setReason('');
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;

    if (type === 'approve') {
      adminMockService.verifyUser(user.id, true, reason);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 }
      });
    } else if (type === 'reject') {
      adminMockService.verifyUser(user.id, false, reason);
    } else if (type === 'info') {
      adminMockService.addAuditLog(
        'Requested more verification info',
        'User',
        user.id,
        reason || 'Clarification on license registration ID'
      );
      alert(`Information request sent to ${user.name}. Reason: ${reason}`);
    }

    loadUsers();
    setConfirmAction(null);
    setReason('');
    setSelectedUser(null); // Close documents modal
  };

  const filteredUsers = users.filter(u => u.verificationStatus === activeTab);

  // Statistics
  const pendingCount = users.filter(u => u.verificationStatus === 'Pending').length;
  const approvedCount = users.filter(u => u.verificationStatus === 'Approved').length;
  const rejectedCount = users.filter(u => u.verificationStatus === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Verification Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div 
          onClick={() => setActiveTab('Pending')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 ${
            activeTab === 'Pending' 
              ? 'border-yellow-500 bg-yellow-50/10' 
              : 'border-brandLight-border bg-white hover:bg-brandLight-panel'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Verification</span>
            <div className="p-2 rounded-xl bg-yellow-50 text-yellow-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">
            {pendingCount}
          </h3>
        </div>

        <div 
          onClick={() => setActiveTab('Approved')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 ${
            activeTab === 'Approved' 
              ? 'border-green-500 bg-green-50/10' 
              : 'border-brandLight-border bg-white hover:bg-brandLight-panel'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Approved / Verified</span>
            <div className="p-2 rounded-xl bg-green-50 text-green-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">
            {approvedCount}
          </h3>
        </div>

        <div 
          onClick={() => setActiveTab('Rejected')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 ${
            activeTab === 'Rejected' 
              ? 'border-red-500 bg-red-50/10' 
              : 'border-brandLight-border bg-white hover:bg-brandLight-panel'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rejected</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-500">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-brandDark-black font-display mt-4">
            {rejectedCount}
          </h3>
        </div>
      </div>

      {/* Main List */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
          {activeTab} Professional & Vendor Requests ({filteredUsers.length})
        </h2>

        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div 
              key={u.id}
              className="p-4 bg-brandLight-panel border border-brandLight-border rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs font-bold"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-brandDark-black text-sm">{u.name}</span>
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase">
                    {u.roleDetail || u.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-[10px] text-gray-400 mt-2 font-semibold">
                  <p>Experience: <strong className="text-gray-600 font-extrabold">{u.experience || 'N/A'}</strong></p>
                  <p>License ID: <strong className="text-gray-600 font-extrabold">{u.license || 'N/A'}</strong></p>
                  <p>Submitted: <strong className="text-gray-600 font-extrabold">{u.joinedDate}</strong></p>
                  <p>Email: <strong className="text-gray-600 font-extrabold">{u.email}</strong></p>
                </div>
              </div>

              <div className="flex gap-2 self-start md:self-center">
                {u.documents && u.documents.length > 0 && (
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="px-3.5 py-2 border border-brandLight-border bg-white text-brandDark-black font-black rounded-xl hover:bg-brandLight-slate transition-colors flex items-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Review Docs</span>
                  </button>
                )}
                {activeTab === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleActionClick('approve', u)}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white font-black rounded-xl transition-all shadow-glow"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleActionClick('reject', u)}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 font-black rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleActionClick('info', u)}
                      className="px-3.5 py-2 border border-brandLight-border text-gray-500 font-black rounded-xl hover:bg-brandLight-slate transition-all"
                    >
                      Request Info
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-gray-400 italic">
              No pending verification requests. All expert and contractor applications have been reviewed.
            </div>
          )}
        </div>
      </div>

      {/* Review Documents Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-brandLight-border p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-brandLight-border">
              <h3 className="text-sm font-black text-brandDark-black">Review Credentials: {selectedUser.name}</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1 bg-brandLight-slate hover:bg-brandLight-border rounded-xl text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 py-2">
              <p className="text-xs text-gray-500 font-bold">
                Please verify the licenses and ID credentials below before confirming verification badge issuance.
              </p>

              <div className="space-y-2">
                {selectedUser.documents?.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-brandLight-panel border border-brandLight-border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-brandDark-black">{doc.name}</p>
                      <p className="text-[9px] text-gray-400 font-semibold uppercase">{doc.type}</p>
                    </div>
                    <a 
                      href={doc.url} 
                      className="px-2.5 py-1 bg-white border border-brandLight-border hover:bg-brandLight-slate rounded-lg text-[9px] font-black"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {selectedUser.verificationStatus === 'Pending' && (
              <div className="flex justify-end gap-2 pt-2 border-t border-brandLight-border">
                <button 
                  onClick={() => handleActionClick('reject', selectedUser)}
                  className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-black rounded-xl transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleActionClick('approve', selectedUser)}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-glow"
                >
                  Approve Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-brandLight-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-brandDark-black">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                {confirmAction.type === 'approve' ? 'Approve' : confirmAction.type === 'reject' ? 'Reject' : 'Request Info'} Application
              </h3>
            </div>

            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              You are about to {confirmAction.type === 'approve' ? 'approve and grant verification status to' : confirmAction.type === 'reject' ? 'reject' : 'request additional documents for'} <strong>{confirmAction.user.name}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Audit Reason / Message to User</label>
              <textarea 
                placeholder="Provide details..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full min-h-[70px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border border-brandLight-border hover:bg-brandLight-slate text-brandDark-black text-xs font-black rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-glow"
              >
                Confirm Verification State
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
