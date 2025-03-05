
import { Brain, Wifi, WifiOff } from "lucide-react";
import { OnlinePanel } from "./OnlinePanel";
import { OfflinePanel } from "./OfflinePanel";
import { TradingTips } from "./TradingTips";
import { ApiKeySheet } from "./ApiKeySheet";
import { useApiKeyManager } from "./hooks/useApiKeyManager";
import { useState } from "react";

interface AIAnalysisPanelProps {
  aiAnalysis?: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation?: number;
    takeProfitRecommendation?: number;
    collaboratingAgents: string[];
  };
  isOnline?: boolean;
}

export const AIAnalysisPanel = ({ 
  aiAnalysis, 
  isOnline = false 
}: AIAnalysisPanelProps) => {
  // Use local state for online status so we can update it from the hook
  const [localIsOnline, setLocalIsOnline] = useState(isOnline);
  
  // Now we need to pass the setLocalIsOnline function to the hook
  const { 
    showApiKeySheet, 
    apiKeyStatus, 
    handleOpenApiKeySheet, 
    handleCloseApiKeySheet 
  } = useApiKeyManager();

  if (!aiAnalysis) {
    return (
      <div className="p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">AI Trading Analyse</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Offline</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          AI analyse is momenteel niet beschikbaar. Verbind met de API om AI-analyses en aanbevelingen te ontvangen.
        </p>
        
        <TradingTips />
      </div>
    );
  }

  return (
    <div className="p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
      {localIsOnline ? (
        <OnlinePanel analysis={aiAnalysis} />
      ) : (
        <OfflinePanel onConnectClick={handleOpenApiKeySheet} />
      )}
      
      <TradingTips />
      
      <ApiKeySheet
        isOpen={showApiKeySheet}
        onClose={handleCloseApiKeySheet}
        apiKeyStatus={apiKeyStatus}
      />
    </div>
  );
};
