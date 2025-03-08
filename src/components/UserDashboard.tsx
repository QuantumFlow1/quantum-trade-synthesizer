import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { useDashboard } from "@/contexts/DashboardContext";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";

// Import all page components
import { OverviewPage } from "./dashboard/pages/OverviewPage";
import { MarketPage } from "./dashboard/pages/MarketPage";
import { MinimalTradingPage } from "./dashboard/pages/MinimalTradingPage";
import { AnalyticsPage } from "./dashboard/pages/AnalyticsPage";
import { WalletPage } from "./dashboard/pages/WalletPage";
import { RiskPage } from "./dashboard/pages/RiskPage";
import { AIToolsPage } from "./dashboard/pages/AIToolsPage";
import { SettingsPage } from "./dashboard/pages/SettingsPage";
import { GamificationPage } from "./dashboard/pages/GamificationPage";
import { VisualizationPage } from "./dashboard/pages/VisualizationPage";
import { VirtualEnvironmentDemo } from "./visualization/VirtualEnvironmentDemo";

const UserDashboard = () => {
  const { userProfile, isLovTrader } = useAuth();
  const { toast } = useToast();
  const { visibleWidgets, setVisibleWidgets, apiStatus, setApiStatus } = useDashboard();
  const [activePage, setActivePage] = useState<string>("overview");
  const [showVirtualEnvironment, setShowVirtualEnvironment] = useState<boolean>(false);

  useEffect(() => {
    // Check if API is available
    const checkApiStatus = async () => {
      try {
        setApiStatus('checking');
        const { data, error } = await supabase.functions.invoke('grok3-response', {
          body: {
            message: "Give me a simple test response",
            context: []
          }
        });
        
        if (error) {
          console.error("API status check failed:", error);
          setApiStatus('unavailable');
        } else {
          console.log("API status check successful:", data);
          setApiStatus('available');
        }
      } catch (error) {
        console.error("Error checking API status:", error);
        setApiStatus('unavailable');
      }
    };
    
    // Only check API status if user is a lov_trader
    if (isLovTrader) {
      checkApiStatus();
      setVisibleWidgets(prev => ({ ...prev, apiAccess: true }));
      
      // Show virtual environment for lov_traders by default
      setShowVirtualEnvironment(true);
    }
  }, [isLovTrader, setApiStatus, setVisibleWidgets]);

  // Handle page navigation
  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  // Render the correct page based on activePage state
  const renderActivePage = () => {
    switch (activePage) {
      case "overview":
        return (
          <>
            {showVirtualEnvironment && <VirtualEnvironmentDemo />}
            <OverviewPage apiStatus={apiStatus} />
          </>
        );
      case "market":
        return <MarketPage />;
      case "trading":
        return <MinimalTradingPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "wallet":
        return <WalletPage />;
      case "risk":
        return <RiskPage />;
      case "ai":
        return <AIToolsPage apiStatus={apiStatus} showApiAccess={visibleWidgets.apiAccess} />;
      case "gamification":
        return <GamificationPage />;
      case "visualization":
        return <VisualizationPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <>
            {showVirtualEnvironment && <VirtualEnvironmentDemo />}
            <OverviewPage apiStatus={apiStatus} />
          </>
        );
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        userEmail={userProfile?.email} 
        isLovTrader={isLovTrader}
      />
      
      <DashboardNavigation
        activePage={activePage}
        onChangePage={handlePageChange}
      />
      
      {renderActivePage()}
    </DashboardLayout>
  );
};

export default UserDashboard;
