
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { logApiCall } from "@/utils/apiLogger";

export interface AdvancedSignal {
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence: number;
  reasoning: string;
}

export function useAdvancedSignal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [advancedSignal, setAdvancedSignal] = useState<AdvancedSignal | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAdvancedSignal = async (currentPrice: number) => {
    if (!currentPrice) {
      toast({
        title: "Invalid price",
        description: "Cannot generate a signal without current price.",
        variant: "destructive",
      });
      setErrorMessage("Invalid price: Cannot generate a signal without current price");
      return null;
    }
    
    // Check if any API keys are available
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    if (!openaiKey && !claudeKey && !geminiKey && !deepseekKey) {
      const errorMsg = "No API keys configured. Please set at least one API key in settings";
      toast({
        title: "No API keys",
        description: errorMsg,
        variant: "destructive",
      });
      setErrorMessage(errorMsg);
      return null;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Fetching advanced trading signal for price:", currentPrice);
      await logApiCall('grok3-response', 'useAdvancedSignal', 'success');
      
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
            console.log("Signal data received:", jsonData);
            setAdvancedSignal(jsonData);
            
            toast({
              title: "Advanced signal received",
              description: `${jsonData.direction} signal with ${jsonData.confidence}% confidence`,
            });
            
            return jsonData;
          } else {
            const errorMsg = "Could not extract signal from response";
            setErrorMessage(errorMsg);
            toast({
              title: "Signal processing failed",
              description: errorMsg,
              variant: "destructive",
            });
            console.error("No JSON found in response:", data.response);
          }
        } catch (parseError) {
          const errorMsg = "Could not parse signal data";
          setErrorMessage(errorMsg);
          console.error("Error parsing signal:", parseError);
          toast({
            title: "Signal processing failed",
            description: errorMsg,
            variant: "destructive",
          });
        }
      } else {
        setErrorMessage("No response data received");
      }
      return null;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(errorMsg);
      await logApiCall('grok3-response', 'useAdvancedSignal', 'error', errorMsg);
      console.error("Error fetching advanced signal:", error);
      toast({
        title: "API Error",
        description: "Could not fetch advanced signal",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSignal = () => {
    setAdvancedSignal(null);
    setErrorMessage(null);
  };

  return {
    isLoading,
    advancedSignal,
    errorMessage,
    setAdvancedSignal,
    fetchAdvancedSignal,
    clearSignal
  };
}
