
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
import { TradingPage } from "./dashboard/pages/TradingPage";
import { AnalyticsPage } from "./dashboard/pages/AnalyticsPage";
import { WalletPage } from "./dashboard/pages/WalletPage";
import { RiskPage } from "./dashboard/pages/RiskPage";
import { AIToolsPage } from "./dashboard/pages/AIToolsPage";
import { SettingsPage } from "./dashboard/pages/SettingsPage";

const UserDashboard = () => {
  const { userProfile, isLovTrader } = useAuth();
  const { toast } = useToast();
  const { visibleWidgets, setVisibleWidgets, apiStatus, setApiStatus } = useDashboard();
  const [activePage, setActivePage] = useState<string>("overview");

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
        return <OverviewPage apiStatus={apiStatus} />;
      case "market":
        return <MarketPage />;
      case "trading":
        return <TradingPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "wallet":
        return <WalletPage />;
      case "risk":
        return <RiskPage />;
      case "ai":
        return <AIToolsPage apiStatus={apiStatus} showApiAccess={visibleWidgets.apiAccess} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <OverviewPage apiStatus={apiStatus} />;
    }
  };

  return (
    <DashboardLayout>
      {/* Command Center Header */}
      <DashboardHeader 
        userEmail={userProfile?.email} 
        isLovTrader={isLovTrader}
      />
      
      {/* Navigation Bar */}
      <DashboardNavigation
        activePage={activePage}
        onChangePage={handlePageChange}
      />
      
      {/* Dynamic Page Content */}
      {renderActivePage()}
    </DashboardLayout>
  );
};

export default UserDashboard;
