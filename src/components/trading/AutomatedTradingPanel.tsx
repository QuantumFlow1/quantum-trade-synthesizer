
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AutomatedTradingPanelProps {
  simulationMode?: boolean;
}

export const AutomatedTradingPanel = ({ simulationMode = true }: AutomatedTradingPanelProps) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [tradeCount, setTradeCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(async () => {
        try {
          // Fetch market data and perform analysis
          const analysis = await analyzeMarket();
          setLastAnalysis(analysis);

          // Execute trade if conditions are met
          if (analysis.shouldTrade) {
            await executeTrade(analysis);
            setTradeCount(prev => prev + 1);
          }
        } catch (error) {
          console.error('Automated trading error:', error);
          toast({
            title: "Trading Error",
            description: "An error occurred during automated trading",
            variant: "destructive",
          });
        }
      }, 30000); // Run every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, riskLevel]);

  const analyzeMarket = async () => {
    const { data: marketData, error } = await supabase.functions.invoke('trading-analysis', {
      body: { riskLevel, simulationMode }
    });

    if (error) throw error;
    return marketData;
  };

  const executeTrade = async (analysis: any) => {
    const { data, error } = await supabase.functions.invoke('execute-simulated-trade', {
      body: {
        type: analysis.recommendedAction,
        amount: analysis.recommendedAmount,
        price: analysis.currentPrice,
        strategy: "QuantumFlow AI",
        confidence: analysis.confidence
      }
    });

    if (error) throw error;

    toast({
      title: "Trade Executed",
      description: `${analysis.recommendedAction.toUpperCase()} ${analysis.recommendedAmount} @ $${analysis.currentPrice}`,
    });

    return data;
  };

  return (
    <Card className="p-6 space-y-6 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Automated Trading {simulationMode ? "(Simulation)" : ""}</h2>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          aria-label="Toggle automated trading"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span>{isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trades Executed</Label>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>{tradeCount}</span>
          </div>
        </div>
      </div>

      {lastAnalysis && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Last Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Confidence: {lastAnalysis.confidence}%</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Recommendation: {lastAnalysis.recommendedAction}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
