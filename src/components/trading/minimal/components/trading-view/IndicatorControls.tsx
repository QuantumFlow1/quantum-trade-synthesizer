
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";

interface IndicatorControlsProps {
  visibleIndicators: {
    volume: boolean;
    ema: boolean;
    sma: boolean;
    macd: boolean;
    rsi: boolean;
    bollingerBands: boolean;
  };
  toggleIndicator: (indicator: string) => void;
}

export const IndicatorControls = ({
  visibleIndicators,
  toggleIndicator
}: IndicatorControlsProps) => {
  const activeIndicators = Object.entries(visibleIndicators)
    .filter(([_, isVisible]) => isVisible)
    .map(([key]) => key);
  
  return (
    <div className="flex gap-2">
      {activeIndicators.map((indicator) => (
        <Button 
          key={indicator}
          size="sm" 
          variant="default" 
          className="h-6 px-2 text-xs capitalize font-medium"
          onClick={() => toggleIndicator(indicator)}
        >
          {indicator === "ema" ? "EMA" : indicator === "sma" ? "SMA" : indicator === "rsi" ? "RSI" : indicator === "macd" ? "MACD" : indicator === "bollingerBands" ? "BB" : indicator}
        </Button>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-1">
            <p className="text-xs font-medium pb-1">Indicators</p>
            {Object.entries(visibleIndicators).map(([key, isVisible]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs capitalize font-medium"
                onClick={() => toggleIndicator(key)}
              >
                <span className="w-4 h-4 mr-2 flex items-center justify-center">
                  {isVisible && <Check className="h-3 w-3" />}
                </span>
                {key === "ema" ? "Moving Avg (EMA)" : 
                 key === "sma" ? "Moving Avg (SMA)" : 
                 key === "rsi" ? "RSI" : 
                 key === "macd" ? "MACD" : 
                 key === "bollingerBands" ? "Bollinger Bands" : 
                 key}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
