
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { TradingPairSelector } from "./components/TradingPairSelector";

interface MinimalTradingControlsProps {
  onRefresh: () => void;
  onTimeframeChange: (timeframe: string) => void;
  currentTimeframe: string;
  selectedPair: string;
  onPairChange: (pair: string) => void;
}

export const MinimalTradingControls = ({
  onRefresh,
  onTimeframeChange,
  currentTimeframe,
  selectedPair,
  onPairChange
}: MinimalTradingControlsProps) => {
  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-2">
        <TradingPairSelector 
          selectedPair={selectedPair} 
          onPairChange={onPairChange} 
        />
        
        <div className="flex border rounded-md overflow-hidden">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={currentTimeframe === tf ? "secondary" : "ghost"}
              size="sm"
              className="px-2 rounded-none h-8"
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
};
