
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { DashboardPageContent } from './DashboardPageContent';
import { useDashboardNavigation } from '@/hooks/use-dashboard-navigation';
import { AIMarketAnalysisPage } from '@/components/ai/AIMarketAnalysisPage';

export const DashboardContent = () => {
  const location = useLocation();
  const { 
    activePage, 
    openAgentsTab, 
    openTradingAgentsTab 
  } = useDashboardNavigation();
  
  // Mock api status (in a real app, this would come from an actual API check)
  const apiStatus = 'available' as 'checking' | 'available' | 'unavailable';
  
  // Set default values for props expected by DashboardPageContent
  const showVirtualEnvironment = false;
  const visibleWidgets = {
    apiAccess: true
  };

  return (
    <div className="w-full">
      <Routes>
        <Route 
          path="/" 
          element={
            <DashboardPageContent 
              activePage="overview"
              apiStatus={apiStatus}
              showVirtualEnvironment={showVirtualEnvironment}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
        <Route 
          path="/overview" 
          element={
            <DashboardPageContent 
              activePage="overview"
              apiStatus={apiStatus}
              showVirtualEnvironment={showVirtualEnvironment}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
        <Route 
          path="/market" 
          element={
            <DashboardPageContent 
              activePage="market"
              apiStatus={apiStatus}
              showVirtualEnvironment={false}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
        <Route 
          path="/trading" 
          element={
            <DashboardPageContent 
              activePage="trading"
              apiStatus={apiStatus}
              showVirtualEnvironment={false}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
        <Route 
          path="/ai" 
          element={
            <AIMarketAnalysisPage />
          } 
        />
        <Route 
          path="/risk" 
          element={
            <DashboardPageContent 
              activePage="risk"
              apiStatus={apiStatus}
              showVirtualEnvironment={false}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
        <Route 
          path="/*" 
          element={
            <DashboardPageContent 
              activePage={activePage}
              apiStatus={apiStatus}
              showVirtualEnvironment={showVirtualEnvironment}
              visibleWidgets={visibleWidgets}
              openAgentsTab={openAgentsTab}
              openTradingAgentsTab={openTradingAgentsTab}
            />
          } 
        />
      </Routes>
    </div>
  );
};
