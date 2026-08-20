import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export interface User {
  id: string;
  email: string;
  role: string;
  profile?: any;
  uid?: string; // For compatibility with older code, map id to uid
  displayName?: string; // For compatibility
  photoURL?: string; // For compatibility
}

interface AuthContextType {
  user: User | null;
  userRole: 'client' | 'pro' | 'admin' | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role?: 'client' | 'pro' | 'admin') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getMockUserForRole = (role: 'client' | 'pro' | 'admin', email?: string): User => {
  if (role === 'admin') {
    return {
      id: 'usr-8',
      uid: 'usr-8',
      email: email || 'vikram@buildpilot.in',
      role: 'ADMIN',
      displayName: 'Vikram Mehta (Super Admin)',
      profile: { name: 'Vikram Mehta' }
    };
  } else if (role === 'pro') {
    return {
      id: 'usr-3',
      uid: 'usr-3',
      email: email || 'ananya@architects.in',
      role: 'PRO',
      displayName: 'Ananya Roy (Architect)',
      profile: { name: 'Ananya Roy' }
    };
  } else {
    return {
      id: 'usr-1',
      uid: 'usr-1',
      email: email || 'shahith@test.com',
      role: 'CLIENT',
      displayName: 'Shahith (Customer)',
      profile: { name: 'Shahith' }
    };
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'pro' | 'admin' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }
    
    // Check if it is a mock token
    if (token.startsWith('mock-token-')) {
      const role = token.replace('mock-token-', '') as 'client' | 'pro' | 'admin';
      const mockUser = getMockUserForRole(role);
      setUser(mockUser);
      setUserRole(role);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedUser = { ...data, uid: data.id, displayName: data.profile?.name || data.email };
        setUser(mappedUser);
        setUserRole(data.role.toLowerCase());
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.warn('Failed to fetch user from backend, checking fallback mock token:', error);
      // Fallback: If backend is offline but token exists, guess role from token
      let role: 'client' | 'pro' | 'admin' = 'client';
      if (token.includes('admin')) role = 'admin';
      else if (token.includes('pro')) role = 'pro';
      
      const mockUser = getMockUserForRole(role);
      setUser(mockUser);
      setUserRole(role);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem('token', idToken);
      
      const email = result.user.email || '';
      const displayName = result.user.displayName || email || 'Google User';
      
      // Try to register/login via custom backend if available
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('token', data.token);
          const mappedUser = { ...data.user, uid: data.user.id, displayName: data.user.profile?.name || data.user.email };
          setUser(mappedUser);
          setUserRole(data.user.role.toLowerCase());
          return;
        }
      } catch (err) {
        console.warn('Backend Google Auth verification not available/failed. Falling back to client-side session:', err);
      }

      // If backend verification fails or is offline, generate a mock-token/session based on role
      // Check if it's a known admin/pro email, otherwise default to client role.
      let role: 'client' | 'pro' | 'admin' = 'client';
      if (email === 'vikram@buildpilot.in') role = 'admin';
      else if (email === 'ananya@architects.in') role = 'pro';

      const mappedUser = {
        id: result.user.uid,
        uid: result.user.uid,
        email: email,
        role: role.toUpperCase(),
        displayName: displayName,
        photoURL: result.user.photoURL || undefined,
        profile: { name: displayName }
      };
      setUser(mappedUser);
      setUserRole(role);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        let errMsg = 'Login failed';
        try {
          const error = await res.json();
          errMsg = error.error || 'Login failed';
        } catch (e) {
          throw new Error('Failed to fetch');
        }
        throw new Error(errMsg);
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      const mappedUser = { ...data.user, uid: data.user.id, displayName: data.user.profile?.name || data.user.email };
      setUser(mappedUser);
      setUserRole(data.user.role.toLowerCase());
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, role: 'client' | 'pro' | 'admin' = 'client') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: role.toUpperCase() })
      });
      if (!res.ok) {
        let errMsg = 'Signup failed';
        try {
          const error = await res.json();
          errMsg = error.error || 'Signup failed';
        } catch (e) {
          throw new Error('Failed to fetch');
        }
        throw new Error(errMsg);
      }
      // Automatically log in after registration
      await signInWithEmail(email, password);
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const resetPassword = async (_email: string) => {
    alert("Password reset not yet implemented on the backend.");
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token && !token.startsWith('mock-token-')) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.warn('Logout request failed:', e);
      }
    }
    localStorage.removeItem('token');
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole,
      loading, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      resetPassword, 
      logout 
    }}>
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
