
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TradeAnalysis {
  shouldTrade: boolean;
  recommendedAction: 'buy' | 'sell';
  recommendedAmount: number;
  confidence: number;
  currentPrice: number;
}

interface AutomatedTradingPanelProps {
  simulationMode?: boolean;
}

export const AutomatedTradingPanel = ({ simulationMode = true }: AutomatedTradingPanelProps) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isRapidMode, setIsRapidMode] = useState(false);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  const [lastAnalysis, setLastAnalysis] = useState<TradeAnalysis | null>(null);
  const [tradeCount, setTradeCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    if (isActive) {
      console.log('Starting automated trading with risk level:', riskLevel);
      const interval = setInterval(async () => {
        try {
          console.log('Fetching market analysis...');
          const { data: analysis, error: analysisError } = await supabase.functions.invoke('trading-analysis', {
            body: { 
              riskLevel, 
              simulationMode,
              rapidMode: isRapidMode
            }
          });

          if (analysisError) {
            console.error('Analysis error:', analysisError);
            throw analysisError;
          }

          console.log('Received market analysis:', analysis);
          setLastAnalysis(analysis);

          if (analysis.shouldTrade) {
            console.log('Trade conditions met, executing rapid trade...');
            const { data: tradeData, error: tradeError } = await supabase.functions.invoke('execute-simulated-trade', {
              body: {
                type: analysis.recommendedAction,
                amount: analysis.recommendedAmount,
                price: analysis.currentPrice,
                strategy: isRapidMode ? "RapidFlow AI" : "QuantumFlow AI",
                confidence: analysis.confidence
              }
            });

            if (tradeError) {
              console.error('Trade execution error:', tradeError);
              throw tradeError;
            }

            console.log('Trade executed successfully:', tradeData);
            setTradeCount(prev => prev + 1);
            
            if (tradeData.profit) {
              setTotalProfit(prev => prev + tradeData.profit);
            }
            
            toast({
              title: "Trade Executed",
              description: `${analysis.recommendedAction.toUpperCase()} ${analysis.recommendedAmount} @ $${analysis.currentPrice}`,
            });
          } else {
            console.log('Trade conditions not met, waiting for next opportunity...');
          }
        } catch (error) {
          console.error('Automated trading error:', error);
          toast({
            title: "Trading Error",
            description: "An error occurred during automated trading",
            variant: "destructive",
          });
        }
      }, isRapidMode ? 5000 : 30000); // Run every 5 seconds in rapid mode, otherwise every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, riskLevel, isRapidMode, simulationMode]);

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

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Rapid Mode
          </Label>
          <Switch
            checked={isRapidMode}
            onCheckedChange={setIsRapidMode}
            aria-label="Toggle rapid trading mode"
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
            <Label>Performance</Label>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Total Profit: ${totalProfit.toFixed(2)}</span>
            </div>
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

      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Trades Executed: {tradeCount}</span>
          <span>Mode: {isRapidMode ? 'Rapid (5s)' : 'Normal (30s)'}</span>
        </div>
      </div>
    </Card>
  );
};
