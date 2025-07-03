
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
import { MarketData } from "../market/types";
import { MarketNLPAnalysis } from "../market/MarketNLPAnalysis";

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

// Mock market data with complete MarketData type
const mockMarketData: MarketData = {
  symbol: "BTC/USDT",
  price: 65432.10,
  change24h: 2.5,
  volume: 1234567890,
  high24h: 66000,
  low24h: 64000,
  market: "crypto",
  timestamp: Date.now(),
  high: 66000,
  low: 64000
};

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
      return (
        <div className="space-y-6">
          <RiskPage />
          <MarketNLPAnalysis marketData={mockMarketData} />
        </div>
      );
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
