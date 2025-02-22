
import { useState, useCallback } from "react";
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

interface AnalysisError extends Error {
  code?: string;
  details?: string;
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

  const handleAnalysisError = useCallback((error: AnalysisError) => {
    console.error("Analyse fout:", error);
    let errorMessage = "Er is een fout opgetreden tijdens de analyse";
    
    if (error.code === "TIMEOUT") {
      errorMessage = "De analyse duurde te lang. Probeer het opnieuw.";
    } else if (error.code === "INSUFFICIENT_DATA") {
      errorMessage = "Onvoldoende marktgegevens beschikbaar voor analyse";
    }
    
    setError(errorMessage);
    toast({
      title: "Analyse Fout",
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const performTradeAnalysis = async (isSimulated: boolean) => {
    setIsAnalyzing(true);
    setError(null);
    console.log("Start handelsanalyse...");

    try {
      const { data, error: apiError } = await supabase.functions.invoke('trading-analysis', {
        body: {
          riskLevel: params.riskLevel,
          simulationMode: isSimulated,
          rapidMode: params.isRapidMode
        }
      });

      console.log("Handelsanalyse antwoord ontvangen:", { data, apiError });

      if (apiError) {
        throw { ...apiError, code: apiError.code || "UNKNOWN_ERROR" };
      }

      if (!data) {
        throw new Error("Geen analysegegevens ontvangen");
      }

      console.log("AI analyse bijwerken met:", data);
      setAiAnalysis({
        ...aiAnalysis,
        confidence: data.confidence || 85,
        recommendation: data.recommendedAction === 'buy' ? 'long' : 'short',
        expectedProfit: `${((data.confidence || 85) * 0.1).toFixed(1)}%`,
        collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
      });

      setTradeCount(prev => prev + 1);
      setTotalProfit(prev => prev + (data.expectedProfit || 0));

      return true;
    } catch (err) {
      handleAnalysisError(err as AnalysisError);
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
    lastAnalysis: aiAnalysis
  };
};
