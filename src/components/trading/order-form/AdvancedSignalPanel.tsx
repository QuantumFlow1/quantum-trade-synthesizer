
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdvancedSignal } from "../hooks/useAdvancedSignal";
import { ApiStatusIndicator } from "./ApiStatusIndicator";
import { ApiUnavailableWarning } from "./ApiUnavailableWarning";
import { SignalDisplay } from "./SignalDisplay";

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
  const { isLoading, fetchAdvancedSignal } = useAdvancedSignal();
  
  const handleFetchSignal = async () => {
    if (!apiAvailable) {
      toast({
        title: "API niet beschikbaar",
        description: "De AI service is momenteel offline. Controleer uw API sleutel instellingen.",
        variant: "destructive",
      });
      return;
    }
    
    const signal = await fetchAdvancedSignal(currentPrice);
    if (signal) {
      setAdvancedSignal(signal);
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
          <ApiStatusIndicator apiAvailable={apiAvailable} />
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={handleFetchSignal}
            disabled={isLoading || !apiAvailable}
          >
            <Zap className={`w-3 h-3 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? 'Genereren...' : 'Genereer Signaal'}
          </Button>
        </div>
      </div>
      
      <ApiUnavailableWarning apiAvailable={apiAvailable} />
      
      <SignalDisplay 
        signal={advancedSignal} 
        apiAvailable={apiAvailable}
        onApply={handleApplySignal}
      />
    </div>
  );
};
