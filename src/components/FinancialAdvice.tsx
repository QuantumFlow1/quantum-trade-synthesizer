
import { useState } from "react";
import { AdviceHeader } from "./financial-advice/AdviceHeader";
import { AIInsights } from "./financial-advice/AIInsights";
import { RiskReturnAnalysis } from "./financial-advice/RiskReturnAnalysis";
import { PortfolioDiversification } from "./financial-advice/PortfolioDiversification";
import { Recommendations } from "./financial-advice/Recommendations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const FinancialAdvice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const { toast } = useToast();
  const isOnline = navigator.onLine;

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate AI analysis",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call the edge function to generate advice
      const { data, error } = await supabase.functions.invoke('generate-advice', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw new Error(`Failed to generate advice: ${error.message}`);
      }
      
      if (!data || !data.advice) {
        throw new Error("Received invalid response from server");
      }
      
      setAiAdvice(data.advice);
      toast({
        title: "AI Analysis Complete",
        description: "New financial insights are available",
      });
    } catch (error) {
      console.error("Failed to generate advice:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI analysis",
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
