
import { useState } from "react";
import { AdviceHeader } from "./financial-advice/AdviceHeader";
import { AIInsights } from "./financial-advice/AIInsights";
import { RiskReturnAnalysis } from "./financial-advice/RiskReturnAnalysis";
import { PortfolioDiversification } from "./financial-advice/PortfolioDiversification";
import { Recommendations } from "./financial-advice/Recommendations";
import { useToast } from "@/hooks/use-toast";

const FinancialAdvice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const { toast } = useToast();
  const isOnline = navigator.onLine;

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-advice");
      const data = await response.json();
      setAiAdvice(data.advice);
      toast({
        title: "AI Analysis Complete",
        description: "New financial insights are available",
      });
    } catch (error) {
      console.error("Failed to generate advice:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI analysis",
        variant: "destructive",
      });
      setAiAdvice("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdviceHeader 
        isOnline={isOnline} 
        isLoadingAI={isLoading}
        onGenerateAdvice={handleGenerateAdvice} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AIInsights 
          isOnline={isOnline}
          aiAdvice={aiAdvice}
        />
        <RiskReturnAnalysis />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioDiversification />
        <Recommendations />
      </div>
    </div>
  );
};

export default FinancialAdvice;

