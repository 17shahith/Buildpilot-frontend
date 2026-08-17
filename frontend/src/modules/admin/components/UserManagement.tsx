import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { adminMockService } from '../../../services/api/adminMockService';
import type { User, Project, Transaction } from '../../../services/api/adminMockService';

interface UserManagementProps {
  roleFilter?: 'client' | 'pro' | 'vendor' | 'admin' | 'all';
}

export const UserManagement: React.FC<UserManagementProps> = ({ roleFilter = 'all' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Table search & filters state
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>(roleFilter === 'all' ? '' : roleFilter);
  const [status, setStatus] = useState('');
  const [verification, setVerification] = useState('');
  
  // Confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'suspend' | 'activate' | 'change-role' | 'verify' | 'reject';
    userId: string;
    userName: string;
    extraData?: string;
  } | null>(null);
  const [confirmReason, setConfirmReason] = useState('');

  // Projects and transactions for details view
  const [associatedProjects, setAssociatedProjects] = useState<Project[]>([]);
  const [associatedTxns, setAssociatedTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (roleFilter !== 'all') {
      setRole(roleFilter);
    } else {
      setRole('');
    }
  }, [roleFilter]);

  const loadUsers = () => {
    setUsers(adminMockService.getUsers());
  };

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    // Load associated data
    const allProjects = adminMockService.getProjects();
    const allTxns = adminMockService.getTransactions();
    
    setAssociatedProjects(
      allProjects.filter(p => p.customerId === user.id || p.contractorId === user.id || p.expertId === user.id)
    );
    setAssociatedTxns(
      allTxns.filter(t => t.userId === user.id)
    );
  };

  const handleActionClick = (
    type: 'suspend' | 'activate' | 'change-role' | 'verify' | 'reject', 
    userId: string, 
    userName: string,
    extraData?: string
  ) => {
    setConfirmAction({ type, userId, userName, extraData });
    setConfirmReason('');
  };

  const executeAction = () => {
    if (!confirmAction) return;

    const { type, userId, extraData } = confirmAction;

    if (type === 'suspend') {
      adminMockService.updateUserStatus(userId, 'Suspended', confirmReason);
    } else if (type === 'activate') {
      adminMockService.updateUserStatus(userId, 'Active', confirmReason);
    } else if (type === 'verify') {
      adminMockService.verifyUser(userId, true, confirmReason);
    } else if (type === 'reject') {
      adminMockService.verifyUser(userId, false, confirmReason);
    } else if (type === 'change-role' && extraData) {
      // Modify role in mock users manually & log
      // Just a simple state update to simulate changing role
      const usersList = adminMockService.getUsers();
      const targetUser = usersList.find(u => u.id === userId);
      if (targetUser) {
        targetUser.role = extraData as any;
        targetUser.roleDetail = extraData === 'admin' ? 'Super Admin' : extraData === 'vendor' ? 'Vendor' : extraData === 'pro' ? 'Contractor' : 'Customer';
        adminMockService.addAuditLog(`Changed user role to ${extraData}`, 'User', userId, confirmReason);
      }
    }

    loadUsers();
    
    // Update selectedUser if it's currently open
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = adminMockService.getUsers().find(u => u.id === userId);
      if (updatedUser) setSelectedUser(updatedUser);
    }

    setConfirmAction(null);
    setConfirmReason('');
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.phone.includes(search);
    const matchesRole = role === '' || u.role === role || u.roleDetail?.toLowerCase().includes(role.toLowerCase());
    const matchesStatus = status === '' || u.status === status;
    const matchesVerification = verification === '' || u.verificationStatus === verification;

    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters Panel */}
      <div className="p-5 rounded-3xl border border-brandLight-border bg-white space-y-4">
        <h2 className="text-xs font-black text-brandDark-black uppercase tracking-wider">
          Filter Users ({filteredUsers.length} shown)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input pl-10 text-xs"
            />
          </div>

          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="premium-input text-xs"
            >
              <option value="">All Roles</option>
              <option value="client">Customers</option>
              <option value="pro">Experts / Contractors</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="premium-input text-xs"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <select
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              className="premium-input text-xs"
            >
              <option value="">All Verifications</option>
              <option value="Approved">Verified</option>
              <option value="Pending">Pending Verification</option>
              <option value="Rejected">Rejected</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brandLight-border text-[9px] font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-3.5">User</th>
                <th className="pb-3.5">Role</th>
                <th className="pb-3.5">Verification</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Projects</th>
                <th className="pb-3.5">Joined</th>
                <th className="pb-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandLight-border/50 text-[11px] font-bold text-gray-600">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-brandLight-panel transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-brandDark-black font-extrabold text-xs">{u.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] bg-brandLight-slate text-brandDark-black px-2 py-0.5 rounded-md">
                      {u.roleDetail || u.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      u.verificationStatus === 'Approved' ? 'bg-green-50 text-green-500 border border-green-200' :
                      u.verificationStatus === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      u.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-500 border border-red-200' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {u.verificationStatus}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      u.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 font-mono">{u.projectsCount}</td>
                  <td className="py-4 text-gray-400">{u.joinedDate}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleOpenDetails(u)}
                        className="px-2.5 py-1 bg-brandLight-slate hover:bg-brandLight-border text-brandDark-black font-extrabold text-[10px] rounded-lg transition-all"
                      >
                        View
                      </button>
                      {u.status === 'Active' ? (
                        <button 
                          onClick={() => handleActionClick('suspend', u.id, u.name)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-500 font-extrabold text-[10px] rounded-lg border border-red-100 transition-all"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActionClick('activate', u.id, u.name)}
                          className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-600 font-extrabold text-[10px] rounded-lg border border-green-100 transition-all"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No users matching the filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Side Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-fade-in animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-brandLight-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold font-display">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-black text-brandDark-black">{selectedUser.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedUser.roleDetail}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1.5 bg-brandLight-slate hover:bg-brandLight-border text-gray-500 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-brandLight-panel border border-brandLight-border/50 text-[11px] font-bold">
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Email</span>
                <span className="text-brandDark-black font-extrabold">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Phone</span>
                <span className="text-brandDark-black font-extrabold">{selectedUser.phone}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Verification Status</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block mt-1 ${
                  selectedUser.verificationStatus === 'Approved' ? 'bg-green-50 text-green-500 border border-green-200' :
                  selectedUser.verificationStatus === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {selectedUser.verificationStatus}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Account Status</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block mt-1 ${
                  selectedUser.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                  'bg-red-50 text-red-500 border border-red-200'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Joined Date</span>
                <span className="text-brandDark-black font-extrabold">{selectedUser.joinedDate}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Last Active</span>
                <span className="text-brandDark-black font-extrabold">{selectedUser.lastActive}</span>
              </div>
              {selectedUser.experience && (
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">Experience</span>
                  <span className="text-brandDark-black font-extrabold">{selectedUser.experience}</span>
                </div>
              )}
              {selectedUser.license && (
                <div>
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold block">License ID</span>
                  <span className="text-brandDark-black font-extrabold">{selectedUser.license}</span>
                </div>
              )}
            </div>

            {/* Verification Documents (if pro/vendor and pending/approved) */}
            {selectedUser.documents && selectedUser.documents.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Submitted Credentials</h4>
                <div className="space-y-2">
                  {selectedUser.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-brandLight-panel border border-brandLight-border/50 text-xs">
                      <div>
                        <p className="font-extrabold text-[11px] text-brandDark-black">{doc.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{doc.type}</p>
                      </div>
                      <a 
                        href={doc.url} 
                        className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-brandLight-border rounded-lg text-[9px] font-black hover:bg-brandLight-slate transition-colors"
                      >
                        <span>Download</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Projects */}
            <div className="mt-6 space-y-3">
              <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Projects Summary</h4>
              <div className="space-y-2">
                {associatedProjects.map((p) => (
                  <div key={p.id} className="p-3 bg-brandLight-panel rounded-xl border border-brandLight-border/50 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-brandDark-black">{p.name}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">Budget: ₹{p.budget.toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      p.status === 'Active' ? 'bg-green-50 text-green-500 border border-green-200' :
                      p.status === 'Completed' ? 'bg-gray-100 text-gray-400' :
                      'bg-red-50 text-red-500 border border-red-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
                {associatedProjects.length === 0 && (
                  <p className="text-gray-400 text-xs italic">No projects linked to this user.</p>
                )}
              </div>
            </div>

            {/* Financial Activity */}
            <div className="mt-6 space-y-3">
              <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Financial Ledgers</h4>
              <div className="space-y-2">
                {associatedTxns.map((t) => (
                  <div key={t.id} className="p-3 bg-brandLight-panel rounded-xl border border-brandLight-border/50 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-brandDark-black">{t.type}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{t.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-brandDark-black">₹{t.amount.toLocaleString('en-IN')}</p>
                      <span className="text-[8px] text-gray-400 font-extrabold uppercase">{t.status}</span>
                    </div>
                  </div>
                ))}
                {associatedTxns.length === 0 && (
                  <p className="text-gray-400 text-xs italic">No financial transactions logged.</p>
                )}
              </div>
            </div>

            {/* Administrative Action Control */}
            <div className="mt-8 pt-6 border-t border-brandLight-border space-y-3.5">
              <h4 className="text-[10px] font-black text-brandDark-black uppercase tracking-wider">Administrative Actions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.verificationStatus === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleActionClick('verify', selectedUser.id, selectedUser.name)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-black rounded-xl transition-all shadow-glow"
                    >
                      Approve Application
                    </button>
                    <button 
                      onClick={() => handleActionClick('reject', selectedUser.id, selectedUser.name)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-all"
                    >
                      Reject Application
                    </button>
                  </>
                )}
                {selectedUser.status === 'Active' ? (
                  <button 
                    onClick={() => handleActionClick('suspend', selectedUser.id, selectedUser.name)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-black rounded-xl border border-red-200 transition-all"
                  >
                    Suspend User Account
                  </button>
                ) : (
                  <button 
                    onClick={() => handleActionClick('activate', selectedUser.id, selectedUser.name)}
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-black rounded-xl border border-green-200 transition-all"
                  >
                    Activate Account
                  </button>
                )}
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleActionClick('change-role', selectedUser.id, selectedUser.name, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-brandLight-panel border border-brandLight-border text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="">Change Role...</option>
                  <option value="client">Client (Customer)</option>
                  <option value="pro">Pro (Contractor/Expert)</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-brandLight-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-black text-brandDark-black">Confirm Administrative Action</h3>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Are you sure you want to {confirmAction.type === 'suspend' ? 'suspend' : confirmAction.type === 'activate' ? 'activate' : confirmAction.type === 'verify' ? 'verify' : confirmAction.type === 'reject' ? 'reject' : `change role of`} <strong>{confirmAction.userName}</strong>
              {confirmAction.type === 'change-role' && ` to ${confirmAction.extraData}`}? 
              This action will generate a system-wide audit event.
            </p>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase block">Reason / Justification</label>
              <textarea 
                placeholder="Enter justification for audit log..."
                value={confirmReason}
                onChange={(e) => setConfirmReason(e.target.value)}
                className="w-full min-h-[60px] p-3 text-xs bg-brandLight-panel border border-brandLight-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold"
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
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
