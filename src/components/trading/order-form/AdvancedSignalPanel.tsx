
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AdvancedSignalPanelProps {
  apiEnabled: boolean;
  apiAvailable?: boolean;
  currentPrice: number;
  advancedSignal: any;
  setAdvancedSignal: (signal: any) => void;
  onSignalApplied: (direction: string, stopLoss: string, takeProfit: string) => void;
}

export const AdvancedSignalPanel = ({ 
  apiEnabled, 
  apiAvailable = false,
  currentPrice, 
  advancedSignal, 
  setAdvancedSignal,
  onSignalApplied
}: AdvancedSignalPanelProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchAdvancedSignal = async () => {
    if (!apiAvailable) {
      toast({
        title: "API niet beschikbaar",
        description: "De AI service is momenteel offline. Controleer uw API sleutel instellingen.",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySignal = () => {
    if (advancedSignal) {
      onSignalApplied(
        advancedSignal.direction, 
        advancedSignal.stop_loss?.toString() || "", 
        advancedSignal.take_profit?.toString() || ""
      );
      
      toast({
        title: "Signaal toegepast",
        description: `${advancedSignal.direction} signaal toegepast op uw order`,
      });
    }
  };

  if (!apiEnabled) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${apiAvailable ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="font-medium">Geavanceerde API-functies</span>
        </div>
        <div className="flex items-center gap-2">
          {!apiAvailable && (
            <div className="flex items-center text-xs text-red-400 gap-1 mr-2">
              <AlertTriangle className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={fetchAdvancedSignal}
            disabled={isLoading || !apiAvailable}
          >
            <Zap className={`w-3 h-3 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? 'Genereren...' : 'Genereer Signaal'}
          </Button>
        </div>
      </div>
      
      {!apiAvailable && (
        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg mt-2 text-xs text-muted-foreground">
          AI trading signaal service is momenteel niet beschikbaar. 
          Controleer of uw API sleutel correct is ingesteld in het instellingenmenu.
        </div>
      )}
      
      {advancedSignal && (
        <div className="p-3 bg-primary/10 rounded-lg mt-2">
          <div className="text-sm font-medium mb-1 flex justify-between">
            <span>{advancedSignal.direction} Signaal ({advancedSignal.confidence}% vertrouwen)</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleApplySignal}
              disabled={!apiAvailable}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Toepassen
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Redenering: {advancedSignal.reasoning}
          </div>
        </div>
      )}
    </div>
  );
};
