
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
import { VisualizationPage } from "./pages/VisualizationPage";
import { VirtualEnvironmentDemo } from "../visualization/VirtualEnvironmentDemo";
import { GrokChat } from "../chat/GrokChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

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
    case "llm":
      return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-600" />
                Multi-Model AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <GrokChat />
            </CardContent>
          </Card>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Chat with various AI models including Grok, OpenAI, Claude, and more.</p>
            <p>Use the settings panel to configure your API keys and preferences.</p>
          </div>
        </div>
      );
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
