import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes';

function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard-client');
  const [marketplaceTab, setMarketplaceTab] = useState<'pros' | 'properties'>('pros');
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>('');
  const [marketplaceRole, setMarketplaceRole] = useState<string>('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Enforce Light Theme body class injection on mount
  useEffect(() => {
    document.body.classList.add('light-theme');
  }, []);

  // Sync route and currentView view-switcher
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentView('landing');
    } else if (path === '/auth') {
      setCurrentView('auth');
    } else if (path === '/main/client') {
      setCurrentView('dashboard-client');
    } else if (path === '/main/professional') {
      setCurrentView('dashboard-pro');
    } else if (path === '/main/admin') {
      setCurrentView('dashboard-admin');
    } else if (path.startsWith('/main/')) {
      const view = path.replace('/main/', '');
      setCurrentView(view);
    }
  }, [location.pathname]);

  return (
    <MainLayout
      currentView={currentView}
      setCurrentView={(view) => {
        if (view === 'landing') navigate('/');
        else if (view === 'auth') navigate('/auth');
        else if (view === 'dashboard-client' || view === 'client') navigate('/main/client');
        else if (view === 'dashboard-pro' || view === 'professional') navigate('/main/professional');
        else if (view === 'dashboard-admin' || view === 'admin') navigate('/main/admin');
        else navigate(`/main/${view}`);
      }}
      setMarketplaceTab={setMarketplaceTab}
    >
      <AppRoutes
        setCurrentView={(view) => {
          if (view === 'auth') {
            navigate('/auth');
          } else if (user) {
            if (view === 'dashboard-client') navigate('/main/client');
            else navigate(`/main/${view}`);
          } else {
            navigate('/auth');
          }
        }}
        marketplaceTab={marketplaceTab}
        setMarketplaceTab={setMarketplaceTab}
        marketplaceSearch={marketplaceSearch}
        setMarketplaceSearch={setMarketplaceSearch}
        marketplaceRole={marketplaceRole}
        setMarketplaceRole={setMarketplaceRole}
      />
    </MainLayout>
  );
}

export default App;
