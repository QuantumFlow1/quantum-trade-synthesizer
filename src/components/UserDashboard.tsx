
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load dashboard pages for better performance
const DashboardLayout = React.lazy(() => import('./dashboard/DashboardLayout'));
const MarketPage = React.lazy(() => import('./dashboard/pages/market/MarketPage'));
const PortfolioPage = React.lazy(() => import('./dashboard/pages/portfolio/PortfolioPage'));
const TradingPage = React.lazy(() => import('./dashboard/pages/trading/TradingPage'));
const SettingsPage = React.lazy(() => import('./dashboard/pages/settings/SettingsPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading...</span>
  </div>
);

const UserDashboard: React.FC = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="market" replace />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="trading" element={<TradingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="market" replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default UserDashboard;
