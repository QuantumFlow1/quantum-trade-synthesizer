
import { useState, useEffect } from "react";
import { AIInsights } from "../financial-advice/AIInsights";
import { AdviceHeader } from "../financial-advice/AdviceHeader";
import { PortfolioDiversification } from "../financial-advice/PortfolioDiversification";
import { RiskReturnAnalysis } from "../financial-advice/RiskReturnAnalysis";
import { Recommendations } from "../financial-advice/Recommendations";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AIAdvicePanelProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const AIAdvicePanel = ({ apiStatus }: AIAdvicePanelProps) => {
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [localApiStatus, setLocalApiStatus] = useState<'checking' | 'available' | 'unavailable'>(apiStatus);
  const { toast } = useToast();

  // Effect to check API availability on mount
  useEffect(() => {
    setLocalApiStatus(apiStatus);
    
    // Check if we need to verify API status
    if (apiStatus === 'checking') {
      checkApiAvailability();
    }
  }, [apiStatus]);

  const checkApiAvailability = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setLocalApiStatus('available');
    } catch (error) {
      console.error("API availability check failed:", error);
      setLocalApiStatus('unavailable');
    }
  };

  const generateAIAdvice = async () => {
    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: "Generate financial trading advice based on current market conditions. Include specific recommendations on asset allocation, risk management strategies, and market timing. Keep it under 400 characters.",
          context: []
        }
      });
      
      if (error) throw error;
      
      setAiAdvice(data?.response || "Geen advies beschikbaar op dit moment");
      
      toast({
        title: "AI Advies Gegenereerd",
        description: "Financieel advies is succesvol gegenereerd",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating AI advice:", error);
      setAiAdvice("Er is een fout opgetreden bij het genereren van advies. Probeer het later opnieuw.");
      toast({
        title: "AI Advies Fout",
        description: "Kon geen AI advies genereren",
        variant: "destructive",
      });
      
      // If we get an error, the API might be unavailable
      setLocalApiStatus('unavailable');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <AdviceHeader 
        isOnline={localApiStatus === 'available'} 
        isLoadingAI={isLoadingAI} 
        onGenerateAdvice={generateAIAdvice} 
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <PortfolioDiversification />
        <RiskReturnAnalysis />
        <AIInsights 
          isOnline={localApiStatus === 'available'} 
          aiAdvice={aiAdvice} 
        />
      </div>
      <div className="mt-4">
        <Recommendations />
      </div>
    </Card>
  );
};
