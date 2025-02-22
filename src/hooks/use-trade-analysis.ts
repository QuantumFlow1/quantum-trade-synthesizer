
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AIAnalysis {
  confidence: number;
  riskLevel: string;
  recommendation: string;
  expectedProfit: string;
  stopLossRecommendation: number;
  takeProfitRecommendation: number;
  collaboratingAgents: string[];
}

interface TradeAnalysisParams {
  isActive: boolean;
  riskLevel: "low" | "medium" | "high";
  isRapidMode: boolean;
  simulationMode: boolean;
}

export const useTradeAnalysis = (params: TradeAnalysisParams) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradeCount, setTradeCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    confidence: 85,
    riskLevel: "medium",
    recommendation: "long",
    expectedProfit: "2.3%",
    stopLossRecommendation: 0,
    takeProfitRecommendation: 0,
    collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
  });

  const performTradeAnalysis = async (isSimulated: boolean) => {
    setIsAnalyzing(true);
    setError(null);
    console.log("Starting trade analysis...");

    try {
      const { data, error: apiError } = await supabase.functions.invoke('trading-analysis', {
        body: {
          riskLevel: params.riskLevel,
          simulationMode: isSimulated,
          rapidMode: params.isRapidMode
        }
      });

      console.log("Trade analysis response received:", { data, apiError });

      if (apiError) {
        console.error("Trade analysis error:", apiError);
        setError(apiError.message || "Failed to perform trade analysis");
        return false;
      }

      if (!data) {
        console.error("No data received from analysis");
        setError("No analysis data received");
        return false;
      }

      console.log("Updating AI analysis with:", data);
      setAiAnalysis({
        ...aiAnalysis,
        confidence: data.confidence || 85,
        recommendation: data.recommendedAction === 'buy' ? 'long' : 'short',
        expectedProfit: `${((data.confidence || 85) * 0.1).toFixed(1)}%`,
        collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
      });

      // Update trade metrics
      setTradeCount(prev => prev + 1);
      setTotalProfit(prev => prev + (data.expectedProfit || 0));

      return true;
    } catch (err) {
      console.error("Error in performTradeAnalysis:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    aiAnalysis,
    isAnalyzing,
    performTradeAnalysis,
    error,
    tradeCount,
    totalProfit,
    lastAnalysis: aiAnalysis // Add this to match the expected interface
  };
};
