
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdvancedSignalPanel } from "./AdvancedSignalPanel";
import { AIAnalysisPanel } from "./AIAnalysisPanel";

interface AdvancedOrderFormProps {
  currentPrice: number;
  advancedSignal: any;
  setAdvancedSignal: (signal: any) => void;
  apiEnabled: boolean;
  apiAvailable?: boolean;
  onSignalApplied: (direction: string, stopLoss: string, takeProfit: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdvancedOrderForm = ({ 
  currentPrice, 
  advancedSignal, 
  setAdvancedSignal,
  apiEnabled,
  apiAvailable = false,
  onSignalApplied,
  onSubmit 
}: AdvancedOrderFormProps) => {
  // Dummy AI analyse data
  const aiAnalysis = {
    confidence: advancedSignal ? advancedSignal.confidence || 65 : 65,
    riskLevel: advancedSignal ? (advancedSignal.confidence > 70 ? "Laag" : "Gemiddeld") : "Gemiddeld",
    recommendation: advancedSignal ? 
      `${advancedSignal.direction} op huidige prijs` : 
      "Wacht op AI signaal",
    expectedProfit: advancedSignal ? 
      `${Math.round((Math.abs(advancedSignal.take_profit - advancedSignal.entry_price) / advancedSignal.entry_price) * 1000) / 10}%` : 
      "Onbekend",
    stopLossRecommendation: advancedSignal ? advancedSignal.stop_loss : 0,
    takeProfitRecommendation: advancedSignal ? advancedSignal.take_profit : 0,
    collaboratingAgents: ["Grok3 AI", "TrendAnalyzer", "SignalGenerator"]
  };

  return (
    <div className="space-y-4">
      <AIAnalysisPanel 
        aiAnalysis={aiAnalysis} 
        isOnline={apiAvailable}
      />
      
      <div className="p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-medium">AI Trading Assistant</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gebruik geavanceerde AI om trading signalen te genereren en orderparameters te optimaliseren
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2 flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
            <span>Huidige BTC Prijs:</span>
            <span className="text-lg font-bold">${currentPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <AdvancedSignalPanel
          apiEnabled={apiEnabled}
          apiAvailable={apiAvailable} 
          currentPrice={currentPrice}
          advancedSignal={advancedSignal}
          setAdvancedSignal={setAdvancedSignal}
          onSignalApplied={onSignalApplied}
        />
        
        <Button 
          type="submit" 
          className="w-full mt-4 bg-primary hover:bg-primary/90" 
          onClick={onSubmit}
          disabled={!advancedSignal}
        >
          {advancedSignal ? `Plaats ${advancedSignal.direction} Order` : "Wacht op signaal..."}
        </Button>
      </div>
    </div>
  );
};
