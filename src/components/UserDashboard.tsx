
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract active page from URL path
  const getActivePageFromPath = () => {
    const path = location.pathname.split('/').filter(Boolean)[1] || "overview";
    return path;
  };
  
  const [activePage, setActivePage] = useState<string>(getActivePageFromPath());
  const [showVirtualEnvironment, setShowVirtualEnvironment] = useState<boolean>(false);

  useEffect(() => {
    // Update active page when location changes
    setActivePage(getActivePageFromPath());
  }, [location.pathname]);

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
    navigate(`/dashboard/${page === "overview" ? "" : page}`);
  };

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    return activePage === path;
  };

  // Open trading agents tab from different parts of the UI
  const openTradingAgentsTab = () => {
    // First navigate to trading page if not already there
    if (!isActivePath('trading')) {
      setActivePage('trading');
      navigate('/dashboard/trading');
    }
    
    // Set localStorage flag to open the Trading Agents tab
    localStorage.setItem('openTradingAgentsTab', 'true');
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
        return <AIToolsPage 
          apiStatus={apiStatus} 
          showApiAccess={visibleWidgets.apiAccess} 
          openTradingAgents={openTradingAgentsTab}
        />;
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
