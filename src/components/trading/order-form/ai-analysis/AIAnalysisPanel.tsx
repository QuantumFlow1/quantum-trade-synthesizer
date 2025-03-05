
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OfflinePanel } from "./OfflinePanel";
import { OnlinePanel } from "./OnlinePanel";
import { useApiKeyManager } from "./hooks/useApiKeyManager";

interface AIAnalysisPanelProps {
  aiAnalysis?: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
  isOnline?: boolean;
}

export const AIAnalysisPanel = ({ aiAnalysis, isOnline = false }: AIAnalysisPanelProps) => {
  const [localIsOnline, setLocalIsOnline] = useState<boolean>(isOnline);
  
  // Sync with prop changes
  useEffect(() => {
    setLocalIsOnline(isOnline);
  }, [isOnline]);

  const { 
    checkAPIAvailability,
    handleManualUpdate,
    isChecking,
    isKeySheetOpen,
    setIsKeySheetOpen,
    openaiKey,
    setOpenaiKey,
    claudeKey,
    setClaudeKey,
    geminiKey,
    setGeminiKey,
    deepseekKey,
    setDeepseekKey,
    saveApiKeys,
    loadSavedKeys
  } = useApiKeyManager({ setLocalIsOnline });
  
  // Load saved keys and check API availability on mount
  useEffect(() => {
    if (!isOnline) {
      checkAPIAvailability();
    }
    
    loadSavedKeys();
  }, []);

  const defaultAnalysis = {
    confidence: 0,
    riskLevel: "Onbekend",
    recommendation: "Niet beschikbaar",
    expectedProfit: "Niet beschikbaar",
    stopLossRecommendation: 0,
    takeProfitRecommendation: 0,
    collaboratingAgents: ["Geen actieve agents"]
  };

  const analysis = aiAnalysis || defaultAnalysis;

  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
      {!localIsOnline ? (
        <OfflinePanel
          isKeySheetOpen={isKeySheetOpen}
          setIsKeySheetOpen={setIsKeySheetOpen}
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          claudeKey={claudeKey}
          setClaudeKey={setClaudeKey}
          geminiKey={geminiKey}
          setGeminiKey={setGeminiKey}
          deepseekKey={deepseekKey}
          setDeepseekKey={setDeepseekKey}
          saveApiKeys={saveApiKeys}
          handleManualUpdate={handleManualUpdate}
          isChecking={isChecking}
        />
      ) : (
        <OnlinePanel analysis={analysis} />
      )}
    </Card>
  );
};
