import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../../modules/dashboard/pages/LandingPage';
import { AuthPage } from '../../modules/auth/pages/AuthPage';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardClient from '../../modules/client/pages/DashboardClient';
import DashboardProfessional from '../../modules/contractor/pages/DashboardContractor';
import DashboardAdmin from '../../modules/admin/pages/DashboardAdmin';
import AIEstimator from '../../modules/estimation/pages/AIEstimator';
import ARVisualizer from '../../modules/ai/pages/ARVisualizer';
import AIInteriorStudio from '../../modules/ai/pages/AIInteriorStudio';
import Marketplace from '../../modules/client/pages/Marketplace';
import HomeCare from '../../modules/client/pages/HomeCare';
import { DashboardLayout } from '../layouts/DashboardLayout';

interface AppRoutesProps {
  setCurrentView: (view: string) => void;
  marketplaceTab: 'pros' | 'properties';
  setMarketplaceTab: (tab: 'pros' | 'properties') => void;
  marketplaceSearch: string;
  setMarketplaceSearch: (search: string) => void;
  marketplaceRole: string;
  setMarketplaceRole: (role: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  setCurrentView,
  marketplaceTab,
  setMarketplaceTab,
  marketplaceSearch,
  setMarketplaceSearch,
  marketplaceRole,
  setMarketplaceRole
}) => {
  return (
    <Routes>
      <Route path="/" element={
        <LandingPage
          setCurrentView={setCurrentView}
          setMarketplaceTab={setMarketplaceTab}
          setMarketplaceSearch={setMarketplaceSearch}
          setMarketplaceRole={setMarketplaceRole}
        />
      } />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/main" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="client" replace />} />
        <Route path="client" element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <DashboardClient />
          </ProtectedRoute>
        } />
        <Route path="professional" element={
          <ProtectedRoute allowedRoles={['pro', 'admin']}>
            <DashboardProfessional />
          </ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        } />
        <Route path="estimator" element={<AIEstimator />} />
        <Route path="ar" element={<ARVisualizer />} />
        <Route path="studio" element={<AIInteriorStudio />} />
        <Route path="marketplace" element={
          <Marketplace
            tab={marketplaceTab}
            setTab={setMarketplaceTab}
            search={marketplaceSearch}
            setSearch={setMarketplaceSearch}
            filterRole={marketplaceRole}
            setFilterRole={setMarketplaceRole}
          />
        } />
        <Route path="homecare" element={<HomeCare />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
