
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkSupabaseConnection } from "@/lib/supabase";
import { generateLocalAdvice, generateAIAdvice } from "@/services/adviceService";
import { AdviceHeader } from "./financial-advice/AdviceHeader";
import { AIInsights } from "./financial-advice/AIInsights";
import { PortfolioDiversification } from "./financial-advice/PortfolioDiversification";
import { RiskReturnAnalysis } from "./financial-advice/RiskReturnAnalysis";
import { Recommendations } from "./financial-advice/Recommendations";

const FinancialAdvice = () => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const handleGenerateAdvice = async () => {
    setIsLoadingAI(true);
    try {
      const isConnected = await checkSupabaseConnection();
      setIsOnline(isConnected);

      const advice = isConnected 
        ? await generateAIAdvice()
        : await generateLocalAdvice();

      setAiAdvice(advice);
      toast({
        title: isConnected ? "AI Analyse Gereed" : "Lokaal Advies Gegenereerd",
        description: isConnected ? "Nieuwe inzichten beschikbaar" : "Basis advies regels toegepast",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Kon advies niet genereren",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdviceHeader
        isOnline={isOnline}
        isLoadingAI={isLoadingAI}
        onGenerateAdvice={handleGenerateAdvice}
      />
      <AIInsights isOnline={isOnline} aiAdvice={aiAdvice} />
      <PortfolioDiversification />
      <RiskReturnAnalysis />
      <Recommendations />
    </div>
  );
};

export default FinancialAdvice;
