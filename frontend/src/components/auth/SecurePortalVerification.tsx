import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Info } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import confetti from 'canvas-confetti';

interface SecurePortalVerificationProps {
  requiredRole: 'client' | 'pro' | 'admin';
  onVerificationSuccess?: () => void;
}

export const SecurePortalVerification: React.FC<SecurePortalVerificationProps> = ({ 
  requiredRole, 
  onVerificationSuccess 
}) => {
  const { verifyPortalAccess } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    setIsVerifying(true);

    try {
      const success = await verifyPortalAccess(usernameInput.trim(), passwordInput);
      
      if (success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      } else {
        setVerificationError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      setVerificationError('Unable to verify your portal access. Please try again later.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center shadow-lg mx-auto">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight mt-3">
            Secure Portal Verification
          </h2>
          <p className="text-xs text-slate-500">
            Please authorize to unlock the Professional Dashboard
          </p>
        </div>

        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#EA580C] font-extrabold uppercase">
            <Info className="w-4 h-4" />
            <span>Secure Sign In Required</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
            Sign in with an account issued by the BuildPilot backend. Portal permissions are verified server-side.
          </p>
        </div>

        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          {verificationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
              {verificationError}
            </div>
          )}

          <div className="space-y-1 text-xs">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter your username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#F97316]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center space-x-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify and Access</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
