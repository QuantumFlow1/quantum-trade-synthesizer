
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface MinimalTradingControlsProps {
  onRefresh: () => void;
  onTimeframeChange: (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => void;
  currentTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
}

export const MinimalTradingControls = ({
  onRefresh,
  onTimeframeChange,
  currentTimeframe
}: MinimalTradingControlsProps) => {
  const timeframes: Array<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w"> = [
    "1m", "5m", "15m", "1h", "4h", "1d", "1w"
  ];

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            variant={currentTimeframe === tf ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeframeChange(tf)}
          >
            {tf}
          </Button>
        ))}
      </div>
      
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};
