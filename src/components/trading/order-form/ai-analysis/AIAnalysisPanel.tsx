import { Brain, Wifi, WifiOff } from "lucide-react";
import { OnlinePanel } from "./OnlinePanel";
import { OfflinePanel } from "./OfflinePanel";
import { TradingTips } from "./TradingTips";
import { ApiKeySheet } from "./ApiKeySheet";
import { useApiKeyManager } from "./hooks/useApiKeyManager";
import { useState, useEffect } from "react";
import { useApiStatus } from "@/components/trading/hooks/api-status";

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
  // Use the API status hook to manage connection state
  const { 
    apiStatus, 
    isVerifying, 
    verifyApiStatus, 
    lastChecked 
  } = useApiStatus(isOnline ? 'available' : 'checking');
  
  // Now we need to pass the setLocalIsOnline function to the hook
  const { 
    showApiKeySheet, 
    apiKeyStatus, 
    handleOpenApiKeySheet, 
    handleCloseApiKeySheet,
    saveApiKeys
  } = useApiKeyManager();

  // When API keys are saved, verify the status
  useEffect(() => {
    if (apiKeyStatus === 'available' && apiStatus === 'unavailable') {
      verifyApiStatus();
    }
  }, [apiKeyStatus, apiStatus, verifyApiStatus]);

  if (!aiAnalysis) {
    return (
      <div className="p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">AI Trading Analyse</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full" />
                <span className="text-sm">Checking</span>
              </div>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Offline</span>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <p className="text-sm text-muted-foreground">
            AI analyse is momenteel niet beschikbaar. Verbind met de API om AI-analyses en aanbevelingen te ontvangen.
          </p>
          <div className="text-xs text-muted-foreground/70 space-y-1">
            <p>• Realtime marktupdates elke 5-15 seconden</p>
            <p>• AI-gestuurde handelsaanbevelingen</p>
            <p>• Risico- en winstanalyse per trade</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-4"
          onClick={handleOpenApiKeySheet}
        >
          Verbind met AI Service
        </Button>
        
        <TradingTips />
      </div>
    );
  }

  const isConnected = apiStatus === 'available';

  return (
    <div className="p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
      {isConnected ? (
        <OnlinePanel analysis={aiAnalysis} />
      ) : (
        <OfflinePanel onConnectClick={handleOpenApiKeySheet} />
      )}
      
      <TradingTips />
      
      <ApiKeySheet
        isOpen={showApiKeySheet}
        onClose={handleCloseApiKeySheet}
        apiKeyStatus={apiKeyStatus}
        onSave={saveApiKeys}
      />
    </div>
  );
};

import { Button } from "@/components/ui/button";
