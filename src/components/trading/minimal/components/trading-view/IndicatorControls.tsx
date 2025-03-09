
import { Button } from "@/components/ui/button";

interface IndicatorControlsProps {
  visibleIndicators: {
    volume: boolean;
    ema: boolean;
    sma: boolean;
  };
  toggleIndicator: (indicator: "volume" | "ema" | "sma") => void;
}

export const IndicatorControls = ({
  visibleIndicators,
  toggleIndicator
}: IndicatorControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant={visibleIndicators.sma ? "default" : "outline"} 
        className="h-6 px-2 text-xs"
        onClick={() => toggleIndicator("sma")}
      >
        SMA
      </Button>
      <Button 
        size="sm" 
        variant={visibleIndicators.ema ? "default" : "outline"} 
        className="h-6 px-2 text-xs"
        onClick={() => toggleIndicator("ema")}
      >
        EMA
      </Button>
      <Button 
        size="sm" 
        variant={visibleIndicators.volume ? "default" : "outline"} 
        className="h-6 px-2 text-xs"
        onClick={() => toggleIndicator("volume")}
      >
        Vol
      </Button>
    </div>
  );
};
