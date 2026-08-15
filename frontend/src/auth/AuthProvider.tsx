import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { api } from '../utils/api';

interface AuthState {
  supabaseUser: User | null;
  supabaseSession: Session | null;
  isPortalVerified: boolean;
  portalRole: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  verifyPortalAccess: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    supabaseUser: null,
    supabaseSession: null,
    isPortalVerified: false,
    portalRole: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check active sessions and sets on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        supabaseSession: session,
        supabaseUser: session?.user ?? null,
        isLoading: false
      }));

      if (session) {
        checkPortalStatus();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({
        ...prev,
        supabaseSession: session,
        supabaseUser: session?.user ?? null,
      }));
      
      if (session) {
        checkPortalStatus();
      } else {
        setState(prev => ({ ...prev, isPortalVerified: false, portalRole: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPortalStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const response = await api.get('api/portal/status', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      if (response && response.verified) {
        setState(prev => ({
          ...prev,
          isPortalVerified: true,
          portalRole: response.role
        }));
      }
    } catch (e) {
      console.error('Portal status check failed', e);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const verifyPortalAccess = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const response = await api.post('api/portal/verify', {
        username,
        password
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response && response.success && response.authorized) {
        setState(prev => ({
          ...prev,
          isPortalVerified: true,
          portalRole: response.role
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Portal verification failed', error);
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({
      supabaseUser: null,
      supabaseSession: null,
      isPortalVerified: false,
      portalRole: null,
      isLoading: false,
    });
    // Optional: Call backend to clear any HTTP-only cookies if we have them
    await api.post('api/auth/logout', {}).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, verifyPortalAccess, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
