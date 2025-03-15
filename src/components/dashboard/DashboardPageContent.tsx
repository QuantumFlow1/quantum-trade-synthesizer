
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
import { OllamaChat } from "../llm-extensions/ollama/OllamaChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

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
                <Terminal className="mr-2 h-5 w-5 text-teal-600" />
                Local Ollama Models
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <OllamaChat />
            </CardContent>
          </Card>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>To use Ollama, make sure you have it installed and running on your local machine.</p>
            <p>Use the settings panel to connect to your Ollama instance (default: http://localhost:11434).</p>
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
