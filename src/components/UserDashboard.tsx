
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { useDashboard } from "@/contexts/DashboardContext";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import DashboardNavigation from "./dashboard/DashboardNavigation"; // Fixed import
import { useDashboardNavigation } from "@/hooks/use-dashboard-navigation";
import { BackToAdminButton } from "./dashboard/BackToAdminButton";
import { ApiChecker } from "./dashboard/ApiChecker";
import { DashboardPageContent } from "./dashboard/DashboardPageContent";
import { OverviewPage } from "./dashboard/pages/OverviewPage";
import { MarketPage } from "./dashboard/pages/MarketPage";
import { PortfolioPage } from "./dashboard/pages/PortfolioPage";
import { MinimalTradingPage } from "./dashboard/pages/MinimalTradingPage";
import { AnalyticsPage } from "./dashboard/pages/AnalyticsPage";
import { WalletPage } from "./dashboard/pages/WalletPage";
import { RiskPage } from "./dashboard/pages/RiskPage";
import { AIToolsPage } from "./dashboard/pages/AIToolsPage";
import { SettingsPage } from "./dashboard/pages/SettingsPage";
import { GamificationPage } from "./dashboard/pages/GamificationPage";

const UserDashboard = () => {
  const { userProfile, isLovTrader } = useAuth();
  const { visibleWidgets, apiStatus } = useDashboard();
  const [showVirtualEnvironment, setShowVirtualEnvironment] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    activePage,
    openAgentsTab,
    showBackButton,
    setOpenAgentsTab,
    handlePageChange,
    handleBackToAdmin,
    openTradingAgentsTab
  } = useDashboardNavigation();

  // Clear the openAgentsTab state after it's been used
  useEffect(() => {
    if (openAgentsTab && activePage === 'trading') {
      setOpenAgentsTab(false);
    }
  }, [activePage, openAgentsTab, setOpenAgentsTab]);

  // Setup virtual environment for lov_traders
  useEffect(() => {
    if (isLovTrader) {
      setShowVirtualEnvironment(true);
    }
  }, [isLovTrader]);

  // Force disable any chat functionality
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('disable-chat-services', 'true');
    }
  }, []);

  // Redirect to overview if we're at the root dashboard path
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/overview');
    }
  }, [location.pathname, navigate]);

  return (
    <DashboardLayout>
      {showBackButton && (
        <div className="px-4 py-2">
          <BackToAdminButton onClick={handleBackToAdmin} />
        </div>
      )}
      
      <DashboardHeader 
        userEmail={userProfile?.email} 
        isLovTrader={isLovTrader}
      />
      
      <DashboardNavigation
        activePage={activePage}
        onChangePage={handlePageChange}
      />
      
      <ApiChecker isLovTrader={isLovTrader} />
      
      <Routes>
        <Route path="/" element={<OverviewPage apiStatus={apiStatus} />} />
        <Route path="/overview" element={<OverviewPage apiStatus={apiStatus} />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/trading" element={<MinimalTradingPage initialOpenAgentsTab={openAgentsTab} />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/risk" element={<RiskPage />} />
        <Route path="/ai" element={<AIToolsPage 
          apiStatus={apiStatus} 
          showApiAccess={visibleWidgets.apiAccess} 
          openTradingAgents={openTradingAgentsTab}
        />} />
        <Route path="/gamification" element={<GamificationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Add fallback route to overview */}
        <Route path="*" element={<OverviewPage apiStatus={apiStatus} />} />
      </Routes>
    </DashboardLayout>
  );
};

export default UserDashboard;
