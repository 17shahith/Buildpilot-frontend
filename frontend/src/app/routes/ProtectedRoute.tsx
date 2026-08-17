import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'client' | 'pro' | 'admin'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500">Checking authorization...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    if (userRole === 'admin') return <Navigate to="/main/admin" replace />;
    if (userRole === 'pro') return <Navigate to="/main/professional" replace />;
    return <Navigate to="/main/client" replace />;
  }

  return <>{children}</>;
};
