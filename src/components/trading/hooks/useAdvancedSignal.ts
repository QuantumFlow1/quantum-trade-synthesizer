
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function useAdvancedSignal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [advancedSignal, setAdvancedSignal] = useState<any>(null);

  const fetchAdvancedSignal = async (currentPrice: number) => {
    if (!currentPrice) {
      toast({
        title: "Ongeldige prijs",
        description: "Kan geen signaal genereren zonder huidige prijs.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if any API keys are available
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    
    if (!openaiKey && !claudeKey && !geminiKey) {
      toast({
        title: "Geen API sleutels",
        description: "Stel ten minste één API sleutel in om geavanceerde signalen te genereren.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: `Generate a trading signal for the current market conditions. Current price: ${currentPrice}. Format the response as JSON with fields: direction (LONG/SHORT), entry_price, stop_loss, take_profit, confidence (0-100), reasoning`,
          context: []
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Parse the response to extract JSON
      if (data && data.response) {
        try {
          // Look for JSON in the string response
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            setAdvancedSignal(jsonData);
            
            toast({
              title: "Geavanceerd signaal ontvangen",
              description: `${jsonData.direction} signaal met ${jsonData.confidence}% vertrouwen`,
            });
            
            return jsonData;
          } else {
            toast({
              title: "Signaal verwerking mislukt",
              description: "Kon het signaal niet extraheren uit de respons",
              variant: "destructive",
            });
          }
        } catch (parseError) {
          console.error("Error parsing signal:", parseError);
          toast({
            title: "Signaal verwerking mislukt",
            description: "Kon het signaal niet verwerken",
            variant: "destructive",
          });
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching advanced signal:", error);
      toast({
        title: "API Fout",
        description: "Kon geen geavanceerd signaal ophalen",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    advancedSignal,
    setAdvancedSignal,
    fetchAdvancedSignal
  };
}
