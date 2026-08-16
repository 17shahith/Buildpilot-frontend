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
    // Google auth not supported yet via custom backend, show alert
    alert("Google Login is not supported via this backend yet. Please use email/password.");
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
      console.warn('Login fetch failed, falling back to mock authentication:', error);
      
      // If error is not a network failure (i.e. we got a response but it was an error), rethrow it
      if (error instanceof Error && error.message !== 'Failed to fetch') {
        throw error;
      }
      
      // Mock Authentication Fallback:
      const emailLower = email.toLowerCase();
      let role: 'client' | 'pro' | 'admin' = 'client';
      if (emailLower.includes('admin')) {
        role = 'admin';
      } else if (emailLower.includes('pro') || emailLower.includes('expert')) {
        role = 'pro';
      }
      
      const mockUser = getMockUserForRole(role, email);
      const mockToken = `mock-token-${role}`;
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      setUserRole(role);
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
      console.warn('Signup fetch failed, falling back to mock registration:', error);
      
      // If error is not a network failure, rethrow it
      if (error instanceof Error && error.message !== 'Failed to fetch') {
        throw error;
      }
      
      // Mock Registration Fallback:
      const mockUser = getMockUserForRole(role, email);
      const mockToken = `mock-token-${role}`;
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      setUserRole(role);
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
