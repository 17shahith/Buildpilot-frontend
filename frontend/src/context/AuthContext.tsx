import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

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
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      console.error('Failed to fetch user:', error);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const signInWithGoogle = async () => {
    // Google auth not supported yet via custom backend, show alert
    alert("Google Login is not supported via this backend yet. Please use email/password.");
  };

  const signInWithEmail = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    const mappedUser = { ...data.user, uid: data.user.id, displayName: data.user.profile?.name || data.user.email };
    setUser(mappedUser);
    setUserRole(data.user.role.toLowerCase());
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'CLIENT' })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Signup failed');
    }
    // Automatically log in after registration
    await signInWithEmail(email, password);
  };

  const resetPassword = async (_email: string) => {
    alert("Password reset not yet implemented on the backend.");
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('token');
    }
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
