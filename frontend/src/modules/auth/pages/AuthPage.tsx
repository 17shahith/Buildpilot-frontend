import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupRole, setSignupRole] = useState<'client' | 'pro' | 'admin'>('client');
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/main');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/main');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in window closed. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setAuthError('Connection failed. Please check your internet connection.');
      } else {
        setAuthError('Authentication failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        navigate('/main');
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, signupRole);
        setSuccessMsg('Account created successfully! Welcome to BuildCore.');
        setTimeout(() => {
          if (signupRole === 'admin') navigate('/main/admin');
          else if (signupRole === 'pro') navigate('/main/professional');
          else navigate('/main/client');
        }, 1500);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your email.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setAuthError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setAuthError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Invalid email format.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else {
        setAuthError(err.message || 'Operation failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-6 py-12 bg-white">
      <div className="w-full max-w-sm bg-white space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#1E293B] font-display">
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
        </div>

        {authError && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl text-center">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          {mode !== 'forgot' && (
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center w-full px-4 py-2.5 space-x-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-bold text-sm text-slate-700 disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google</span>
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#F97316]/50 bg-white text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#F97316]/30 shadow-sm"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#F97316]/50 bg-white text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#F97316]/30 shadow-sm"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Account Type</label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as 'client' | 'pro' | 'admin')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#F97316]/50 bg-white text-slate-800 focus:ring-1 focus:ring-[#F97316]/30 shadow-sm"
                >
                  <option value="client">Client (Customer)</option>
                  <option value="pro">Professional (Contractor/Architect)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>
                  {mode === 'signin' && 'Sign in'}
                  {mode === 'signup' && 'Sign up'}
                  {mode === 'forgot' && 'Send reset link'}
                </span>
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setAuthError('');
                setSuccessMsg('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline transition-colors block mx-auto mt-4"
            >
              Forgot password
            </button>
          )}

          <div className="text-center mt-6">
            {mode === 'signin' && (
              <p className="text-xs text-slate-500 font-semibold">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthError('');
                    setSuccessMsg('');
                  }}
                  className="text-[#F97316] hover:underline font-bold"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-xs text-slate-500 font-semibold">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setAuthError('');
                    setSuccessMsg('');
                  }}
                  className="text-[#F97316] hover:underline font-bold"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-[#F97316] hover:underline font-bold"
              >
                Back to Sign in
              </button>
            )}
          </div>

          {/* Quick Demo / Developer Sign-In Panel */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              Developer Quick Access Portals
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await signInWithEmail('admin@buildpilot.in', 'password');
                    navigate('/main/admin');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 border border-red-100 hover:border-red-300 hover:bg-red-50/20 rounded-2xl transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-1.5 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <span className="text-[9px] font-black text-red-600 tracking-wider">Admin</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await signInWithEmail('pro@buildpilot.in', 'password');
                    navigate('/main/professional');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 border border-orange-100 hover:border-orange-300 hover:bg-orange-50/20 rounded-2xl transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-1.5 group-hover:scale-110 transition-transform">
                  💼
                </div>
                <span className="text-[9px] font-black text-orange-600 tracking-wider">Pro Portal</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await signInWithEmail('client@buildpilot.in', 'password');
                    navigate('/main/client');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 border border-blue-100 hover:border-blue-300 hover:bg-blue-50/20 rounded-2xl transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-1.5 group-hover:scale-110 transition-transform">
                  👤
                </div>
                <span className="text-[9px] font-black text-blue-600 tracking-wider">Client</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
