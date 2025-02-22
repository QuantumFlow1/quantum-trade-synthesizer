
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

export const useTradeAnalysis = (currentPrice: number) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    confidence: 85,
    riskLevel: "medium",
    recommendation: "long",
    expectedProfit: "2.3%",
    stopLossRecommendation: currentPrice * 0.98,
    takeProfitRecommendation: currentPrice * 1.035,
    collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
  });

  const performTradeAnalysis = async (isSimulated: boolean) => {
    setIsAnalyzing(true);
    console.log("Starting trade analysis...");

    try {
      const { data, error } = await supabase.functions.invoke('trading-analysis', {
        body: {
          riskLevel: "medium",
          simulationMode: isSimulated,
          rapidMode: false
        }
      });

      console.log("Trade analysis response received:", { data, error });

      if (error) {
        console.error("Trade analysis error:", error);
        toast({
          title: "Analysis Error",
          description: error.message || "Failed to perform trade analysis",
          variant: "destructive",
        });
        return false;
      }

      if (!data) {
        console.error("No data received from analysis");
        toast({
          title: "Analysis Error",
          description: "No analysis data received",
          variant: "destructive",
        });
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

      return true;
    } catch (error) {
      console.error("Error in performTradeAnalysis:", error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    aiAnalysis,
    isAnalyzing,
    performTradeAnalysis
  };
};
