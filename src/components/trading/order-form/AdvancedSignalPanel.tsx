
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AdvancedSignalPanelProps {
  apiEnabled: boolean;
  currentPrice: number;
  advancedSignal: any;
  setAdvancedSignal: (signal: any) => void;
  onSignalApplied: (direction: string, stopLoss: string, takeProfit: string) => void;
}

export const AdvancedSignalPanel = ({ 
  apiEnabled, 
  currentPrice, 
  advancedSignal, 
  setAdvancedSignal,
  onSignalApplied
}: AdvancedSignalPanelProps) => {
  const { toast } = useToast();
  
  const fetchAdvancedSignal = async () => {
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
    } catch (error) {
      console.error("Error fetching advanced signal:", error);
      toast({
        title: "API Fout",
        description: "Kon geen geavanceerd signaal ophalen",
        variant: "destructive",
      });
    }
  };

  if (!apiEnabled) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-medium">Geavanceerde API-functies</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          onClick={fetchAdvancedSignal}
        >
          <Zap className="w-3 h-3" />
          Genereer Signaal
        </Button>
      </div>
      
      {advancedSignal && (
        <div className="p-3 bg-primary/10 rounded-lg mt-2">
          <div className="text-sm font-medium mb-1">
            {advancedSignal.direction} Signaal ({advancedSignal.confidence}% vertrouwen)
          </div>
          <div className="text-xs text-muted-foreground">
            Redenering: {advancedSignal.reasoning}
          </div>
        </div>
      )}
    </div>
  );
};
