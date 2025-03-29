
import React from "react";
import { OverviewPage } from "./pages/OverviewPage";
import { MarketPage } from "./pages/MarketPage";
import { MinimalTradingPage } from "./pages/MinimalTradingPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { WalletPage } from "./pages/WalletPage";
import { RiskPage } from "./pages/RiskPage";
import { AIToolsPage } from "./pages/AIToolsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { GamificationPage } from "./pages/GamificationPage";
import { VirtualEnvironmentDemo } from "../visualization/VirtualEnvironmentDemo";

interface DashboardPageContentProps {
  activePage: string;
  apiStatus: 'checking' | 'available' | 'unavailable';
  showVirtualEnvironment: boolean;
  visibleWidgets: {
    apiAccess: boolean;
    [key: string]: boolean;
  };
  openAgentsTab: boolean;
  openTradingAgentsTab: () => void;
}

export const DashboardPageContent: React.FC<DashboardPageContentProps> = ({ 
  activePage, 
  apiStatus, 
  showVirtualEnvironment,
  visibleWidgets,
  openAgentsTab,
  openTradingAgentsTab
}) => {
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
      return <MinimalTradingPage initialOpenAgentsTab={openAgentsTab} />;
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
