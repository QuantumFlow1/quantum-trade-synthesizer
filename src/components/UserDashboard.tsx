
import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useDashboard } from "@/contexts/DashboardContext";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useDashboardNavigation } from "@/hooks/use-dashboard-navigation";
import { BackToAdminButton } from "./dashboard/BackToAdminButton";
import { ApiChecker } from "./dashboard/ApiChecker";
import { DashboardPageContent } from "./dashboard/DashboardPageContent";

const UserDashboard = () => {
  const { userProfile, isLovTrader } = useAuth();
  const { visibleWidgets, apiStatus } = useDashboard();
  const [showVirtualEnvironment, setShowVirtualEnvironment] = useState<boolean>(false);
  
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
      
      <DashboardPageContent 
        activePage={activePage}
        apiStatus={apiStatus}
        showVirtualEnvironment={showVirtualEnvironment}
        visibleWidgets={visibleWidgets}
        openAgentsTab={openAgentsTab}
        openTradingAgentsTab={openTradingAgentsTab}
      />
    </DashboardLayout>
  );
};

export default UserDashboard;
