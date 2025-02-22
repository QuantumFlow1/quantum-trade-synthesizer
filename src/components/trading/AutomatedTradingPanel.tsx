
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { TradingControls } from './automated/TradingControls';
import { TradingStatus } from './automated/TradingStatus';
import { ErrorDisplay } from './automated/ErrorDisplay';
import { AnalysisDisplay } from './automated/AnalysisDisplay';
import { TradingMetrics } from './automated/TradingMetrics';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      console.log('Starting automated trading with risk level:', riskLevel);
      let timeoutId: NodeJS.Timeout;

      const performTradeAnalysis = async () => {
        try {
          setError(null);
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
            setError(analysisError.message);
            toast({
              title: "Analysis Error",
              description: analysisError.message,
              variant: "destructive",
            });
            return;
          }

          if (!analysis) {
            throw new Error('No analysis data received');
          }

          console.log('Received market analysis:', analysis);
          setLastAnalysis(analysis);

          if (analysis.shouldTrade) {
            console.log('Trade conditions met, executing trade...');
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
              setError(tradeError.message);
              toast({
                title: "Trade Execution Error",
                description: tradeError.message,
                variant: "destructive",
              });
              return;
            }

            if (!tradeData) {
              throw new Error('No trade data received');
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
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          console.error('Automated trading error:', errorMessage);
          setError(errorMessage);
          toast({
            title: "Trading Error",
            description: errorMessage,
            variant: "destructive",
          });
        }

        timeoutId = setTimeout(performTradeAnalysis, isRapidMode ? 5000 : 30000);
      };

      performTradeAnalysis();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isActive, riskLevel, isRapidMode, simulationMode, toast]);

  return (
    <Card className="p-6 space-y-6 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <TradingControls
        isActive={isActive}
        setIsActive={setIsActive}
        isRapidMode={isRapidMode}
        setIsRapidMode={setIsRapidMode}
        simulationMode={simulationMode}
      />

      <TradingStatus
        isActive={isActive}
        totalProfit={totalProfit}
      />

      <ErrorDisplay error={error} />

      <AnalysisDisplay analysis={lastAnalysis} />

      <TradingMetrics
        tradeCount={tradeCount}
        isRapidMode={isRapidMode}
      />
    </Card>
  );
};
