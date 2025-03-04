
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useSimulatedOrder() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSimulatedOrder = async (
    orderType: "buy" | "sell",
    amount: string,
    currentPrice: number,
    orderMode: string,
    advancedSignal: any
  ) => {
    try {
      setIsSubmitting(true);
      const simulationRequest = {
        simulation: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          pair_id: "00000000-0000-0000-0000-000000000000",
          type: orderType === "buy" ? "long" : "short",
          amount: Number(amount),
          entry_price: currentPrice,
          strategy: orderMode === "standard" ? "manual" : 
                   advancedSignal ? "ai-assisted" : "manual",
          simulation_type: "daytrading"
        }
      };
      
      console.log("Sending simulation request:", simulationRequest);
      
      const { data, error } = await supabase.functions.invoke('trade-simulation', {
        body: simulationRequest
      });
      
      if (error) {
        console.error("Error response from trade-simulation:", error);
        throw error;
      }
      
      console.log("Simulation response:", data);
      
      toast({
        title: "Simulatie Gestart",
        description: `Uw ${orderType === "buy" ? "LONG" : "SHORT"} simulatie voor ${amount} BTC is succesvol gestart tegen $${currentPrice}.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error creating simulation:", error);
      toast({
        title: "Simulatie Fout",
        description: "Er is een fout opgetreden bij het starten van de simulatie. Probeer het later opnieuw.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    handleSimulatedOrder
  };
}
