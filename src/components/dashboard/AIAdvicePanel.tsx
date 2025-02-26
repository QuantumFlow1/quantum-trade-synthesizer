
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertCircle } from "lucide-react";
import { AIInsights } from "@/components/financial-advice/AIInsights";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AIAdvicePanelProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const AIAdvicePanel = ({ apiStatus }: AIAdvicePanelProps) => {
  const [advice, setAdvice] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Automatisch advies ophalen bij het laden van de component als API beschikbaar is
  useEffect(() => {
    if (apiStatus === 'available' && !advice) {
      generateAdvice();
    }
  }, [apiStatus]);

  const generateAdvice = async () => {
    if (apiStatus !== 'available') {
      toast({
        title: "AI Service Offline",
        description: "De AI service is momenteel niet beschikbaar. Probeer het later opnieuw.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
        body: { market: "crypto", timeframe: "short" }
      });
      
      if (error) throw error;
      
      if (data && data.advice) {
        setAdvice(data.advice);
      }
    } catch (error) {
      console.error("Error generating advice:", error);
      toast({
        title: "Generatie Mislukt",
        description: "Kon geen AI analyse genereren. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2" /> AI Trading Advies
      </h2>
      
      {apiStatus === 'checking' ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-muted-foreground">
            Verbinding met AI service controleren...
          </div>
        </div>
      ) : (
        <AIInsights 
          isOnline={apiStatus === 'available'} 
          aiAdvice={advice} 
        />
      )}
      
      {apiStatus === 'unavailable' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center text-sm">
          <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
          <span>
            AI service is momenteel niet beschikbaar. Controleer uw API sleutel of probeer het later opnieuw.
          </span>
        </div>
      )}
    </Card>
  );
};
